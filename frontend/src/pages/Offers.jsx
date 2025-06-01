import { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Newsletter from "../components/NewLatter";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        // Replace this URL with your actual offers API
        const response = await axios.get(
          `https://your-api.com/api/offers?page=${page}`
        );
        setOffers(response.data.offers);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [page]);

  return (
    <div className="bg-black min-h-screen text-white p-6 max-w-7xl mx-auto pt-15 px-4 sm:px-20">
      <h1 className="font-playfair text-4xl font-bold mb-8">Special Offers & Deals</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array(6)
            .fill()
            .map((_, idx) => (
              <div key={idx} className="bg-gray-900 rounded p-4">
                <Skeleton height={150} />
                <Skeleton height={30} className="mt-4" />
                <Skeleton height={20} className="mt-2" />
              </div>
            ))}
        </div>
      ) : (
        <div className="font-playfair grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {offers.length === 0 && (
            <p>No offers available right now. Check back later!</p>
          )}

          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-gray-900 rounded p-4 flex flex-col"
            >
              <img
                src={offer.image || "/default-offer.png"}
                alt={offer.title}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="mt-4 text-xl font-semibold">{offer.title}</h2>
              <p className="mt-2 text-gray-300 flex-grow">
                {offer.description}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Expires on: {new Date(offer.expiryDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-600 rounded disabled:bg-gray-600"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Next
        </button>
      </div>
      <Newsletter/>
    </div>
  );
};

export default OffersPage;
