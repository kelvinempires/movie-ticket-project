import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { FaFilm } from "react-icons/fa6";

const Header = () => {
  return (
    <header className="pt-4 pb-2 shadow-md px-4 sm:px-14 fixed z-30 w-full">
      <div className=" container mx-auto flex flex-wrap items-center justify-between">
        <Link
          to="/"
          className="flex items-center justify-start space-x-2"
        >
          <FaFilm className="text-2xl text-yellow-400" />
          <span className="text-lg sm:text-xl font-bold">CineBook</span>
        </Link>
        <div className="w-1/2">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
