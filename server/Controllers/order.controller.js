import { OrderModel } from "../Models/order.model.js";

export const CreateOrder=async (req,resp,next)=>{
  try {
      let {Address,Items,Day,Time,cordinates,Amount,Count,phoneNumber,AltphoneNumber}=req.body;
      if(!Address ||!Items||!Day||!Time||!Amount||!Count) 
        return resp.status(200).send({success:false,msg:"all feilds are required!!!!"})
      
    let data=await OrderModel.create({Address,Items:Items,User:req.user.id,Day,Time:Time,lang:cordinates?.lang,lat:cordinates?.lat,Amount,Count,phoneNumber,AltphoneNumber})

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
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 9;
    if(!page || !limit)
        return resp.status(200).send({ success: false, msg: "All feilds are required" });
    
        let totaldoc=null;
       if (page == 1) {
          totaldoc = await OrderModel.find().countDocuments();
        }
      
  let data=await OrderModel.find({User:req.user.id})
      .limit(limit)
      .skip((page - 1)*limit)
      .sort({ createdAt: -1 });    
      if(data.length>0){
        return resp.send({success:true,msg:data})
      }
      else{
        return resp.send({success:true,msg:[]})
      }
    } catch (error) {
      return resp.status(500).send({success:false,msg:"Internal server error"})
    }
  }


      
    export const GetAllOrder=async (req,resp,next)=>{
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 9;
    if(!page || !limit)
        return resp.status(200).send({ success: false, msg: "All feilds are required" });
    
        let totaldoc=null;
       if (page == 1) {
          totaldoc = await OrderModel.find().countDocuments();
        }
        
  let data=await OrderModel.find()
  .limit(limit)
  .skip((page - 1)*limit)
  .sort({ createdAt: -1 })
      if(data.length>0){
        return resp.send({success:true,msg:data})
      }
      else{
        return resp.send({success:true,msg:[]})
      }

      } catch (error) {
        return resp.status(500).send({success:false,msg:"Internal server error"})
      }
    }
  
    export const UpdateOrderStatus=async(req,resp)=>{
      try {
          let  {id,orderStatus,paymentStatus}=req.body;
          if(!id ||!orderStatus ||!paymentStatus) 
            return resp.send({success:false,msg:"All feilds are required"})
        let data=await OrderModel.updateOne({_id:id},{$set:{orderStatus,paymentStatus}})
        if(data){
          return resp.send({success:true,msg:"updated successfully"})
          
        }
        } catch (error) {
          return resp.status(500).send({success:false,msg:"Internal server error"})
        }
    }
    
    export const UpdateOrder=async(req,resp)=>{
      try {
          let {Address,Day,Time,cordinates,phoneNumber,AltphoneNumber,id}=req.body;
      if(!Address ||!cordinates||!Day||!Time||!Day||!phoneNumber||!AltphoneNumber||!id) 
        return resp.status(400).send({success:false,msg:"all feilds are requir"})
      let data=await OrderModel.updateOne({_id:id},{$set:{Address,lang:cordinates?.lang,lat:cordinates.lat,Day,Time,phoneNumber,AltphoneNumber}})
      if(data){
        return resp.status(200).send({success:true,msg:"Updated successfully"})
      }
      else{
        return resp.status(400).send({success:false,msg:"kuch to galat hua hai"})

      }

        } catch (error) {
          return resp.status(500).send({success:false,msg:"Internal server error"})
        }
    }