import express from "express"
import {GetAllUser, GetAllWhoCanSeeUsers, getLoggedInUser, login, logout, refreshAccessToken, signup, UpdatewhoCanSee, verifyOtp} from "../Controllers/user.controller.js"
import { upload } from "../utilities/user.multer.js";
import { protect } from "../Middlewares/AuthMiddleware.js";
export const UserRouter=express.Router();
UserRouter.post("/signup",upload.single("profilePicture"),signup)
UserRouter.post("/verify-otp-after-signup",verifyOtp)
UserRouter.post("/signin",login)
UserRouter.post("/refresh-token",refreshAccessToken)
UserRouter.post("/logout-user",protect,logout)
UserRouter.get("/all-users",protect,GetAllUser)

UserRouter.put("/update-who-can-see",protect,UpdatewhoCanSee)//This api updates the WhoCanSee array 
//? let {whoCanSee}=req.body;

UserRouter.get("/loged-in-user",protect,getLoggedInUser)
UserRouter.get("/Getall-whoCanSee-user",protect,GetAllWhoCanSeeUsers)










