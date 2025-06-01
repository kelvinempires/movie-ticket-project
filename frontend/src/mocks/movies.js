// src/mocks/movies.js
export const mockMovies = {
  nowPlaying: [
    {
      id: 1,
      title: "Dune: Part Two",
      poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/w1280/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      rating: 8.5,
      duration: 166,
      genre: "Sci-Fi, Adventure",
      genres: ["Sci-Fi", "Adventure"],
      description:
        "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
      releaseDate: "2024-03-01",
      showtimes: [
        {
          date: "2024-04-15",
          times: ["10:00", "13:30", "17:00", "20:30"],
          theater: "Cineplex Downtown",
        },
        {
          date: "2024-04-16",
          times: ["10:30", "14:00", "17:30", "21:00"],
          theater: "Cineplex Downtown",
        },
      ],
      price: 12.99,
    },
    {
      id: 2,
      title: "Godzilla x Kong: The New Empire",
      poster: "https://image.tmdb.org/t/p/w500/tmFN5vSzo7QkZxCmQ7e2a5Z1wja.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/w1280/lzWHmYdfeFiMIY4JaMmtR7GEli3.jpg",
      rating: 7.2,
      duration: 115,
      genre: "Action, Sci-Fi",
      genres: ["Action", "Sci-Fi"],
      description:
        "The epic next chapter in the cinematic Monsterverse pits two of the greatest icons against each other.",
      releaseDate: "2024-03-29",
      showtimes: [
        {
          date: "2024-04-15",
          times: ["11:00", "14:30", "18:00", "21:30"],
          theater: "IMAX City Center",
        },
      ],
      price: 14.99,
    },
  ],
  comingSoon: [
    {
      id: 101,
      title: "Furiosa: A Mad Max Saga",
      poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/w1280/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      rating: 0,
      duration: 120,
      genre: "Action, Adventure",
      genres: ["Action", "Adventure"],
      description:
        "The origin story of renegade warrior Furiosa before her encounter and teamup with Mad Max.",
      releaseDate: "2024-05-24",
      showtimes: [],
      price: 0,
    },
  ],
};

export const getMovieById = (id) => {
  const allMovies = [...mockMovies.nowPlaying, ...mockMovies.comingSoon];
  return allMovies.find((movie) => movie.id === parseInt(id));
};

// src/mocks/offers.js
export const offers = [
  {
    id: 1,
    title: "Student Discount",
    description: "20% off for students every Thursday",
    code: "STUDENT20"
  },
  // Add more offers...
];

export const theaters = [
  { id: 1,name: "Cineplex Downtown",location: "123 Main St",facilities: ["IMAX", "Dolby Atmos", "Food Court"],},
  { id: 2, name: "IMAX City Center", location: "456 Central Ave", facilities: ["IMAX", "3D"] },
  { id: 3, name: "Starlight Cinemas", location: "789 Park Blvd", facilities: ["4DX", "VIP Seating"] },
  { id: 4, name: "Galaxy Theaters", location: "101 Galaxy Rd", facilities: ["Standard", "Food Court"] },
  { id: 5, name: "Cineworld Plaza", location: "202 Plaza St", facilities: ["IMAX", "Dolby Atmos"] },
];
