import React, { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Minus,
  Plus,
  X,
  Shirt,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setCartItems } from "../Redux/Slice/Auth.slice";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export type ServiceItem = {
  id: number;
  name: string;
  price: number;
  Item?:[];
  
};

export type CurrServiceType={
  label:string;
  icon:string;
  id?:string;
  Items:ServiceItem[];
}
// const SERVICE_ITEMS: ServiceItem[] = [
//   { id: 1, name: "Shirt", price: 15 },
//   { id: 2, name: "T-Shirt", price: 12 },
//   { id: 3, name: "Trouser", price: 20 },
//   { id: 4, name: "Jeans", price: 25 },
//   { id: 5, name: "Saree", price: 60 },
//   { id: 6, name: "Blazer", price: 50 },
//   { id: 7, name: "Kurta", price: 30 },
// ];

export default function LaundryServiceModalDemo({open,setOpen,CurrService}:{open:boolean,setOpen:React.Dispatch<React.SetStateAction<boolean>>,CurrService:CurrServiceType}) {
  // const [open, setOpen] = useState(false);
  

  return (
    <div className="min-h-screen flex z-10 items-center justify-center bg-slate-100 p-5">
      {/* <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(true)}
        className="px-8 py-4 rounded-2xl bg-[#00D3F3] text-white font-semibold shadow-xl"
      >
        Open Ironing Service
      </motion.button> */}

      <ServiceModal
        open={open}
        onClose={() => setOpen(false)}
        CurrService={CurrService}
        
      />
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  CurrService:CurrServiceType
}

function ServiceModal({
  open,
  onClose,
  CurrService,
}: ModalProps) {
  const [cart, setCart] = useState<
    Record<number, number>
  >({});
  const dispatch=useDispatch();
  const { t } =
      useTranslation();
  
const navigage=useNavigate();
  const increase = (id: number) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decrease = (id: number) => {
    setCart((prev) => ({
      ...prev,
      [id]: Math.max(
        0,
        (prev[id] || 0) - 1
      ),
    }));
  };

  const total = useMemo(() => {
    return CurrService.Items.reduce(
      (acc, item) =>
        acc +
        item.price *
          (cart[item.id] || 0),
      0
    );
  }, [cart]);

  const totalItems = Object.values(
    cart
  ).reduce((a, b) => a + b, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
            fixed
            inset-0
            z-40
            bg-black/40
            backdrop-blur-sm
          "
          />

          {/* MODAL */}

          <motion.div
            initial={{
              y: "100%",
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 26,
            }}
            className="
            fixed
            z-50

            bottom-0
            left-0
            right-0

            md:left-1/2
            md:top-1/2
            md:bottom-auto
            md:right-auto

            md:-translate-x-1/2
            md:-translate-y-1/2

            bg-white

            h-[92vh]
            md:h-[85vh]

            w-full
            md:w-175

            rounded-t-4xl
            md:rounded-4xl

            shadow-2xl

            flex
            flex-col

            overflow-hidden
          "
          >
            {/* DRAG BAR */}

            {/* <div className="flex justify-center py-3">
              <div className="w-16 h-1.5 rounded-full bg-slate-300" />
            </div> */}

            {/* HEADER */}

            <div className="px-5 pb-1 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {CurrService.label?CurrService.label:"Ironing"}
                  </h2>

                  <p className="text-slate-500">
                    Select items for ironing
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2"
                >
                  <X />
                </button>
              </div>
            </div>

            {/* SERVICE CARD */}

            {/* <div className="p-5">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="
                rounded-3xl
                border

                p-1

                flex
                items-center
                gap-4
              "
              >
                <div
                  className="
                  h-10
                  w-10

                  rounded-2xl

                  bg-[#00D3F3]/10

                  flex
                  items-center
                  justify-center
                "
                >
                  <Shirt
                    size={40}
                    className="text-[#00D3F3]"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-md">
                    Ironing
                  </h3>

                  <p className="text-slate-500 text-sm">
                    Select items for ironing
                  </p>
                </div>
              </motion.div>
            </div> */}

            {/* ITEMS */}

            <div className="flex-1 overflow-y-auto px-5 pb-10">
              {CurrService.Items.map(
                (item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.05,
                    }}
                    className="
                    p-1
                    rounded-3xl
                    border

                    mb-2

                    flex
                    items-center
                    justify-between
                  "
                  >
                    <div
                      className="
                      flex
                      items-center
                      gap-4
                    "
                    >
                      <div
                        className="
                        h-16
                        w-16

                        rounded-2xl

                        bg-slate-100

                        flex
                        items-center
                        justify-center
                      "
                      >
                        <Shirt />
                      </div>

                      <div>
                        <h4 className="font-semibold text-md">
                          {item.name}
                        </h4>

                        <p className="font-bold text-xs text-[#00D3F3]">
                          ₹{item.price}/pc
                        </p>
                      </div>
                    </div>

                    {/* COUNTER */}

                    <div
                      className="
                      bg-slate-100

                      rounded-full

                      px-4
                      py-3

                      flex
                      items-center
                      gap-5
                    "
                    >
                      <button
                        onClick={() =>
                          decrease(
                            item.id
                          )
                        }
                      >
                        <Minus />
                      </button>

                      <motion.span
                        key={
                          cart[
                            item.id
                          ] || 0
                        }
                        initial={{
                          scale: 0.5,
                          opacity: 0,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                        }}
                        className="
                        font-bold
                        min-w-5
                        text-center
                      "
                      >
                        {cart[
                          item.id
                        ] || 0}
                      </motion.span>

                      <button
                        onClick={() =>
                          increase(
                            item.id
                          )
                        }
                        className="text-[#00D3F3]"
                      >
                        <Plus />
                      </button>
                    </div>
                  </motion.div>
                )
              )}
            </div>

            {/* FOOTER */}

            <div
              className="
              sticky
              bottom-0

              border-t

              bg-white

              p-2

              flex
              items-center
              justify-between
            "
            >
              <div>
                <p className="text-slate-500  text-xs">
                  {t("estimated_total")}
                </p>

                <motion.h2
                  key={total}
                  initial={{
                    scale: 0.8,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  className="
                  text-xl
                  font-bold
                "
                >
                  ₹{total}
                </motion.h2>

                <p className="text-slate-500">
                  ({totalItems} items)
                </p>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                onClick={()=>{
                  let arr=[]
                  for (let key in cart){
                     let currItem=CurrService.Items.filter((item)=>{
                      return Number(item.id)==Number(key)
                     })
                     arr.push({id:currItem[0].id,name:currItem[0].name,price:currItem[0].price,count:cart[key],icon:"👔"})
                  }
                  console.log(arr)
                  dispatch(setCartItems(arr))
                  onClose();
                  navigage("/DeliveryDate")
                  
                  
                  
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="
                px-4
                py-2

                rounded-2xl

                bg-[#F4B183]

                text-white
                font-semibold

                shadow-lg
              "
              >
                Continue →
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}