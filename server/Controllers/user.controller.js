import { UserModel } from "../Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { TryCatchHandler } from "../utilities/TryCatchHandler.utility.js";
import {transporter} from "../utilities/nodemailer.js"
import { sendOTP, sendotpfast } from "../index.js";
import path from "path"
import fs from "fs/promises"

export const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phoneNumber,
      Address,
      
    } = req.body;
   
    // Required fields validation
    if (!username || !email || !password||!Address) {
      return res.status(400).json({
        success: false,
        msg: "Username, email and password are required",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        msg: "Password must be at least 6 characters",
      });
    }

    // Check existing user
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        msg: "User already exists with this email or phone ",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Send verification email
    let phone="+91"+String(phoneNumber)
    let msgbody=`You otp for verification is ${verificationCode}.Remember it is valid only for 5 minutes`
    // let data=await sendOTP("+919769479166",msgbody);
  // let data=await sendotpfast(phoneNumber,verificationCode)
  let data=true;

    
    
    
    
    if(data){
    // Create user
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      profilePicture:'',
      verificationCode,
      Address,
      verificationCodeExpires:Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });
    
    

     return res.status(201).json({
       success: true,
       msg:
       "Signup successful. Verification code sent to your email.",
      });
    }
  } catch (error) {
    console.log(error)
  
    // Duplicate unique field error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];

      return res.status(409).json({
        success: false,
        msg: `${duplicateField} already exists`,
      });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(
        (err) => err.msg
      );

      return res.status(400).json({
        success: false,
        msg: "Validation failed",
        errors,
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.msg
          : undefined,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // 1. Validation Check
    if (!phoneNumber || !otp) {
      return res.status(400).json({ 
        success: false, 
        msg: "Email and OTP are required" 
      });
    }

    // 2. Find user
    const user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        msg: "User not found" 
      });
    }

    // 3. Already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false, 
        msg: "Account already verified" 
      });
    }

    
    // 4. OTP expired
    if (user.verificationCodeExpires < Date.now()) {
      return res.status(410).json({ 
        success: false, 
        msg: "OTP has expired" 
      });
    }

    // 5.  incoming OTP and Compare
    
    if (otp !== user.verificationCode) {
      return res.status(401).json({ 
        success: false, 
        msg: "Invalid OTP" 
      });
    }

    // 6. Verify account & Clear OTP fields
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Email verified successfully",
    });

  } catch (error) {
    /* ---------- ERROR HANDLING ---------- */
    console.log(error)
    return res.status(500).json({
      success: false,
      msg: error.msg || "Internal Server Error",
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password required",
      });
    }

    const user = await UserModel.findOne({$or:[{email:identifier},{phoneNumber:identifier}]  });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "User Not found",
      });
    }
    // if(user.DOB)
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        msg: "Please verify your account first",
      });
    }

    // 🔑 Short-lived access token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );

    // 🔄 Long-lived refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "7d" },
    );

    // Store refresh token (optional but recommended)
    user.refreshToken = refreshToken;
    await user.save();

    // 🍪 Send tokens in cookies
    res
      .cookie("accessToken", accessToken, {
        // httpOnly: true,
        // secure: true, if it is in production
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        // httpOnly: true,
        // secure: true, if it is in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        msg: "Login successful",
        email: user.email,
        accessToken,
      });
  } catch (error) {
    console.log(error)
    return res.send({ success: false, msg: error });
  }
};

export const refreshAccessToken = async (req, res) => {
  // console.log(req.cookies)
  console.log(req.cookies)
  const refreshToken = req.cookies.refreshToken;
  // console.log(req.cookies);
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      msg: "Login again",
    });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
    );

    const user = await UserModel.findById(decoded.id);
    console.log(user)
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        msg: "Invalid refresh token",
      });
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: "15m" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.send({ success: true, msg: "refreshed successfully"});
  } catch (err) {
    console.log(err)
    return res.status(403).json({
      success: false,
      msg: "Refresh token expired",
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken").clearCookie("refreshToken").json({
    success: true,
    msg: "Logged out successfully",
  });
};
  


