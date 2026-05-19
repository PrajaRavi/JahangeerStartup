import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../context/socket.context";
import type { SignupFormData } from "../Redux/Slice/Auth.slice";
import { GroupOptions, type memberObject } from "../utils/Types";
import { LocalStorageLogedinuserId } from "../utils/Dotenv";
import GroupSettings from "./GroupSettings";
import Modal, { type Options } from "../utils/Modal.util";
import { MoreVertical } from "lucide-react";
import CreateGroupPage from "./GroupCreation";
import axios from "axios";

export function ChatHeader() {
  let ActiveUser = useSelector((state: any) => state.Auth.ActiveUser);
  const user = useSelector((state: any) => state.Auth.user);
  let AllUserData = useSelector((state: any) => state.Auth.AllUsers);
  let ShowGroupOrChat = useSelector((state: any) => state.Auth.ShowGroupOrChat);

  const { socket } = useContext(SocketContext);
  let [ShowGroupSettingPage, setShowGroupSettingPage] = useState(false);
  const LogedInUser = useSelector((state: any) => state.Auth.user);
  let [IsSenderTyping, setIsSenderTyping] = useState<boolean>(false);
  let [ShowOptions, setShowOptions] = useState<boolean>(false);
  let [SelectedOption, setSelectedOption] = useState<string>("");
  let { Onlineuser } = useContext(SocketContext);
  let [ModalOptions,setModalOptions]=useState<Options[]>([])
  let [FilterdUsers, setFilterdUsers] = useState<SignupFormData[]>([]); //This contains alluserdata except the logedinuser
  useEffect(() => {
    socket.on("typing-acknowledgement", (data: string) => {
      console.log(data);
      if (data === "typing") {
        setIsSenderTyping(true);
      } else {
        setIsSenderTyping(false);
      }
    });
  }, []);

  function ReturnTotalOnlineUsersInAGroup(members: memberObject[]) {
    let filtered = members.filter(
      (item: memberObject) => item.userID != LogedInUser._id,
    );
    let count = 0;
    if (Onlineuser && filtered.length > 0) {
      for (let user of filtered) {
        if (Onlineuser.has(user.userID)) {
          count++;
        }
      }
    }
    return count;
  }

  useEffect(() => {
    setModalOptions([{label:GroupOptions.newgroup,onClick:(e)=>{
      setShowOptions(false);
                setSelectedOption(String(e.target.title).toLowerCase());
                if (String(e.target.title).toLowerCase() == "new group") {
                } else if (
                  String(e.target.title).toLowerCase() == "new community"
                ) {
                }
    }},{label:GroupOptions.newcommu,onClick:()=>{}},{label:GroupOptions.settings,onClick:()=>{
      setShowOptions(false);
      setShowGroupSettingPage(true);
    }}])

       
    if (user._id !== "") {
      let newdata = AllUserData.filter((item: SignupFormData) => {
        return item._id != user._id;
      });
      setFilterdUsers(newdata);
    }
  }, [user, AllUserData]);
  function ReturnStringWithCommaSepratedMembers(members: memberObject[]) {
    //this members container array of id of user
    // for now i am just taking names of the users in future i will do something that show name for users which are saved otherwise show their phone no
    // i am already storing all userdata inside AllUserData so i have to just filter the array and create a new array
    let result = "";
    for (let member of members) {
      let data = AllUserData?.filter((user: SignupFormData) => {
        return user._id == member.userID;
      });
      if (
        member.userID !==
        String(localStorage.getItem(LocalStorageLogedinuserId))
      )
        result += data[0].username + ",";
    }

    return result;
  }

  function EditGroup() {}
  const JSXForShowingOnlineOrTyping = () => {
    return (
      <>
        {IsSenderTyping == false ? (
          <p className="text-sm text-green-500">Online</p>
        ) : (
          <p className="text-sm text-green-500">typing...</p>
        )}
      </>
    );
  };
  if (ShowGroupOrChat == "group") {
    return (
      <>
        {ShowGroupSettingPage ? (
          <GroupSettings
            setShowGroupSettingPage={setShowGroupSettingPage}
            data={ActiveUser}
            OnClose={() => setShowGroupSettingPage(false)}
          />
        ) : null}
        <div
          onClick={() => EditGroup()}
          className="p-4 border-b bg-white flex items-center justify-between"
        >
          {ShowOptions ? (
            <Modal
              top={"60px"}
              right={"30px"}
              position="fixed"
              
              options={ModalOptions}
            />
          ) : (
            false
          )}
          <div className="flex items-center gap-3">
            <img
              src={`http://localhost:7000/Images/GroupProfile/${ActiveUser?.groupProfileImage}`}
              alt={ActiveUser?.groupName}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <h2 className="font-medium">{ActiveUser?.groupName}</h2>

              <p className="text-sm text-green-500">
                {ReturnTotalOnlineUsersInAGroup(
                  ActiveUser.members
                  
                ) == 0
                  ? ReturnStringWithCommaSepratedMembers(ActiveUser?.members)
                  : ReturnTotalOnlineUsersInAGroup(
                      ActiveUser.members,
                      
                    ) + " online"}
              </p>
            </div>
          </div>

          <MoreVertical
            onClick={() => {
              setShowOptions(!ShowOptions);
            }}
            className="w-5 h-5 text-gray-600"
          />
        </div>
      </>
    );
  } else if (ActiveUser?._id !== LogedInUser?._id) {
    return (
      <>
        {SelectedOption == "new group" && (
          <CreateGroupPage
            setSelectedOption={setSelectedOption}
            users={FilterdUsers}
            onCreateGroup={async ({
              groupDescription,
              groupName,
              groupProfile,
              selectedUsers,
              settings,
            }) => {
              let formdata = new FormData();

              formdata.append("groupDescription", groupDescription);
              formdata.append("groupName", groupName);
              formdata.append("GroupProfile", groupProfile);
              formdata.append("members", JSON.stringify(selectedUsers));
              formdata.append("groupSettings", JSON.stringify(settings));
              console.log(selectedUsers);
              try {
                let { data } = await axios.post(
                  `http://localhost:7000/group/create-group`,
                  formdata,
                  { withCredentials: true },
                );
                if (data.success) {
                  console.log(data);
                  setSelectedOption("");
                }
              } catch (error) {
                console.log(error);
                console.log("error during creating group");
              }
            }}
          />
        )}

        <div className="p-4 border-b bg-white flex items-center justify-between">
          {ShowOptions ? (
            <Modal
            
              position="fixed"
              top={"60px"}
              right={"30px"}
              options={ModalOptions}
            />
          ) : (
            false
          )}
          <div className="flex items-center gap-3">
            <img
              src={`http://localhost:4500/Images/Profile/${ActiveUser?.profilePicture}`}
              alt={ActiveUser?.username}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <h2 className="font-medium">{ActiveUser?.username}</h2>

              {Onlineuser.has(ActiveUser._id) ? (
                <JSXForShowingOnlineOrTyping />
              ) : (
                <p className="text-sm text-black">offline</p>
              )}
            </div>
          </div>

          <MoreVertical
            onClick={() => {
              // setShowOptions(true)
              setShowOptions(!ShowOptions);
            }}
            className="w-5 h-5 text-gray-600"
          />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="p-4 border-b bg-white flex items-center justify-between">
          {ShowOptions ? (
            <Modal
            position="fixed"
              top={"60px"}
              right={"30px"}
              options={ModalOptions}
            />
          ) : (
            false
          )}
          <div className="flex items-center gap-3">
            <img
              src={`http://localhost:4500/Images/Profile/${ActiveUser?.profilePicture}`}
              alt={ActiveUser?.username}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <h2 className="font-medium">{ActiveUser?.username}</h2>

              <p className="text-sm text-green-500">Message yourself</p>
            </div>
          </div>

          <MoreVertical
            onClick={() => {
              setShowOptions(!ShowOptions);
            }}
            className="w-5 h-5 text-gray-600"
          />
        </div>
      </>
    );
  }
}
