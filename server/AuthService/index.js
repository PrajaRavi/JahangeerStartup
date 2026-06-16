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

app.post("/ravi",async(req,resp)=>{
  try {
    /**
     * 
    let Daydata=await DaySettModel.create({Day:["Today","Tomorrow ","Day After Tomorrow "]})
    let Timedata=await TimeSettModel.create({Time:[{from:"10 Am",to:"10 PM"},{from:"10 Am",to:"10 PM"},{from:"10 Am",to:"10 PM"}]})
    return resp.send({success:true,msg:"yess"})

    */
   let {id,from,to}=req.body;
   let data=await TimeSettModel.updateOne({"Day._id":id},{$set:{"Day.$.from":from,"Day.$.to":to}})
   if(data){
    return resp.send({success:true,msg:"updated successfullly!!!"})
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
