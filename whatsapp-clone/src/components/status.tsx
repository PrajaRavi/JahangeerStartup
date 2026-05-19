import React, { useEffect, useRef, useState } from "react";

import {
  Plus,
  ArrowLeft,
  Type,
  Palette,
  MoreVertical,
} from "lucide-react";
import { useSelector } from "react-redux";
import Modal, { type Options } from "../utils/Modal.util";
import { StatusOptions, StatusTypes } from "../utils/Types";
import StatusPrivacy from "./StatusPrivacy";
import axios from "axios";

/*
  Status type
*/
interface Status {
  _id: string;
  username: string;
  profilePicture: string;
  text?: string;
  createdAt: string;
  WhoCanSee:string[];
  bgColorIdx:number;
  fontIdx:number;
  

}

/*
  Dummy statuses
*/
const dummyStatuses: Status[] = [];

/*
  Background colors
*/
const bgColors = [
  "#1B1B1B",
  "#128C7E",
  "#7B1FA2",
  "#1976D2",
  "#E91E63",
  "#F57C00",
];

/*
  Fonts
*/
const fonts = [
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
];

const StatusPage = () => {
  const user = useSelector((state: any) => state.Auth.user);
  const UserRef=useRef(user);
  let [ShowModal,setShowModal]=useState<boolean>(false)
  let [statusPrivacy,setStatusPrivacy]=useState<boolean>(false)
  let AllUserData = useSelector((state: any) => state.Auth.AllUsers);
let [NotVeiwedStatus,setNotVeiwedStatus]=useState<Status[]>([])
let [StatusMap,setStatusMap]=useState<Map<string,Status[]>>(()=>new Map())
// let StatusMap:Map<string,Status[]>=new Map()
let [viewedStatus,setviewedStatus]=useState<Status[]>([])
  let [ModalOption,setModalOption]=useState<Options[]>([])
  /*
    All statuses
  */
  /*
    Modal for add options
  */
  const [showOptions, setShowOptions] =
    useState(false);

  /*
    Text status editor
  */
  const [showTextEditor, setShowTextEditor] =
    useState(false);

  /*
    Status text
  */
  const [statusText, setStatusText] =
    useState("");

  /*
    Current bg
  */
  const [bgIndex, setBgIndex] =
    useState(0);

  /*
    Current font
  */
  const [fontIndex, setFontIndex] =
    useState(0);

  
  /*
    Change background
  */
  const changeBackground = () => {
    setBgIndex(
      (prev) =>
        (prev + 1) %
        bgColors.length
    );
  };

  /*
    Change font
  */
  const changeFont = () => {
    setFontIndex(
      (prev) =>
        (prev + 1) %
        fonts.length
    );
  };

  /*
    Upload text status
  */
 useEffect(()=>{
console.log(StatusMap)
 },[StatusMap])
 const GetAllStatus=async ()=>{
  try {
    let {data}=await axios.get(`http://localhost:7000/status/all-status`,{withCredentials:true})
    if(data?.success){
console.log(data)
for (let status of data?.msg){
  for (let user of AllUserData){
    
    if(user._id==status?.userId){
      if(StatusMap?.get(status?.userId)){

        StatusMap?.get(status?.userId)?.push({_id:status._id,bgColorIdx:Number(status?.content?.bgColor),fontIdx:Number(status?.content?.font),createdAt:status?.createdAt,profilePicture:user.profilePicture,username:user.username,WhoCanSee:user.WhoCanSee,text:status?.content?.text})
      }else{
        StatusMap?.set(user._id,[{_id:status._id,bgColorIdx:Number(status?.content?.bgColor),fontIdx:Number(status?.content?.font),createdAt:status?.createdAt,profilePicture:user.profilePicture,username:user.username,WhoCanSee:user.whoCanSee,text:status?.content?.text}])
      }
      setStatusMap(new Map(StatusMap))
      break;
    }
  }
}
console.log(AllUserData)
console.log(StatusMap)
    }
  } catch (error) {
    console.log(error)
  }

 }
  const uploadTextStatus =async  () => {
    if (!statusText.trim()) return;

    const newStatus: Status = {
      _id: Date.now().toString(),
      text: statusText,
      createdAt: "Just now",
      profilePicture:UserRef.current.profilePicture,
      username:UserRef.current.username,
      bgColorIdx:bgIndex,
      fontIdx:fontIndex,
      WhoCanSee:[],
      

    };

    
    //!The data i want for creating status is type(Text) and content({text,bgcolor,font})
      
let {data}= await axios.post(`http://localhost:7000/status/create-status`,{type:StatusTypes.text,content:JSON.stringify({text:statusText,bgColor:bgIndex,font:fontIndex})},{withCredentials:true})
if(data.success){
  console.log(data)
  setNotVeiwedStatus((prev) => [
    newStatus,
    ...prev,
  ]);
  
  setStatusText("");
  setShowTextEditor(false);
}

  };

  useEffect(()=>{
    GetAllStatus();
setModalOption([{label:StatusOptions.statpriv,onClick:()=>{
        setShowModal(false)

setStatusPrivacy(true)
}},{label:StatusOptions.sett,onClick:()=>{

}}])
UserRef.current=user;
  },[user])

  return (

    <div className="min-h-screen w-full border-2 border-red-400 bg-white text-black">
      {ShowModal&&<Modal options={ModalOption} position="fixed" right="100px" top="100px" />}
      {statusPrivacy&&<StatusPrivacy LogedInUser={UserRef.current} onclose={()=>{
        setStatusPrivacy(false);
      }} users={AllUserData}/>}
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold">
          Status
        </h1>

        {/* Add status */}
        
        {/* <button
          onClick={() =>
            setShowOptions(true)
          }
          className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center"
        >
          <Plus />
        </button> */}
        <button onClick={()=>{
          console.log(StatusMap)
          setShowModal(!ShowModal)
        }} className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
          <MoreVertical/>
        </button>
      </div>

      {/* Not viewed */}
      <div className="p-4">
        <div
                key={UserRef.current._id}
                className="flex items-center gap-4 rounded-2xl hover:bg-green-100 cursor-pointer transition"
              >
                {/* Ring */}
                <div className="p-[3px] relative z-0  rounded-full">
                  <span onClick={()=>{
            setShowOptions(true)

                  }} className="absolute bottom-0 right-0 bg-black rounded-full  text-green-400 font-bold"><Plus size={20}/></span>
                  <img
                    src={`http://localhost:4500/Images/Profile/${UserRef.current?.profilePicture}`}
                                        alt={
                      UserRef.current.username
                    }
                    className="w-16 h-16 rounded-full object-cover z-0 border-2 border-black"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    {
                      UserRef.current.username
                    }
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {
                     "Add Status"
                    }
                  </p>
                </div>
              </div>
        <h2 className="text-gray-400 text-sm uppercase">
          Recent Updates
        </h2>

        <div className="space-y-1 z-10 ">
          {NotVeiwedStatus.map(
            (status) => (
              <div
                key={status._id}
                className="flex items-center gap-4 p-1 rounded-2xl hover:bg-green-100 cursor-pointer transition"
              >
                {/* Ring */}
                <div className="p-[3px] rounded-full bg-green-500">
                  <img
                    
                    src={`http://localhost:4500/Images/Profile/${status.profilePicture}`}

                    alt={
                      status.username
                    }
                    className="w-13 h-13 rounded-full object-cover border-2 border-black"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    {
                      status.username
                    }
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {
                      status.createdAt
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Viewed */}
      <div className="px-4">
        <h2 className="text-gray-400 text-sm  uppercase">
          Viewed Updates
        </h2>

        <div className="space-y-1">
          {viewedStatus.map(
            (status) => (
              <div
                key={status._id}
                className="flex items-center gap-1 p-3 rounded-2xl hover:bg-green-600 cursor-pointer transition"
              >
                {/* Gray ring */}
                <div className="p-[3px] rounded-full bg-gray-600">
                  <img
                    src={
                      status.profilePicture
                    }
                    alt={
                      status.username
                    }
                    className="w-13 h-13 rounded-full object-cover border-2 border-black"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    {
                      status.username
                    }
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {
                      status.createdAt
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Add status options modal */}
      {showOptions && (
        <div className="fixed inset-0 z-50 bg-black/50 text-white flex items-end justify-center">
          <div className="w-full max-w-md bg-[#111] rounded-t-3xl p-6">
            <h2 className="text-xl font-bold mb-6">
              Create Status
            </h2>

            <div className="space-y-4">
              {/* Text */}
              <button
                onClick={() => {
                  setShowOptions(false);
                  setShowTextEditor(
                    true
                  );
                }}
                className="w-full flex items-center gap-4 bg-gray-900 p-4 rounded-2xl"
              >
                <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                  <Type size={26} />
                </div>

                <div className="text-left">
                  <h3 className="font-semibold">
                    Text
                  </h3>

                  <p className="text-sm text-gray-400">
                    Share text status
                  </p>
                </div>
              </button>

              {/* Photo/video */}
              <button className="w-full flex items-center gap-4 bg-gray-900 p-4 rounded-2xl">
                <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center">
                  📸
                </div>

                <div className="text-left">
                  <h3 className="font-semibold">
                    Photos & Videos
                  </h3>

                  <p className="text-sm text-gray-400">
                    Coming soon
                  </p>
                </div>
              </button>
            </div>

            <button
              onClick={() =>
                setShowOptions(false)
              }
              className="w-full mt-6 bg-red-500 py-3 rounded-2xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Text status editor */}
      {showTextEditor && (
        <div
          className="fixed inset-0 z-50 flex flex-col text-white transition-all"
          style={{
            background:
              bgColors[bgIndex],
            fontFamily:
              fonts[fontIndex],
          }}
        >
          {/* Top */}
          <div className="flex items-center justify-between p-5">
            {/* Back */}
            <button
              onClick={() =>
                setShowTextEditor(
                  false
                )
              }
            >
              <ArrowLeft size={30} />
            </button>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Font */}
              <button
                onClick={
                  changeFont
                }
                className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center"
              >
                <Type />
              </button>

              {/* Background */}
              <button
                onClick={
                  changeBackground
                }
                className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center"
              >
                <Palette />
              </button>
            </div>
          </div>

          {/* Text input */}
          <div className="flex-1 flex items-center justify-center p-6">
            <textarea
              placeholder="Type a status..."
              value={statusText}
              onChange={(e) =>
                setStatusText(
                  e.target.value
                )
              }
              className="w-full bg-transparent text-center text-4xl outline-none resize-none placeholder:text-white/70"
              rows={5}
            />
          </div>

          {/* Send */}
          <div className="p-6">
            <button
              onClick={
                uploadTextStatus
              }
              className="w-full bg-white text-black font-semibold py-4 rounded-2xl"
            >
              Share Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPage;