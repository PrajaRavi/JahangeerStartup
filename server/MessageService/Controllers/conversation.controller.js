// await model.countDocument({}) it will count all the document and if we pass some data then it will count the filtered data
import { ConversationModel } from "../Models/conversation.model.js";
import { MsgModel } from "../Models/Message.model.js";

export const GetMessagesOfPartcipants = async (req, resp, next) => {
  try {
    let { senderid, reciverid } = req.query;
    //! 1. here first i have to get the conversationID using the senderid and reciverid
    console.log(senderid, reciverid);
    if (!senderid || !reciverid) {
      return resp
        .status(400)
        .send({ success: false, msg: "khuch hai nahi yar" });
    }
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 9;
    let totalpage = null;
    if (senderid !== reciverid) {
      let data = await ConversationModel.find({
        "participants.userID":{$all:[senderid,reciverid]}
      });
      // console.log(data)
      if (data.length > 0) {
        if (page == 1) {
          let data1 = await MsgModel.find({ ConversationID: data[0]._id });
          totalpage = data1[0].length;
        }

        //! 2. then i have to use this conversationID to fetch all the messages
        let Messages = await MsgModel.find({ ConversationID: data[0]._id })
          .limit(limit)
          .skip(page - 1)
          .sort({ createdAt: -1 });

        if (Messages.length > 0) {
          console.log(Messages);
          return resp
            .status(200)
            .send({
              success: true,
              msg: Messages,
              page,
              totalpage: Math.ceil(totalpage / limit),
            });
        }
      } else {
        return resp
          .status(200)
          .send({ success: true, msg: [], text: "no  content bhai" });
      }
    } else {
      let data = await ConversationModel.find({
        "participants.userID":[senderid,reciverid]
      });
      if (data.length > 0) {
        if (page == 1) {
          let data = await MsgModel.find({ ConversationID: data[0]._id });
          totalpage = data[0].length;
        }

        //! 2. then i have to use this conversationID to fetch all the messages
        let Messages = await MsgModel.find({ ConversationID: data[0]._id })
          .limit(limit)
          .skip(page - 1)
          .sort({ createdAt: -1 });

        if (Messages.length > 0) {
          console.log(Messages);
          return resp
            .status(200)
            .send({
              success: true,
              msg: Messages,
              page,
              totalpage: Math.ceil(totalpage / limit),
            });
        }
      } else {
        return resp
          .status(200)
          .send({ success: true, msg: [], text: "no  content bhai" });
      }
    }
  } catch (error) {
    console.log(error);
    return resp
      .status(500)
      .send({ success: false, msg: "internal server error" });
  }
};
export const GetLastMessageOfParticipents = async (req, resp) => {
  try {
    let { senderid, reciverid } = req.query;
    if (!senderid || !reciverid) {
      return resp.send({ success: false, msg: "khuch hai nahi yar" });
    }
    if (senderid !== reciverid) {
      let data = await ConversationModel.find({
        "participants.userID": { $all: [senderid, reciverid] },
      }).populate({ path: "LastMsgID" });
      if (data.length > 0) {
        return resp
          .status(200)
          .send({ success: true, msg: data, senderid, reciverid });
      } else {
        return resp
          .status(200)
          .send({
            success: false,
            msg: [],
            text: "no  content bhai",
            senderid,
            reciverid,
          });
      }
    } else {
      //! this is self message condition
      let data = await ConversationModel.find({
        "participants.userID": [senderid, reciverid],
      }).populate({ path: "LastMsgID" });
      if (data.length > 0) {
        return resp
          .status(200)
          .send({ success: true, msg: data, senderid, reciverid });
      } else {
        return resp
          .status(200)
          .send({
            success: false,
            msg: [],
            text: "no  content bhai",
            senderid,
            reciverid,
          });
      }
    }
  } catch (error) {
    console.log(error);
    return resp
      .status(500)
      .send({
        success: false,
        msg: "internal server error GetLastMessageOfParticipents",
      });
  }
};

export const StoreLastMsgIdOfParticipants=async (req,resp)=>{
try {
    let {userId,msgid,conversationId}=req.body;
if(!userId||!msgid||!conversationId) return resp.status(200).send({success:false,msg:"kuch aya hi nahi hahi bhai!!!"})
let data = await ConversationModel.updateOne({
       _id:conversationId, "participants.userID": userId
      },{$set:{"participants.$.LastMsgID":msgid}});  
  if(data) return resp.status(200).send({success:true,msg:"successfully updated!!!!"})   

      
  } catch (error) {
    console.log(error);
    return resp
      .status(500)
      .send({ success: false, msg: "internal server error StoreLastMsgIdOfParticipants" });
  }  
}

