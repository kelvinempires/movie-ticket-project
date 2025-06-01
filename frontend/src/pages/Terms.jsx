const TermsAndConditions = () => {
  return (
    <div className="bg-black min-h-screen text-white p-8 px-4 sm:px-20 mx-auto pt-15 w-full">
      <h1 className="font-prata text-4xl font-bold mb-8">Terms & Conditions</h1>

      <p className="mb-4 text-gray-300">
        Welcome to MovieHub. By accessing or using our services, you agree to be
        bound by the following terms and conditions.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Use of Service</h2>
      <p className="mb-4 text-gray-300">
        You agree to use our service only for lawful purposes and in a way that
        does not infringe the rights of others.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Intellectual Property
      </h2>
      <p className="mb-4 text-gray-300">
        All content provided is the property of MovieHub or its licensors. You
        may not reproduce or distribute without permission.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">
        Limitation of Liability
      </h2>
      <p className="mb-4 text-gray-300">
        We provide the service “as is” and disclaim all warranties. We are not
        liable for damages arising from your use of the service.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Changes to Terms</h2>
      <p className="mb-4 text-gray-300">
        We may update these terms at any time. Continued use means you accept
        the new terms.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Governing Law</h2>
      <p className="mb-4 text-gray-300">
        These terms are governed by the laws of the applicable jurisdiction.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Contact Us</h2>
      <p className="mb-4 text-gray-300">
        For questions, contact{" "}
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

export default TermsAndConditions;
