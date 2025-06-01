import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { options } from "../services/omdbApi";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();

  // Debounced function for real-time search
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/multi?query=${query}&language=en-US`,
          options
        );
        setResults(response.data.results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleResultClick = (item) => {
    const path =
      item.media_type === "tv"
        ? `/watch-tv/${item.id}`
        : `/watch-movie/${item.id}`;
    navigate(path);
    setQuery(""); // Clear search bar
    setResults([]); // Clear results
  };

  const toggleSearchBar = () => {
    setExpanded((prev) => !prev);
    if (!expanded) setQuery(""); // Reset query when closing the search bar
  };

  return (
    <div className="flex justify-end items-end">
      {/* Search Button */}
      <button
        onClick={toggleSearchBar}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        {expanded ? "Close Search" : "Search"}
      </button>

      {/* Retractable Search Bar */}
      {expanded && (
        <div className="absolute top-12 w-full max-w-3xl bg-gray-900 text-white p-4 rounded-lg shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, TV shows, or actors..."
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Search Results */}
          {loading ? (
            <p className="text-gray-400 mt-4">Searching...</p>
          ) : (
            <ul className="mt-4">
              {results.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleResultClick(item)}
                  className="p-2 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition flex items-center gap-4"
                >
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={item.title || item.name}
                    className="w-12 h-18 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold">
                      {item.title || item.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {item.media_type === "movie"
                        ? "Movie"
                        : item.media_type === "tv"
                        ? "TV Show"
                        : "Unknown"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* No Results */}
          {!loading && results.length === 0 && query.trim() && (
            <p className="text-gray-400 mt-4">No results found for {query}.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
