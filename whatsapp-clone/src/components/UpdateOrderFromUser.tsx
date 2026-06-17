import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock3,
  MapPin,
  Pencil,
  Ticket,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import type { CurrServiceType } from "./ServiceDetails";
import { useNavigate } from "react-router";
import { generatePickupDays, generateTimeSlots } from "../utils/Dotenv";
import { UpdateOrderdProductFlag, type OrderProductType } from "../Redux/Slice/Auth.slice";

export default function UpdateOrderFromUser({OrderData,setOpenOrderUpdateModal}:{OrderData:OrderProductType,setOpenOrderUpdateModal:React.Dispatch<React.SetStateAction<boolean>>}) {
  const [selectedDay, setSelectedDay] =
    useState();
  let CartItems=useSelector((state:any)=>state.Auth.CartItems)
  let [codinates,setcodinates]=useState({lang:0,lat:0})
  const navigate=useNavigate();
  const ProductPickUpDays=useSelector((state:any)=>state.Auth.ProductPickUpDays)
  let OrderdProductsFlag=useSelector((state:any)=>state.Auth.OrderdProductsFlag)
  const dispatch=useDispatch();
  
  const  ProductPirckUpTime=useSelector((state:any)=>state.Auth.ProductPirckUpTime)
  const User=useSelector((state:any)=>state.Auth.ActiveUser)


  const [selectedTime, setSelectedTime] =
    useState("11-1");

    let [Address,setAddress]=useState("")
    let [phoneNumber,setphoneNumber]=useState()
    let [AltphoneNumber,setAltphoneNumber]=useState()

  const [coupon, setCoupon] =
    useState("");

  const [accepted, setAccepted] =
    useState(true);

  const [pickupDays,setpickupDays] = useState(
    [
    {
      id: "today",
      label: "Today",
      date: "30 May",
    },
    {
      id: "tomorrow",
      label: "Tomorrow",
      date: "31 May",
    },
    {
      id: "after",
      label: "Day After Tomorrow",
      date: "1 Jun",
    },
  ]
);

  const [timeSlots,settimeSlots] = useState([
    {
      id: "9-11",
      label: "09 AM - 11 AM",
      disabled: true,
    },
    {
      id: "11-1",
      label: "11 AM - 01 PM",
    },
    {
      id: "4-6",
      label: "04 PM - 06 PM",
    },
    {
      id: "6-8",
      label: "06 PM - 08 PM",
    },
  ]);

  let CartSummary=useMemo(()=>{
  let totalamount=0;
  let totalelem=0;
  CartItems?.forEach((product:any)=>{
    totalamount+=product.price*product.count;
    totalelem+=1;
  })
  return {totalamount,totalelem}
  },[CartItems])
  
  async function PlaceOrder(){
    try {
      let time=timeSlots.filter((item)=>{
        return item.id==selectedTime
      })
      if(Address=="" || !phoneNumber ||!AltphoneNumber){
        return toast.error("All feilds are required")
      }
      if(String(phoneNumber).length!=10 ||String(AltphoneNumber).length!=10 )
        return toast.error("Invalid phone number")
      
      
      
      let Day=pickupDays.filter((Day:any)=>{
        return Day.id==selectedDay;
      })
      let {data}=await axios.put(`http://localhost:5000/order/update-order`,{id:OrderData._id,Address,phoneNumber,AltphoneNumber,cordinates:codinates,Day:Day[0].date,Time:{from:time[0].label.split("-")[0].trim(),to:time[0].label.split("-")[1].trim(),}},{withCredentials:true})
      if(data.success){
        toast.success("order placed successfully")
        setOpenOrderUpdateModal(false);
        dispatch(UpdateOrderdProductFlag(!OrderdProductsFlag))
        
      }
      else{
        toast.error(data?.msg)
      }
    } catch (error:any) {
      let {data,status}=error.response;
      if(data?.msg){
        return toast.error(data?.msg)
      }
      console.log(error)
      toast.error("internal server error")
    }
  }
  useEffect(()=>{
    LangAndLat();
    let data=generatePickupDays([
  "Today",
  "Tomorrow",
  "Day After Tomorrow",
]);
console.log(data)
    setpickupDays(data)

    if(ProductPirckUpTime?.length>0){
      let data=generateTimeSlots(ProductPirckUpTime)
      settimeSlots(data)
    }
  },[ProductPirckUpTime])

  async function LangAndLat(){
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const coordinates = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    console.log(coordinates)
    setcodinates({lang:coordinates.lng,lat:coordinates.lat})
    // Send this data to your Node.js backend
    
  }, (error) => {
    console.error("User denied location access or error occurred.", error);
  });
} else {
  console.log("Geolocation is not supported by this browser.");
}
  }
  
  async function UpdateTime(id:string,value:string){
    let Hours=null;
if(Number(value.slice(0,2))>12){
  Hours=Number(value.slice(0,2))%12;
  if(Hours<10){
    Hours="0"+String(Hours)
  }
  Hours=String(Hours)
  
}

try {
  let {data}=await axios.put(`http://localhost:4500/DateTime/update-time`,{id,from:Hours+" AM ",to:String(value).split(":")[1]+" PM "},{withCredentials:true})
  if(data.success){
    toast.success("Updated successfully refresh the page")
    
    
  }
} catch (error) {
  console.log(error)
}
  }
  useEffect(()=>{
setAddress(OrderData.Address)
setphoneNumber(OrderData.phoneNumber)
setAltphoneNumber(OrderData.AltphoneNumber)


  },[])
  return (
    <div
      className="
      min-h-screen
      w-full
      bg-transparent
      backdrop-blur-sm
      relative

      "
    >
      <button className="absolute top-5 right-5" onClick={()=>{
setOpenOrderUpdateModal(false);
      }}><X size={20}/></button>
      <div
        className="
        max-w-3xl
        mx-auto
      "
      >
        {/* Main Glass Card */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
          backdrop-blur-xl
          bg-white/10

          border
          border-white/20

          rounded-[32px]
          z-5
          shadow-2xl

          p-5
          md:p-8

          text-white
        "
        >
          {/* Header */}

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="
            bg-orange-400
            text-white

            px-5
            py-3

            rounded-xl

            font-semibold
          "
          >
            Schedule Pickup
          </motion.button>

          {/* ADDRESS */}

          <div className="mt-8">
            <h2
              className="
              text-2xl
              font-bold
              flex
              items-center
              gap-2
            "
            >
              <MapPin size={22} />
              Address
            </h2>

            <div
              className="
              mt-4

              flex
              items-center
              justify-between

              bg-white/5
              border
              border-white/10

              rounded-2xl

              p-4
            "
            >
              <div>
                <p className="text-lg">
                  Tap to select your Delivery location location
                </p>
{/*                 

                <p className="text-white/60">
                  Maharashtra, India
                </p> */}
              </div>

              <button
              onClick={()=>{
                if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const coordinates = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    console.log(coordinates)
    setcodinates({lang:coordinates.lng,lat:coordinates.lat})
    toast.success("location selected successfully")
    // Send this data to your Node.js backend
    
  }, (error) => {
    console.error("User denied location access or error occurred.", error);
  });
} else {
  console.log("Geolocation is not supported by this browser.");
}

              }}
                className="
                h-12
                w-12

                rounded-full

                bg-white/10

                flex
                items-center
                justify-center
              "
              >
                <Pencil size={18} />
              </button>
            </div>
          </div>

          {/* PICKUP DATE */}

          <div className="mt-10">
            <h2
              className="
              text-2xl
              font-bold

              flex
              items-center
              gap-2
            "
            >
              <Calendar size={22} />
              Choose Pickup Day
            </h2>

            <div className="mt-5 space-y-4">
              {pickupDays.map((day) => (
                <motion.label
                  whileHover={{
                    scale: 1.01,
                  }}
                  key={day.id}
                  className="
                  flex
                  items-center
                  gap-4

                  p-4

                  rounded-2xl

                  bg-white/5

                  border
                  border-white/10

                  cursor-pointer
                "
                >
                  <input
                    type="radio"
                    checked={
                      selectedDay ===
                      day.id
                    }
                    onChange={() =>
                      setSelectedDay(
                        day.id
                      )
                    }
                  />

                  <span>
                    {day.label}
                    <strong>
                      {" "}
                      ({day.date})
                    </strong>
                  </span>
                </motion.label>
              ))}
            </div>
          </div>

          {/* TIME SLOT */}

          <div className="mt-10">
            <h2
              className="
              text-2xl
              font-bold

              flex
              items-center
              gap-2
            "
            >
              <Clock3 size={22} />
              Preferred Pickup Time
            </h2>

            <div className="mt-5 space-y-4">
              {timeSlots.map((slot) => (
                <label
                  key={slot.id}
                  className={`
                  flex
                  relative
                  items-center
                  gap-4

                  p-4

                  rounded-2xl

                  border

                  ${
                    slot.disabled
                      ? "opacity-40"
                      : ""
                  }

                  bg-white/5
                  border-white/10
                  cursor-pointer
                `}
                >
                  <input
                    type="radio"
                    disabled={
                      slot.disabled
                    }
                    checked={
                      selectedTime ===
                      slot.id
                    }
                    onChange={() =>
                      setSelectedTime(
                        slot.id
                      )
                    }
                  />

                  {slot.label}
                 {User.IsAdmin&& <button className="
                h-10
                w-10
                absolute
                right-10 
                top-1

                rounded-full

              
                flex
                items-center
                justify-center
              "
              
              >
                <label htmlFor="Time">
<input type="time" onChange={(e)=>{
  UpdateTime(slot.id,e.target.value)
}} name="Time" id="Time" />
                </label>
                </button>

              }
                </label>
              ))}
            </div>
          </div>

          <div className="w-full">
            <form action="">
              <div>
            <label className="block mb-2 font-medium">
              Address
            </label>

            <input
              type="text"
              name="Address"
              required
              value={Address}
              onChange={(e)=>setAddress(e.target.value)}
              placeholder="Chawl name,building name Area pincode"
              className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-[#00D3F3]
            "
            />
            

            {/* {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )} */}
          </div>
            <div>
            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              type="number"
              name="phoneNumber"
              required
              value={phoneNumber}
              onChange={(e)=>setphoneNumber(e.target.value)}
              placeholder="Enter your phone"
              className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-[#00D3F3]
            "
            />
            

            {/* {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )} */}
          </div>
              <div>
            <label className="block mb-2 font-medium">
              Alternate Phone
            </label>

            <input
              type="number"
              name="Alternate phoneNumber"
              required
              value={AltphoneNumber}
              onChange={(e)=>setAltphoneNumber(e.target.value)}
              placeholder="Enter your phone"
              className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-[#00D3F3]
            "
            />
            

            {/* {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )} */}
          </div>
          

            </form>


          </div>
          
          
          {/* COUPON */}

          <div className="mt-10">
            <h2
              className="
              text-2xl
              font-bold

              flex
              items-center
              gap-2
            "
            >
              <Ticket size={22} />
              Coupon
            </h2>

            <input
              value={coupon}
              onChange={(e) =>
                setCoupon(
                  e.target.value
                )
              }
              placeholder="Enter Coupon Code"
              className="
              mt-4

              w-full

              bg-white/5

              border
              border-white/10

              rounded-2xl

              px-5
              py-4

              outline-none

              placeholder:text-white/40
            "
            />
          </div>

          {/* TERMS */}

          <div
            className="
            mt-8

            flex
            items-center
            gap-3
          "
          >
            <input
              checked={accepted}
              onChange={() =>
                setAccepted(
                  !accepted
                )
              }
              type="checkbox"
            />

            <p className="text-sm">
              I agree to Terms &
              Conditions
            </p>
          </div>

          {/* BUTTON */}

          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            onClick={()=>{
              PlaceOrder();
            }}
            whileTap={{
              scale: 0.96,
            }}
            disabled={!accepted}
            className="
            mt-8

            w-full

            bg-[#00D3F3]

            text-[#023B40]

            py-4

            rounded-2xl

            font-bold
            text-lg

            shadow-lg

            disabled:opacity-50
          "
          >
            Update Order
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}