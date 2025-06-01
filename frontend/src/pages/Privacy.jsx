const PrivacyPolicy = () => {
  return (
    <div className="bg-black min-h-screen text-white p-8 w-full mx-auto pt-15 px-4 sm:px-20">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <p className="mb-4 text-gray-300">
        Your privacy is important to us. This Privacy Policy explains how we
        collect, use, disclose, and safeguard your information when you visit
        our application.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Information We Collect
      </h2>
      <p className="mb-4 text-gray-300">
        We may collect personal information such as your name, email address,
        and usage data when you interact with our service.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        How We Use Your Information
      </h2>
      <p className="mb-4 text-gray-300">
        We use the information to provide, maintain, and improve our services,
        communicate with you, and ensure security.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Cookies</h2>
      <p className="mb-4 text-gray-300">
        We use cookies and similar tracking technologies to enhance your
        experience on our site.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Third-Party Services</h2>
      <p className="mb-4 text-gray-300">
        We may share your information with trusted third parties to provide the
        services you request.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Your Choices</h2>
      <p className="mb-4 text-gray-300">
        You may update or delete your information by contacting us, and control
        cookie preferences in your browser.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Contact Us</h2>
      <p className="mb-4 text-gray-300">
        If you have questions about this policy, please contact us at{" "}
        <a
          href="mailto:support@moviehub.com"
          className="text-blue-500 hover:underline"
        >
          support@moviehub.com
        </a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
