import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  } from "lucide-react";
import {useSelector } from "react-redux";
import type { OrderProductType } from "../Redux/Slice/Auth.slice";
import { OrderStatusPlace } from "../utils/Dotenv";
import { toast } from "react-toastify";
import UpdateOrderFromUser from "./UpdateOrderFromUser";

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] =
    useState<string | null>(null);
    let [SelectedOrderForUpdate,setSelectedOrderForUpdate]=useState<OrderProductType>()
let [OpenOrderUpdateModal,setOpenOrderUpdateModal]=useState(false)
  
let OrderdProducts=useSelector((state:any)=>state.Auth.OrderdProducts)
/*
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

  return (
    <>
    {OpenOrderUpdateModal&&<div className="fixed top-0 w-full h-full overflow-y-scroll z-30 left-0">
      <UpdateOrderFromUser OrderData={SelectedOrderForUpdate as OrderProductType} setOpenOrderUpdateModal={setOpenOrderUpdateModal}/>
    </div>}
    <div
      className="mt-10 w-full min-h-screen

      
      p-4
      md:p-8
    "
    >
      <div
        className="
        max-w-5xl
        mx-auto
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
          text-4xl
          font-bold
          text-white
          mb-8
        "
        >
          My Orders
        </motion.h1>

        <div className="space-y-6">
          {OrderdProducts.map(
            (order:OrderProductType, index:Number) => {
              const expanded =
                expandedOrder ===
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
                      Number(index) * 0.1,
                  }}
                  className="
                  backdrop-blur-xl

                  bg-white/10

                  border
                  border-white/20

                  rounded-3xl

                  overflow-hidden
                "
                >
                  {/* CARD */}

                  <div className="p-6 relative">
                    {/* TOP */}
                    <button onClick={()=>{
                      if(order.orderStatus==OrderStatusPlace){
                        setOpenOrderUpdateModal(true)
                        setSelectedOrderForUpdate(order)
                      }
                      else{
                        toast.info("You can't edit once the product is out for delivery")
                      }

                    }} className="absolute bottom-2 right-2 p-1 border-2 rounded-md">update</button>
                    

                    <div
                      className="
                      flex
                      
                      flex-col
                      md:flex-row
                      md:items-center
                      md:justify-between

                      gap-4
                    "
                    >
                      <div>
                        <h2
                          className="
                          text-xl
                          font-bold
                          text-white
                        "
                        >
                          Order #
                          {order._id}
                        </h2>

                        <div
                          className="
                          mt-2
                          inline-flex
                          px-3
                          py-1

                          rounded-full

                          text-sm

                          bg-cyan-500/20

                          text-cyan-300
                        "
                        >
                          {
                            order.orderStatus
                          }
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
                        gap-2

                        px-5
                        py-3

                        rounded-xl

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

                    <div
                      className="
                      mt-6

                      grid

                      md:grid-cols-3

                      gap-4
                    "
                    >
                      <div
                        className="
                        flex
                        gap-3
                      "
                      >
                        <MapPin
                          className="text-cyan-300"
                        />

                        <div>
                          <p className="text-white/60">
                            Address
                          </p>

                          <p className="text-white">
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
                      "
                      >
                        <Calendar
                          className="text-cyan-300"
                        />

                        <div>
                          <p className="text-white/60">
                            Delivery Day
                          </p>

                          <p className="text-white">
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
                      "
                      >
                        <Clock
                          className="text-cyan-300"
                        />

                        <div>
                          <p className="text-white/60">
                            Time Slot
                          </p>

                          <p className="text-white">
                            {
                              `${order.Time.from}-${order.Time.to}`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
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
                                      <h4 className="text-white font-semibold">
                                        {
                                          item.name
                                        }
                                      </h4>

                                      <p className="text-white/60">
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
                            text-white
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