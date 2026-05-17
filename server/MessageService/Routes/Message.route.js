import express from "express";
import {
  DeleteUnseenMsg,
  GetGroupMsg,
  GetUnseenMsgOfUser,
  UpdateMultipleMessages,
} from "../Controllers/Message.controller.js";
import { protect } from "../Middlewares/AuthMiddleware.js";
import { GetLastMsgOFGroup } from "../Controllers/group.controller.js";
export const MsgRouter = express.Router();
MsgRouter.put("/update-msg-seen", protect, UpdateMultipleMessages);
//? let {IDarray}=req.body;
//? return resp.status(200).send({success:true,msg:"update successfully!!!!"})

MsgRouter.get("/group-messages", protect, GetGroupMsg);
//? let {GroupID}=req.query;
//? return resp.status(200).send({success:true,msg:data,totalpage:Math.ceil(totaldoc/limit),page:page})

MsgRouter.get("/last-messages-of-group", protect, GetLastMsgOFGroup);

MsgRouter.get("/unseen-messages-of-conversation", protect, GetUnseenMsgOfUser);
//? let { userID } = req.query;
//?return resp.status(200).send({ success: true, msg: Array.from(ResultMap) });
//? return resp.status(200).send({ success: true, msg: [] });
