import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./components/Home"
import Signup from "./components/Signup"
// import { useTheme } from "./context/theme.context";
import Navbar from "./components/Navbar";
import Signin from "./components/Signin";
import PhoneVerificationPage from "./components/Verification";
import { useDispatch, useSelector } from "react-redux";
import { LocalStorageLogedinuserId } from "./utils/Dotenv";
import axios from "axios";
import { setActiveUser, SetProductPickUpDay, SetProductPickUpTime, UpdateOrderData, UpdateUsersData } from "./Redux/Slice/Auth.slice";
import { useEffect } from "react";
import SchedulePickupPage from "./components/DeliveryDate";
import OrderSummaryPage from "./components/CartPage";
import OrdersPage from "./components/ShowOrder";
import AdminPanel from "./components/Admin";
import { toast } from "react-toastify";

function App() {
    // const { dark } = useTheme();
  const IsUserLogin=useSelector((state:any)=>state.Auth.IsUserLogin)
  const GetAllOrdersFlag=useSelector((state:any)=>state.Auth.GetAllOrdersFlag)


    const dispatch=useDispatch();
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
    },[IsUserLogin])

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
      GetAllUsers();
      let interval=setInterval(RefreshToken,10000)
      
      return ()=>{
        clearInterval(interval)
      }
    },[IsUserLogin])
    useEffect(()=>{
      console.log("cal kiya")
      GetAllOrders();
    },[GetAllOrdersFlag])


async  function GetProductPickUpTime(){
  try {
    let {data}=await axios.get(`http://localhost:4500/DateTime/time`,{withCredentials:true})
    if(data.success){
      dispatch(SetProductPickUpTime(data?.msg))
    }
  } catch (error) {
    if(localStorage.getItem(LocalStorageLogedinuserId))
    toast.error("erro in GetProductPickUpDays")  
  console.log(error)
  }
}

async function GetAllUsers(){
  try {
    let {data}=await axios.get(`http://localhost:4500/user/all-users?page=1&limit=9`,{withCredentials:true})
    console.log(data)
    if(data.success){
      dispatch(UpdateUsersData(data?.msg))
    }
  } catch (error) {
    
    console.log(error)
  }
}


// getting all orders
async function GetAllOrders(){
  try {
    let {data}=await axios.get(`http://localhost:5000/order/get-all-order?page=1&limit=9`,{withCredentials:true})
    console.log(data)
    if(data.success){
      dispatch(UpdateOrderData(data?.msg))
    }
  } catch (error) {
    
    console.log(error)
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
  if(localStorage.getItem(LocalStorageLogedinuserId))
  toast.error("erro in GetProductPickUpDays")  
  }
}
  return (
    <>
    {/* <div
      className={`min-h-screen  w-125 sm:w-full transition-all duration-500 ${
        dark
        ? "bg-linear-to-br  from-[#023B40] to-[#01BCBC] text-white"
        : "bg-slate-50 text-slate-900"
        }`}
    > */}
    
      {/* NAVBAR */}
      
      
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
          {/* </div> */}
          {/* <LaundryServiceModalDemo open={true} setOpen={setjust}/> */}
     </>
  )
}

export default App
