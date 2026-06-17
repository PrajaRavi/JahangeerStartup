import express from 'express';
import dotenv from 'dotenv'
import cors from "cors"
import path from "path"
import cookieParser from 'cookie-parser';
import { UserRouter } from './Routes/user.route.js';
import { DBConnect } from './Config/connenction1.js';
import { UserModel } from './Models/user.model.js';
import { DateTimeRouter } from './Routes/DateTime.route.js';
import { DaySettModel, TimeSettModel } from './Models/DateTime.model.js';
dotenv.config()
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
  try {
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
*/
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

} catch (error) {
  return resp.status(500).send({success:false,msg:"Internal server error"})
}
})
   



app.use("/user",UserRouter)
app.use("/DateTime",DateTimeRouter)
app.listen((PORT),()=>{
console.log(`server running at port ${PORT}`)
})
