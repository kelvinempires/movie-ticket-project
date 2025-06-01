import React, { useContext, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
// import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method,] = useState("paystack");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    products,
    delivery_fee,
  } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phoneNumber: "",
  });
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        // API call for Cash on Delivery (COD)
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            toast.success(response.data.message);
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        // Stripe payment processing
        case "stripe": {
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        }

        // Paystack payment processing
        case "paystack": {
          const responsePaystack = await axios.post(
            backendUrl + "/api/order/paystack",
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(responsePaystack);
          if (responsePaystack.data.success) {
            const { authorization_url } = responsePaystack.data;
            window.location.replace(authorization_url); // Redirect to Paystack payment page
          } else {
            toast.error(responsePaystack.data.message);
          }
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80v] border-t border-gray-300"
    >
      {/* -----left side---- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3 ">
          <Title test1={"DELIVERY"} test2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-0.5 px-3.5 w-full"
            type="text"
            placeholder="First name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-0.5 px-3.5 w-full"
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-0.5 px-3.5 w-full"
          type="Email"
          placeholder="Email address"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-0.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-0.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-0.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-0.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode optional"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-0.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phoneNumber"
          value={formData.phoneNumber}
          className="border border-gray-300 rounded py-0.5 px-3.5 w-full"
          type="number"
          placeholder="Phone number"
        />
      </div>
      {/* ----right side----- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          {/* <Title test1={"PAYMENT"} test2={"METHOD"} /> */}
          {/* ---------text payment selection-------- */}
          {/* <div className="flex gap-3 flex-col lg:flex-row"> */}
            {/* Stripe Payment Option */}
            {/* <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-0 border border-gray-300 lg:border-0 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full  ${
                  method === "stripe" ? "bg-green-400" : ""
                } `}
              ></p>
              <img
                src={assets.stripe_logo}
                className="h-5 mx-4"
                alt="stripe logo"
              />
            </div> */}

            {/* Cash on Delivery Option */}
            {/* <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-0 border border-gray-300 lg:border-0 p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                } `}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">COD</p>
            </div> */}

            {/* Paystack Payment Option */}
            {/* <div
              onClick={() => setMethod("paystack")}
              className="flex items-center gap-0 border border-gray-300 lg:border-0 p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${
                  method === "paystack" ? "bg-green-400" : ""
                } `}
              ></p>
              <h2 className="text-green-500 text-md font-semibold mx-4">
                Nigeria Payment
              </h2>
            </div> */}
          {/* </div> */}
          <div className=" w-fit text-end mt-8 lg:ml-40">
            <button
              type="submit"
              className="bg-green-500 text-white px-16 py-3 text-sm flex items-center justify-center rounded-md hover:bg-green-600 transition-all duration-300 cursor-pointer"
              disabled={loading} // Disable the button while loading
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "PLACE ORDER"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
