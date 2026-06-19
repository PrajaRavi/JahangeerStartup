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
import { OrderModel } from './Models/order.model.js';
import axios from 'axios';

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


export async function sendotpfast(phone,otp){
  try {
    let {data}=await axios.get(`https://api.hanuotp.in/sms-otp.php?number=${phone}&OTP=${otp}&apikey=${process.env.HANU_OTP}`)
console.log(data)
return data.return
  } catch (error) {
    console.log(error)
  }
}
// export async function sendotpfast(phone,otp){
//   try {
    
//     const url=`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2_SM}&route=otp&variables_values=${otp}&numbers=${phone}`
    
//     let {data}=await axios.get(url);
//     if (data.return === true) {
//       console.log(`✅ OTP successfully sent to ${userMobile}`);
//       return { success: true, data: response.data };
//     } else {
//       console.error('❌ Fast2SMS failed to dispatch:', response.data.message);
//       return { success: false, error: response.data.message };
//     }
//   } catch (error) {
//     console.log(error)
//     // console.error('💥 Internal SMS Network Error:', error.message);
//     return { success: false, error: error.message };
//   }

// }
app.get("/ravi",async(req,resp)=>{
  
   try {
  let {orderid}=req.query;
  let data=await OrderModel.deleteOne({_id:orderid})
  if(data){
    return resp.status(200).send({success:true,msg:"Successfully deleted"})
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
