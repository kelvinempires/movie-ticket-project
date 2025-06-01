// src/pages/MyProfile.jsx
import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext.jsx";

const MyProfile = () => {
  const { userData, fetchUserData } = useContext(ShopContext);

  useEffect(() => {
    fetchUserData(); // Call it when the component mounts
  }, []);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
      {userData ? (
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Phone:</strong> {userData.phone}
          </p>
          {/* Add other user details as needed */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default MyProfile;
