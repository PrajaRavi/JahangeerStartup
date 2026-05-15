import express from 'express';
import dotenv from 'dotenv'
import cors from "cors"
import path from "path"
import cookieParser from 'cookie-parser';
import { UserRouter } from './Routes/user.route.js';
import { DBConnect } from './Config/connenction1.js';
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

app.use("/user",UserRouter)
app.listen((PORT),()=>{
console.log(`server running at port ${PORT}`)
})
