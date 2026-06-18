import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import {  useNavigate, useParams } from "react-router";
import { useTheme } from "../context/theme.context";
import { OtpTimer } from "../utils/OtpTimer";

interface FormData {
  phoneNumber: string;
  otp:string;
  NewPassword:string;
}

export default function ForgotPass() {
  const {phone}=useParams();
  const [formData, setFormData] = useState<FormData>({
    phoneNumber:String(phone) ,
    otp:"",
    NewPassword:"",

  });

 
  const [loading, setLoading] =
    useState(false);
    const {dark}=useTheme()
    const navigate=useNavigate();

  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if(formData.phoneNumber=="" || formData.otp==""||formData.NewPassword=="") 
      return toast.error("all feilds are required")
    try {
      setLoading(true);

      // API Call
      
      let {data}=await axios.put(`http://localhost:4500/user/forgot-pass`,formData,{withCredentials:true})
      console.log(data);
      if(data.success){
        toast.success(data?.msg)
        setFormData({
        phoneNumber: "",
        otp:"",
        NewPassword:""
      });
      setTimeout(() => {
        
        navigate(`/signin/${formData.phoneNumber}`)
      }, 1000);

    }

        
    } catch (error:any) {
      const {data,status}=error.response;
      console.log(status)
      if(data?.msg){
        toast.error(`${data?.msg}`)
      }else{
        toast.error("forgotpass failed internal server error")
      }

    } finally {
      setLoading(false);
    }
  };

  async function HandleResend(){
    try {
      let {data}=await axios.put(`http://localhost:4500/user/resend-forgotpass-otp`,{phoneNumber:formData.phoneNumber})
      if(data.success){
        toast.success(data?.msg)
      }
      else{
        toast.error(data?.msg)
      }
    } catch (error:any) {
      let {data,status}=error.response;
      if(data?.msg){
        toast.error(data?.msg)
        console.log(status)
      }
      else{

        console.log(error)
        toast.error("Internal server error")
      }
    }

  }
  function HandleTimeEnd(){
return false;
  }
  return (
    <div className={`w-screen  fixed top-0 left-0 h-screen flex items-center justify-center  ${
        dark
        ? "bg-linear-to-br  from-[#023B40] to-[#01BCBC] text-white"
        : "bg-slate-50 text-slate-900"
        } `}>

    <div
      className={`h-[60%] w-[80%] flex items-center justify-center flex-col`}
    >
        <h1
          className="
          text-3xl
          font-bold
          text-center
          text-[#023B40]
        "
        >
          Forgot Password
        </h1>

        
        <form
          onSubmit={handleSubmit}
          className="space-y-5 md:w-[50%] w-full"
        >
          
          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phoneNumber"
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
          <div>
            <label className="block mb-2 font-medium">
              New Password
            </label>

            <input
              type="password"
              name="NewPassword"
              value={formData.NewPassword}
              onChange={handleChange}
              placeholder="Enter your New Password"
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
          
          {/* Contact */}
          <div>
            <label className="block mb-2 font-medium">
            otp
            </label>

            <input
              type="number"
              name="otp"
              maxLength={10}
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter  otp"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-[#00D3F3]
            text-white
            py-3
            rounded-xl
            font-semibold
            hover:opacity-90
            transition
            disabled:opacity-70
            disabled:cursor-not-allowed
            flex
            justify-center
            items-center
            gap-2
          "
          >
            {loading ? (
              <>
                <div
                  className="
                  h-5
                  w-5
                  border-2
                  border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
                />
                processing...
              </>
            ) : (
              "submit"
            )}
          </button>
        </form>
        <OtpTimer minutes={5} onResendClick={HandleResend} onTimerEnd={HandleTimeEnd}/>
    </div>
    </div>

  );
}