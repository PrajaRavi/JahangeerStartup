import { OrderModel } from "../Models/order.model.js";

export const CreateOrder=async (req,resp,next)=>{
  try {
      let {Address,Items,Day,Time,cordinates}=req.body;
      if(!Address ||!Items||!Day||!Time) 
        return resp.status(200).send({success:false,msg:"all feilds are required!!!!"})
      
    let data=await OrderModel.create({Address,Items:Items,User:req.user.id,Day,Time:Time,lang:cordinates?.lang,lat:cordinates?.lat})

    if(data){
      return resp.send({success:true,msg:"successfully"})
    }
    } catch (error) {
      console.log(error)
      return resp.status(500).send({success:false,msg:"Internal server error"})
    }
}
export const GetOrders=async (req,resp,next)=>{
  try {
    
  let data=await OrderModel.find({User:req.user.id})
  
  if(data.length>0){
    
    return resp.send({success:true,msg:data})
    
  }
  } catch (error) {
    return resp.status(500).send({success:false,msg:"Internal server error"})
  }
}