import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    User:{
      type:mongoose.Schema.Types.ObjectId,
      Ref:"User"
    },

    lat:{
      type:Number,
      default:0
    },
    Address:{
      type:String,
      default:"",
    },
    lang:{
      type:Number,
      default:0
    },
Amount:{
  type:Number,
  default:0
},
Count:{
type:Number,
  default:0
  
},
phoneNumber: {
      type: String,
      default: "",
    },
AltphoneNumber: {
      type: String,
      default: "",
    },



    Items:[{
        id:String,
        name:String,
        price:Number,
        count:Number,
        
    }],

     paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "PAID",
        "FAILED",
      ],
      default: "PENDING",
    },
    Time:{
      from:String,
      to:String,
    }

    ,
    Day:{
type:String,
    },
    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },

  },{timestamps:true}
)

export const OrderModel=mongoose.model("Order",OrderSchema)