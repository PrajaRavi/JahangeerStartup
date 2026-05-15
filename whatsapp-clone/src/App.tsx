import { BrowserRouter, Route, Routes, useNavigate } from "react-router"
import SignupPage from "./components/Signup"
import { useDispatch, useSelector} from "react-redux"
import Hero from "./components/Hero";
import { PrivateComp } from "./utils/PrivateComp";
import VerifyOtpPage from "./components/EmailVerification";
import LoginPage from "./components/Signin";
import type { AppDispatch } from "./Redux/Stores/Store.files";
import { GetAllUser, GetLogedInUser, RefreshToken } from "./Redux/Thunk/Auth.thunk";
import { useEffect, useMemo, useState } from "react";
import {io} from "socket.io-client"
import { SocketContext } from "./context/socket.context";
function App() {
  const dispatch=useDispatch<AppDispatch>()
  let [Onlineuser,setOnlineuser]=useState<Map<string,string>>(new Map())
  const IsUserLogin =useSelector((state:any)=>state.Auth.IsUserLogin)
  const LogedInUser=useSelector((state:any)=>state.Auth.user)


  const socket=useMemo(()=>{
return io("http://localhost:7000")
},[])

  async function refreshtoken(){

    if(localStorage.getItem("email")){

      setTimeout(() => {
        dispatch(RefreshToken())    
      }, 5000);
    }
      
  }
   async function getalluser(){
    if(localStorage.getItem("email")){
       dispatch(GetAllUser())
    }
  }
  async function getlogedinuser(){
    if(localStorage.getItem("email")){
      dispatch(GetLogedInUser())
      
    }
  }

      useEffect(()=>{
  // console.log("sidebar chal raha hai")
  if(IsUserLogin){
    socket.emit("user-connected",{userid:LogedInUser._id,socketid:socket.id})
    
    socket.on("online-users",(data:any)=>{
      
       Onlineuser=new Map(data)
      setOnlineuser(Onlineuser)
      
      
      
    })
  }
  },[IsUserLogin])

  useEffect(()=>{
    getlogedinuser();
    getalluser();
    
refreshtoken();
return ()=>{
  socket.off()
}
  },[])
  return (
    <>
    <SocketContext.Provider value={{socket,Onlineuser}}>

    <BrowserRouter>
    <Routes>

      <Route path="/signup" element={<SignupPage/>}/>
      <Route path="/signin/:email" element={<LoginPage/>}/>
 <Route path="/" element={<Hero />}/>
      <Route path="/" element={<PrivateComp/>}>
      

 <Route path="/email-verification/:email" element={<VerifyOtpPage/>}/>
      </Route>
      
    </Routes>
    </BrowserRouter>
      
    </SocketContext.Provider>
    </>
  )
}

export default App
