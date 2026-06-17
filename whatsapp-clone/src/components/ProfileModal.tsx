import axios from "axios";
import { X, Mail, Phone, Camera } from "lucide-react";
// import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onLogout: () => void;
  setProfile:React.Dispatch<React.SetStateAction<string>>;
  profile:string;

  user: {
    name: string;
    email: string;
    phone: string;
    
  };
}

export default function ProfileModal({
  open,
  onClose,
  onUpdate,
  onLogout,
  user,
  profile,
  setProfile,
}: ProfileModalProps) {
  if (!open) return null;
  // const User=useSelector((state:any)=>state.Auth.ActiveUser)
  async function UpdateDP(file:any){
    try {
      let formdata=new FormData();
      formdata.append("DP",file)
      let {data}=await axios.put(`http://localhost:4500/user/update-user-DP`,formdata,{withCredentials:true})
      if(data.success){
        toast.success("Updated successfully")
      }

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div
      className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/30
      backdrop-blur-sm
      p-4
    "
    >
      <div
        className="
        relative
        w-full
        max-w-md

        rounded-3xl

        border
        border-white/20

        bg-white/10
        backdrop-blur-xl

        shadow-[0_8px_32px_rgba(0,0,0,0.25)]

        p-6
        sm:p-8
      "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="
          absolute
          top-4
          right-4

          p-2
          rounded-full

          hover:bg-white/10
          transition
        "
        >
          <X size={20} />
        </button>

        {/* Profile Avatar */}
        <div className="flex justify-center">
          
          <div
            className="
            h-24
            w-24
            relative

            rounded-full

            bg-cyan-500/20

            border
            border-cyan-400/30

            flex
            items-center
            justify-center
          "
          >
            {/* <User
              size={40}
              className="text-cyan-400"
            /> */}
            <img src={profile} alt="profile" className="w-20 h-20 rounded-full" />
            <form action="">

{/* <label htmlFor=""></label> */}
            <label htmlFor="profile" className="absolute bottom-0 right-0"><Camera/>
            <input  onChange={(e:any)=>{
const file = e.target.files?.[0] || null;

    if (file) {
      setProfile(URL.createObjectURL(file));
      UpdateDP(file)

    }
            }} type="file" name="profile" id="profile" className="hidden" />
            </label>
            </form>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mt-4">
          <h2
            className="
            text-2xl
            font-bold
          "
          >
            My Profile
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Manage your account information
          </p>
        </div>

        {/* User Info */}
        <div className="mt-8 space-y-4">
          {/* Name */}
          <div
            className="
            flex
            items-center
            gap-3

            rounded-2xl
            border
            border-white/10

            bg-white/5

            p-4
          "
          >
            {/* <User
              size={20}
              className="text-cyan-400"
            /> */}

            <div>
              <p className="text-xs text-slate-400">
                Name
              </p>

              <p className="font-medium">
                {user.name}
              </p>
            </div>
          </div>

          {/* Email */}
          <div
            className="
            flex
            items-center
            gap-3

            rounded-2xl
            border
            border-white/10

            bg-white/5

            p-4
          "
          >
            <Mail
              size={20}
              className="text-cyan-400"
            />

            <div>
              <p className="text-xs text-slate-400">
                Email
              </p>

              <p className="font-medium break-all">
                {user.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div
            className="
            flex
            items-center
            gap-3

            rounded-2xl
            border
            border-white/10

            bg-white/5

            p-4
          "
          >
            <Phone
              size={20}
              className="text-cyan-400"
            />

            <div>
              <p className="text-xs text-slate-400">
                Phone
              </p>

              <p className="font-medium">
                {user.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div
          className="
          mt-8

          flex
          flex-col
          sm:flex-row

          gap-3
        "
        >
          <button
            onClick={onUpdate}
            className="
            flex-1

            bg-cyan-500

            text-white
            font-medium

            py-3

            rounded-xl

            hover:bg-cyan-600
            transition
          "
          >
            Update Profile
          </button>

          <button
            onClick={onLogout}
            className="
            flex-1

            border
            border-red-500/30

            text-red-400

            py-3

            rounded-xl

            hover:bg-red-500/10
            transition
          "
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}