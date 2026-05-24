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
      
// Media Type Indicator
  type: { 
    type: String, 
    enum: ['text', 'video', 'audio', 'image'], 
    default: 'text',
    required: true 
  },

  // This is for (delete for me delete section)
  hiddenBy:[{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      index: true // Indexed because friends will query this field to see their feed
    }],
  
  content: {
    // For 'text' type
    text: { type: String, trim: true },
    
    // For future 'video/audio/image' types
    mediaUrl: { type: String, default: null },
    duration: { type: Number, default: null } // useful for video/audio length
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