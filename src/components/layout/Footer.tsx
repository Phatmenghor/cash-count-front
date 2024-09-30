import { FaBuilding, FaCode } from "react-icons/fa"; // Importing icons from FontAwesome

const Footer = () => {
  return (
    <footer className="bg-gray-400 text-gray-300 py-2">
      <div className="container mx-auto text-center">
        <p className="text-sm text-white flex items-center justify-center gap-2">
          <FaBuilding className="text-white" /> {/* Bank icon */}
          Powered by{" "}
          <span className="font-semibold text-white">
            CP Bank | IT Development
          </span>
          <FaCode className="text-white" /> {/* Code icon */}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
