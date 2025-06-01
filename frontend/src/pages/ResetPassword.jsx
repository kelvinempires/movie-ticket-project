import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const inputRefs = useRef([]);
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pastedValues = paste.split("");
    pastedValues.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/send-reset-otp`,
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false when request is complete
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      const otpArray = inputRefs.current.map((e) => e.value);
      setOtp(otpArray.join(""));
      setIsOtpSent(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false when request is complete
    }
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/reset-password`,
        { email, otp, newPassword }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false when request is complete
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Form to enter new email id */}

      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg w-96 text-sm"
        >
          {" "}
          <div className="text-center text-2xl sm:text-3xl">
            <Title
              className="text-white text-3xl"
              test1={"RESET"}
              test2={"PASSWORD"}
            />
            <div className="inline-flex items-center gap-2 mb-2 mt-10"></div>
            <p className="text-indigo-300 mb-6 text-center w-3/4 m-auto text-xs sm:text-sm md:text-base">
              Enter your registered email address
            </p>
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A56]">
            <img src={assets.mail} alt="mail icon" className="w-3 h-3" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent-none outline-none text-white w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            className={`w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 transition-all flex items-center justify-center ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-900"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
      )}
      {/* otp input form */}

      {!isOtpSent && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-indigo-300 mb-6 text-center">
            Enter the OTP sent to your email{" "}
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-3 rounded-full hover:opacity-90 transition-all flex items-center justify-center">
            {loading ? (
              <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      )}

      {/* enter new password */}

      {isOtpSent && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-indigo-300 mb-6 text-center">
            Enter your new password
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A56]">
            <img src={assets.lock} alt="lock icon" className="w-3 h-3" />
            <input
              type="password"
              placeholder="password"
              className="bg-transparent-none outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-3 rounded-full hover:opacity-90 transition-all flex items-center justify-center">
            {loading ? (
              <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
