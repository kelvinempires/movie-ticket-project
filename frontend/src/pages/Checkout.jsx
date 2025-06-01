// // src/pages/Checkout.jsx
// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { useMovies } from "../context/MovieContext"; // ✅ Import MovieContext

// const Checkout = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { reserveSeats } = useMovies(); // ✅ Access reserveSeats function

//   const [paymentMethod, setPaymentMethod] = useState("credit");
//   const [cardDetails, setCardDetails] = useState({
//     number: "",
//     expiry: "",
//     cvv: "",
//   });

//   if (!state) {
//     navigate("/");
//     return null;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // First reserve the seats
//     const reservationSuccess = await reserveSeats(
//       state.movie.id,
//       `${state.selectedDate}-${state.selectedTime}`,
//       state.selectedSeats
//     );

//     if (reservationSuccess) {
//       // Then process payment
//       toast.success("Payment successful!");
//       navigate("/success", { state });
//     } else {
//       toast.error("Seat reservation failed. Please try again.");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8">Checkout</h1>

//         <div className="grid md:grid-cols-2 gap-8">
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

//             <div className="space-y-4 mb-6">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   checked={paymentMethod === "credit"}
//                   onChange={() => setPaymentMethod("credit")}
//                 />
//                 <span>Credit Card</span>
//               </label>

//               <label className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   checked={paymentMethod === "paypal"}
//                   onChange={() => setPaymentMethod("paypal")}
//                 />
//                 <span>PayPal</span>
//               </label>
//             </div>

//             {paymentMethod === "credit" && (
//               <form onSubmit={handleSubmit}>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block mb-1">Card Number</label>
//                     <input
//                       type="text"
//                       placeholder="1234 5678 9012 3456"
//                       className="w-full p-2 border rounded"
//                       value={cardDetails.number}
//                       onChange={(e) =>
//                         setCardDetails({
//                           ...cardDetails,
//                           number: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block mb-1">Expiry Date</label>
//                       <input
//                         type="text"
//                         placeholder="MM/YY"
//                         className="w-full p-2 border rounded"
//                         value={cardDetails.expiry}
//                         onChange={(e) =>
//                           setCardDetails({
//                             ...cardDetails,
//                             expiry: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block mb-1">CVV</label>
//                       <input
//                         type="text"
//                         placeholder="123"
//                         className="w-full p-2 border rounded"
//                         value={cardDetails.cvv}
//                         onChange={(e) =>
//                           setCardDetails({
//                             ...cardDetails,
//                             cvv: e.target.value,
//                           })
//                         }
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full mt-6 bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700"
//                 >
//                   Complete Booking
//                 </button>
//               </form>
//             )}
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-start mb-4">
//                 <img
//                   src={state.movie.poster}
//                   alt={state.movie.title}
//                   className="w-16 h-24 object-cover rounded mr-4"
//                 />
//                 <div>
//                   <h3 className="font-medium">{state.movie.title}</h3>
//                   <p className="text-sm text-gray-600">
//                     {state.selectedTheater}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     {new Date(state.selectedDate).toLocaleDateString()} at{" "}
//                     {state.selectedTime}
//                   </p>
//                 </div>
//               </div>

//               <div className="border-t border-gray-200 pt-4">
//                 <div className="flex justify-between mb-2">
//                   <span>Tickets ({state.selectedSeats.length})</span>
//                   <span>
//                     $
//                     {(state.selectedSeats.length * state.movie.price).toFixed(
//                       2
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Convenience Fee</span>
//                   <span>$2.50</span>
//                 </div>
//               </div>

//               <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between font-semibold">
//                 <span>Total</span>
//                 <span>
//                   $
//                   {(
//                     state.selectedSeats.length * state.movie.price +
//                     2.5
//                   ).toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;
