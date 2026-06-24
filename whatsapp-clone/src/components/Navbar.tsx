import { Menu ,ShoppingBag, X } from 'lucide-react'
import  { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTheme } from '../context/theme.context';
import logo from "../assets/logo.png"
import logo1 from "../assets/logo1.png"
import { LocalStorageLogedinuserId } from '../utils/Dotenv';
import { useDispatch, useSelector } from 'react-redux';
import ProfileModal from './ProfileModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setActiveUser, SetIsUserLogin, SetOrderdProd } from '../Redux/Slice/Auth.slice';
import { useTranslation } from 'react-i18next';


function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const IsUserLogin =useSelector((state:any)=>state.Auth.IsUserLogin)
  // let CartItems=useSelector((state:any)=>state.Auth.CartItems)
  let [profileOpen,setprofileOpen]=useState(false)
  const User=useSelector((state:any)=>state.Auth.ActiveUser)
// let OrderdProducts=useSelector((state:any)=>state.Auth.OrderdProducts)
let OrderdProductsFlag=useSelector((state:any)=>state.Auth.OrderdProductsFlag)
const { t } =
    useTranslation();
  const dispatch=useDispatch();
  const navigate=useNavigate();
    const { dark } = useTheme();
    let [Profile,setProfile]=useState("Ravi")
  
    useEffect(()=>{
if(User?.profilePicture){
  setProfile(`http://localhost:4500/Images/Profile/${User?.profilePicture}`)
}
else{
  setProfile("../src/assets/3dravi.png")

}
    },[IsUserLogin,User])

  async function logout(){
    try {
      let {data}=await axios.post(`http://localhost:4500/user/logout-user`,{},{withCredentials:true})
      if(data.success){
        localStorage.removeItem(LocalStorageLogedinuserId)
        setprofileOpen(false)
        setTimeout(() => {
          dispatch(setActiveUser([]))
          dispatch(SetIsUserLogin(false))
          navigate("/")
        }, 100);
      }
    } catch (error) {
      console.log(error)
      console.log("error in logout")
    }
  }

  //! This function fetch all the orders of the logedin user only
  async function GetAllOrders(){
    try {
      let {data}=await axios.get(`http://localhost:4500/order/get-order-by-id`,{withCredentials:true})
      console.log(data)
      if(data.success){

        dispatch(SetOrderdProd(data?.msg))
      }
    } catch (error) {
      console.log(error)
      if(localStorage.getItem(LocalStorageLogedinuserId))
      toast.error("Internal server error")
    }
  }
  useEffect(()=>{
GetAllOrders();
  },[OrderdProductsFlag])
  return (
    <>
    <ProfileModal
  open={profileOpen}
  onClose={() => setprofileOpen(false)}
  onUpdate={() => {
    // navigate("/profile")
  }}
  onLogout={logout}
  profile={Profile}
  setProfile={setProfile}
  user={{
    name: User.username,
    email:User.email,
    phone: User.phoneNumber,
  }}
/>
    <section className="fixed z-10 top-0 left-0 justify-center items-center w-full">

      <nav className="sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <img src={dark?logo1:logo} className="md:h-25 h-20" />

          <div className="hidden lg:flex gap-8">
            <Link to={"/"}>{t("home")}</Link>
            {User?.role!=="user" && localStorage.getItem(LocalStorageLogedinuserId)?<Link to={"/admin"}>Admin</Link>:null}
            { <Link  to={"/lang"}>{t("language")}</Link>}
            { <a  href={"#Services"}>{t("services")}</a>}
            { <a href={"#Contact"}>{t("contact")}</a>}
           
          </div>

          <div className="flex items-center gap-3">
{/*           
            <button
              onClick={()=>{
                console.log(CartItems)
                toggleTheme()}}
              className="p-3 rounded-full bg-white/20"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button> */}

             {localStorage.getItem(LocalStorageLogedinuserId)?
             <div className='w-12 border-4 border-cyan-200  h-12 rounded-full'>
              
<img src={Profile} alt="profile" onClick={()=>{
  setprofileOpen(true)
}} className='w-full h-full rounded-full' />
             </div>:<button className=" px-5 py-3 rounded-xl bg-cyan-400 text-black font-semibold">
             <Link to={"/signin/1234123123"}>{t("login")}</Link>
            </button>}

            {/* cart button */}
            {/* <button className='relative' onClick={()=>{
              console.log(CartItems)
              // GetAllOrders();
              navigate("/cart")
            }}><ShoppingCart/>
            <p className='absolute -bottom-2 w-4 h-4 bg-black flex items-center justify-center rounded-full  -right-2 text-xs'>{CartItems?.length}</p>
            </button> */}
            <button className='relative' onClick={()=>{
              navigate("/show-orders")

            }}><ShoppingBag size={20} />
            </button>


            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden px-6 pb-6 flex flex-col gap-4">
            <Link onClick={()=>{
              setMobileOpen(false)
            }} to={"/"}>{t("home")}</Link>
            {User?.role!=="user" && localStorage.getItem(LocalStorageLogedinuserId)}
            { <Link onClick={()=>{
              setMobileOpen(false)
            }} to={"/lang"}>{t("language")}</Link>}
            
            { <a onClick={()=>{
              setMobileOpen(false)
            }} href={"#Services"}>{t("services")}</a>}
            { <a onClick={()=>{
              setMobileOpen(false)
            }} href={"#Contact"}>{t("contact")}</a>}
        
          </div>
        )}
      </nav>
      </section>
    </>


  )
}

export default Navbar
