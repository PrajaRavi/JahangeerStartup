import axios from "axios";
import { PlusIcon, User, XSquareIcon } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetAllUsers } from "../Redux/Slice/Auth.slice";
import type { AppDispatch } from "../Redux/Stores/Store.files";
import { GroupSettingObject } from "./Hero";
import type { MembersOfGroup } from "../utils/Types";

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  phoneNumber: string;
}

type GroupSetting =
  | "onlyAdminsCanSend"
  | "onlyAdminsCanEditInfo"
  | "approveNewMembers";

interface CreateGroupPayload {
  _id:string;
  groupName: string;
  groupDescription: string;
  groupProfile: File | null;
  members: MembersOfGroup[];
  settings: GroupSetting;
  admins:string[]
}

function GroupSettings({data,OnClose,setShowGroupSettingPage}:{data:CreateGroupPayload,OnClose:(e:any)=>void,setShowGroupSettingPage:React.Dispatch<React.SetStateAction<boolean>>}) {
  const [groupName, setGroupName] =
      useState<string>(data.groupName);
  let AllUserData=useSelector((state:any)=>state.Auth.AllUsers)
  const dispatch=useDispatch<AppDispatch>()
  const LogedInUser=useSelector((state:any)=>state.Auth.user)


  const [groupPreview, setGroupPreview] =
    useState<string>("");

  let [selectedUsers,setSelectedUsers]=useState<User[]>([])
    const [
      groupDescription,
      setGroupDescription,
    ] = useState<string>(data.groupDescription);
  
    const [groupProfile, setGroupProfile] =
      useState<File | null>(data.groupProfile);
      const [step, setStep] =
          useState<number>(1);
      
        const [search, setSearch] =
          useState<string>("");
      
        
  
    const [settings, setSettings] =
        useState<GroupSetting[]>(data.settings);
    
    /*
    Toggle enum setting
  */
  const toggleSetting = (
    setting: GroupSetting
  ) => {
    setSettings((prev) => {
      const exists =
        prev.includes(setting);

      if (exists) {
        return prev.filter(
          (item) => item !== setting
        );
      }

      return [...prev, setting];
    });
  };

  /*
    Check if enabled
  */
  const isSettingEnabled = (
    setting: GroupSetting
  ) => {
    return settings.includes(
      setting
    );
  };

const handleDeselectUser = (
    userId: string
  ) => {
    setSelectedUsers((prev) =>
      prev.filter(
        (u) => u._id !== userId
      )
    );
  };

    const handleProfileChange = (
      e: ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        e.target.files?.[0] || null;
  
      if (file) {
        setGroupProfile(file);
        setGroupPreview(
          URL.createObjectURL(file)
        );
      }
    };
  
  
  const filteredUsers = AllUserData.filter(
    (user:User) =>
      user.username
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  useEffect(()=>{
    // setSelectedUsers([])
    // if(data?.members.length>0 && AllUserData?.length>0){
    let arr:User[]=[]
      data?.members.forEach((member)=>{

        AllUserData.forEach((user:any)=>{

          if(user._id==member.userID){
            console.log(user._id,member)
            arr.push(user)
          }
        })
        
      })
      setSelectedUsers(arr)
      
     },[])
async function HandleGroupUpdate(){
  if(data?.settings.includes(GroupSettingObject.onlyAdminsCanEditInfo) &&!data?.admins?.includes(LogedInUser._id)){
    return alert("Only admin can edit info")
  }
  let members=selectedUsers.map((item:User)=>{
    return item._id;

  })
  
  //! since in backend the members array is array of objects(userid,lastmsgid) so i have to fetch all members lastmsgid and then i have to create a new array and send it
  //! also one thing if i added a new members then it lastmsgid will be equal to lastmsgId of group
  
  // ?This  members array contains the recent selected users
  // ?The members inside data contains all the real members
  let FormatedMembers:MembersOfGroup[]=[]
  members.map((userid:string)=>{
    for (let member of data?.members){
      if(member.userID==userid){
        FormatedMembers.push({userID:userid,LastMsgID:member.LastMsgID} as MembersOfGroup)
        return;
      }
    }
        
    FormatedMembers.push({userID:userid,LastMsgID:null})
  })
    


    

    
  let formdata=new FormData();
  formdata.append("userId",data._id)
  formdata.append("groupName",groupName)
  formdata.append("groupDescription",groupDescription)
  formdata.append("members",JSON.stringify(FormatedMembers))
  formdata.append("groupSettings",JSON.stringify(settings))
  formdata.append("GroupProfile",groupProfile)
  try {
    let response=await axios.put(`http://localhost:7000/group/update-group`,formdata,{withCredentials:true})

      if(response?.data?.success){
        console.log(response?.data)
        setShowGroupSettingPage(false);
        dispatch(SetAllUsers(AllUserData))
         }
         else{
          alert(response?.data?.msg)
         }
      
  } catch (error:any) {
    if(error?.response){

      if(error.response?.status===500){
        alert("Internal server error")
      }
    }else{
alert("something went wrong")
      console.log(error)
      console.log("error in HandleGroupUpdate()")
    }
      
                
  }

}

/*
    Select member
  */
  const handleSelectUser = (
    user: User
  ) => {
    const exists =
      selectedUsers.some(
        (u) => u._id === user._id
      );

    if (exists) return;

    setSelectedUsers((prev) => [
      ...prev,
      user,
    ]);
  };

  return (
    <>
  {step==0?<div className="w-screen fixed flex flex-col items-center justify-center overflow-y-scroll top-0 left-0 h-screen glass z-30">

    <div className="p-4 border-b w-[60vw] relative flex flex-col">
      <button
                onClick={() =>
                  setStep(1)
                }
                className="absolute -top-10 bg-black w-8 h-8 text-white rounded-md"
                
              >
                ←
              </button>

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3 outline-none"
              />
            </div>

            {selectedUsers.length >
              0 && (
              <div className="p-4 border-b  flex gap-3 overflow-x-auto">
                {selectedUsers.map(
                  (user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-2 shrink-0"
                    >
                      <img
                        src={`http://localhost:4500/Images/Profile/${user.profilePicture}`}
                        alt={
                          user.username
                        }
                        className="w-8 h-8 rounded-full"
                      />

                      <span>
                        {
                          user.username
                        }
                      </span>

                      <button
                        onClick={() =>
                          handleDeselectUser(
                            user._id
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="max-h-[450px] w-[60vw] overflow-y-auto">
              {filteredUsers.map(
                (user:User) => {
                  const isSelected =
                    selectedUsers.some(
                      (u) =>
                        u._id ===
                        user._id
                    );

                  return (
                    <div
                      key={user._id}
                      onClick={() =>
                        isSelected
                          ? handleDeselectUser(
                              user._id
                            )
                          : handleSelectUser(
                              user
                            )
                      }
                      className={`flex items-center gap-4 p-4 border-b cursor-pointer ${
                        isSelected
                          ? "bg-green-50"
                          : ""
                      }`}
                    >
                      <img
                        src={`http://localhost:4500/Images/Profile/${user.profilePicture}`}
                        alt={
                          user.username
                        }
                        className="w-12 h-12 rounded-full"
                      />

                      <div>
                        <h3 className="font-semibold">
                          {
                            user.username
                          }
                        </h3>

                        <p className="text-sm text-gray-500">
                          {
                            user.email
                          }
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
  </div>


    :<div className="w-screen fixed flex items-center justify-center overflow-y-scroll top-0 left-0 h-screen glass z-30">
      <XSquareIcon className=" absolute  top-5 right-5" onClick={(e)=>OnClose(e)}/>
      <div className="w-[60vw]">

       <div className="p-5 border-b  flex items-center gap-4">
              
              <h1 className="text-2xl font-bold" >
                Group Details
              </h1>
            </div>

            <div className="p-5 space-y-5">
              {/* Group image */}
              <div className="flex justify-center" onClick={()=>{
                // console.log(selectedUsers)
              }}>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e)=>{

                      data?.settings.includes(GroupSettingObject.onlyAdminsCanEditInfo) ?alert("only admim can send message"): handleProfileChange(e)
                    }
                  }
                  />

                  <img
src={groupPreview||`http://localhost:7000/Images/GroupProfile/${data?.groupProfileImage}`}

                    alt="group"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                </label>
              </div>

              {/* Group name */}
              <input
                type="text"
                placeholder="Group name"
                value={groupName}
                onChange={(e) =>
                  setGroupName(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3"
              />

              {/* Description */}
              <textarea
                placeholder="Group description"
                value={
                  groupDescription
                }
                onChange={(e) =>
                  setGroupDescription(
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3 resize-none"
                rows={4}
              />

               {/* Enum settings */}
              <div className="space-y-4">
                <h2 className="font-bold text-lg">
                  Group Settings
                </h2>

                {[
                  "onlyAdminsCanSend",
                  "onlyAdminsCanEditInfo",
                  "approveNewMembers",
                ].map((setting) => (
                  <label
                    key={setting}
                    className="flex justify-between"
                  >
                    <span>
                      {setting}
                    </span>

                    <input
                      type="checkbox"
                      checked={isSettingEnabled(
                        setting as GroupSetting
                      )}
                      onChange={() =>{
                        toggleSetting(
                          setting as GroupSetting
                        )
                        console.log(settings)
                      }
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Bottom selected users */}
            <div className="border-t p-4">
              <h3 className="font-semibold relative mb-3">
                Selected Members
              <button onClick={()=>setStep(0)} className="absolute top-0 right-0" title="Add members"><PlusIcon /></button>
              </h3>

              <div className="flex gap-4 overflow-x-auto">
                {selectedUsers.map(
                  (user) => (
                    <div
                      key={user._id}
                      className="flex relative flex-col items-center shrink-0"
                    >
                      <div className={data?.admins?.includes(user._id)?"dot absolute right-0 top-0 w-3 h-3 rounded-full bg-green-500":"hidden"}>
                      </div>

                      <img
                        src={
                          `http://localhost:4500/Images/Profile/${user?.profilePicture}`
                        }
                        alt={
                          user.username
                        }
                        className="w-14 h-14 rounded-full"
                      />

                      <span className="text-sm mt-2">
                        {
                          String(user.username).length>7?String(user.username).slice(0,7)+"...":String(user.username)
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Create button */}
            <div className="p-4 border-t">
              <button 
              onClick={()=>{
                HandleGroupUpdate()
              }}
                                
                className="w-full bg-black text-white py-3 rounded-xl"
              >
                Update Group
              </button>
            </div>
      </div>

    </div>}

    </>
  )
}

export default GroupSettings
