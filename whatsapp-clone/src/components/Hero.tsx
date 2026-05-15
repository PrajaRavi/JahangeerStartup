import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import "../index.css"
import { Link } from "react-router";
import ReciveAudioPath from "../assets/music/reciver.mp3";
import "../App.css"
import {
  SetMessages,
  UpdateMsgSeen,
  type messageType,
} from "../Redux/Slice/Auth.slice";
import { SocketContext } from "../context/socket.context";
import {
  formatTime12Hour,
  LocalStorageLogedinuserId,
  myobject,
} from "../utils/Dotenv";
import axios from "axios";
import { Sidebar } from "./Sidebar";
import { ChatHeader } from "./Chatheader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";


export const GroupSettingObject = {
  onlyAdminsCanSend: "onlyAdminsCanSend",
  onlyAdminsCanEditInfo: "onlyAdminsCanEditInfo",
  approveNewMembers: "approveNewMembers",
};





type PropsOfChatWindow = {
  SelectedSideBar: string;
  // setSelectedSideBar:React.Dispatch<React.SetStateAction<string>>,
  // let [,setSelectedSideBar]=useState<string>(myobject[0])
};

function ChatWindow({ SelectedSideBar }: PropsOfChatWindow) {
  // const { socket } = useContext(SocketContext);
  let ActiveUser = useSelector((state: any) => state.Auth.ActiveUser);
  // const messages = useSelector((state: any) => state.Auth.messages);
  // const { Onlineuser } = useContext(SocketContext);

  // const dispatch = useDispatch();

  if (ActiveUser?.username == "") {
    return (
      <div>
        <h1>Select any one to chat!!!!</h1>
      </div>
    );
  } else if (SelectedSideBar == myobject[0]) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <ChatHeader />
        <MessageList />
        <MessageInput />
      </div>
    );
  } else if (SelectedSideBar == myobject[1]) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <h1>Implement karna hai abhi</h1>
      </div>
    );
  }
}

