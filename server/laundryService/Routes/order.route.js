import express from "express"
import { protect } from "../Middlewares/AuthMiddleware.js";
import { CreateOrder, GetOrders } from "../Controllers/order.controller.js";
export const OrderRouter=express.Router();

OrderRouter.post("/create-order",protect,CreateOrder)
OrderRouter.get("/get-all-order",protect,GetOrders)
OrderRouter.put("/update-order",protect,CreateOrder)








