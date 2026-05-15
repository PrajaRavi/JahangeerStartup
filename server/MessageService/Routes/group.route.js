import express from "express"
import { protect } from "../Middlewares/AuthMiddleware.js";
import { upload } from "../utilities/group.multer.js";
import { createGroup, GetallGroup, ReturnUnseenMsgCount, UpdateGroupMembers, UpdateGroupWithID } from "../Controllers/group.controller.js";
export const GroupRoute=express.Router();
GroupRoute.post("/create-group",protect,upload.single("GroupProfile"),createGroup)
GroupRoute.get("/groups",protect,GetallGroup)
GroupRoute.put("/update-group",protect,upload.single("GroupProfile"),UpdateGroupWithID)
GroupRoute.put("/update-group-members",protect,UpdateGroupMembers)
GroupRoute.post("/get-unseenmsg-count",protect,ReturnUnseenMsgCount)