export default function Hero() {
  const user = useSelector((state: any) => state.Auth.user);
  let reciverAudio = new Audio(ReciveAudioPath);
  const { socket, Onlineuser } = useContext(SocketContext);
  const OnlineUserRef = useRef(Onlineuser);
  let ActiveUser = useSelector((state: any) => state.Auth.ActiveUser);
  const messages = useSelector((state: any) => state.Auth.messages);
  let [GroupIdWithUnseenMsgCount, setGroupIdWithUnseenMsgCount] = useState<
    Map<string, number>
  >(new Map(null)); //This variable will keep count of group and their unseenmsg

  let [GroupData, setGroupData] = useState<GroupDataType[]>([
    
  ]);
  let GroupDataRef = useRef<GroupDataType[]>(null);
  type GroupDataType = {
    _id: string;
    groupName: string;
    groupDescription: string;
    groupProfileImage: string;
    groupSettings: string[];
    members: string[];
    admins: string[];
    createdBy: string;
  };

  let [AllUsersUnSeenMsg, setAllUsersUnseenMsg] = useState<
    Map<string, number>
  >(new Map()); //This map is storing all the unseen messages of diffrent senders when user is online/offline but activeuser is !=that user which is sending the message Map<senderId,[messageids]>

  let [SelectedSideBar, setSelectedSideBar] = useState<string>(myobject[0]);
  const IsUserLogin = useSelector((state: any) => state.Auth.IsUserLogin);
  let ShowGroupOrChat = useSelector((state: any) => state.Auth.ShowGroupOrChat);

  const dispatch = useDispatch();

  useEffect(() => {
    OnlineUserRef.current = Onlineuser;
  }, [Onlineuser]);

  async function GetGroupUnseenMsgCount(
    GroupIDArray: string[],
    userID: string = String(localStorage.getItem(LocalStorageLogedinuserId)),
  ) {
    try {
      let { data } = await axios.post(
        `http://localhost:7000/group/get-unseenmsg-count`,
        { userID, GroupIDArray: GroupIDArray },
        { withCredentials: true },
      );
      if (data.success) {
        console.log(data);
        let newdata = new Map();
        for(let item of data?.msg){
          if(item[1]!==0){
            newdata.set(String(item[0]),item[1])
          }
        }
        console.log(newdata)
        setAllUsersUnseenMsg(new Map([...AllUsersUnSeenMsg,...newdata]))
        
      }
    } catch (error) {
      console.log(error);
      console.log("error in GetGroupUnseenMsgCount");
    }
  }


  async function StoreUnseenMsginDB(
    senderID: string,
    reciverID: string,
    msgid: string,
  ) {
    try {
      let { data } = await axios.post(
        `http://localhost:7000/conversation/unsees-msg-of-participents`,
        { senderID, reciverID, msgid },
        { withCredentials: true },
      );
      if (data.success) {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      console.log(
        "error in  StoreUnseenMsginDB(senderid:string,reciverid:string)",
      );
    }
  }
  async function GetUnseenMsgFromDB(reciverID: string) {
    //This for chat of two users
    try {
      let { data } = await axios.get(
        `http://localhost:7000/conversation/unsees-msg-of-participents?reciverID=${reciverID}`,
        { withCredentials: true },
      );
      if (data.success) {
        if (data?.msg?.length > 0) {
          let newmap = new Map();
          for (let item of data?.msg) {
            console.log(item);
            newmap.set(item?.senderID, item?.messages);
          }
          console.log("hi hi hi ");
          setAllUsersUnseenMsg(newmap);
        } else {
          console.log("empty data kuch aya hi nahi hai!!!");
        }
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      console.log(
        "error in  StoreUnseenMsginDB(senderid:string,reciverid:string)",
      );
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
  function ReturnIfLogedinUserIsMemberOfGroupOrNot(GroupID: string) {
    if (
      !GroupDataRef.current ||
      GroupDataRef.current.length == 0 ||
      !GroupID ||
      GroupID == ""
    )
      return alert("kuch aya hi nahi bhai");
    for (let group of GroupDataRef.current) {
      console.log("second");
      console.log(group);
      if (group._id == GroupID) {
        if (
          group?.members?.includes(String(localStorage.getItem("LogedInUser")))
        )
          return true;
      }
    }
    return false;
  }
  useEffect(() => {
    GroupDataRef.current = GroupData;
  }, [GroupData]);
  useEffect(() => {
    socket.on("connect", () => {
      socket.on("reciver-ne-message-seen-kar-liya-hai", (data: any) => {
        console.log("reciver-ne-message-seen-kar-liya-hai");
        console.log(data);
        dispatch(UpdateMsgSeen({ msgid: data?.msgid, seen: true }));
      });

      socket.on("recive-message", (data1: any) => {
        let myobj: messageType = {
          _id: data1.msgid,
          text: data1.msg.text,
          seen: false,
          time: formatTime12Hour(Date.now()),
          senderID: data1.msg.senderID,
          reciverID: data1.msg.reciverID,
          profilePicture: data1?.profilePicture,
        };
        dispatch(SetMessages(myobj));
        console.log(data1);
        // now getting the UnseenGroupMsg

        
        

        let IfUserIsOnline = OnlineUserRef.current.has(data1.msg.senderID);
        if (IfUserIsOnline) {
          // console.log(data1.msg)
          /**
             * In case of chat for message blue tick
              ->data1.msg.senderID===localStorage.getItem("ActiveUser")
            ->But in case of group chat
            data1.msg.reciverID===localStorage.getItem("ActiveUser")
             */

          if (data1.msg.senderID === localStorage.getItem("ActiveUser")) {
            reciverAudio.play();
            // now this MsgNanoId is the MsgMongodbId
            socket.emit("message-seen-ho-gaya", {
              msgid: data1?.msgid,
              roomid: data1?.roomid,
            });
          } else {
            if (!data1?.GroupID) {
              
              let oldData = AllUsersUnSeenMsg.get(data1.msg.senderID);
              console.log(oldData);
              console.log(AllUsersUnSeenMsg)
              // console.log(data1.msgid);
              StoreUnseenMsginDB(
                data1?.msg?.senderID,
                data1?.msg?.reciverID,
                data1?.msgid,
              );
              let newMap:Map<string,number>=new Map()
              if (oldData) {
                newMap.set(data1?.msg?.senderID,oldData+1)
              } else {
                newMap.set(data1?.msg?.senderID, 1);
              }
              setAllUsersUnseenMsg(new Map([...AllUsersUnSeenMsg,...newMap]))
              socket.emit(
                "store-all-unseenmsg-id",
                Array.from(AllUsersUnSeenMsg),
              );
            } else {
              if (localStorage.getItem("ActiveUser") === data1?.GroupID) {
                //it means that reciver ne group hi open kiya hua hai
                //!Now i have roomID and i have to just update the lastMsgId of user having this socketID
                UpdateGroupMembersLastMsgID(
                  String(localStorage.getItem(LocalStorageLogedinuserId)),
                  data1?.GroupID,
                  data1?.msgid,
                );

                reciverAudio.play();

                // console.log(localStorage.getItem(LocalStorageLogedinuserId))
              } else {
                // it means reciver ne kisi aur ka chat open kiya hai so i have to store all the group unseen msg
                // in this case (it is occuring inside non members user of group so handle carefully)-Means this case is running inside all the online users it doesn't matter if the user is member of that group or not
                // ->solution i created this funtion ReturnIfLogedinUserIsMemberOfGroupOrNot
                // alert("Jyes")
                // alert(data)
                  let oldData = AllUsersUnSeenMsg.get(data1.GroupID);
                  StoreUnseenMsginDB(
                    data1?.msg?.senderID,
                    data1?.GroupID,
                    data1?.msgid,
                  );
                  if (oldData) {
                    // console.log(AllUsersUnSeenMsg);
                    // oldData.push(data1?.msgid);
                    AllUsersUnSeenMsg.set(data1?.GroupID,oldData+1)
                  } else {
                    AllUsersUnSeenMsg.set(data1?.GroupID, 1);
                  }
                  socket.emit(
                    "store-all-unseenmsg-id",
                    Array.from(AllUsersUnSeenMsg),
                  );
                  console.log(AllUsersUnSeenMsg)
                  
                  
                }
            }
          }
        } else {
          alert("la la la ");
        }
      });
    });
    return () => {};
  }, []);

  useEffect(() => {
    socket.on("reciver-ne-message-seen-kiya", (data: any) => {
      console.log("reciver-ne-message-seen-kar-liya-hai");
      console.log(data);
      dispatch(UpdateMsgSeen({ msgid: data?.msgid, seen: true }));
    });
  }, []);

  useEffect(() => {
    if (user._id != "") {
      localStorage.setItem("LogedInUser", user._id);
      GetUnseenMsgFromDB(user._id);
    }
  }, [user]);

  async function UpdateUnseenMsgToSeen(IDarray: string[]) {
    try {
      let { data } = await axios.put(
        `http://localhost:7000/message/update-msg-seen`,
        { IDarray },
        { withCredentials: true },
      );
      console.log(data);
      if (data?.success) {
        console.log(data?.msg);
      } else {
        console.log("error in  UpdateUnseenMsgToSeen");
      }
    } catch (error) {
      console.log(error);
      console.log("error in  UpdateUnseenMsgToSeen");
    }
  }
  async function UpdateUnseenMsgCollection(
    senderID: string,
    reciverID: string,
  ) {
    try {
      let { data } = await axios.delete(
        `http://localhost:7000/message/delete-unseemsg?senderID=${senderID}&reciverID=${reciverID}`,
        { withCredentials: true },
      );
      if (data?.success) {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      console.log("error in  UpdateUnseenMsgCollection");
    }
  }
  useEffect(() => {
    console.log(messages);

    let IfActiveUserExistOrNotInAllUsersUnSeenMsg = AllUsersUnSeenMsg.get(
      ActiveUser._id,
    );

    if (IfActiveUserExistOrNotInAllUsersUnSeenMsg != undefined) {
      if (ShowGroupOrChat == "chat") {
        // 1.updating all the unseen messages seen=true
        UpdateUnseenMsgToSeen(IfActiveUserExistOrNotInAllUsersUnSeenMsg);
        // 2.removing this Activeuser from AlluserUnSennMsg Map in clientside as well as serverside
        AllUsersUnSeenMsg.delete(ActiveUser._id);
        // 3.Update the UnseenMsg collection in DB make the respective Activeuser._id=senderID and logedinuser._id=reciverID messages=[] or delte
        UpdateUnseenMsgCollection(ActiveUser._id, user._id);
        // 4.Emit an event such that sender can know that reciver ne uska message dekh liya(means update the messages array on the sender side)(not for group messages)
        socket.emit("unseen-msg-ko-reciver-ne-seen-kar-liya", {
          data: IfActiveUserExistOrNotInAllUsersUnSeenMsg,
          roomid: Onlineuser.get(ActiveUser._id),
        });
      } else {
        // 2.removing this Activeuser from AlluserUnSennMsg Map in clientside as well as serverside
        AllUsersUnSeenMsg.delete(ActiveUser._id);
        // 3.Update the UnseenMsg collection in DB make the respective Activeuser._id=senderID and logedinuser._id=reciverID messages=[] or delte
        UpdateUnseenMsgCollection(
          String(localStorage.getItem("LogedInUser")),
          ActiveUser._id,
        );
      }
    }
  }, [ActiveUser]);
  useEffect(() => {
    socket.on(
      "unseen-msg-ko-reciver-ne-seen-kar-liya-ackknowledgment-for-sender",
      (data: string[]) => {
        for (let item of data) {
          dispatch(UpdateMsgSeen({ msgid: item, seen: true }));
        }
      },
    );
    socket.on("take-all-unseenmsg-id", (data: any) => {
      console.log("take-all-unseenmsg-local-id");
      console.log(data);
    });
  }, []);

  return (
    <>
      {IsUserLogin ? (
        <div className="h-screen flex bg-gray-100">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex md:w-95">
            <Sidebar
              AllUsersUnSeenMsg={AllUsersUnSeenMsg}
              SelectedSideBar={SelectedSideBar}
              GroupData={GroupData}
              setGroupData={setGroupData}
              setSelectedSideBar={setSelectedSideBar}
              GroupIdWithUnseenMsgCount={GroupIdWithUnseenMsgCount}
              setGroupIdWithUnseenMsgCount={setGroupIdWithUnseenMsgCount}
              GetGroupUnseenMsgCount={GetGroupUnseenMsgCount}
            />
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex">
            <ChatWindow SelectedSideBar={SelectedSideBar} />
          </div>
        </div>
      ) : (
        <div>
          <h1 className="font-bold text-red-700 ">Hello I am ravi prajapati</h1>
          <Link to={"/signup"}>signup</Link>
          <Link to={"/signin/abc@gmail.com"}>signin</Link>
        </div>
      )}
    </>
  );
}
