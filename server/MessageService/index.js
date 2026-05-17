import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import cors from "cors";
import { DBConnect } from "./Config/connenction1.js";
import { MsgRouter } from "./Routes/Message.route.js";
import { ConvrsationRoute } from "./Routes/conversation.route.js";
import { ConversationModel } from "./Models/conversation.model.js";
import { MsgModel } from "./Models/Message.model.js";
import mongoose from "mongoose";
import { GroupRoute } from "./Routes/group.route.js";
import path from "path";
import { Group } from "./Models/group.model.js";
let OnLineUsers = new Map(); //This map  keeps all the onlineuser
let AllUsersUnSeenMsg = new Map(); // This map  keeps all the unseenmessages localid of respectiveuser
dotenv.config();
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(express.json());
app.use("/message", MsgRouter);
app.use("/group", GroupRoute);
app.use("/conversation", ConvrsationRoute);
// path->Image/GroupProfile/abc.jpg
app.use("/Images", express.static(path.join(process.cwd(), "Images")));

DBConnect();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

// async function CheckConversationBwTwoUser(senderId, reciverId, newmsg) {
async function CheckConversationBwTwoUser(msg) {
  try {
    if (msg.senderID !== msg.reciverID) {
      let data = await ConversationModel.find({
        "participants.userID": { $all: [msg.senderID, msg.reciverID] },
      });
console.log(data)
console.log("ravi")
      if (data?.length == 0) {
        //! since now i am not stroring messages inside conversation model so if conversation do not exist then i have to just create this and if it already exist then nothing 
        //  create a conversation document between them and adding newmsgID as default params of messages
        let FormatedParticipants=[{userID:msg.senderID,LastMsgID:null},{userID:msg.reciverID,LastMsgID:null}]
        
        let data = await ConversationModel.create({
          participants: FormatedParticipants,
        });
          
        console.log("objecfunction CheckConversationBwTwoUser done");
        return data._id

      } 
      else{
        console.log("objecfunction CheckConversationBwTwoUser done");
        return data[0]._id
      }
      
       

    } else {
      let data = await ConversationModel.find({
        "participants.userID": [msg.senderID, msg.reciverID],
      });

      if (data?.length == 0) {
        //  create a conversation document between them and adding newmsgID as default params of messages
        let FormatedParticipants=[{userID:msg.senderID,LastMsgID:null,userID:msg.reciverID,LastMsgID:null}]
        let data = await ConversationModel.create({
          participants: FormatedParticipants,
          
        });
        console.log("objecfunction CheckConversationBwTwoUser done");
        return data._id
      } 
      else{
        console.log("objecfunction CheckConversationBwTwoUser done");
        return data[0]._id
      
      }
    }
  } catch (error) {
    console.log(error);
    console.log("error in function CheckConversationBwTwoUser()");
  }
}

async function StoreMesageInDBForGroup(senderID, reciverID, text, status, time,GroupID,profilePicture,ConversationID) {
  try {
    // mongodb.create() method by default returns the created document
   let   data = await MsgModel.create({ senderID, reciverID, text, time,GroupID,profilePicture }); //by default i am storing status as deliverd
   

    if (!data) {
      console.log("message not sent!!!");
    }
    return String(data._id);
  } catch (error) {
    console.log("function StoreMesageInDB(senderId,reciverId,newmsg)");
    console.log(error);
  }
}
async function StoreMesageInDB(senderID, reciverID, text, time,ConversationID) {
  try {
    // mongodb.create() method by default returns the created document
    let   data = await MsgModel.create({ senderID, reciverID, text, time ,ConversationID}); //by default i am storing status as deliverd
    


    if (!data) {
      console.log("message not sent!!!");
    }
    return String(data._id);
  } catch (error) {
    console.log("function StoreMesageInDB(senderId,reciverId,newmsg)");
    console.log(error);
  }
}

