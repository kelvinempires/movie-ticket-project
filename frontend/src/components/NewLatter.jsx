import React, { useState } from "react";
import Title from "./Title";
import { FiArrowRight } from "react-icons/fi"; // Feather icon, you can pick others if you like

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }
    // TODO: Add your subscribe API call here
    alert(`Thanks for subscribing with ${email}!`);
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center max-w-5xl lg:w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-30 bg-gray-900 text-white">
      <Title
        title="Stay Inspired"
        subTitle="Join our newsletter and be the first to discover new destinations, exclusive offers and travel inspiration."
      />
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full"
          placeholder="Enter your email"
          required
        />
        <button
          onClick={handleSubscribe}
          className="flex items-center justify-center gap-2 group bg-yellow-500 px-4 md:px-7 py-2.5 rounded active:scale-95 transition-all"
        >
          Subscribe
          <FiArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <p className="text-gray-500 mt-6 text-xs text-center">
        By subscribing, you agree to our Privacy Policy and consent to receive
        updates.
      </p>
    </div>
  );
};

export default Newsletter;
