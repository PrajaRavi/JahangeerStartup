import { StatusModel } from "../Models/status.model.js";

export const CreateStatus=async (req,resp)=>{
  try {
      let userId=req.user.id;
      let {type,content}=req.body;//This content will contain {text,bgcolor,font}[for type->text]
      if(!type||!content) return resp.status(200).send({success:false,msg:"Nothing kuch aya hi nahi hai!!!!"})
      content=JSON.parse(content);
      let data=await StatusModel.create({userId,viewedBy:[],type,content})
      if(data){
        console.log(data)
        return resp.status(200).send({success:true,msg:"created successfully!!!!"})
      }
  
   
    } catch (error) {
      console.log(error);
      return resp
        .status(500)
        .send({ success: false, msg: "internal server error" });
    }
}
export const UpdateViewBy=async(req,resp)=>{

try {
  let {viewedBy,statusId}=req.body;//This viewby will be a userId not an array fo id's
  if(!viewedBy || !statusId) return resp.status(200).send({success:false,msg:"nothing(kuch aya hi nahi)"})
  let data=await StatusModel.updateOne({_id:statusId},{$addToSet:{viewedBy}})
  if(data)
    return resp.status(200).send({success:true,msg:"Updated successfully!!!"})
 
  } catch (error) {
    console.log(error);
    return resp
      .status(500)
      .send({ success: false, msg: "internal server error" });
  }
};


export const GetAllStatus=async (req,resp)=>{
  // !For now i am sending all status data but in frontend since i already have AllUsersData so i will create an array having statusdata and also whoCanSee array and use it 
  try {
  let data=await StatusModel.find()
  if(data){
    return resp.status(200).send({success:true,msg:data})
  }

  } catch (error) {
    console.log(error);
    return resp
      .status(500)
      .send({ success: false, msg: "internal server error" });
  
  }
}
