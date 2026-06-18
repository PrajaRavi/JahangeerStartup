// Twillo for now i am not using it in diffrent service
import twilio from 'twilio';
import dotenv from 'dotenv'
dotenv.config()


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

// Change this to your verified Indian personal phone number
const TEST_NUMBER = '+919769479166'; 

/**
 * STEP 1: Send the OTP
 */
export async function sendOTP(phone,body="Hello this is Ravi") {
  
  
    try {
      /**
       * 
      const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: TEST_NUMBER, channel: 'sms' });
      
      console.log(`✅ Success! OTP status: ${verification.status}`);
      console.log("Check your phone, the code should arrive shortly.");
      return true;
      */
     
let data= await client.messages
    .create({
        body: body,
        from: process.env.SENDER_PHONE,
        to: phone
    })
    console.log(data)
    if(data){
      return true;
    }

        } catch (error) {
      console.log(error)
        console.error("❌ Error sending OTP:", error.message);
    }
}

/**
 * STEP 2: Verify the OTP (Run this after you get the SMS)
 * @param {string} userEnteredCode - The 4 or 6 digit code received on your phone
 */
async function verifyOTP(userEnteredCode) {
    try {
        const verificationCheck = await client.verify.v2
            .services(verifyServiceSid)
            .verificationChecks.create({ to: TEST_NUMBER, code: userEnteredCode });

        if (verificationCheck.status === 'approved') {
            console.log("🎉 SUCCESS! The OTP matches. User is verified.");
        } else {
            console.log("❌ FAILED! Incorrect or expired OTP.");
        }
    } catch (error) {
        console.error("❌ Error checking OTP:", error.message);
    }
}

// --- Run the test ---

// Once you receive the code, comment out sendOTP(), 
// uncomment the line below with your code, and run it again:
// verifyOTP('123456');
import express from 'express';
import cors from "cors"
import path from "path"
import cookieParser from 'cookie-parser';
import { UserRouter } from './Routes/user.route.js';
import { DBConnect } from './Config/connenction1.js';
import { UserModel } from './Models/user.model.js';
import { DateTimeRouter } from './Routes/DateTime.route.js';
import { DaySettModel, TimeSettModel } from './Models/DateTime.model.js';
import { OrderRouter } from './Routes/order.route.js';
const app=express();
const PORT=process.env.PORT||2000;
DBConnect();
app.use(cors({
  origin:['http://localhost:5173','http://localhost:5173/'],
  credentials:true,
}))
app.use(cookieParser())
app.use(express.json());
/*
  Make uploads folder public/static

  URL:
  /uploads/<filename>
*/
// !project/
// !├── uploads/
// !│   └── profile/
// !│       └── image1.jpg
//! http://localhost:5000/uploads/profile/image1.jpg
app.use(
  "/Images",
  express.static(
    path.join(process.cwd(), "Images")
  )
);

app.get("/ravi",async(req,resp)=>{
  /**
   * 
  let Daydata=await DaySettModel.create({Day:["Today","Tomorrow ","Day After Tomorrow "]})
  let Timedata=await TimeSettModel.create({Time:[{from:"10 Am",to:"10 PM"},{from:"10 Am",to:"10 PM"},{from:"10 Am",to:"10 PM"}]})
  return resp.send({success:true,msg:"yess"})
  
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 9;
  if(!page || !limit)
  return resp.status(200).send({ success: false, msg: "All feilds are required" });
  
  let totaldoc=null;
  if (page == 1) {
    totaldoc = await UserModel.find().countDocuments();
    }
    
    
    let data=await UserModel.find().select("-password -refreshToken -verifyotp -resetOtp -phoneNumber -isVerified -isOnline -verificationCode -role -verificationCodeExpires")
    .limit(limit)
    .skip((page - 1)*limit)
    .sort({ createdAt: -1 });    
    if(data.length>0){
      return resp.status(200).send({ success: true, msg: data });
      }
      else{
        return resp.status(200).send({ success: true, msg: [] });
      
    }
    const {
      username,
      email,
      phoneNumber,
      role,
      id,
      } = req.body;
      let userid=id?id:req.user.id;
      if(!userid||!username || !email || !password||!role){
        return resp.status(200).send({ success: true, msg: "All feilds are required" });
        }
        
        let data=await UserModel.updateOne({_id:userid},{$set:{username,email,phoneNumber,role}})
        if(data){
          return resp.status(200).send({ success: true, msg: "successfully updated" });
          }
          else{
            return resp.status(400).send({ success: true, msg: "something went wrong" });
          
        }
        let phoneNumber=req.body;
        if(!phoneNumber){
          return resp.status(200).send({ success: false, msg: "Phone Number is required" });
          }
          const LoginOtp = Math.floor(
            100000 + Math.random() * 900000
            ).toString();
            
            // Send verification email
            let phone="+91"+String(phoneNumber)
            let msgbody=`You otp for login is ${LoginOtp}.Remember it is valid only for 5 minutes`
            let data=await sendOTP("+919769479166",msgbody);
            
            if(data){
              return resp.status(200).send({ success: true, msg: "Successfull" });
              
              }
              */
   try {
   let {phoneNumber,LoginOtp}=req.body;
   let data=await  UserModel.find({phoneNumber});
   if(!data[0]?.LoginOtp){
              return resp.status(200).send({ success: false, msg: "Invalid OTP" });
            }
            if(data[0]?.LoginOtp==LoginOtp){
              return resp.status(200).send({ success: true, msg: "successfully logedin" });
              
    }        




} catch (error) {
  return resp.status(500).send({success:false,msg:"Internal server error"})
}
})
   



app.use("/user",UserRouter)
app.use("/DateTime",DateTimeRouter)
app.use("/order",OrderRouter)

app.listen((PORT),()=>{
console.log(`server running at port ${PORT}`)
})
