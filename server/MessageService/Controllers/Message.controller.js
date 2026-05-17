import { ConversationModel } from "../Models/conversation.model.js";
import { MsgModel } from "../Models/Message.model.js";

export const UpdateMultipleMessages = async (req, resp) => {
  try {
    let { IDarray } = req.body;
    if (!IDarray || IDarray.length == 0) {
      return resp.send({ success: false, msg: "nothing" });
    }
    let data = await MsgModel.updateMany(
      { _id: { $in: IDarray } },
      { $set: { seen: true } },
    );
    console.log(data);
    return resp
      .status(200)
      .send({ success: true, msg: "update successfully!!!!" });
  } catch (error) {
    console.log(error);
    return resp.send("internal server error in UpdateMultipleMessages ");
  }
};
export const DeleteUnseenMsg = async (req, resp) => {
  try {
    let { senderID, reciverID } = req.query;
    if (!senderID || !reciverID)
      return resp.send({ success: false, msg: "senderID,reciverID required" });
    let data = await UnseenMsgModel.deleteOne({ senderID, reciverID });
    if (data) {
      console.log(data);
      return resp
        .status(200)
        .send({ success: true, msg: "Deleted successfully!!!!" });
    }
  } catch (error) {
    console.log(error);
    return resp.send("internal server error in UpdateUnseenMsg");
  }
};

export const GetGroupMsg = async (req, resp) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 9;
    let { GroupID } = req.query;
    let totaldoc = null;
    if (!GroupID)
      return resp.status(200).send({ success: false, msg: "no query params" });
    if (page == 1) {
      totaldoc = await MsgModel.find({ GroupID }).countDocuments();
    }
    let data = await MsgModel.find({ GroupID })
      .limit(limit)
      .skip(page - 1)
      .sort({ createdAt: -1 });

    if (data.length > 0) {
      return resp.status(200).send({
        success: true,
        msg: data,
        totalpage: Math.ceil(totaldoc / limit),
        page: page,
      });
    } else {
      return resp.status(203).send({ success: false, msg: [] });
    }
    console.log(data);
  } catch (error) {
    console.log(error);
    return resp
      .status(500)
      .send({ success: false, msg: "internal server error" });
  }
};

export const GetUnseenMsgOfUser = async (req, resp) => {
  try {
    let { userID } = req.query;
    let ConversationID = null;
    if (!userID)
      return resp
        .status(200)
        .send({ success: false, msg: "Requrired data not found" });
    let ResultMap = new Map(); //This will store senderId(key),(unseenmsg arr)(value)
    // finding all the conversation document where the logedInUser is reciver
    let data = await ConversationModel.find({
      "participants.userID": userID,
    });

    if (data?.length > 0) {
      //now find that participants where userID is equal to logedinuser
      let participants = [];
      data?.map((covnersationdoc) => {
        covnersationdoc.participants.map((participant) => {
          if (participant.userID == userID) {
            participants.push({LastMsgID:participant?.LastMsgID,ConversationID:covnersationdoc._id});
          }
        });
      });
      let PromiseResult = await Promise.all(
        participants.map(async (item) => {
          let UnSeenMsgs=null;
          if(item.LastMsgID){

             UnSeenMsgs= await MsgModel.find({
              ConversationID:item.ConversationID,
              _id: { $gt: item.LastMsgID },
            });
          }
          else{
            UnSeenMsgs = await MsgModel.find({
              ConversationID:item.ConversationID
            });
          }

          let ArrayOfMsgIDS = UnSeenMsgs.map((item) => {
            return item._id;
          });

          if (UnSeenMsgs.length > 0) {
            let AlreadyExist = ResultMap.get(item.userID);
            if (AlreadyExist) {
              AlreadyExist.push(ArrayOfMsgIDS);
            } else {
              if(UnSeenMsgs[0].senderID==userID){
                ResultMap.set(UnSeenMsgs[0].reciverID, ArrayOfMsgIDS);
              }
              else{
                ResultMap.set(UnSeenMsgs[0].senderID, ArrayOfMsgIDS);
              }
                

            }
          }
        }),
      );

      console.log(ResultMap);
      console.log("resultmap")
      if (Number(ResultMap.size) > 0) {
        return resp
          .status(200)
          .send({ success: true, msg: Array.from(ResultMap) });
      } else {
        return resp.status(200).send({ success: true, msg: [] });
      }
    }
  } catch (error) {
    console.log(error);
    return resp
      .status(500)
      .send({ success: false, msg: "internal server error" });
  }
};
