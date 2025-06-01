import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errs.email = "Invalid email address";
    }
    if (!formData.message.trim()) errs.message = "Message cannot be empty";
    return errs;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // Here you would normally send data to backend or email service
      console.log("Form data submitted:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } else {
      setErrors(validationErrors);
      setSubmitted(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center p-8 pt-15">
      <h1 className="font-prata text-4xl font-bold mb-8">Contact Us</h1>

      <p className="max-w-xl text-center mb-6 text-gray-400">
        Have questions or want to give feedback? Fill out the form below and
        we’ll get back to you as soon as possible.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-900 p-8 rounded-lg shadow-lg"
        noValidate
      >
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 font-semibold">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`w-full p-3 rounded bg-gray-800 border ${
              errors.name ? "border-red-500" : "border-gray-700"
            } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 mt-1 text-sm">{errors.name}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`w-full p-3 rounded bg-gray-800 border ${
              errors.email ? "border-red-500" : "border-gray-700"
            } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block mb-2 font-semibold">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            className={`w-full p-3 rounded bg-gray-800 border ${
              errors.message ? "border-red-500" : "border-gray-700"
            } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && (
            <p className="text-red-500 mt-1 text-sm">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-3 rounded font-semibold text-lg"
        >
          Send Message
        </button>

        {submitted && (
          <p className="mt-4 text-green-400 font-semibold text-center">
            Thank you! Your message has been sent.
          </p>
        )}
      </form>

      <div className="mt-12 max-w-lg text-center text-gray-400">
        <p>
          Email:{" "}
          <a
            href="mailto:support@moviehub.com"
            className="text-blue-500 hover:underline"
          >
            support@moviehub.com
          </a>
        </p>
        <p className="mt-2">Phone: +1 234 567 8900</p>
        <p className="mt-2">Address: 123 Movie St, Cinema City, USA</p>
      </div>
    </div>
  );
};

export default ContactPage;
