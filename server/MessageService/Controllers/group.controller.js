import mongoose from "mongoose";
import { Group } from "../Models/group.model.js";
import { type } from "os";
import { json } from "stream/consumers";
import { MsgModel } from "../Models/Message.model.js";
/*
  Create Group Controller
*/
export const createGroup = async (req, res) => {
  try {
    /*
      Get current logged in user
      (from auth middleware)
    */
   const userId = req.user.id;
  //  return console.log(req.file)
    /*
      Extract body data
    */
    const {
      groupName,
      groupDescription,
      members,
      groupSettings,
    } = req.body;
    /*
      Validate group name
    */
    if (!groupName?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Group name is required",
      });
    }

    /*
      Validate members
    */
    if (
      !members ||
      // !Array.isArray(members) ||
      members.length === 0
    ) {
      console.log(members)
      return res.status(400).json({
        success: false,
        message:
          "At least one member is required",
      });
    }

    
    

    /*
      Validate MongoDB ObjectIds
    */
   
    const validMembers =
      JSON.parse(members).map(
        (member) =>
          new mongoose.Types.ObjectId(
            member._id
          )
      );

    
    /*
      Validate settings
    */
    const allowedSettings = [
      "onlyAdminsCanSend",
      "onlyAdminsCanEditInfo",
      "approveNewMembers",
    ];

    let validatedSettings = [];

    if (
      groupSettings &&
      Array.isArray(JSON.parse(groupSettings))
    ) {
      validatedSettings =
        JSON.parse(groupSettings).filter(
          (setting) =>

            allowedSettings.includes(
              setting
            )
          
        );
    }
    
    /*
      Create group
    */

      //!since i have members as array of groupID and intially when group is created then all the members have lastmsgID=null so i  have to create a new array from these members array 
      let NewMembers=JSON.parse(members)?.map((item)=>{
        return {
          userID:item._id,
          LastMsgID:null
        }
      })
      NewMembers?.push({userID:userId,LastMsgID:null})
    const newGroup =
      await Group.create({
        groupName: groupName.trim(),
        groupDescription:
          groupDescription?.trim() ||
          "",
        groupProfileImage:req?.file?.filename||"unknown file hai",
        groupSettings:
          validatedSettings,
        members:NewMembers,

        /*
          Creator becomes admin
        */
        admins: [userId],

        createdBy: userId,
      });

    return res.status(201).json({
      success: true,
      message:
        "Group created successfully",
      data: newGroup,
    });
  } catch (error) {
    console.error(
      "Create Group Error:",
      error
    );

    /*
      Handle invalid ObjectId
    */
    if (
      error instanceof
      mongoose.Error.CastError
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid member id",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};

export const GetallGroup=async(req,resp)=>{
  try {
    let {userId}=req.query;
    if(!userId) return resp.send({success:false,msg:"nothing"})
    let data=await Group.find({$or:[
      {"admins":userId}
    ,{"members.userID":userId}
  ]})
  if(data.length>0){
    return resp.send({success:true,msg:data})
  }
    
  } catch (error) {
    console.log(error)
    return resp.send({success:false,msg:"error in GetAllgroup"})
  }
}
export const UpdateGroupWithID=async (req,resp)=>{
  try {
    let {userId,groupName,
      groupDescription,
      members,
      groupSettings,
}=req.body;
members=JSON.parse(members);
groupSettings=JSON.parse(groupSettings)
    if(!userId) return resp.send({success:false,msg:"nothing"})
      let data=await Group.updateOne({_id:userId},{$set:{groupName,groupDescription,members,groupSettings,groupProfileImage:req.file.filename||"Unknown file"}})
    
    if(data){
      return resp.status(200).send({success:true,msg:"updated bhaiya!!!!!"})
    }
    console.log(data)

    
  } catch (error) {
    console.log(error)
    return resp.status(500).send({success:false,msg:"error in Updategroup"})
    
  }
}

export const GetLastMsgOFGroup=async (req,resp)=>{
  try {
    if(!req.query.GroupID) return resp.status(200).send({success:false,msg:"Nothing bhai!!!!"})
      let data=await MsgModel.find({GroupID:req.query.GroupID}).sort({createdAt:-1})
  
      // .populate({path:"senderID"})
      console.log(data)
      return resp.status(200).send({success:true,msg:data[0]})
      
    } catch (error) {
      console.log(error);
      return resp
        .status(500)
        .send({ success: false, msg: "internal server error" });
    }
}
export const UpdateGroupMembers=async(req,resp)=>{
  try {
let {userID,GroupID,msgid}=req.body;
let data=await Group.updateOne({_id:GroupID,"members.userID":userID},{$set:{"members.$.LastMsgID":msgid,LastMsgID:msgid}})
if(data){
  return resp.status(200).send({success:true,msg:"successfully updated!!!"})
}
return resp.status(200).send({success:false,msg:"Kuch to hua hai bhai!!!"})
 
      
  } catch (error) {
    console.log(error);
    return resp
      .status(500)
      .send({ success: false, msg: "internal server error" });
    }
  }
export const ReturnUnseenMsgCount=async (req,resp)=>{
  try {
    
let {userID,GroupIDArray}=req.body;
GroupIDArray=Array.from(GroupIDArray)
/*

console.log(userID)
console.log(GroupIDArray)
return
*/
if(!userID || GroupIDArray?.length==0) return resp.send({success:false,msg:"kuch aya hi nahi hai!!!!"})
let response=new Map();
let data=await Promise.all(GroupIDArray.map(async (GroupID)=>{
  let data=await Group.find({_id:GroupID,"members.userID":userID},{members:{$elemMatch:{userID}}})
  if(data.length>0){
    let lastmsgId=data[0]?.members[0]?.LastMsgID;
    if(lastmsgId){
      console.log("if")
      // This filtering is for members who lasgMsgId is not null
      let groupmessages=await MsgModel.find({GroupID:GroupID,_id:{$gt:lastmsgId}})
      let MsgIds=groupmessages.map((item)=>{
        return item._id;
      })
      response.set(GroupID,MsgIds)
      
    }
    else{
      console.log("else"+GroupID)
      // Now if the lastMsgId is  null

      let groupmessages=await MsgModel.find({GroupID:GroupID})
      let MsgIds=groupmessages.map((item)=>{
        return item._id;
      })
    response.set(GroupID,MsgIds)

    }
  }
}))  
  
   
      return resp.status(200).send({success:true,msg:Array.from(response)})
      
  
      
  } catch (error) {
    console.log(error);
    return resp
      .status(500)
      .send({ success: false, msg: "internal server error" });
  }
}