import { useState, } from "react";
import PropTypes from "prop-types";
// import axios from "axios";

const Dropdown = ({ movie }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="text-xl font-bold text-theme"
        >
          Movie Details
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div>
              <h2 className="text-white">Languages:</h2>
              {movie.spoken_languages.map((language) => (
                <span
                  key={language.iso_639_1}
                  className="text-zinc-400 text-sm block"
                >
                  {language.name}
                </span>
              ))}
            </div>
            <div>
              <h2 className="text-white">Budget:</h2>
              <span className="text-zinc-400 text-sm block">
                {movie.budget ? `$${movie.budget}` : "N/A"}
              </span>
            </div>
            <div>
              <h2 className="text-white">Revenue:</h2>
              <span className="text-zinc-400 text-sm block">
                {movie.revenue ? `$${movie.revenue}` : "N/A"}
              </span>
            </div>
            <div>
              <h2 className="text-white">Runtime:</h2>
              <span className="text-zinc-400 text-sm block">
                {movie.runtime ? `${movie.runtime} minutes` : "N/A"}
              </span>
            </div>
            <div>
              <h2 className="text-white">Status:</h2>
              <span className="text-zinc-400 text-sm block">
                {movie.status}
              </span>
            </div>
            <div>
              <h2 className="text-white">Tagline:</h2>
              <span className="text-zinc-400 text-sm block">
                {movie.tagline}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
Dropdown.propTypes = {
  movie: PropTypes.shape({
    spoken_languages: PropTypes.arrayOf(
      PropTypes.shape({
        iso_639_1: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    budget: PropTypes.number,
    revenue: PropTypes.number,
    runtime: PropTypes.number,
    status: PropTypes.string,
    tagline: PropTypes.string,
  }).isRequired,
};

export default Dropdown;
