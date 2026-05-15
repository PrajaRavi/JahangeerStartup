import { ConversationModel } from "../Models/conversation.model.js";
import { MsgModel } from "../Models/Message.model.js";

export const UpdateMultipleMessages=async (req,resp)=>{
  try {
    let {IDarray}=req.body;
    if(!IDarray ||IDarray.length==0){
      return resp.send({success:false,msg:"nothing"})
    }
    let data=await MsgModel.updateMany({_id:{$in:IDarray}},{$set:{seen:true}})
    console.log(data)
    return resp.status(200).send({success:true,msg:"update successfully!!!!"})
      
  
  } catch (error) {
    console.log(error)
    return resp.send("internal server error in UpdateMultipleMessages ")
  }

}
export const DeleteUnseenMsg=async(req,resp)=>{
try {
    let {senderID,reciverID}=req.query;
    if(!senderID || !reciverID) return resp.send({success:false,msg:"senderID,reciverID required"})
    let data=await UnseenMsgModel.deleteOne({senderID,reciverID})
  if(data){

    console.log(data)
    return resp.status(200).send({success:true,msg:"Deleted successfully!!!!"})
  }
      
  
  } catch (error) {
    console.log(error)
    return resp.send("internal server error in UpdateUnseenMsg")
  }
}

export const GetGroupMsg=async(req,resp)=>{
  try {
      let page=parseInt(req.query.page)||1;
    let limit=parseInt(req.query.limit)||9;
    let {GroupID}=req.query;
    let totaldoc=null;
      if(!GroupID) return resp.status(200).send({ success: false, msg: "no query params" });
      if(page==1){
        totaldoc=await MsgModel.find({GroupID}).countDocuments();
      }
      let data=await MsgModel.find({GroupID}).limit(limit).skip(page-1).sort({createdAt:-1})
     
      if(data.length>0){
        return resp.status(200).send({success:true,msg:data,totalpage:Math.ceil(totaldoc/limit),page:page})
      }
      else{
        return resp.status(203).send({success:false,msg:[]})
  
      }
      console.log(data)
    
    } catch (error) {
      console.log(error);
      return resp
        .status(500)
        .send({ success: false, msg: "internal server error" });
    }
}
