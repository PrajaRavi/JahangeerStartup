import { DaySettModel, TimeSettModel } from "../Models/DateTime.model.js";

export const UpdateTime=async (req,resp)=>{
  try{
  let {id,from,to}=req.body;
     let data=await TimeSettModel.updateOne({"Time._id":id},{$set:{"Time.$.from":from,"Time.$.to":to}})
     if(data){
      return resp.send({success:true,msg:"updated successfullly!!!"})
     }
    } catch (error) {
      return resp.status(500).send({success:false,msg:"Internal server error"})
    }
  
}

export const GetTime=async (req,resp)=>{
  try{
     let data=await TimeSettModel.find();
          if(data){
      return resp.send({success:true,msg:data[0].Time})
     }
    } catch (error) {
      return resp.status(500).send({success:false,msg:"Internal server error"})
    }
  
}
export const GetDay=async (req,resp)=>{
  try{
     let data=await DaySettModel.find();
          if(data){
      return resp.send({success:true,msg:data[0].Day})
     }
    } catch (error) {
      return resp.status(500).send({success:false,msg:"Internal server error"})
    }
  
}