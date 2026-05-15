import { useState, ChangeEvent, FormEvent } from "react";
import type { AppDispatch } from "../Redux/Stores/Store.files";
import { useDispatch } from "react-redux";
import { EmailVerification } from "../Redux/Thunk/Auth.thunk";
import { useNavigate, useParams } from "react-router";

export interface VerifyOtpFormData {
  email: string;
  otp: string;
  confirmOtp: string;
}

const VerifyOtpPage = () => {
  const navigation=useNavigate();
  const {email}=useParams()
  const dispatch=useDispatch<AppDispatch>()
  const [formData, setFormData] =
    useState<VerifyOtpFormData>({
      email:email as string,
      otp: "",
      confirmOtp: "",
    });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] =
    useState<boolean>(false);

  /*
    Handle input changes
  */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    /*
      Clear old error while typing
    */
    setError("");
  };

  /*
    Handle form submit
  */
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    /*
      Validate OTP match
    */
    if (formData.otp !== formData.confirmOtp) {
      setError("OTP does not match");
      return;
    }

    try {
      setLoading(true);

      /*
        Replace with your API call
      */
      

      // console.log(payload);
  let result=await   dispatch(EmailVerification(formData))
      if(result.payload?.success){
          alert("sucess!!!"+result?.payload?.msg)
          navigation(`/signin/${formData.email}`)
        }
        else {
          alert("error!!!"+result?.payload)
        }
  
      

      /*
        Example:
        await dispatch(verifyOtp(payload)).unwrap()
      */
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Verify OTP
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl outline-none"
            required
          />

          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl outline-none"
            required
          />

          <input
            type="text"
            name="confirmOtp"
            placeholder="Confirm OTP"
            value={formData.confirmOtp}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl outline-none"
            required
          />

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;