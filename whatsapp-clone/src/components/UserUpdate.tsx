import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router";
import { ProfessionAdmin, ProfessionDeliveryBoy, ProfessionUser } from "../utils/Dotenv";
import { User, X } from "lucide-react";
import type { SignupFormData } from "../Redux/Slice/Auth.slice";

interface FormData {
  username: string;
  email: string;
  phoneNumber: string;
  role?:string,
  id?:string,
  
  
}

export default function UpdateUser({setOpenUpdateUserModal,UserData}:{setOpenUpdateUserModal:React.Dispatch<React.SetStateAction<boolean>>,UserData:SignupFormData}) {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    phoneNumber: "",
    role:"",
  id:""
  
  });

  const [errors, setErrors] = useState<
    Partial<FormData>
  >({});

  const [loading, setLoading] =
    useState(false);
    const navigate=useNavigate();

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    // Name Validation
    if (!formData.username.trim()) {
      newErrors.username = "Name is required";
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email";
    }

    // Contact Validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber =
        "Contact number is required";
    } else if (
      !/^[0-9]{10}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber =
        "Enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      // API Call
      setFormData({...formData,id:UserData._id})
      let {data}=await axios.put(`http://localhost:4500/user/update-user-by-Id`,formData,{withCredentials:true})
      console.log(data);
      
      
      if(data.success){
        toast.success(data?.msg)
        setFormData({
        username: "",
        email: "",
        phoneNumber: "",
      });
      setOpenUpdateUserModal(false)
    }
    } catch (error:any) {
      const {data,status}=error.response
      toast.error("signup failed!!!"+`${data?.msg}`)
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(()=>{
setFormData({email:UserData.email,username:UserData.username,phoneNumber:UserData.phoneNumber,role:UserData.role})
  },[UserData])
  return (
    <div className="fixed top-0 left-0 w-full h-full z-30">

    <div className="w-full 
      backdrop-blur-sm
      relative
       flex items-center justify-center">
<button onClick={()=>{
  setOpenUpdateUserModal(false)
}} className="absolute top-5 right-5"><X color="white" size={30}/></button>
    <div
      className="
      h-full
      mt-20
      flex 
      flex-col
      items-center
      glass
      md:w-[70%] 
      w-[90%]

         p-4
    "
    >
        <h1
          className="
          text-3xl
          font-bold
          text-center
          text-[#023B40]
        "
        >
          Create Account
        </h1>

        <p
          className="
          text-center
          text-gray-500
          mt-2
          mb-8
        "
        >
          Update Profile
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 md:w-[50%] w-[100%]"
        >
          {/* Name */}
          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
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

            {errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
            

            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Profession
            </label>

            <select onChange={handleChange} className="w-full
              border
              rounded-xl
              px-4
              
              py-3
              outline-none
              focus:border-[#00D3F3]" name="role" id="role">
              <option selected={UserData.role==ProfessionUser} className="bg-black" value={ProfessionUser}>{ProfessionUser}</option>
              <option selected={UserData.role==ProfessionDeliveryBoy} className="bg-black" value={ProfessionDeliveryBoy}>{ProfessionDeliveryBoy}</option>
              <option selected={UserData.role==ProfessionAdmin} className="bg-black" value={ProfessionAdmin}>{ProfessionAdmin}</option>
            </select>

            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block mb-2 font-medium">
              Contact Number
            </label>

            <input
              type="tel"
              name="phoneNumber"
              maxLength={10}
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="9876543210"
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

            {errors.phoneNumber && (
              <p className="text-red-400 text-sm mt-1">
                {errors.phoneNumber}
              </p>
            )}
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
                Updating Account...
              </>
            ) : (
              "Update"
            )}
          </button>
        </form>
    </div>
    </div>
    </div>


  );
}