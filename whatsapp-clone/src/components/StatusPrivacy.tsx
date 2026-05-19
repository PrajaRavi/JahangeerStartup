import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react"
interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  phoneNumber: string;
  whoCanSee?:string[];

}

function StatusPrivacy({users,onclose,LogedInUser}:{users:User[],onclose:()=>{},LogedInUser:User}) {
  const [selectedUsers, setSelectedUsers]=useState<User[]>([])

  let [SelectedUserIDs,setSelectedUserIDs]=useState<string[]>([])
  const [search, setSearch] =
      useState<string>("");
  
  /*
    Select member
  */
 async function GetAllWhoCanSeeUserOfLogedInuser(){
  try {
    let {data}=await axios.get("http://localhost:4500/user/Getall-whoCanSee-user",{withCredentials:true})
    if(data.success) {
      console.log(data)
      setSelectedUsers(data?.msg)
    }
  } catch (error) {
    console.log(error)
  }
 }
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
const filteredUsers = users.filter(
(user) =>
      
      user.username
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  /*
    Remove member
  */
  const handleDeselectUser = (
    userId: string
  ) => {
    setSelectedUsers((prev) =>
      prev.filter(
        (u) => u._id !== userId
      )
    );
  };
  useEffect(()=>{
GetAllWhoCanSeeUserOfLogedInuser();
  },[])
  return (
    <>
    <div className=" fixed glass z-10   h-full">
<X onClick={onclose}/>
            <div className="p-4 w-[60vw]  border-b">
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
              <div className="p-4 border-b flex gap-3 overflow-x-auto">
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

            <div className="max-h-[450px] overflow-y-auto">
              {filteredUsers.map(
                (user) => {
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

            <div className="p-4 border-t">
              <button
                disabled={
                  selectedUsers.length ===
                  0
                }
                onClick={async ()=>{
                  let Iddata=selectedUsers.map((item:User)=>{
                    return item._id
                  })
                  // now update the user collection and add privacy in the logedin user
                  // let formdata=new FormData();
                  // formdata.append("whoCanSee",JSON.stringify(Iddata))
                  try {
                    let {data}=await axios.put(`http://localhost:4500/user/update-who-can-see`,{whoCanSee:JSON.stringify(Iddata)},{withCredentials:true})
                    if(data?.success){
                      console.log(data)
                      onclose();
                    }
                  } catch (error) {
                    console.log(error)
                  }
                   }}
                className="w-20 bg-black text-white py-3 rounded-xl"
              >
                Submit
              </button>
            </div>
    </div>

          </>
        )} 
 

export default StatusPrivacy
