import { UserModel } from "../Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { TryCatchHandler } from "../utilities/TryCatchHandler.utility.js";
import {transporter} from "../utilities/nodemailer.js"

export const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phoneNumber,
      bio,
      
    } = req.body;
   let  profilePicture=req.file.filename

    // Required fields validation
    if (!username || !email || !password) {
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
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        msg: "User already exists with email or username",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create user
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      bio,
      profilePicture,
      verificationCode,
      verificationCodeExpires:Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });
      
      

    
    // Send verification email
    if(user._id){

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account",
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <h1>${verificationCode}</h1>
        <p>This code will be used to verify your account.</p>
        `,
      });
    }

    return res.status(201).json({
      success: true,
      msg:
        "Signup successful. Verification code sent to your email.",
    });
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
    const { email, otp } = req.body;

    // 1. Validation Check
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        msg: "Email and OTP are required" 
      });
    }

    // 2. Find user
    const user = await UserModel.findOne({ email });

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
    return res.status(500).json({
      success: false,
      msg: error.msg || "Internal Server Error",
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password required",
      });
    }

    const user = await UserModel.findOne({ email });
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
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await UserModel.updateOne({ refreshToken }, { $set: { refreshToken: "" } });
  }

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
      msg: "OTP resent successfully. Please check your email.",
    });
  } catch (error) {
    return res.send({ success: false, msg: error });
  }
};
export const GetAllUser = async (req, res, next) => {//implement rate limiting after
  try {
let data=await UserModel.find().select("-password -refreshToken -verifyotp -resetOtp -phoneNumber -isVerified -isOnline -verificationCode -role -verificationCodeExpires")    
if(data){
    return res.send({ success: true, msg: data });

}
  } catch (error) {
    console.log(error)
    return res.send({ success: false, msg: error });
    
    
  }
}




export const UpdatewhoCanSee=async(req,resp)=>{
 try {
  let {whoCanSee}=req.body;
  if(!whoCanSee ||whoCanSee?.length==0) return resp.status(200).send({success:false,msg:"nothing kuch aya hi nahi!!!"})
  whoCanSee=JSON.parse(whoCanSee); 
  let data=await UserModel.updateOne({_id:req.user.id},{$set:{whoCanSee}});
  if(data) return resp.status(200).send({success:true,msg:"updated successfully!!!"})
    
  } catch (error) {
    console.log(error)
    return resp.status(500).send({success:false,msg:"Internal server error"})
  }
} 

export const GetAllWhoCanSeeUsers=async(req,resp)=>{
  try {
    let data=await UserModel.find({_id:req.user.id}).populate({path:"whoCanSee"})
    console.log(data)
    if(data[0].whoCanSee.length>0) return resp.status(200).send({success:true,msg:data[0].whoCanSee})
      return resp.status(200).send({success:false,msg:[]})
  } catch (error) {
    console.log(error)
    return resp.status(500).send({success:false,msg:"Internal server error"})
    
  }
}