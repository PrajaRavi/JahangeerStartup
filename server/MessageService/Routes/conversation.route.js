import express from "express"
import { protect } from "../Middlewares/AuthMiddleware.js";
import {GetLastMessageOfParticipents, GetMessagesOfPartcipants, StoreLastMsgIdOfParticipants} from "../Controllers/conversation.controller.js"
export const ConvrsationRoute=express.Router();

ConvrsationRoute.get("/msg-of-participents",protect,GetMessagesOfPartcipants)
    //? let { senderid, reciverid } = req.query;
    // !Responses return buy this api
    //? return resp.status(200).send({success:true,msg:Messages,page,totalpage:Math.ceil((totalpage)/limit)}) length>0
    //? return resp.status(200).send({success:true,msg:[],text:"no  content bhai"}) otherwise


ConvrsationRoute.get("/last-msg-of-participents",protect,GetLastMessageOfParticipents)
    //? let { senderid, reciverid } = req.query;
    // !Responses return buy this api
    //? return resp.status(200).send({success:true,msg:data,senderid,reciverid})[returning the whole last msg document] response.length>0
    //? return resp.status(200).send({success: false,msg: [],text: "no  content bhai",senderid,reciverid}); else


  ConvrsationRoute.post("/update-user-lastmsgId",protect,StoreLastMsgIdOfParticipants)//
  //? let {userId,msgid,conversationId}=req.body;
  //? if(data) return resp.status(200).send({success:true,msg:"successfully updated!!!!"})   
   

