//use Prticipants ID's to fetch all the messages
// Their is no need of stroing message ID's 
import mongoose from "mongoose";
const convschema=new mongoose.Schema({
  participants:[{
    userID:{
              type:mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            LastMsgID:{
              type:mongoose.Schema.Types.ObjectId,
              ref: "Message",
            }}],

  LastMsgID:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Message",
          },


  
},{
  timestamps: true,
  versionKey: false
})
export const ConversationModel = mongoose.model("Conversation", convschema);  