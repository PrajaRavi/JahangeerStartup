import express from "express"
import { protect } from "../Middlewares/AuthMiddleware.js";
import { CreateStatus, GetAllStatus, UpdateViewBy } from "../Controllers/status.contoller.js";
export const StatusRoute=express.Router();
StatusRoute.post("/create-status",protect,CreateStatus)
StatusRoute.put("/update-status-viewedBy",protect,UpdateViewBy)
StatusRoute.get("/all-status",protect,GetAllStatus)