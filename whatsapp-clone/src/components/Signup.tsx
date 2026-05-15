
import { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../Redux/Thunk/Auth.thunk";
import { useNavigate } from "react-router";
import type { AppDispatch } from "../Redux/Stores/Store.files";


interface SignupFormData {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  bio: string;
  profilePicture: File | null;
}

export default function SignupPage() {
  const navigation=useNavigate();
  const dispatch=useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    bio: "",
    profilePicture: null,
  });

  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("bio", formData.bio);

      if (formData.profilePicture) {
        data.append("profilePicture", formData.profilePicture);
      }

      console.log(formData)
      let result =await dispatch(signupUser(data))
      console.log(result)
      if(result.payload?.success){
          alert("sucess!!!"+result?.payload?.msg)
          navigation(`/email-verification/${formData.email}`)
        }
        else {
          alert("error!!!"+result?.payload)
        }
  



      

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl outline-none"
            required
          />

          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl outline-none"
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl outline-none resize-none"
            rows={4}
          />

          <input
            type="file"
            accept="image/*"
            name="profilePicture"
            onChange={handleFileChange}
            className="w-full"
          />

          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}