import { createContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const navigate = useNavigate();

  const getUserProfile = async (token) => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = res.data.userData;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // Update localStorage
      return userData;
    } catch (error) {
      console.error("Error fetching user profile", error);
      return null;
    }
  };

  // Update both token and user in sync
  const updateAuth = async (newToken, newUser = null) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);

    if (newUser) {
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } else if (newToken) {
      // If no user provided but we have a token, fetch the profile
      await getUserProfile(newToken);
    } else {
      // Logout case
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && !user) {
        await getUserProfile(storedToken);
      }
    };
    initializeAuth();
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      search,
      setSearch,
      showSearch,
      setShowSearch,
      navigate,
      backendUrl,
      token,
      setToken: updateAuth, // Replace setToken with our unified updateAuth
      user,
      setUser: (userData) => {
        setUser(userData);
        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          localStorage.removeItem("user");
        }
      },
      updateAuth, // Expose the unified auth update function
    }),
    [search, showSearch, token, user, navigate, backendUrl]
  );

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