app.get("/ravi", async (req, resp) => {
  try {
 let {userID}=req.query;
 let ConversationID=null;
if(!userID) return resp.status(200).send({success:false,msg:"Requrired data not found"})
let ResultMap=new Map();//This will store senderId(key),(unseenmsg arr)(value)
  // finding all the conversation document where the logedInUser is reciver
 let data=await ConversationModel.find({"participants.1.userID":userID})
 ConversationID=data[0]._id
 if(data?.length>0){
  //now find that participants where userID is equal to logedinuser 
  let participants=[]
   data?.map((covnersationdoc)=>{
    covnersationdoc.participants.map((participant)=>{
      if(participant.userID==userID){
        participants.push(participant)
      }
      
    })
   })
   console.log(participants)
   let PromiseResult=await Promise.all(participants.map(async (item)=>{
let UnSeenMsgs=await MsgModel.find({ConversationID,_id:{$gt:item.LastMsgID}})
let ArrayOfMsgIDS=UnSeenMsgs.map((item)=>{
  return item._id;
})


if(UnSeenMsgs.length>0){
  let AlreadyExist=ResultMap.get(item.userID);
  if(AlreadyExist){
    AlreadyExist.push(ArrayOfMsgIDS)

  }else{
    ResultMap.set(item.userID,ArrayOfMsgIDS)
  }
}
   }))
   
   console.log(ResultMap)
   if(Number(ResultMap.size)>1){
     return resp.status(200).send({success:true,msg:data})
    }
    else{
      return resp.status(200).send({success:true,msg:[]})

    }

     


  }






  } catch (error) {
    console.log(error);
    return resp
      .status(500)
      .send({ success: false, msg: "internal server error" });
  }
});
io.on("connection", async (socket) => {
  socket.on("user-connected", (data) => {
    // console.log(OnLineUsers)
    console.log(socket.id);
    socket.on("typing-started", ({ roomid }) => {
      console.log("typing-start", roomid);
      socket.to(roomid).emit("typing-acknowledgement", "typing");
    });
    socket.on("typing-stoped", ({ roomid }) => {
      console.log("typing-stoped", roomid);
      socket.to(roomid).emit("typing-acknowledgement", "stoped");
    });
    OnLineUsers.set(data.userid, data.socketid);
    // send everyone except the current user
    // socket.on("typing-start")
    io.emit("online-users", Array.from(OnLineUsers));
    socket.on("send-message", async ({ roomid, msg,GroupID,profilePicture }) => {
      // await CheckConversationBwTwoUser(msg?.senderID, msg?.reciverID, msgid);
      let ConversationID=await CheckConversationBwTwoUser(msg);//overall it will return the createdConversationID
      //This function is creating conversation if it not exist and then returning it's _id and if it already exist then also it is returning it's _id

      //!Important
      // !handling messagestore when the lastmsgid of everuser is null(basically first time conversation document is created)
      //?intially when first time the conversation document is created for two participants then after creating covnersation document i am getting it's ConversationID so immidiately update the lastMsgId of the sender in that conversation document and for sender it will depend if it is online then update it other wise not 
      
      //!now handling message store when lastmsgid of everuser is not null(basically conversation document is already created)
      //?I will still get ConversationID so it is simple just store the conversationID in the message and again for sender immidiately update lastmsgid and for reciver it will depend that if it is online or not


      let msgid=null;
      if(GroupID){
        msgid= await StoreMesageInDBForGroup(
         msg?.senderID,
         msg?.reciverID,
         msg?.text,
         msg?.status,
         msg?.time,
         GroupID,
         profilePicture,
         ConversationID,
       );
       
      }
      else{
        console.log("else")
        console.log(ConversationID)
        msgid= await StoreMesageInDB(
         msg?.senderID,
         msg?.reciverID,
         msg?.text,
         msg?.time,
         ConversationID,
         );
        }
         
        // after storing the message updating the sender's lastmsgId of the respective ConversationID
        let data=await ConversationModel.updateOne({_id:ConversationID,"participants.userID":msg?.senderID},{$set:{"participants.$.LastMsgID":msgid}})

      
      socket.emit("msg-status-is-sent", {
        _id: msg._id,
        text: msg.text,
        status: "sent",
        time: msg.time,
        msgid, //This Id is the messages mongodb id
      });
      if (msgid) {
        /**
        await CheckConversationBwTwoUser(msg?.senderID, msg?.reciverID, msgid);
         * 
        */
  socket.emit("msg-status-is-deliverd", {
    _id: msgid,
    text: msg.text,
    status: "deliverd",
    time: msg.time,
    ConversationID,
  });
}

      console.log(roomid);
      console.log("roomid")

      if (msg?.senderID !== msg?.reciverID) {
        socket.to(roomid).emit("recive-message", { roomid, msg, msgid ,profilePicture,GroupID,ConversationID}); //this msg contains _id(nanoid) and this msgid is mongodb id of the message
      } else {
        // self message(message yourself)
        try {
          let newdata = await MsgModel.updateOne(
            { _id: msgid },
            { $set: { seen: true } },
          );
          console.log("message seen done selfmessage");
        } catch (error) {
          console.log("error in message-seen-ho-gaya selfmessage");
          console.log(error);
        }
      }
    });

    socket.on("store-all-unseenmsg-id", (AllUsersUnSeenMsgPrams) => {
      //1. I am already storing all the UnseenMsg with the sender in frontend in  AllUsersUnSeenMsg Map
      //2. so now i just have to store it in server and whenever i update it in frontend i also have to update inside server also
      AllUsersUnSeenMsg = new Map(AllUsersUnSeenMsgPrams);
    });
    socket.on("remove-user-from-AllUsersUnSeenMsg-id", ({ userid }) => {
      if (AllUsersUnSeenMsg.get(userid)) {
        AllUsersUnSeenMsg.delete(userid);
      }
    });

    socket.on("give-all-unseenmsg-id", () => {
      socket.emit("take-all-unseenmsg-id", Array.from(AllUsersUnSeenMsg));
    });

    socket.on("message-seen-ho-gaya", async (data) => {
      console.log(data);
      try {
        let newdata = await MsgModel.updateOne(
          { _id: data?.msgid },
          { $set: { seen: true } },
        );
        // console.log(newdata)
        console.log("message seen done");
        // socket.to(data?.roomid).emit("reciver-ne-message-seen-kar-liya-hai",{msgid:data?.MsgNanoId})
        io.emit("reciver-ne-message-seen-kiya", { msgid: data?.msgid });
      } catch (error) {
        console.log("error in message-seen-ho-gaya");
        console.log(error);
      }
    });
    socket.on("give-all-online-users", () => {
      io.emit("take-all-online-users", Array.from(OnLineUsers));
    });
  });
  socket.on("unseen-msg-ko-reciver-ne-seen-kar-liya", ({ data, roomid }) => {
    console.log("unseen-msg-ko-reciver-ne-seen-kar-liya");
    console.log(data);
    console.log(roomid);
    socket
      .to(roomid)
      .emit(
        "unseen-msg-ko-reciver-ne-seen-kar-liya-ackknowledgment-for-sender",
        Array.from(data),
      );
    // socket.emit("unseen-msg-ko-reciver-ne-seen-kar-liya-ackknowledgment-for-sender",data)
  });
  socket.on("disconnect", async (data1) => {
    let disconnectuserid = null;
    for (let [userid, socketid] of OnLineUsers.entries()) {
      if (socketid == socket.id) {
        disconnectuserid = userid;
      }
    }
    OnLineUsers.delete(disconnectuserid);
    console.log(OnLineUsers);
    io.emit("online-users", Array.from(OnLineUsers));

    console.log("disconnected successfully", socket.id);
  });
  socket.broadcast.emit("User-joind", socket.id + "user joind");
  socket.broadcast.emit("User-Online", socket.id);
  socket.on("UserId", (data) => {
    UserMap.set(data, socket.id);
    // console.log(UserMap)
    const UserSocketArray = Array.from(UserMap.entries());
    io.emit("AllUserJoindTheChat", UserSocketArray); //user to send a data to all the users including the sender as well
  });

  // socket.emit("AllUserjoindTheChat",UserSocket);// we can never emit a map object directly we have to convert it in an array before  sending in frontend or emitting

  socket.on("message", ({ msg, room }) => {
    io.to(UserMap.get(room)).emit("get-msg", msg); //we can give one socke.id or array of socket.id
  });
  socket.on("PrivateMode", ({ msg, room }) => {
    console.log("Private Mode", msg, room);
    io.to(UserMap.get(room)).emit("get-privacy-msg", msg);
  });
  socket.on("typing-start", ({ msg, room }) => {
    console.log("typing-start", msg, room);
    io.to(UserMap.get(room)).emit("typing-acknowledgement", msg);
  });
  socket.on("typing-end", ({ msg, room }) => {
    console.log("typing-end", msg, room);
    io.to(UserMap.get(room)).emit("typing-acknowledgement", msg);
  });
  socket.on("get-privacy-msg-reply", (data) => {
    console.log(data);
    // socket.emit(UserMap.get(data.id),data.ans)
    io.to(UserMap.get(data.reciver)).emit(
      "Opponent-ans-regarding-Privacy-mode",
      data.ans,
    );
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server is listening at port of ${process.env.PORT}`);
});
