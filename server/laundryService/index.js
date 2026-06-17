import express from 'express';
import dotenv from 'dotenv'
import cors from "cors"
import path from "path"
import cookieParser from 'cookie-parser';
import { OrderRouter } from './Routes/order.route.js';
import { DBConnect } from './Config/connenction1.js';
import { OrderModel } from './Models/order.model.js';
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
    let {Address,Day,Time,cordinates,phoneNumber,AltphoneNumber,id}=req.body;
      if(!Address ||!cordinates||!Day||!Time||!Day||!phoneNumber||!AltphoneNumber) 
        return resp.status(200).send({success:false,msg:"all feilds are requir"})
      let data=await OrderModel.updateOne({_id:id},{$set:{Address,lang:cordinates?.lang,lat:cordinates.lat,Day,Time,phoneNumber,AltphoneNumber}})
      if(data){
        return resp.status(200).send({success:true,msg:"Updated successfully"})
      }
      else{
        return resp.status(200).send({success:false,msg:"kuch to galat hua hai"})

      }

  } catch (error) {
    return resp.status(500).send({success:false,msg:"Internal server error"})
  }
})

app.use("/order",OrderRouter)
app.listen((PORT),()=>{
console.log(`server running at port ${PORT}`)
})
