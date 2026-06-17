import {motion} from "framer-motion"
import { useTheme } from "../context/theme.context";
import { useState } from "react";
import Icon1 from "../assets/clean-clothes.png"
import Icon2 from "../assets/iron.png"
import Icon3 from "../assets/clothing-hanger.png"
import Icon4 from "../assets/t-shirt.png"
import Icon5 from "../assets/sport-shoe.png"
import LaundryServiceModalDemo, { type CurrServiceType } from "./ServiceDetails";
const services = [
  {label:"Wash & Fold",id:"serv1",icon:Icon1,Items:[
  { id: 1, name: "Shirt", price: 15 },
  { id: 2, name: "T-Shirt", price: 10 },
  { id: 3, name: "Trouser", price: 15 },
  { id: 4, name: "Jeans", price: 10 },
  { id: 5, name: "Saree(Regular)", price: 30 },
  { id: 6, name: "Saree(Etc)", price: 120 },
  { id: 7, name: "Dress material", price: 20 },
]},
//   {label:"Dry Cleaning",id:"serv2",icon:Icon2,Items:[
//   { id: 1, name: "Shirt", price: 15 },
//   { id: 2, name: "T-Shirt", price: 12 },
//   { id: 3, name: "Trouser", price: 20 },
//   { id: 4, name: "Jeans", price: 25 },
//   { id: 5, name: "Saree", price: 60 },
//   { id: 6, name: "Blazer", price: 50 },
//   { id: 7, name: "Kurta", price: 30 },
// ]},

//   {label:"Wash & Iron",id:"serv3",icon:Icon3,Items:[
//   { id: 1, name: "Shirt", price: 15 },
//   { id: 2, name: "T-Shirt", price: 12 },
//   { id: 3, name: "Trouser", price: 20 },
//   { id: 4, name: "Jeans", price: 25 },
//   { id: 5, name: "Saree", price: 60 },
//   { id: 6, name: "Blazer", price: 50 },
//   { id: 7, name: "Kurta", price: 30 },
// ]},

  {label:"Heavy Wash service",id:"serv4",icon:Icon4,Items:[
  { id: 8, name: "Curtain", price: 25 },
  { id: 9, name: "Bad sheet", price: 20 },
  { id: 10, name: "Pillow covers", price: 12 },
  ]},

  {label:"Bag cleaning",id:"serv5",icon:Icon3,Items:[
  { id: 20, name: "Sch. Bag/Office Bag", price: 80 },
  { id: 21, name: "Travel Bag", price: 100 },
  // { id: 22, name: "Trouser", price: 20 },
  // { id: 4, name: "Jeans", price: 25 },
  // { id: 5, name: "Saree", price: 60 },
  // { id: 6, name: "Blazer", price: 50 },
  // { id: 7, name: "Kurta", price: 30 },
]},
  {label:"Shoe Cleaning",id:"serv6",icon:Icon5,Items:[
  { id: 1, name: "Sports shoes", price: 80 },
  { id: 2, name: "Sneakers", price: 80 },
  { id: 3, name: "Casual shoes", price: 60 },
  // { id: 4, name: "Jeans", price: 25 },
  // { id: 5, name: "Saree", price: 60 },
  // { id: 6, name: "Blazer", price: 50 },
  // { id: 7, name: "Kurta", price: 30 },
]},
];

export default function Services() {
      const { dark } = useTheme();
      let [OpenService,setOpenService]=useState(false)
      let [SelectedService,setSelectedService]=useState<{label:string,icon:string}>()
  
  return (
    <>
    <div className="text-black fixed top-0 z-50 left-0">

          {OpenService&&<LaundryServiceModalDemo CurrService={SelectedService as CurrServiceType} open={OpenService} setOpen={setOpenService}/>}
    </div>

    <section id="Services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-center text-4xl font-bold mb-12">
          Our Services
        </h2>

        <div className="grid sm:grid-cols-2 z-1 cursor-pointer lg:grid-cols-6 gap-6">
          {services.map((service) => (
            <motion.div
            onClick={()=>{
              setOpenService(true)
              setSelectedService(service)
            }}
              whileHover={{ y: -8 }}
              key={service.label}
              className={`p-8 rounded-3xl ${
                dark ? "bg-white/10" : "bg-white shadow-lg"
              }`}
            >
              <img className="h-10 mb-4 " alt={service.label} src={service.icon}></img>
              <h3 className="text-xl font-bold">{service.label}</h3>
              {/* <button className="px-5 py-3 rounded-xl bg-cyan-400 text-black font-semibold">book</button> */}
            </motion.div>
          ))}
        </div>
      </section>

    </>
  );
}