export const getLoggedInUser = async (req, res, next) => {
  // console.log("getlogedinuser")
  try {
    const userId = req.user.id; // from protectforapp middleware

    const user = await UserModel.findById(userId).select(
      "-password -refreshToken -verifyotp -resetOtp",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // console.log(user)
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error)
    return res.send({ success: false, msg: error });
    
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, msg: "Email required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "User already verified" });
    }

    // 🔑 Generate new OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // 🔒 Hash OTP
    // const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // ✅ Save OTP + expiry in DB
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // ✉️ Send OTP via email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "OTP Verification - Resend",
      text: `Hello ${user.firstName},\n\nYour OTP for account verification is: ${otp}\nThis OTP will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      msg: "OTP resent successfully. Please check your phone.",
    });
  } catch (error) {
    return res.send({ success: false, msg: error });
  }
};
export const GetAllUser = async (req, resp, next) => {
  try{
  let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 9;
    if(!page || !limit)
    return resp.status(200).send({ success: false, msg: "All feilds are required" });

    let totaldoc=null;
   if (page == 1) {
      totaldoc = await UserModel.find().countDocuments();
    }
      

   let data=await UserModel.find().select("-password -refreshToken -verifyotp -resetOtp  -isVerified -isOnline -verificationCode  -verificationCodeExpires")
      .limit(limit)
      .skip((page - 1)*limit)
      .sort({ createdAt: -1 });    
     
if(data.length>0){
    return resp.status(200).send({ success: true, msg: data,page,Totalpage:Math.ceil(totaldoc/limit) });
  }
  else{
    return resp.status(200).send({ success: true, msg: [] });

  }
  }
 catch (error) {
    console.log(error)
    return res.send({ success: false, msg: error });
    
    
  }
}


export const UpdateUserDP=async (req,resp)=>{
  try {
      let  userId=req.user.id;//This id comes from protect middleware
    let IFAlreadyProfilePhotoSelectedOrNot=await UserModel.find({_id:userId})
    console.log("Hiiii")
    console.log("Hiiii")
    console.log("Hiiii")
    if(IFAlreadyProfilePhotoSelectedOrNot[0].profilePicture!=""){
      console.log("ook")
      const oldFilePath = path.join(
        (process.cwd()+"/Images/Profile"),
        IFAlreadyProfilePhotoSelectedOrNot[0].profilePicture
      );
      
      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.log(error)
        console.log(
          "Old photo not found"
        );
      }
    }
    let data=await UserModel.updateOne({_id:userId},{$set:{profilePicture:req.file.filename}})  
    
    if(data){
  
      return resp.send({success:true,msg:"updated"})
    }
    } catch (error) {
      console.log(error)
      return resp.status(500).send({success:false,msg:"Internal server error"})
    }
}

export const UpdateUser=async(req,resp)=>{
  try {
  const {
      username,
      email,
      phoneNumber,
      role,
      id,
       } = req.body;
  let userid=id?id:req.user.id;
  if(!userid||!username || !email || !phoneNumber||!role){
    return resp.status(200).send({ success: true, msg: "All feilds are required" });
  }

let data=await UserModel.updateOne({_id:userid},{$set:{username,email,phoneNumber,role}})
if(data){
    return resp.status(200).send({ success: true, msg: "successfully updated" });
  }
  else{
    return resp.status(400).send({ success: true, msg: "something went wrong" });

  }

} catch (error) {
  console.log(error)
  return resp.status(500).send({success:false,msg:"Internal server error"})
}
}

 export async function SendResetPasswordOTP(req, resp) {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return resp.status(400).send({ success: false, msg: "Please provide phoneNumber" });
  }

  try {
    const user = await UserModel.findOne({ phoneNumber }); // Use lowercase for consistency

    // Security Note: You might want to return 'success: true' even if user doesn't exist 
    // to prevent email enumeration, but 404/403 is standard for many apps.
    if (!user) {
      return resp.status(404).send({ success: false, msg: "No account found with this phone" });
    }

    // Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set Expiry (5 minutes)
    const otpExpiresAt = Date.now() + 5 * 60 * 1000;

    // Save OTP to User document
    await UserModel.updateOne(
      { phoneNumber },
      {
        $set: {
          resetOtp: otp,
          resetOtpExpiresAt: otpExpiresAt,
        },
      }
    );

   
    // Send OTP
    let phone="+91"+String(phoneNumber)
    let msgbody=`You otp for reset password is ${otp}.Remember it is valid only for 5 minutes`
    // let data=await sendOTP("+919769479166",msgbody);
  let data=await sendotpfast(phoneNumber,otp)

    if(data){

      
      // Return a CLEAN success response
      return resp.status(200).send({ 
        success: true, 
        msg: "OTP sent successfully to your Phone" 
      });
    }
    else{
      console.log("error in sending forgot pass otp")
    }

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return resp.status(500).send({ 
      success: false, 
      msg: "An internal server error occurred. Please try again later." 
    });
  }
}

export async function ResetUserPassword(req, resp) {
  const { phoneNumber, NewPassword, otp } = req.body;

  // 1. Validation check (400 Bad Request)
  if (!phoneNumber || !NewPassword || !otp) {
    return resp.status(400).send({ 
      success: false, 
      msg: "All fields (phoneNumber, new password, and OTP) are required" 
    });
  }

  try {
    const user = await UserModel.findOne({ phoneNumber });

    // 2. User Existence check (404 Not Found)
    if (!user) {
      return resp.status(404).send({ success: false, msg: "User not found" });
    }

    // 3. OTP Presence & Validity check (400 Bad Request)
    // We check if resetOtp exists in DB to prevent reset logic if no OTP was requested
    if (!user.resetOtp || user.resetOtp !== String(otp)) {
      return resp.status(400).send({ success: false, msg: "Invalid OTP" });
    }

    // 4. Expiry check (410 Gone or 400)
    if (user.resetOtpExpiresAt < Date.now()) {
      return resp.status(400).send({ success: false, msg: "OTP has expired" });
    }

    // 5. Hashing & Updating (Use Async for better performance)
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(NewPassword, saltRounds);

    await UserModel.updateOne(
      { phoneNumber },
      {
        $set: {
          password: hashedPass,
          resetOtp: "",           // Clear the OTP so it can't be reused
          resetOtpExpiresAt: 0,   // Reset the timer
        },
      }
    );

    // 6. Success Response (200 OK)
    return resp.status(200).send({
      success: true,
      msg: "Password reset successfully. You can now login with your new password.",
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return resp.status(500).send({ 
      success: false, 
      msg: "Internal server error during password reset" 
    });
  }
}

export const resendOtpforForgotPass=async(req,res,next)=>{
 try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, msg: "phoneNumber required" });
    }

    const user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    
    // 🔑 Generate new OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // 🔒 Hash OTP
    // const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex"); bad me dekh lunga

    // ✅ Save OTP + expiry in DB
    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    // ✉️ Send OTP via email
    
    let phone="+91"+String(phoneNumber)
    let msgbody=`You otp for reset password is ${otp}.Remember it is valid only for 5 minutes`
    // let data=await sendOTP("+919769479166",msgbody);
  let data=await sendotpfast(phoneNumber,otp)

    
    if(data){

      
      res.status(200).json({
        success: true,
        msg: "OTP resent successfully. Please check your phone.",
      });
    }
    else{
      console.log("error in resendotpforgotpass SMS twilio service")
    }
  } catch (error) {
    console.log(error)
    return res.send({ success: false, msg:"error in  resendOtpforForgotPass "});
  }
}

export const resendOtpforverification = async (req, res, next) => {
  try {
    const { phoneNumber} = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, msg: "phone required" });
    }

    const user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "User already verified" });
    }

    // 🔑 Generate new OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // 🔒 Hash OTP
    // const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // ✅ Save OTP + expiry in DB
    user.verificationCode = otp;
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // ✉️ Send OTP via email
    let phone="+91"+String(phoneNumber)
    let msgbody=`You otp for verification is ${otp}.Remember it is valid only for 5 minutes`
    // let data=await sendOTP("+919769479166",msgbody);
  let data=await sendotpfast(phoneNumber,otp)

    
    if(data){

      
      res.status(200).json({
        success: true,
        msg: "OTP resent successfully. Please check your phone.",
      });
    }
  } catch (error) {
    return res.send({ success: false, msg: error });
  }
};

export const SendLoginOtp=async (req, resp, next) => {
        try {
let {phoneNumber}=req.body;
if(!phoneNumber){
    return resp.status(200).send({ success: false, msg: "Phone Number is required" });
  }
  const user=await UserModel.find({phoneNumber})
  if(user.length==0){
    return resp.status(200).send({ success: false, msg: "User does not exist with this phone Number" });
    
  }
  const LoginOtp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  
  // Send verification email
  let phone="+91"+String(phoneNumber)
  let msgbody=`You otp for login is ${LoginOtp}.Remember it is valid only for 5 minutes`
  // let data=await sendOTP("+919769479166",msgbody);
  let data=await sendotpfast(phoneNumber,LoginOtp)
  
  if(data){
    let result=await UserModel.updateOne({phoneNumber},{$set:{LoginOtp}})
    if(result)
      return resp.status(200).send({ success: true, msg: "Successfull" });
      
    }
    


} catch (error) {
  console.log(error)
  return resp.status(500).send({success:false,msg:"Internal server error"})
}
}

export const LoginUserWithLoginOtp=async (req, resp, next) => {
try {
   let {phoneNumber,LoginOtp}=req.body;
   let user=await  UserModel.find({phoneNumber});
   if(!user[0]?.LoginOtp){
              return resp.status(200).send({ success: false, msg: "Invalid OTP" });
            }

            if(user[0]?.LoginOtp==LoginOtp){
              // 🔑 Short-lived access token
    const accessToken = jwt.sign(
      { id: user[0]._id },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );

    // 🔄 Long-lived refresh token
    const refreshToken = jwt.sign(
      { id: user[0]._id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "7d" },
    );

    // Store refresh token (optional but recommended)
    let updateuser=await UserModel.updateOne({phoneNumber},{$set:{refreshToken:refreshToken}})
    // 🍪 Send tokens in cookies
    resp
      .cookie("accessToken", accessToken, {
        // httpOnly: true,
        // secure: true, if it is in production
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        // httpOnly: true,
        // secure: true, if it is in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        msg: "Login successful",
        email: user[0].email,
        accessToken,
      });

            }        
            else{
              return resp.status(200).send({ success: false, msg: "Invalid otp" });

            }
              




} catch (error) {
  console.log(error)
  return resp.status(500).send({success:false,msg:"Internal server error"})
}

}

export const DeleteUserById=async (req, resp, next) => {
try {
  let {userid}=req.query;
  if(!userid){
    return resp.status(200).send({success:false,msg:"Userid required"})

  }
  let data=await UserModel.deleteOne({_id:userid})
  if(data){

    return resp.status(200).send({success:true,msg:"Successfully deleted"})
  }



} catch (error) {
  return resp.status(500).send({success:false,msg:"Internal server error"})
}
}