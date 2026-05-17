import { useContext, useEffect, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { SocketContext } from "../context/socket.context";
import type { AppDispatch } from "../Redux/Stores/Store.files";
import type { GroupDataType, LastMsgAndSeenObjType, memberObject } from "../utils/Types";
import { setActiveUser, SetShowChatOrGroup, type SignupFormData } from "../Redux/Slice/Auth.slice";
import axios from "axios";
import { localStorageLastMsg, LocalStorageLogedinuserId, myobject } from "../utils/Dotenv";
import api from "../utils/post.api";
import UserProfileModal from "./UserProfile";
import { MessageCircle, MessageSquare, Search } from "lucide-react";

type PropsOfSideBar = {
  SelectedSideBar: string;
  setSelectedSideBar: React.Dispatch<React.SetStateAction<string>>;
  AllUsersUnSeenMsg: Map<string, string[]>;
  GroupData: GroupDataType[];
  setGroupData: React.Dispatch<React.SetStateAction<GroupDataType[]>>;
  GroupIdWithUnseenMsgCount:Map<string,number>;
  setGroupIdWithUnseenMsgCount:React.Dispatch<React.SetStateAction<Map<string,number>>>;
  GetGroupUnseenMsgCount:(GroupIDArray: string[], userID?: string) => Promise<void>
};

export function Sidebar({
  SelectedSideBar,
  setSelectedSideBar,
  AllUsersUnSeenMsg,
  GroupData,
  setGroupData,
  // GroupIdWithUnseenMsgCount,
  // setGroupIdWithUnseenMsgCount,
  GetGroupUnseenMsgCount,
}: PropsOfSideBar) {
  const navigate = useNavigate();
  const { Onlineuser, socket } = useContext(SocketContext);
  // const messages = useSelector((state: any) => state.Auth.messages);
  // const IsUserLogin = useSelector((state: any) => state.Auth.IsUserLogin);
  let ShowGroupOrChat = useSelector((state: any) => state.Auth.ShowGroupOrChat);

  let [ShowSearchBox, setShowSearchBox] = useState<boolean>(false);
  let [SerachedUsers, setSerachedUsers] = useState<any>([]);
  let [showUserProfile, setshowUserProfile] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  let ActiveUser = useSelector((state: any) => state.Auth.ActiveUser);
  let [LastMsgAndSeenObj, setLastMsgAndSeenObj] = useState<
    Map<string, LastMsgAndSeenObjType>
  >(new Map());
  let AllUserData = useSelector((state: any) => state.Auth.AllUsers);
  // let UnseenMessages = useSelector((state: any) => state.Auth.UnseenMessages);
  const LogedInUser = useSelector((state: any) => state.Auth.user);
  
 
  function SerachUsers(username: string) {
    try {
      let filterdUsers = AllUserData.filter((item: SignupFormData) => {
        // console.log(String(item.username).toLowerCase(),String(username).toLowerCase())
        return String(item.username)
          .toLowerCase()
          .includes(String(username).toLowerCase());
      });
      // console.log(filterdUsers)
      setSerachedUsers(filterdUsers);
    } catch (error) {
      console.log(error);
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
  function CheckIfUserExistInMembers(members: memberObject[], userId: string) {
    for (let member of members) {
      if (member.userID == userId) return true;
    }
    return false;
  }

  
  async function GetAllGroups(userid: string) {
    // newmembers.includes(LogedInUser._id)||admins.includes(LogedInUser._id)
    try {
      let { data } = await axios.get(
        `http://localhost:7000/group/groups?userId=${userid}`,
        { withCredentials: true },
      );
      if (data.success) {
        // filter groups means store only that groups which related to the currlogedin user

        let newdata = data?.msg.filter((item: GroupDataType) => {
          return (
            CheckIfUserExistInMembers(
              item?.members,
              String(localStorage.getItem(LocalStorageLogedinuserId)),
            ) 
          );
        });
        console.log(GroupData);
        setGroupData(newdata);
        let MembersIDS = data?.msg.map((item: GroupDataType) => {
          return item._id;
        });
        console.log(MembersIDS);
        GetGroupUnseenMsgCount(MembersIDS);

        console.log("group a gaya");
        console.log(data?.msg);
      }
    } catch (error) {
      console.log("error in getallgroup");
    }
  }
  function GetLastMsgOfChat(reciverid: string) {
    return LastMsgAndSeenObj.get(reciverid);
  }

  async function GetLastMsgOfGroup() {
    try {
      let { data } = await axios.get(
        `http://localhost:7000/message/last-messages-of-group?GroupID=${localStorage.getItem("ActiveUser")}`,
        { withCredentials: true },
      );
      if (data.success) {
        LastMsgAndSeenObj.set(String(localStorage.getItem("ActiveUser")), {
          lastmsg: data?.msg?.text,
          lastseen: data?.msg.time,
        });
      }
    } catch (error) {
      console.log("error in getlastmsgofgroup");
    }
  }
  async function GetLastMessageOfChatWrapper(
    senderid: string,
    reciverid: string,
  ) {
    try {
      let { data } = await axios.get(
        `http://localhost:7000/conversation/last-msg-of-participents?senderid=${senderid}&reciverid=${reciverid}`,
        { withCredentials: true },
      );

      if (data?.msg?.length > 0) {
        LastMsgAndSeenObj.set(data.reciverid, {
          lastmsg: data?.msg?.text,
          lastseen: data?.msg?.time,
        });
      } else {
        LastMsgAndSeenObj.set(data.reciverid, {
          lastmsg: data?.msg?.text,
          lastseen: data?.msg?.time,
        });
      }
    } catch (error) {
      console.log(error);
      console.log("error in GetLastMessageOfChat");
    }
  }

  async function LogoutUser() {
    try {
      let { data } = await api.post(
        "/user/logout-user",
        {},
        { withCredentials: true },
      );
      if (data.success) {
        localStorage.removeItem("email");
        navigate("/signin/abc@gmail.com");
      }
    } catch (error) {
      console.log(error);
      alert("error in logout the user");
    }
  }

  useEffect(()=>{
console.log(AllUsersUnSeenMsg)
  },[AllUsersUnSeenMsg])
  
  useEffect(() => {
    if (ShowGroupOrChat == "group") {
      GetLastMsgOfGroup();
      // but at the same time i also have to reset the logedinUser lastmsgid
      if (AllUsersUnSeenMsg.get(ActiveUser._id)) {
        AllUsersUnSeenMsg.delete(ActiveUser._id)
        UpdateGroupMembersLastMsgID(
          String(localStorage.getItem(LocalStorageLogedinuserId)),
          ActiveUser._id,
          String(localStorage.getItem(localStorageLastMsg)),
        );
      }
    }
    if (LogedInUser._id !== "" && AllUserData?.length > 0) {
      GetAllGroups(String(localStorage.getItem(LocalStorageLogedinuserId)));
      for (let user of AllUserData) {
        // console.log(user,LogedInUser._id)
        GetLastMessageOfChatWrapper(LogedInUser?._id, user._id);
      }
    }
  }, [AllUserData, ActiveUser]);
  
  return (
    <div className="w-full md:w-95 border-r bg flex  flex-row h-full">
      <UserProfileModal
        onClose={() => setshowUserProfile(false)}
        isOpen={showUserProfile}
        onLogout={LogoutUser}
        onUpdate={() => {}}
        user={LogedInUser}
      />
      <div className="w-[10%] relative flex pt-5 flex-col gap-2 h-full bg-green-50">
        <button
          title="button"
          onClick={() => {
            setSelectedSideBar(myobject[0]);
          }}
          className={
            SelectedSideBar == myobject[0]
              ? "bg-green-200 relative flex items-center justify-center w-10 h-10"
              : "flex items-center justify-center w-10 h-10"
          }
        >
          {<MessageCircle size={18} />}
          <p className="absolute bottom-0 right-1 text-s font-semibold">
            {AllUsersUnSeenMsg?.size > 0 ? AllUsersUnSeenMsg?.size : ""}
          </p>
        </button>
        <button
          title="button"
          onClick={() => {
            setSelectedSideBar(myobject[1]);
          }}
          className={
            SelectedSideBar == myobject[1]
              ? "bg-green-200 flex items-center justify-center w-10 h-10"
              : "flex items-center justify-center w-10 h-10"
          }
        >
          {<MessageSquare size={18} />}
        </button>
        <button
          onClick={() => setshowUserProfile(true)}
          className="w-10 h-10 absolute bottom-5 "
        >
          <img
            className="w-full h-full rounded-full"
            src={`http://localhost:4500/Images/Profile/${LogedInUser?.profilePicture}`}
            alt="profile"
          />
        </button>
      </div>

      <div className="w-[90%] flex flex-col ">
        <div className="p-4 border-b w-full gap-3 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Chats</h2>
          {ShowSearchBox == false ? (
            <button title="button" onClick={() => {setShowSearchBox(true)
              console.log(ActiveUser)
            }}>
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          ) : (
            <div className="serachBox w-[80%] flex gap-2 bg-green-50 p-1 rounded-md border-2  border-black ">
              <button
                title="button"
                onClick={() => {
                  setShowSearchBox(false);
                  console.log(AllUsersUnSeenMsg);
                }}
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>{" "}
              <input
                type="search"
                name="serach"
                onChange={(e: any) => {
                  // console.log(e.target.value)
                  SerachUsers(e.target.value);
                }}
                className="w-full bg-transparent outline-none border-none"
                id="search"
                placeholder="Serach User"
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {SerachedUsers?.length == 0
            ? AllUserData.map((user: SignupFormData) => (
                <div
                  onClick={() => {
                    dispatch(
                      setActiveUser({
                        _id: user._id,
                        username: user.username,
                        bio: user.bio,
                        phoneNumber: user.phoneNumber,
                        profilePicture: user.profilePicture,
                      }),
                    );
                    localStorage.setItem("ActiveUser", user._id);
                    socket.emit("give-all-unseenmsg-id", {});
                    dispatch(SetShowChatOrGroup("chat"));
                  }}
                  key={user._id}
                  className={
                    ActiveUser._id == user._id
                      ? "flex items-center relative gap-3 p-4  bg-green-100  cursor-pointer border-b"
                      : "flex items-center relative gap-3 p-4 hover:bg-gray-100  cursor-pointer border-b"
                  }
                >
                  <img
                    src={`http://localhost:4500/Images/Profile/${user?.profilePicture}`}
                    alt={user?.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div
                    id="dot"
                    className={
                      Onlineuser.has(user._id)
                        ? "w-2 h-2 absolute bottom-3  left-14 rounded-full bg-green-500"
                        : "w-2 h-2 absolute bottom-3  left-14 rounded-full hidden"
                    }
                  ></div>

                  {/* 
            !Never call a function inside jsx it is wrong and inefficient
            !Never call a function inside jsx it is wrong and inefficient
            !Never call a function inside jsx it is wrong and inefficient
            !Never call a function inside jsx it is wrong and inefficient
            !Never call a function inside jsx it is wrong and inefficient
             */}

                  {AllUsersUnSeenMsg?.get(user._id) == undefined ? (
                    <p className="time font-semibold text-xs  absolute right-5">
                      {LogedInUser._id &&
                        (GetLastMsgOfChat(user._id)?.lastseen as ReactNode)}
                    </p>
                  ) : (
                    <p className="UnSeenMsgCount bg-green-600 w-5 h-5 flex items-center justify-center rounded-full text-black font-semibold text-xs  absolute right-5">
                      {AllUsersUnSeenMsg.get(user._id)?.length}
                    </p>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start flex-col">
                      <h3 className="font-medium truncate">
                        {user?.username}
                        {LogedInUser?._id == user?._id ? "(you)" : ""}
                      </h3>
                      {/* <span className="text-xs text-gray-500"></span> */}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {LogedInUser._id &&
                        (GetLastMsgOfChat(user._id)?.lastmsg as ReactNode)}
                      {/* {chat.lastMessage} */}
                    </p>
                  </div>
                </div>
              ))
            : SerachedUsers.map((user: SignupFormData) => (
                <div
                  onClick={() => {
                    dispatch(
                      setActiveUser({
                        _id: user._id,
                        username: user.username,
                        bio: user.bio,
                        phoneNumber: user.phoneNumber,
                        profilePicture: user.profilePicture,
                      }),
                    );
                    localStorage.setItem("ActiveUser", user._id);
                    socket.emit("give-all-unseenmsg-id", {});
                  }}
                  key={user._id}
                  className={
                    ActiveUser._id == user._id
                      ? "flex items-center relative gap-3 p-4  bg-green-100  cursor-pointer border-b"
                      : "flex items-center relative gap-3 p-4 hover:bg-gray-100  cursor-pointer border-b"
                  }
                >
                  <img
                    src={`http://localhost:4500/Images/Profile/${user?.profilePicture}`}
                    alt={user?.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div
                    id="dot"
                    className={
                      Onlineuser.has(user._id)
                        ? "w-2 h-2 absolute bottom-3  left-14 rounded-full bg-green-500"
                        : "w-2 h-2 absolute bottom-3  left-14 rounded-full hidden"
                    }
                  ></div>

                  {/* {ReturnCountOfUnseenMsg(user._id) == undefined ? (
                    <p className="time font-semibold text-xs  absolute right-5">
                      {LogedInUser._id &&
                        (GetLastMsgOfChat(user._id)?.lastseen as ReactNode)}
                    </p>
                  ) : (
                    <p className="UnSeenMsgCount bg-green-600 w-5 h-5 flex items-center justify-center rounded-full text-black font-semibold text-xs  absolute right-5">
                      {ReturnCountOfUnseenMsg(user._id)}
                    </p>
                  )} */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start flex-col">
                      <h3 className="font-medium truncate">
                        {user?.username}
                        {LogedInUser?._id == user?._id ? "(you)" : ""}
                      </h3>
                      {/* <span className="text-xs text-gray-500"></span> */}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {LogedInUser._id &&
                        (GetLastMsgOfChat(user._id)?.lastmsg as ReactNode)}
                      {/* {chat.lastMessage} */}
                    </p>
                  </div>
                </div>
              ))}
          <div>
            {GroupData.length > 0
              ? GroupData?.map((group: GroupDataType) => (
                  <div
                    onClick={() => {
                      dispatch(
                        setActiveUser({
                          _id: group._id,
                          groupName: group.groupName,
                          groupDescription: group.groupDescription,
                          phoneNumber: 123,
                          groupProfileImage: group.groupProfileImage,
                          members: group.members,
                          settings: group.groupSettings,
                          admins: group.admins,
                          LastMsgID:group.LastMsgID
                          
                        }),
                      );
                      dispatch(SetShowChatOrGroup("group"));
                      localStorage.setItem("ActiveUser", group._id);
                    }}
                    key={group._id}
                    className={
                      ActiveUser._id == group._id
                        ? "flex items-center relative gap-3 p-4  bg-green-100  cursor-pointer border-b"
                        : "flex items-center relative gap-3 p-4    cursor-pointer border-b"
                    }
                  >
                    <img
                      src={`http://localhost:7000/Images/GroupProfile/${group.groupProfileImage}`}
                      alt={group.groupName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {AllUsersUnSeenMsg.get(group._id)===undefined||AllUsersUnSeenMsg.get(group._id)?.length===0? (
                      <p className="time font-semibold text-xs  absolute right-5">
                        {LastMsgAndSeenObj.get(group._id)?.lastseen}
                      </p>
                    ) : (
                      <p
                        
                        className="UnSeenMsgCount bg-green-600 w-5 h-5 flex items-center justify-center rounded-full text-black font-semibold text-xs  absolute right-5"
                      >
                        {AllUsersUnSeenMsg.get(group._id)?.length}
                      </p>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start flex-col">
                        <h3 className="font-medium truncate">
                          {group.groupName}
                        </h3>
                        {
                          <span className="text-xs text-gray-500">
                            {LastMsgAndSeenObj.get(group._id)?.lastmsg}
                          </span>
                        }

                        {/* <span className="text-xs text-gray-500"></span> */}
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
