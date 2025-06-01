const AboutPage = () => {
  return (
    <div className="bg-black min-h-screen text-white p-8 mx-auto pt-15 w-full px-4 sm:px-14 max-w-7xl">
      <h1 className="font-prata text-4xl font-bold mb-6">About Us</h1>

      <p className="text-lg leading-relaxed mb-6">
        Welcome to MovieHub — your go-to platform for discovering the latest
        movies, checking showtimes, and snagging the best ticket deals near you.
      </p>

      <p className="text-lg leading-relaxed mb-6">
        Our mission is to bring movie lovers closer to the magic of cinema by
        offering a seamless ticket booking experience, personalized
        recommendations, and exclusive offers on snacks and combos.
      </p>

      <p className="text-lg leading-relaxed mb-6">
        We are passionate about movies and technology, and our team works
        tirelessly to keep the app updated with the latest releases, theater
        information, and promotions.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-300">
        <li>
          <strong>Kelvin Ewurum</strong> – Founder & Lead Developer
        </li>
        <li>
          <strong>kelvin Ewurum</strong> – UI/UX Designer
        </li>
        <li>
          <strong>kelvin Ewurum</strong> – Backend Engineer
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Contact Us</h2>
      <p className="text-lg leading-relaxed">
        Have questions or feedback? Reach out to us at{" "}
        <a href="kelvinewurum@gmail.com" className="text-blue-500 hover:underline">
          support@moviehub.com
        </a>
        .
      </p>
    </div>
  );
};

export default AboutPage;
