import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

interface FormData {
  phoneNumber: string;
  otp: string;
  confirmOtp: string;
}

export default function PhoneVerificationPage() {
  const [loading, setLoading] =
    useState(false);
    const {phone}=useParams()
    const navigate=useNavigate();


  
  const [formData, setFormData] =
    useState<FormData>({
      phoneNumber: String(phone),
      otp: "",
      confirmOtp: "",
    });

  const [errors, setErrors] = useState({
    phoneNumber: "",
    otp: "",
    confirmOtp: "",
  });

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

  const validate = () => {
    const newErrors = {
      phoneNumber: "",
      otp: "",
      confirmOtp: "",
    };

    

    if (!formData.otp.trim()) {
      newErrors.otp =
        "OTP is required";
    }

    if (!formData.confirmOtp.trim()) {
      newErrors.confirmOtp =
        "Confirm OTP is required";
    }

    if (
      formData.otp &&
      formData.confirmOtp &&
      formData.otp !==
        formData.confirmOtp
    ) {
      newErrors.confirmOtp =
        "OTP does not match";
    }

    setErrors(newErrors);

    return (
      !newErrors.phoneNumber &&
      !newErrors.otp &&
      !newErrors.confirmOtp
    );
  };

 
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      // API Call
      let {data}=await axios.post(`http://localhost:4500/user/verify-otp-after-signup`,formData)
      if(data.success){

        toast.success(
          "Phone verified successfully"
        );
      }
      else{
        toast.error(
          "Verification failed!!!"
        );
      
      }
      setTimeout(() => {
        navigate(`/signin/${formData.phoneNumber}`)
      }, 1000);
    } catch(error:any) {
      let {data,status}=error.response;
      console.log(status)
        toast.error(
          "Verification failed!!! "+`${data?.msg}`
        );
      
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      w-full
      min-h-screen
      flex
      items-center
      justify-center
      px-4
      py-10
    "
    >
      <div
        className="
        w-full
        max-w-md
        border
        border-slate-200
        dark:border-slate-700
        rounded-3xl
        p-6
        sm:p-8
      "
      >
        {/* Header */}
        <div className="text-center">
          <h1
            className="
            text-3xl
            font-bold
          "
          >
            Phone Verification
          </h1>

          <p
            className="
            mt-2
            text-slate-500
          "
          >
            Verify your mobile number
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          {/* Phone Number */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Phone Number
            </label>

            <div className="flex gap-2">
              <input
                type="tel"
                name="phoneNumber"
                maxLength={10}
                value={
                  formData.phoneNumber
                }
                onChange={handleChange}
                placeholder="9876543210"
                className="
                flex-1
                border
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-cyan-500
              "
              />

              </div>

            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors.phoneNumber
                }
              </p>
            )}
          </div>

          {/* OTP */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              OTP
            </label>

            <input
              type="text"
              name="otp"
              maxLength={6}
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-cyan-500
            "
            />

            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">
                {errors.otp}
              </p>
            )}
          </div>

          {/* Confirm OTP */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Confirm OTP
            </label>

            <input
              type="text"
              name="confirmOtp"
              maxLength={6}
              value={
                formData.confirmOtp
              }
              onChange={handleChange}
              placeholder="Confirm OTP"
              className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-cyan-500
            "
            />

            {errors.confirmOtp && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors.confirmOtp
                }
              </p>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-cyan-500
            text-white
            py-3
            rounded-xl
            font-semibold
            flex
            justify-center
            items-center
            gap-2
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
                  border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
                />
                Verifying...
              </>
            ) : (
              "Verify Phone"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}