import { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../Redux/Stores/Store.files";
import { useNavigate, useParams } from "react-router";
import { LoginUser } from "../Redux/Thunk/Auth.thunk";
// import { loginUser } from "../redux/thunks/authThunk";

export interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation=useNavigate();
const {email}=useParams()
  const [formData, setFormData] =
    useState<LoginFormData>({
      email: email as string,
      password: "",
    });

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

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

    try {
      setLoading(true);
let result=await dispatch(LoginUser(formData))
if(result.payload?.success){
          alert("sucess!!!"+result?.payload?.msg)
          localStorage.setItem("email",formData.email)
          navigation(`/`)
        }
        else {
          alert("error!!!"+result?.payload)
        }
      /*
        Replace this with your thunk:
        await dispatch(loginUser(formData)).unwrap()
      */

      // console.log(formData);
    } catch (error: any) {
      setError(
        error?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Login
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
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
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
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;