import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import WatchNow from "./pages/watchNow";
import BookTicketPage from "./pages/BookTicketPage";
import Confirmation from "./pages/Confirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Movies from "./pages/Movies";
import Theaters from "./pages/Theaters";
import Offers from "./pages/Offers";
import Navbar from "./components/NavBar";
import TermsAndConditions from "./pages/Terms";
import PrivacyPolicy from "./pages/Privacy";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import EmailVerify from "./pages/EmailVerify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import Checkout from "./pages/Checkout";

const App = () => {
  return (
    <div className="text-[#e2e2e2] bg h-full flex flex-col">
      <ToastContainer />
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="email-verify" element={<EmailVerify />} />
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/theaters" element={<Theaters />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/checkout" element={<Checkout />} /> */}
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/tv/:id" element={<MovieDetails />} />
          <Route path="/watch-movie/:id" element={<WatchNow />} />
          <Route path="/watch-tv/:id" element={<WatchNow />} />
          <Route path="/book-ticket/:movieId" element={<BookTicketPage />} />
          <Route path="/confirmation/:id" element={<Confirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

