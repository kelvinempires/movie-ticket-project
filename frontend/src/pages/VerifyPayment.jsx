import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyPayment = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const reference = searchParams.get("reference"); // Paystack uses `reference`

  const verifyPayment = async () => {
    try {
      if (!success || !orderId || (reference && reference.trim() === "")) {
        toast.error("Invalid payment verification request.");
        navigate("/cart");
        return;
      }

      if (!token) {
        toast.error("You need to log in to verify your payment.");
        navigate("/login");
        return;
      }

      let verificationUrl = "";
      let requestData = { success, orderId };

      if (reference) {
        // Paystack verification
        verificationUrl = `${backendUrl}/api/order/verifyPaystack`;
        requestData = { reference, orderId };
      } else {
        // Stripe verification
        verificationUrl = `${backendUrl}/api/order/verifyStripe`;
      }

      const response = await axios.post(verificationUrl, requestData, {
        headers: { token },
      });

      if (response.data.success) {
        setCartItems({});
        toast.success("Payment verified successfully!");
        navigate("/orders");
      } else {
        toast.error("Payment failed.");
        navigate("/cart");
      }
    } catch (error) {
      console.error(
        "Error verifying payment:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Error verifying payment. Please try again."
      );
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyPayment();
    }
  }, [token]);

return (
  <div className="flex items-center justify-center h-screen text-center text-lg font-bold">
    {loading ? (
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-500 mt-3 animate-pulse">Verifying payment...</p>
      </div>
    ) : (
      <p className="text-green-500 animate-fade-in">Redirecting...</p>
    )}
  </div>
);
};

export default VerifyPayment;
