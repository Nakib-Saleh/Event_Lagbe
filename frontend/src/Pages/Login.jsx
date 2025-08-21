import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Provider/AuthContext";
import { toast, Toaster } from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import Lottie from "lottie-react";
import animationData from "../assets/Artificial Intelligence Chatbot.json";

const Login = () => {
  const { logIn} = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await logIn(email, password);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.log(err.code);
      if (err?.code === "auth/invalid-credential" || err?.code === "auth/user-not-found") {
        setError("Invalid email or password");
      } else {
        toast.error(err?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div><Toaster/></div>
      <div className="w-1/2 hidden md:flex items-center justify-center p-8">
        <Lottie animationData={animationData} loop={true} />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 ">
        <div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md bg-gradient-to-b from-red-50 via-red-100 to-red-200"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back!</h2>
          <hr className="border-t-2 border-black my-4" />
          <h2 className="text-xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                required
              />
              {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-red-400 text-white py-2 rounded hover:bg-blue-500 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <h3 className="text-center">Don't have an account?<span className="text-blue-500 cursor-pointer" onClick={() => navigate("/register")}> Register Now</span></h3>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
