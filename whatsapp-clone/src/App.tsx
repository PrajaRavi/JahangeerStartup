import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./components/Home"
import LandingPage from "./components/LandingPage"
import Signup from "./components/Signup"
import { useTheme } from "./context/theme.context";
import Navbar from "./components/Navbar";
import Signin from "./components/Signin";
import PhoneVerificationPage from "./components/Verification";
import { useDispatch } from "react-redux";
import { GetAllUser, GetLogedInUser } from "./Redux/Thunk/Auth.thunk";
import { LocalStorageLogedinuserId } from "./utils/Dotenv";
import axios from "axios";
import { setActiveUser, SetProductPickUpDay, SetProductPickUpTime } from "./Redux/Slice/Auth.slice";
import { useEffect, useState } from "react";
import LaundryServiceModalDemo from "./components/ServiceDetails";
import SchedulePickupPage from "./components/DeliveryDate";
import OrderSummaryPage from "./components/CartPage";
import OrdersPage from "./components/ShowOrder";
import AdminPanel from "./components/Admin";
import { toast } from "react-toastify";

function App() {
    const { dark, toggleTheme } = useTheme();
    const dispatch=useDispatch();
  let [just,setjust]=useState()
    async function GetLogedInUser(){
      try {
        let {data}=await axios.get(`http://localhost:4500/user/loged-in-user`,{withCredentials:true})
        if(data.success){
          console.log(data)
          dispatch(setActiveUser(data?.data))
        }
      } catch (error) {
        console.log(error)
        console.log("error in  GetLogedInUser ")
      }
    }
    useEffect(()=>{
if(localStorage.getItem(LocalStorageLogedinuserId)){
  GetLogedInUser();
}
    },[])

    async function RefreshToken(){
      try {
        let {data}=await axios.post(`http://localhost:4500/user/refresh-token`,{},{withCredentials:true})
        if(data.success){
          console.log(data)
           }
      } catch (error) {
        console.log(error)
        console.log("error in  GetLogedInUser ")
      }
    }
    useEffect(()=>{
      GetProductPickUpDays();
      GetProductPickUpTime();
      RefreshToken();
let interval=setInterval(RefreshToken,10000)

return ()=>{
  clearInterval(interval)
}
    },[])

async  function GetProductPickUpTime(){
  try {
    let {data}=await axios.get(`http://localhost:4500/DateTime/time`,{withCredentials:true})
    if(data.success){
      dispatch(SetProductPickUpTime(data?.msg))
    }
  } catch (error) {
  console.log(error)
  toast.error("erro in GetProductPickUpDays")  
  }
}
async  function GetProductPickUpDays(){
  try {
    let {data}=await axios.get(`http://localhost:4500/DateTime/day`,{withCredentials:true})
    if(data.success){
      dispatch(SetProductPickUpDay(data?.msg))
    }
  } catch (error) {
  console.log(error)
  toast.error("erro in GetProductPickUpDays")  
  }
}
  return (
    <>
    <div
      className={`min-h-screen overflow-hidden w-full transition-all duration-500 ${
        dark
        ? "bg-gradient-to-br  from-[#023B40] to-[#01BCBC] text-white"
        : "bg-slate-50 text-slate-900"
        }`}
    >
    
    <BrowserRouter>
        <Navbar />
    <Routes>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/signin/:phone" element={<Signin/>}/>
      <Route path="/verify/:phone" element={<PhoneVerificationPage/>}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/DeliveryDate" element={<SchedulePickupPage/>}/>
      <Route path="/cart" element={<OrderSummaryPage/>}/>
      <Route path="/show-orders" element={<OrdersPage/>}/>
      <Route path="/admin" element={<AdminPanel/>}/>

    </Routes>
    </BrowserRouter>
      {/* NAVBAR */}
      
      
          </div>
          {/* <LaundryServiceModalDemo open={true} setOpen={setjust}/> */}
     </>
  )
}

export default App
