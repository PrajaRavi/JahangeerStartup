import {motion} from "framer-motion"
import { useTheme } from "../context/theme.context";
import { useState } from "react";
import Icon1 from "../assets/clean-clothes.png"
// import Icon2 from "../assets/iron.png"
import Icon3 from "../assets/clothing-hanger.png"
import Icon4 from "../assets/t-shirt.png"
import Icon5 from "../assets/sport-shoe.png"
import Bag from "../assets/backpack.png"
import LaundryServiceModalDemo, { type CurrServiceType } from "./ServiceDetails";
import { useTranslation } from "react-i18next";
export default function Services() {
  const { dark } = useTheme();
  let [OpenService,setOpenService]=useState(false)
  let [SelectedService,setSelectedService]=useState<{label:string,icon:string}>()
  const { t } =
  useTranslation();
  
  const services = [
    {label:t("wash_fold"),id:"serv1",icon:Icon1,Items:[
    { id: 1, name: t("shirt"), price: 15 },
    { id: 2, name: t("tshirt"), price: 10 },
    { id: 3, name: t("trouser"), price: 15 },
    { id: 4, name: t("jeans"), price: 10 },
    { id: 5, name: t("saree_regular)"), price: 30 },
    { id: 6, name: t("saree_etc)"), price: 120 },
    { id: 7, name: t("dress_material"), price: 20 },
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
  
    {label:t("wash_iron"),id:"serv3",icon:Icon3,Items:[
    { id: 1, name: t("shirt"), price: 15 },
    // { id: 2, name: "T-Shirt", price: 12 },
    { id: 30, name: t("trouser"), price: 15 },
    { id: 31, name: t("school_uniform"), price: 30 },
    { id: 32, name: t("kurti"), price: 15 },
    { id: 33, name: t("plazzo"), price: 15 },
    { id: 34, name: t("saree_regular"), price: 40 },
    { id: 35, name: t("saree_etc"), price: 130 },
    { id: 36, name: t("dress_material"), price: 25 },
  ]},
  
    {label:t("heavy_wash"),id:"serv4",icon:Icon4,Items:[
    { id: 1, name: t("curtain"), price: 25 },
    { id: 2, name: t("bed_sheet"), price: 20 },
    { id: 3, name: t("pillow_cover"), price: 12 },
    ]},
  
    {label:t("bag_cleaning"),id:"serv5",icon:Bag,Items:[
    { id: 1, name: "Sch. Bag/Office Bag", price: 80 },
    { id: 2, name: "Travel Bag", price: 100 },
    // { id: 22, name: "Trouser", price: 20 },
    // { id: 4, name: "Jeans", price: 25 },
    // { id: 5, name: "Saree", price: 60 },
    // { id: 6, name: "Blazer", price: 50 },
    // { id: 7, name: "Kurta", price: 30 },
  ]},
    {label:t("shoe_cleaning"),id:"serv6",icon:Icon5,Items:[
    { id: 1, name: "Sports shoes", price: 80 },
    { id: 2, name: "Sneakers", price: 80 },
    { id: 3, name: "Casual shoes", price: 60 },
    // { id: 4, name: "Jeans", price: 25 },
    // { id: 5, name: "Saree", price: 60 },
    // { id: 6, name: "Blazer", price: 50 },
    // { id: 7, name: "Kurta", price: 30 },
  ]},
  ];
  
  
  return (
    <>
    <div className="text-black fixed top-0 z-50 left-0">

          {OpenService&&<LaundryServiceModalDemo CurrService={SelectedService as CurrServiceType} open={OpenService} setOpen={setOpenService}/>}
    </div>

    <section id="Services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-center text-4xl font-bold mb-12">
          {t("our_services")}
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