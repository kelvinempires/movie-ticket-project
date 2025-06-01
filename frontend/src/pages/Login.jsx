import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/frontend_assets/assets";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, backendUrl, setUser, user } =
    useContext(ShopContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

const onSubmitHandler = async (e) => {
  e.preventDefault();
  if (!email || !password) {
    toast.error("Please fill in all fields");
    return;
  }
  if (!backendUrl) {
    toast.error("Backend URL is not configured.");
    return;
  }

  // Basic email validation
  if (!/\S+@\S+\.\S+/.test(email)) {
    toast.error("Enter a valid email.");
    return;
  }

  setLoading(true);

  try {
    const url =
      currentState === "Sign Up"
        ? `${backendUrl}/api/user/register`
        : `${backendUrl}/api/user/login`;

    const data =
      currentState === "Sign Up"
        ? { name, email, password }
        : { email, password };

    const response = await axios.post(url, data);

    if (response.data.success) {
      const { token, user } = response.data;
      setToken(token);
      localStorage.setItem("token", token);

      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success(
        currentState === "Login"
          ? "Login successful!"
          : "Sign up successful! Redirecting..."
      );
      navigate("/");
    } else {
      // Handle cases where success is false but request was successful (HTTP 200)
      const errorMessage = response.data.msg || motion || "Operation failed.";
      toast.error(errorMessage);
    }
  } catch (error) {
    // Handle HTTP errors (4xx, 5xx)
    const errorMessage =
      error.response?.data?.msg ||
      error.message ||
      "An unexpected error occurred.";
    toast.error(errorMessage);
    console.error("Error during login/signup:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Only proceed if we have both token and user
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // Only update state if values are different
        if (token !== storedToken) setToken(storedToken);
        if (JSON.stringify(user) !== storedUser) setUser(parsedUser);

        // Only navigate if we're on login page
        if (location.pathname === "/login") {
          navigate("/");
        }
      } catch (err) {
        console.error("Failed to parse user data:", err);
        localStorage.removeItem("user");
      }
    }
  }, [setToken, setUser, navigate, location.pathname, token, user]); // Add token and user to dependencies

  return (
    <div className="bg-black h-screen">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        <AnimatePresence mode="wait">
          {currentState === "Sign Up" && (
            <motion.div
              key="signup-name"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]"
            >
              <img src={assets.person} alt="Person Icon" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="bg-transparent outline-none text-gray-300"
                placeholder="Name"
                aria-label="Name"
                required
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.mail} alt="Mail Icon" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="bg-transparent outline-none text-gray-300"
            placeholder="Email"
            aria-label="Email"
            required
          />
        </div>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.lock} alt="Lock Icon" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="bg-transparent outline-none text-gray-300"
            placeholder="Password"
            aria-label="Password"
            required
          />
        </div>

        <div className="w-full flex flex-col justify-between text-sm mt-[-8px]">
          <div>
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-indigo-500 cursor-pointer"
            >
              Forgot password?
            </p>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 text-gray-200 font-medium hover:bg-indigo-900 hover:cursor-pointer hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-900 transition-all flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : currentState === "Login" ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
          <div>
            {currentState === "Login" ? (
              <p className="text-gray-400 text-center mt-4 text-xs">
                Don&apos;t have an account?{" "}
                <span
                  onClick={() => setCurrentState("Sign Up")}
                  className="text-indigo-400 cursor-pointer underline"
                >
                  Sign Up
                </span>
              </p>
            ) : (
              <p className="text-gray-400 text-center mt-4 text-xs">
                Already have an account?{" "}
                <span
                  onClick={() => setCurrentState("Login")}
                  className="text-indigo-400 cursor-pointer underline"
                >
                  Login
                </span>
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
