import express from "express"
import { protect } from "../Middlewares/AuthMiddleware.js";
import { GetDay, GetTime, UpdateTime } from "../Controllers/DateTime.controller.js";
export const DateTimeRouter=express.Router();
DateTimeRouter.put("/update-time",protect,UpdateTime)
DateTimeRouter.get("/time",protect,GetTime)
DateTimeRouter.get("/day",protect,GetDay)




