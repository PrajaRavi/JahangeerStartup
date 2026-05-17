import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socket.context";
import SendAudioPath from "../assets/music/send.mp3";
import ReciveAudioPath from "../assets/music/reciver.mp3";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../Redux/Stores/Store.files";
import { SetMessages, UpdateMsg, UpdateMsgSeen, type messageType } from "../Redux/Slice/Auth.slice";
import { nanoid } from "nanoid";
import { formatTime12Hour, localStorageLastMsg, LocalStorageLogedinuserId } from "../utils/Dotenv";
import axios from "axios";
import { GroupSettingObject } from "./Hero";
import { Mic, Paperclip, Send, Smile } from "lucide-react";

export function MessageInput() {
  const { socket, Onlineuser } = useContext(SocketContext);
  let senderaudio = new Audio(SendAudioPath);

  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: any) => state.Auth.messages);
  let [UserStopedTyping, setUserStopedTyping] = useState<boolean>(false);
  let ActiveUser = useSelector((state: any) => state.Auth.ActiveUser);
  let ShowGroupOrChat = useSelector((state: any) => state.Auth.ShowGroupOrChat);

  const LogedInUser = useSelector((state: any) => state.Auth.user);
  const [text, setText] = useState("");

  async function StoreLastMsgIdOfConversation(msgid:string,conversationId:string){
    try {
      let {data}=await axios.put(`http://localhost:7000/conversation/store-conversation-last-msg-id`,{msgid,conversationId},{withCredentials:true}) 
      if(data.success){
        console.log(data.msg)
      }
    } catch (error) {
      console.log(error)
      console.log("error in StoreLastMsgIdOfParticipants")
    }
  }
  function SendMessage() {
    if (text != "") {
      let myobj: messageType = {
        _id: nanoid(),
        text,
        status: "sending",
        seen: false,
        time: formatTime12Hour(Date.now()),
        senderID: LogedInUser._id,
        reciverID: ActiveUser._id,
      };

      if (LogedInUser._id !== ActiveUser._id && ShowGroupOrChat=="group") {
        
        let CurrntlyOnlineUsers: string[] = [];
        for (let member of ActiveUser?.members) {
          console.log(member);
          let result = Onlineuser.get(member?.userID);
          if (result) CurrntlyOnlineUsers.push(result);
        }

        // In case of group chat i have to send group id also
        if (ShowGroupOrChat == "group") {
          /*
        Here i have to do two task
        !1.emit the send-message event for all the online group members(also update their lastmsgID If message is seened)
        !2.handle members who are offline
        !3.basically intially it is not neccesary that all user are online so for online users i will imidiately send message and also update theis lastmsgID in group document but members who are offline
          !1.initally their msgid will be null so inside useffect whenever they will come online so i have to check if their lastmsgID==null then first fetch all the message of that group and all the messages will be unseen for them now
          !->as well as they will open the group i will update their lastmsgid(which will be the lastmsg of the group)->so for that i have to store the lastmsgID of group
          !->now if they are offline again but this time their lastmsgid!=null(so i will fetch all the messages of that group)->and i will count all the messages which are after the lastmsgid of that member 
*/

          socket.emit("send-message", {
            roomid: CurrntlyOnlineUsers,
            msg: myobj,
            senderId: LogedInUser._id,
            reciverId: ActiveUser._id,
            status: "sending",
            GroupID: ActiveUser._id,
            profilePicture: LogedInUser.profilePicture,
          }); //in case of group message this reciverId will be the groupId

          // At the time of sending message since sender is sending message so i have to take care of it's lastmsgid
        } else {
          socket.emit("send-message", {
            roomid: CurrntlyOnlineUsers,
            msg: myobj,
            senderId: LogedInUser._id,
            reciverId: ActiveUser._id,
            status: "sending",
          }); //in case of group message this reciverId will be the groupId
        }
      } else {
        console.log("selfmessage");
        socket.emit("send-message", {
          roomid: Onlineuser.get(ActiveUser._id),
          msg: myobj,
          senderId: LogedInUser._id,
          reciverId: ActiveUser._id,
          status: "sending",
        });
        dispatch(UpdateMsgSeen({ msgid: myobj?._id, seen: true }));
      }

      dispatch(SetMessages(myobj));
      console.log(messages);
      setText("");
    }
  }
  async function UpdateGroupMembersLastMsgID(
    userID: string,
    GroupID: string,
    msgid: string,
  ): Promise<void> {
    try {
      let { data } = await axios.put(
        `http://localhost:7000/group/update-group-members`,
        { userID, GroupID, msgid },
        { withCredentials: true },
      );
      if (data?.success) {
        console.log("succcessfull");
      }
    } catch (error) {
      console.log("err in UpdateGroupMembersLastMsgID");
    }
  }

  useEffect(() => {
    console.log(messages);
    if (messages?.length > 0 && messages[messages.length - 1]?._id) {
      localStorage.setItem(
        localStorageLastMsg,
        messages[messages.length - 1]?._id,
      );
    }
  }, [messages]);

  useEffect(() => {
    if (UserStopedTyping) {
      socket.emit("typing-stoped", { roomid: Onlineuser.get(ActiveUser._id) });
    }
  }, [UserStopedTyping]);

  useEffect(() => {
    socket.on("msg-status-is-sent", async (data: any) => {
      console.log("message status is sen")
      dispatch(
        UpdateMsg({
          msgid: data?._id,
          status: "sent",
          msgMongoId: data?.msgid,
        }),
      );
      await senderaudio.play();
    });
    socket.on("msg-status-is-deliverd", (data: any) => {
      console.log("deliverd");
      if(data?.ConversationID &&data?.ConversationID!=="" ){
        StoreLastMsgIdOfConversation(data?._id,data?.ConversationID);
      }
      console.log(ActiveUser._id, LogedInUser._id);
      console.log(ActiveUser._id === LogedInUser._id);
      if (ActiveUser._id === LogedInUser._id) {
        console.log("chal diya");
        dispatch(UpdateMsgSeen({ msgid: data?._id, seen: true }));
      }
      dispatch(UpdateMsg({ msgid: data?._id, status: "delivered" }));
    });
  }, []);

  return (
    <>
      {(ShowGroupOrChat == "group" &&
        (((ActiveUser?.settings.includes(GroupSettingObject.onlyAdminsCanSend) && ActiveUser?.admins?.includes(String(localStorage.getItem(LocalStorageLogedinuserId))))||ActiveUser?.settings.includes(GroupSettingObject.onlyAdminsCanEditInfo)||ActiveUser?.settings.includes(GroupSettingObject.approveNewMembers)) 
        )) ||
      ShowGroupOrChat == "chat" ? (
        <div className="p-4 border-t bg-white flex items-center gap-3">
          <Smile className="w-6 h-6 text-gray-500 cursor-pointer" />
          <Paperclip className="w-6 h-6 text-gray-500 cursor-pointer" />

          <input
            type="text"
            // placeholder={String((ShowGroupOrChat=="group" && ActiveUser?.settings.includes(GroupSettingObject.onlyAdminsCanSend) && ActiveUser?.admins?.includes(localStorage.getItem("LogedInUser"))===false)||ShowGroupOrChat=="chat")}
            placeholder={"Type a message..."}
            value={text}
            onKeyDown={(e) => {
              if (e.key.toLowerCase() == "enter") {
                SendMessage();
              }
            }}
            onChange={(e) => {
              setText(e.target.value);
              socket.emit("typing-started", {
                roomid: Onlineuser.get(ActiveUser._id),
              });
              setTimeout(() => {
                socket.emit("typing-stoped", {
                  roomid: Onlineuser.get(ActiveUser._id),
                });
              }, 3000);
            }}
            className="flex-1 px-4 py-3 border rounded-full outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={() => {
              SendMessage();
            }}
            title="send"
            className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white"
          >
            {text.trim() ? (
              <Send className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>
      ) : (
        <div className="p-4 border-t bg-white flex items-center gap-3">
          <h1>Only Admin can send message</h1>
        </div>
      )}
    </>
  );
}
