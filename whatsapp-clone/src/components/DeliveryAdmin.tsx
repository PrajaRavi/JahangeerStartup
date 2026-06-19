import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  X,
  
} from "lucide-react";
import {useDispatch, useSelector } from "react-redux";
import { UpdateAllOrderDataFlag, type OrderProductType } from "../Redux/Slice/Auth.slice";
import GlassCopyInput from "../utils/InputCopy";
import { CANCELLED, DELIVERED, OrderStatusOut_for_Delivery, OrderStatusPlace, PaymentFailed, PaymentPaid, PaymentPending} from "../utils/Dotenv";
import { toast } from "react-toastify";
import axios from "axios";
import { useTheme } from "../context/theme.context";
import { useNavigate } from "react-router";

export default function DeliverAdmin() {
  const [expandedOrder, setExpandedOrder] =
    useState<string | null>(null);
    const { dark } = useTheme();
  const User=useSelector((state:any)=>state.Auth.ActiveUser)
  const navigate=useNavigate();

  const [expandedOrder1, setExpandedOrder1] =
    useState<string | null>(null);
    const dispatch=useDispatch();
  const OrderData=useSelector((state:any)=>state.Auth.OrderData)
  let [LocalOrderData,setLocalOrderData]=useState<OrderProductType[]>([{_id:"ravi",Address:"ravi",Day:"ravi",Items:[],orderStatus:"ravi",paymentStatus:"ravi",Time:{from:"ravi",to:"ravi"},User:{_id:"ravi",email:'ravi',phoneNumber:"456",profilePicture:'ravi',username:"ravi"},AltphoneNumber:56,Amount:678,Count:5,lang:565,lat:56,phoneNumber:56}])
  let [SelectedOrderForUpdate,setSelectedOrderForUpdate]=useState<OrderProductType>()
let [OpenOrderUpdateModal,setOpenOrderUpdateModal]=useState(false)
  const GetAllOrdersFlag=useSelector((state:any)=>state.Auth.GetAllOrdersFlag)
  let [OrderStatus,setOrderStatus]=useState()
  let [PaymentStatus,setPaymentStatus]=useState()

/**
 * 

  const orders = [
    {
      _id: "MD10001",
      orderStatus: "Processing",
      Address: "Kalyan, Maharashtra",
      deliveryDate: "20 Jun 2026",
      deliveryTime: "11 AM - 1 PM",

      Items: [
        {
          id: 1,
          name: "Shirt",
          quantity: 2,
          price: 15,
          icon: "👔",
        },
        {
          id: 2,
          name: "Jeans",
          quantity: 1,
          price: 25,
          icon: "👖",
        },
      ],
    },

    {
      id: "MD10002",
      status: "Delivered",
      address: "Mumbai, Maharashtra",
      deliveryDate: "25 Jun 2026",
      deliveryTime: "4 PM - 6 PM",

      items: [
        {
          id: 3,
          name: "Suit",
          quantity: 1,
          price: 120,
          icon: "🤵",
        },
      ],
    },
  ];
 */

  useEffect(()=>{
    if(User.role=="user"){
      navigate("/")
      
    }
    if(OrderData?.length>0){

      setLocalOrderData(OrderData)
    }
    else{
      setLocalOrderData([{_id:"ravi",Address:"ravi",Day:"ravi",Items:[],orderStatus:"ravi",paymentStatus:"ravi",Time:{from:"ravi",to:"ravi"},User:{_id:"ravi",email:'ravi',phoneNumber:"456",profilePicture:'ravi',username:"ravi"},AltphoneNumber:56,Amount:678,Count:5,lang:565,lat:56,phoneNumber:56}])
    }
  },[OrderData,GetAllOrdersFlag])

  async function HandleSubmit(e:React.FormEvent
){
    e.preventDefault();
    try {
      let {data}=await axios.put(`http://localhost:4500/order/update-order-status`,{id:SelectedOrderForUpdate?._id,orderStatus:OrderStatus,paymentStatus:PaymentStatus},{withCredentials:true})
      if(data.success){
        toast.success("Updated")
        setOpenOrderUpdateModal(false)
        dispatch(UpdateAllOrderDataFlag(!GetAllOrdersFlag))
        
      }
      else{
        toast.error(data?.msg)
      }
    } catch (error:any) {
      let {data,status}=error.response;
      toast.error(data?.msg)
      console.log(status)
      console.log(error)
    }
  }
  return (
    <>
    {OpenOrderUpdateModal&&<div className={`w-screen z-30 text-white  bg-black/30
      backdrop-blur-sm fixed top-0 left-0 h-screen flex items-center justify-center  `}>
      <button onClick={()=>setOpenOrderUpdateModal(false)} className="absolute right-5 top-5"><X size={20}/></button>
      <form onSubmit={(e)=>{
        HandleSubmit(e);
      }} className="flex flex-col rounded-md gap-4 md:w-[60%] w-[90%]" action="">
        <p>OrderId:{SelectedOrderForUpdate?._id}</p>
        <div>
                    <label className="block mb-2 font-medium">
                      OrderStatus
                    </label>
        
                    <select onChange={(e:any)=>{
                      setOrderStatus(e.target.value)
                    }}  className="w-full
                      border
                      rounded-xl
                      px-4
                      
                      py-3
                      outline-none
                      focus:border-[#00D3F3]" name="role" id="role">
                      <option selected={SelectedOrderForUpdate?.orderStatus==OrderStatusPlace} className="bg-black" value={OrderStatusPlace}>{OrderStatusPlace}</option>
                      <option selected={SelectedOrderForUpdate?.orderStatus==OrderStatusOut_for_Delivery} className="bg-black" value={OrderStatusOut_for_Delivery}>{OrderStatusOut_for_Delivery}</option>
                      <option selected={SelectedOrderForUpdate?.orderStatus==DELIVERED} className="bg-black" value={DELIVERED}>{DELIVERED}</option>
                      <option selected={SelectedOrderForUpdate?.orderStatus==CANCELLED} className="bg-black" value={CANCELLED}>{CANCELLED}</option>
                    </select>
        
                    
                  </div>
        <div>
                    <label className="block mb-2 font-medium">
                      PaymentStatus
                    </label>
        
                    <select onChange={(e:any)=>{
                      setPaymentStatus(e.target.value)
                    }}  className="w-full
                      border
                      rounded-xl
                      px-4
                      
                      py-3
                      outline-none
                      focus:border-[#00D3F3]" name="role" id="role">
                      <option selected={SelectedOrderForUpdate?.paymentStatus==PaymentFailed} className="bg-black" value={PaymentFailed}>{PaymentFailed}</option>
                      <option selected={SelectedOrderForUpdate?.paymentStatus==PaymentPaid} className="bg-black" value={PaymentPaid}>{PaymentPaid}</option>
                      <option selected={SelectedOrderForUpdate?.paymentStatus==PaymentPending} className="bg-black" value={PaymentPending}>{PaymentPending}</option>
                    </select>
        
                    
                  </div>
                  <button className="w-full border-2 rounded-md p-3">submit</button>
        
      </form>
    </div>}
    <div
      className={`min-h-screen  pt-20  w-full  transition-all duration-500 ${
        dark
        ? "bg-linear-to-br  from-[#023B40] to-[#01BCBC] "
        : "bg-slate-50 text-white"
        }`}
    >
      <div
        className="
        max-w-5xl
        mx-auto
        text-white
      "
      >
        <motion.h1
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
          md:text-2xl
          text-xl
          font-bold
          
          mb-8
        "
        >
          My Orders
        </motion.h1>

        <div className="space-y-6">
          {LocalOrderData.map(
            (order:OrderProductType, index) => {
              const expanded =
                expandedOrder ===
                order._id;

              const expanded1 =
                expandedOrder1 ===
                order._id;

              const total =
                order.Items.reduce(
                  (
                    acc,
                    item:any
                  ) =>
                    acc +
                    item.price *
                      item.count,
                  0
                );

              return (
                <motion.div
                  key={String(order._id)}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.1,
                  }}
                  className="
                  backdrop-blur-xl

                  bg-white/10

                  w-full
                  border
                  
                  border-white/20

                  md:rounded-3xl
                  rounded-md

                  "
                  // overflow-hidden
                >
                  {/* CARD */}

                  <div className="p-1 md:p-3 relative">
                          
                    {/* <button  className="absolute top-2 right-2 p-1 border-2 rounded-md"><ChevronDown /></button> */}
                    <button
                    onClick={() =>
                          setExpandedOrder1(
                            expanded1
                              ? null
                              : String(order._id)
                          )
                        }
                      className="absolute  top-2 right-2 p-1 border-2 rounded-md">

                    <motion.div
                    
                    animate={{
                            rotate:
                            expanded1
                                ? 180
                                : 0,
                              }}
                              >
                          <ChevronDown />
                        </motion.div>
                          </button>
                    <button onClick={()=>{
                      setOpenOrderUpdateModal(true)
                      setSelectedOrderForUpdate(order)
                    }} className="absolute bottom-2 right-2 p-1 border-2 rounded-md">update</button>
                    {/* TOP */}

                    <div
                      className="
                      flex
                      
                      flex-col
                      md:flex-row
                      md:items-center
                      md:justify-between

                      md:gap-4
                      gap-1
                    "
                    >
                      <div>
                        <h2
                          className="
                          md:text-xl
                          text-xs
                          md:font-semibold
                          text-white
                          
                        "
                        >
                          Order #
                          {`${order._id} [${order.orderStatus}]`}
                        </h2>
                        <div className="flex flex-wrap flex-row gap-2">
                          <GlassCopyInput value={String(order.phoneNumber)} label="phoneNumber"/>
                          <GlassCopyInput value={String(order.AltphoneNumber)} label="AltphoneNumber"/>
                          <GlassCopyInput value={String(order.lang)} label="lang"/>
                          <GlassCopyInput value={String(order.lat)} label="lat"/>

                        </div>
                        
                        </div>
                          {/* <button className="flex
                        items-center
                        gap-2

                        px-5
                        py-3

                        rounded-xl

                        bg-[#00D3F3]

                        text-[#023B40]
                        mb-2
                        ml-50

                        font-semibold">
                          Track
                             </button> */}
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expanded
                              ? null
                              : String(order._id)
                          )
                        }
                        className="
                        flex
                        items-center
                        md:gap-2
                        md:w-full
                        w-[80%]

                        md:px-5
                        px-2
                        md:py-3
                        py-1
                        md:text-sm
                        text-xs

                        md:rounded-xl
                        rounded-sm

                        bg-[#00D3F3]

                        text-[#023B40]

                        font-semibold
                      "
                      >
                        View Products

                        <motion.div
                          animate={{
                            rotate:
                              expanded
                                ? 180
                                : 0,
                          }}
                        >
                          <ChevronDown />
                        </motion.div>
                      </button>
                    </div>

                    {/* DETAILS */}

                    {expanded1&&<div
                      // mt-6
                      className="

                      grid

                      md:grid-cols-3

                      md:gap-4
                      gap-1
                    "
                    >
                      <div
                        className="
                        flex
                        md:gap-3
                        gap-1
                        text-[4px]
                      "
                      >
                        <MapPin
                        
                          className="text-cyan-300 md:text-sm"
                        />

                        <div  className="text-white">
                          <p className=" md:text-sm  text-xs">
                            Address
                          </p>

                          <p className=" md:text-sm text-xs">
                            {
                                order.Address
                            }
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                        flex
                        gap-3
                        md:text-sm text-xs
                      "
                      >
                        <Calendar
                          className="text-cyan-300"
                        />

                        <div>
                          <p className=" md:text-sm text-white text-xs">
                            Delivery Day
                          </p>

                          <p className=" md:text-sm text-white text-xs">
                            {
                              order.Day
                            }
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                        flex
                        gap-3
                        md:text-sm text-xs
                      "
                      >
                        <Clock
                          className="text-cyan-300"
                        />

                        <div>
                          <p className="/60 md:text-sm text-white text-xs">
                            Time Slot
                          </p>

                          <p className=" md:text-sm text-white text-xs">
                            {
                              `${order.Time.from}-${order.Time.to}`
                            }
                          </p>
                        </div>
                      </div>
                    </div>}
                  </div>

                  {/* PRODUCTS */}

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height:
                            "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        className="
                        overflow-hidden
                      "
                      >
                        <div
                          className="
                          border-t
                          border-white/10

                          p-6
                        "
                        >
                          <div className="space-y-4">
                            {order.Items.map(
                              (
                                item:any
                              ) => (
                                <div
                                  key={
                                    item._id
                                  }
                                  className="
                                  flex
                                  items-center
                                  justify-between

                                  bg-white/5

                                  rounded-2xl

                                  p-4
                                "
                                >
                                  <div
                                    className="
                                    flex
                                    items-center
                                    gap-4
                                  "
                                  >
                                    <div className="text-3xl">
                                      {
                                       "👖"
                                      }
                                    </div>

                                    <div>
                                      <h4 className=" font-semibold">
                                        {
                                          item.name
                                        }
                                      </h4>

                                      <p className="/60">
                                        ₹
                                        {
                                          item.price
                                        }
                                        ×
                                        {
                                          item.count
                                        }
                                      </p>
                                    </div>
                                  </div>

                                  <div
                                    className="
                                    text-cyan-300
                                    font-bold
                                  "
                                  >
                                    ₹
                                    {item.price *
                                      item.count}
                                  </div>
                                </div>
                              )
                            )}
                          </div>

                          <div
                            className="
                            mt-5

                            flex
                            justify-between

                            text-xl
                            font-bold
                            
                          "
                          >
                            <span>
                              Total
                            </span>

                            <span>
                              ₹{total}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }
          )}
        </div>
      </div>
    </div>
    </>

  );
}