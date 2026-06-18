import express from "express"
import {GetAllUser, getLoggedInUser, login, LoginUserWithLoginOtp, logout, refreshAccessToken, resendOtpforForgotPass, resendOtpforverification, ResetUserPassword, SendLoginOtp, SendResetPasswordOTP, signup, UpdateUser, UpdateUserDP, verifyOtp} from "../Controllers/user.controller.js"
import { upload } from "../utilities/user.multer.js";
import { protect } from "../Middlewares/AuthMiddleware.js";
export const UserRouter=express.Router();
UserRouter.post("/signup",signup)
UserRouter.post("/verify-otp-after-signup",verifyOtp)
UserRouter.post("/signin",login)
UserRouter.post("/refresh-token",refreshAccessToken)
UserRouter.post("/logout-user",protect,logout)
UserRouter.get("/all-users",protect,GetAllUser)
UserRouter.put("/update-user-DP",protect,upload.single("DP"),UpdateUserDP)
UserRouter.put("/update-user-by-Id",protect,UpdateUser)
UserRouter.put("/send-forgot-pass-otp",SendResetPasswordOTP)
UserRouter.put("/forgot-pass",ResetUserPassword)
UserRouter.put("/resend-verify-otp",resendOtpforverification)
UserRouter.put("/resend-forgotpass-otp",resendOtpforForgotPass)
UserRouter.post("/send-login-otp",SendLoginOtp)
UserRouter.post("/login-user-with-login-otp",LoginUserWithLoginOtp)



UserRouter.get("/loged-in-user",protect,getLoggedInUser)










