const Footer = () => {
  return (
    <footer className="bg-gray-400 z-50 right-0 text-gray-300 py-3 transition-colors duration-300 hover:bg-gray-500">
      <div className="container mx-auto text-center">
        <p className="text-xs md:text-sm text-white">
          Powered by{" "}
          <span className="font-semibold underline decoration-gray-200">
            CP Bank | IT Development
          </span>
          {" | "}
          <span className="text-gray-200">
            &copy; {new Date().getFullYear()}
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
