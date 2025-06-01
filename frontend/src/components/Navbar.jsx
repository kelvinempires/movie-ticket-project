import { useState, useEffect, useContext } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  FaFilm,
  FaSearch,
  FaUserCircle,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { navigate, token, setToken, user, setUser } = useContext(ShopContext);

  const showSearch = token || ["/", "/movies"].includes(location.pathname);

  const logout = () => {
    if (window.location.pathname !== "/login") {
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
    setTimeout(() => navigate("/login"), 100);
    }
  };


  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    setSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  // Either remove this entirely or add a proper check
  useEffect(() => {
    if (user && JSON.stringify(user) !== localStorage.getItem("lastUserLog")) {
      console.log("User in Navbar:", user);
      localStorage.setItem("lastUserLog", JSON.stringify(user));
    }
  }, [user]);

  return (
    <nav className="shadow-md fixed z-30 w-full text-white shadow-lg bg-gradient-to-b from-gray-900 via-black/60 to-transparent px-0 sm:px-14">
      <div className="container mx-auto px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaFilm className="text-2xl text-yellow-400" />
            <span className="text-xl font-bold">CineBook</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {["/", "/movies", "/theaters", "/offers"].map((path, idx) => (
              <NavLink
                key={idx}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `hover:text-yellow-400 transition duration-300 ${
                    isActive ? "text-yellow-400 font-medium" : ""
                  }`
                }
              >
                {path === "/"
                  ? "Home"
                  : path.replace("/", "").charAt(0).toUpperCase() +
                    path.slice(2)}
              </NavLink>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Search icon */}
            {showSearch && (
              <button
                className="p-2 rounded-full hover:bg-indigo-700 transition duration-300"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <FaSearch className="text-lg" />
              </button>
            )}

            {/* User avatar or login */}
            <div className="group relative">
              {user?.name && (
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 text-white font-bold cursor-pointer hover:bg-gray-900 transition duration-300"
                  title={`Logged in as ${user.name}`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              {token && (
                <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
                  <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded">
                    <p
                      onClick={() => navigate("/orders")}
                      className="font-playfair cursor-pointer hover:text-yellow-400 transition duration-300"
                    >
                      My Profile
                    </p>
                    
                    <p
                      onClick={logout}
                      className="font-playfair cursor-pointer hover:text-yellow-400 transition duration-300"
                    >
                      Log Out
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!token && (
              <NavLink
                to="/login"
                className="p-2 rounded-full hover:bg-indigo-700 transition duration-300"
              >
                <FaUserCircle className="text-lg" />
              </NavLink>
            )}

            {/* Mobile menu icon */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-black transition duration-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && searchOpen && (
          <form
            onSubmit={handleSearch}
            className="mt-3 md:hidden flex items-center"
          >
            <input
              type="text"
              placeholder="Search movies..."
              className="flex-grow p-2 rounded-l text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-yellow-400 text-gray-900 p-2 rounded-r hover:bg-yellow-300"
            >
              <FaSearch />
            </button>
          </form>
        )}
      </div>

      {/* Desktop Search */}
      {showSearch && searchOpen && (
        <div className="hidden md:block bg-indigo-900 py-2">
          <div className="container mx-auto px-4">
            <form
              onSubmit={handleSearch}
              className="flex items-center max-w-md mx-auto"
            >
              <input
                type="text"
                placeholder="Search movies, theaters..."
                className="flex-grow p-2 rounded-l text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-yellow-400 text-gray-900 p-2 px-4 rounded-r hover:bg-yellow-300"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Slide Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md md:hidden flex items-start justify-center pt-20 px-6">
          <div className="w-full max-w-sm bg-black/80 text-white rounded-xl shadow-xl p-6 space-y-4 animate-slide-in">
            <button
              className="absolute top-6 right-6 text-white hover:text-yellow-400 text-2xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaTimes />
            </button>

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-yellow-500/10 ${
                  isActive ? "text-yellow-400 font-semibold" : ""
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-yellow-500/10 ${
                  isActive ? "text-yellow-400 font-semibold" : ""
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Movies
            </NavLink>
            <NavLink
              to="/theaters"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-yellow-500/10 ${
                  isActive ? "text-yellow-400 font-semibold" : ""
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Theaters
            </NavLink>
            <NavLink
              to="/offers"
              className={({ isActive }) =>
                `block py-2 px-4 rounded hover:bg-yellow-500/10 ${
                  isActive ? "text-yellow-400 font-semibold" : ""
                }`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              Offers
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
