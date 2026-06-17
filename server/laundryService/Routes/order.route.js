import express from "express"
import { protect } from "../Middlewares/AuthMiddleware.js";
import { CreateOrder, GetAllOrder, GetOrders, UpdateOrder, UpdateOrderStatus } from "../Controllers/order.controller.js";
export const OrderRouter=express.Router();

OrderRouter.post("/create-order",protect,CreateOrder)
OrderRouter.get("/get-all-order",protect,GetAllOrder)
OrderRouter.get("/get-order-by-id",protect,GetOrders)
OrderRouter.put("/update-order-status",protect,UpdateOrderStatus)
OrderRouter.put("/update-order",protect,UpdateOrder)








