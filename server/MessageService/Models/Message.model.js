import mongoose from "mongoose";
const msgschema=new mongoose.Schema({
  senderID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  reciverID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  GroupID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Group",
    
  },
  ConversationID:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Conversation",
    },
      

  text:{
    type:String,
    trim:true,
  },
  
profilePicture:{
    type:String,
    trim:true,
  },
  time:{
    type:String,
    default:"00:00",
    trim:true,
  },
  seen:{
    type:Boolean,
    default:false,
    },
  status:{
type:String,
default:"delivered",
trim:true
  }
},{
  timestamps:true,
  versionKey:false
});

export const MsgModel=mongoose.model("Message",msgschema);