import express from "express"
import {GetAllUser, getLoggedInUser, login, logout, refreshAccessToken, signup, StoreSocketId, verifyOtp} from "../Controllers/user.controller.js"
import { upload } from "../utilities/user.multer.js";
import { protect } from "../Middlewares/AuthMiddleware.js";
export const UserRouter=express.Router();
UserRouter.post("/signup",upload.single("profilePicture"),signup)
UserRouter.post("/verify-otp-after-signup",verifyOtp)
UserRouter.post("/signin",login)
UserRouter.post("/refresh-token",protect,refreshAccessToken)
UserRouter.post("/logout-user",protect,logout)
UserRouter.get("/all-users",protect,GetAllUser)
UserRouter.put("/store-socket-id",protect,StoreSocketId)

UserRouter.get("/loged-in-user",protect,getLoggedInUser)









