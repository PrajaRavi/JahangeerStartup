import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import {toast} from "react-toastify"
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { LocalStorageLogedinuserId } from "../utils/Dotenv";
import { useDispatch } from "react-redux";
import { SetIsUserLogin } from "../Redux/Slice/Auth.slice";
import { useTheme } from "../context/theme.context";

interface LoginForm {
  identifier: string; // Email or Phone
  password: string;
}

export default function SignInPage() {
  const {phone}=useParams();
  const dispatch=useDispatch();
  const {dark}=useTheme()
  let [OpenPopModal,setOpenPopModal]=useState<boolean>(false)
  let [LoginOtp,setLoginOtp]=useState<string>("")
  const [formData, setFormData] =
    useState<LoginForm>({
      identifier: String(phone),
      password: "",
    });
const navigate=useNavigate();
  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

  const validate = () => {
    const newErrors = {
      identifier: "",
      password: "",
    };

    if (!formData.identifier.trim()) {
      newErrors.identifier =
        "Email or Phone is required";
    }

    if (!formData.password.trim()) {
      newErrors.password =
        "Password is required";
    } else if (
      formData.password.length < 6
    ) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return !newErrors.identifier &&
      !newErrors.password
      ? true
      : false;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

//   async function HandleSendOtp(){
//     try {
//       if(formData.identifier==""){

//         return toast.error("phone number required")
//       }
//       if(formData.identifier.length!=10){
//         return toast.error("Invalid phone number")
//       }
//       let {data}=await axios.post(`http://localhost:4500/user/send-login-otp`,{phoneNumber:formData.identifier})
//       if(data.success){
//         toast.success("An otp is send to your phone")
// setOpenPopModal(true)
//       }
//       else{
//         toast.error(data?.msg)
//       }
//     } catch (error:any) {
//       let {data,status}=error.response;
//       if(data){
//         console.log(status)
//         toast.error(
//           data?.msg ||
//           "Something went wrong"
//         );
//       }
//       console.log(error)
   
//     }
//   }

  async function HandleLoginWithOtp(e:any){
    e.preventDefault();
    try {
      if(LoginOtp==""){
        return toast.warn("otp is required")
      }
  let  {data}=await axios.post(`http://localhost:4500/user/login-user-with-login-otp`,{phoneNumber:formData.identifier,LoginOtp},{withCredentials:true})
      if(data.success){
setOpenPopModal(false)
toast.success("Login Successful");
        dispatch(SetIsUserLogin(true))
  
        // Navigate Here
        localStorage.setItem(LocalStorageLogedinuserId,data?.email)
        navigate("/");
        dispatch(SetIsUserLogin(true))
     
      }
      else{
        toast.error(data?.msg)
      }
      
    } catch (error:any) {
      let {data,status}=error.response;
      if(data){
        console.log(status)
        toast.error(
          data?.msg ||
          "Something went wrong"
        );
      }
      console.log(error)
    }
  }
  const handleSubmit = async (
    e: any
  ) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      let {data}=await axios.post(`http://localhost:4500/user/signin`,formData,{withCredentials:true})
      if (data.success) {
        toast.success("Login Successful");
        dispatch(SetIsUserLogin(true))
  
        // Navigate Here
        localStorage.setItem(LocalStorageLogedinuserId,data?.email)
        navigate("/");
        dispatch(SetIsUserLogin(true))
      }
      else{
        toast.error("signin failed!!!!")
      }

      
      console.log(data);
    } catch (error: any) {
      let {data,status}=error.response;
      if(data){
        console.log(status)
        toast.error(
          data?.msg ||
          "Something went wrong"
        );
      }
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-screen  fixed top-0 left-0 h-screen flex items-center justify-center  ${
        dark
        ? "bg-linear-to-br  from-[#023B40] to-[#01BCBC] text-white"
        : "bg-slate-50 text-slate-900"
        } `}>

          {/* creating a pop up for entering the login otp */}
          {OpenPopModal&&<div className="w-full z-10 flex items-center justify-center fixed  bg-white/10
        backdrop-blur-xl
 top-0 left-0 text-white h-full  ">
            <button onClick={()=>{
setOpenPopModal(false)
            }} className="absolute top-5 right-5"><X/></button>
            <form action="" onSubmit={HandleLoginWithOtp} className="md:w-[60%] w-[80%]">
              <h1>Login with OTP</h1>
                <div>
            <label
              className="
              block
              text-sm
              text-slate-300
              mb-2
            "
            >
              OTP
            </label>

            <input
              type="number"
              name="LoginOtp"
              value={
                LoginOtp
              }
              onChange={(e)=>{
                setLoginOtp(e.target.value)
              }}
              placeholder="Enter OTP"
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

            
          </div>
          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-[#00D3F3]
            text-black
            py-3
            mt-3
            rounded-xl
            font-semibold
            flex
            items-center
            justify-center
            gap-3
            disabled:opacity-70
          "
          >
            {loading ? (
              <>
                <div
                  className="
                  h-5
                  w-5
                  border-2
                  border-black
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
                />

                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>



            </form>

          </div>}

    <div
      className={`h-[60%] w-[80%] flex items-center justify-center flex-col`}
    >
     
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="
            text-3xl
            font-bold
            text-white
          "
          >
            Welcome Back
          </h1>

          <p
            className="
            text-slate-400
            mt-2
          "
          >
            Login to your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 md:w-[60%] w-[90%]"
        >
          {/* Email / Phone */}
          <div>
            <label
              className="
              block
              text-sm
              text-slate-300
              mb-2
            "
            >
              Email or Phone
            </label>

            <input
              type="text"
              name="identifier"
              value={
                formData.identifier
              }
              onChange={handleChange}
              placeholder="Enter email or phone"
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

            {errors.identifier && (
              <p
                className="
                text-red-400
                text-sm
                mt-1
              "
              >
                {errors.identifier}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="
              block
              text-sm
              text-slate-300
              mb-2
            "
            >
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={
                  formData.password
                }
                onChange={handleChange}
                placeholder="Enter password"
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

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                  />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p
                className="
                text-red-400
                text-sm
                mt-1
              "
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
            onClick={async ()=>{
              if(formData.identifier==""){
              return  toast.info("Enter PhoneNumber  first")
              }
              if(formData.identifier.length!=10)
                return toast.info("Invalid PhoneNumber")
              // implement forgot password functionality
              try {
                let {data}=await  axios.put(`http://localhost:4500/user/send-forgot-pass-otp`,{phoneNumber:formData.identifier},{withCredentials:true})
                if(data.success){
                  console.log(data)
                  toast.success(data?.msg)
                  
    
                  // then navigate the user
                  navigate(`/forgotpass/${formData.identifier}`)
                  setTimeout(() => {
                    toast.success("An otp is send to your number.It is valid only for 5 minutes")
                  }, 1000);
                }
                else{
                  toast.warn(data?.msg)
                }
                
              } catch (error:any) {
                let {data,status}=error.response;
                if(data){
                  console.log(status)
                  toast.error(data?.msg)
                }
              }



            }}
              type="button"
              className="
              text-cyan-400
              text-sm
              hover:underline
            "
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-[#00D3F3]
            text-black
            py-3
            rounded-xl
            font-semibold
            flex
            items-center
            justify-center
            gap-3
            disabled:opacity-70
          "
          >
            {loading ? (
              <>
                <div
                  className="
                  h-5
                  w-5
                  border-2
                  border-black
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
                />

                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

        </form>
        
          {/* <button
          onClick={()=>{
            HandleSendOtp()
          }}
            className="
            
            bg-[#00D3F3]
            text-black
            cursor-pointer
            md:w-[60%] w-[90%]
            mt-3
            py-3
            rounded-xl
            font-semibold
            flex
            items-center
            justify-center
            gap-3
            disabled:opacity-70
          "
          >
            
              Sign In with otp
          
          </button> */}

        {/* Divider */}
        <div
          className="
          flex
          items-center
          gap-3
          my-6
        "
        >
          <div className="flex-1 h-px bg-slate-700" />

          <span className="text-slate-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {/* Signup Link */}
        <p
          className="
          text-center
          text-slate-400
        "
        >
          Don't have an account?{" "}
          <button
            className="
            text-cyan-400
            hover:underline
          "
          >
            <Link to={"/signup"}>Sign Up</Link>
          </button>
        </p>
     
    </div>
    </div>
  );
}