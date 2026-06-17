import {motion} from "framer-motion"
import { useTheme } from "../context/theme.context";
import { useState } from "react";
import LaundryServiceModalDemo, { type CurrServiceType } from "./ServiceDetails";
const services = [
  {label:"Wash & Fold",id:"serv1",icon:"../src/assets/clean-clothes.png",Items:[
  { id: 1, name: "Shirt", price: 15 },
  { id: 2, name: "T-Shirt", price: 12 },
  { id: 3, name: "Trouser", price: 20 },
  { id: 4, name: "Jeans", price: 25 },
  { id: 5, name: "Saree", price: 60 },
  { id: 6, name: "Blazer", price: 50 },
  { id: 7, name: "Kurta", price: 30 },
]},
  {label:"Dry Cleaning",id:"serv2",icon:"../src/assets/iron.png",Items:[
  { id: 1, name: "Shirt", price: 15 },
  { id: 2, name: "T-Shirt", price: 12 },
  { id: 3, name: "Trouser", price: 20 },
  { id: 4, name: "Jeans", price: 25 },
  { id: 5, name: "Saree", price: 60 },
  { id: 6, name: "Blazer", price: 50 },
  { id: 7, name: "Kurta", price: 30 },
]},
  {label:"Wash & Iron",id:"serv3",icon:"../src/assets/clothing-hanger.png",Items:[
  { id: 1, name: "Shirt", price: 15 },
  { id: 2, name: "T-Shirt", price: 12 },
  { id: 3, name: "Trouser", price: 20 },
  { id: 4, name: "Jeans", price: 25 },
  { id: 5, name: "Saree", price: 60 },
  { id: 6, name: "Blazer", price: 50 },
  { id: 7, name: "Kurta", price: 30 },
]},
  {label:"Heavy Wash service",id:"serv4",icon:"../src/assets/t-shirt.png",Items:[
  { id: 1, name: "Shirt", price: 15 },
  { id: 2, name: "T-Shirt", price: 12 },
  { id: 3, name: "Trouser", price: 20 },
  { id: 4, name: "Jeans", price: 25 },
  { id: 5, name: "Saree", price: 60 },
  { id: 6, name: "Blazer", price: 50 },
  { id: 7, name: "Kurta", price: 30 },
]},
  {label:"Bag cleaning",id:"serv5",icon:"../src/assets/sport-shoe.png",Items:[
  { id: 1, name: "Shirt", price: 15 },
  { id: 2, name: "T-Shirt", price: 12 },
  { id: 3, name: "Trouser", price: 20 },
  { id: 4, name: "Jeans", price: 25 },
  { id: 5, name: "Saree", price: 60 },
  { id: 6, name: "Blazer", price: 50 },
  { id: 7, name: "Kurta", price: 30 },
]},
  {label:"Shoe Cleaning",id:"serv6",icon:"../src/assets/sport-shoe.png",Items:[
  { id: 1, name: "Shirt", price: 15 },
  { id: 2, name: "T-Shirt", price: 12 },
  { id: 3, name: "Trouser", price: 20 },
  { id: 4, name: "Jeans", price: 25 },
  { id: 5, name: "Saree", price: 60 },
  { id: 6, name: "Blazer", price: 50 },
  { id: 7, name: "Kurta", price: 30 },
]},
];

export default function Services() {
      const { dark } = useTheme();
      let [OpenService,setOpenService]=useState(false)
      let [SelectedService,setSelectedService]=useState<{label:string,icon:string}>()
  
  return (
    <>
    <div className="text-black fixed top-0 left-0">

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