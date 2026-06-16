import { motion } from "framer-motion";
import { Shirt, ShoppingBag, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { CurrServiceType, ServiceItem } from "./ServiceDetails";
import { useEffect, useMemo } from "react";
import { ReStoreCartItems, setCartItems } from "../Redux/Slice/Auth.slice";

interface Product {
  id: number;
  name: string;
  icon: string;
  price: number;
  quantity: number;
}

export default function OrderSummaryPage() {
  const serviceName = "Ironing";
  let CartItems=useSelector((state:any)=>state.Auth.CartItems)
const dispatch=useDispatch();
  const products: Product[] = [
    {
      id: 1,
      name: "Shirt",
      icon: "👔",
      price: 15,
      quantity: 2,
    },
    {
      id: 2,
      name: "T-Shirt",
      icon: "👕",
      price: 12,
      quantity: 3,
    },
    {
      id: 3,
      name: "Jeans",
      icon: "👖",
      price: 25,
      quantity: 1,
    },
  ];

  const totalItems = products.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const totalAmount = products.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  useEffect(()=>{
console.log(CartItems)
if(CartItems?.length>0){
//  console.log(data)
}
  },[])

    let CartSummary=useMemo(()=>{
let totalamount=0;
let totalelem=0;
CartItems?.forEach((product:CurrServiceType)=>{
  product?.Items?.forEach((item:any)=>{
totalamount+=Number(item.Item[0].price)*Number(item.count)
totalelem+=Number(item.count)
  })
})
return {totalamount,totalelem}
},[CartItems])

async function HandleProdDelete(serviceLabel:string,ProdID:string){
  // let FilterData=CartItems.
  console.log(serviceLabel,ProdID)
  if(serviceLabel!="" && ProdID!=""){
 let FilterData=CartItems.map((service:CurrServiceType)=>{
  let  FilteredProd=null;
  if(service.label==serviceLabel){
     FilteredProd=service.Items.filter((item:any)=>{
      return item.Item[0].id!=ProdID
    })
    
  }
  return {label:serviceLabel,icon:service.icon,Items:FilteredProd}
 })
 dispatch(ReStoreCartItems(FilterData))
}
}
  
  return (
    <div className="min-h-screen  bg-transparent p-4 md:p-8">
      {CartItems.map((products:CurrServiceType,idx:Number)=>{


      return <div className="max-w-3xl mt-2 mx-auto">
        {/* Service Name */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
          bg-white
          text-black
          rounded-3xl
          p-6
          shadow-sm
          mb-5
        "
        >
          <h1 className="text-3xl font-bold text-[#023B40]">
            {products.label}
          </h1>

          <p className="text-slate-500 mt-2">
            Selected Items
          </p>
        </motion.div>

        {/* Product List */}

        <div className="space-y-4">
          {products?.Items?.map((product, index) => (
            
            <motion.div
              key={product.count}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              className="
              bg-white
              rounded-2xl
              p-4

              flex
              items-center
              justify-between
              relative
              shadow-sm
            "
            >
               <div className="flex items-center gap-4">

                {/* <button className="absolute top-0 right-3" onClick={()=>{
                  HandleProdDelete(products.label,String(product?.Item[0]?.id))
                }} ><X size={20} color="black"/></button> */}
                {/* Product Icon */}

                <div
                  className="
                  h-14
                  w-14

                  rounded-xl

                  bg-cyan-50

                  flex
                  items-center
                  justify-center

                  text-2xl
                "
                >
                  {<Shirt color="black"/>}
                </div>

                {/* Product Info */}

                <div>
                  <h3 className="font-semibold text-black text-lg">
                    {product?.Item[0]?.name}
                  </h3>

                  <p className="text-slate-500">
                    ₹{product?.Item[0].price} ×{" "}
                    {product?.count}
                  </p>
                </div>
              </div>

              {/* Item Total */}

              <div>
                <h4 className="font-bold text-lg text-[#00D3F3]">
                  ₹
                  {product?.Item[0].price*
                    product?.count}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>

        
      </div>
      })
      
      }
      {/* Footer Summary */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
          mt-6

          bg-white

          rounded-3xl

          p-6

          shadow-sm
        "
        >
          <div className="flex justify-between">
            <span className="text-slate-500">
              Total Items
            </span>

            <span className="font-bold text-black">
              {CartSummary.totalelem}
            </span>
          </div>

          <div className="flex justify-between mt-3">
            <span className="text-slate-500">
              Total Amount
            </span>

            <span className="text-2xl font-bold text-[#023B40]">
              ₹{CartSummary.totalamount}
            </span>
          </div>

          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="
            mt-6

            w-full

            bg-[#00D3F3]

            text-[#023B40]

            py-4

            rounded-2xl

            font-bold

            flex
            items-center
            justify-center
            gap-2
          "
          >
            <ShoppingBag size={20} />
            {`Your Order is pending`}
          </motion.button>
        </motion.div>
    </div>
  );
}