// src/components/Sidebar.tsx
import { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaInfoCircle,
  FaServicestack,
  FaEnvelope,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 mt-12 left-0 bg-white shadow-lg transform transition-all duration-300
                    ${isOpen ? "w-64" : "w-20"}`}
      >
        <button className="text-gray-600 p-2 m-4" onClick={toggleSidebar}>
          {isOpen ? "Close" : "Open"}
        </button>
        <nav className="mt-8">
          <ul className="space-y-4">
            <li>
              <Link href="/" className="flex items-center space-x-2">
                <FaHome className="text-gray-600" size={24} />
                {isOpen && <span className="text-gray-800">Home</span>}
              </Link>
            </li>
            <li>
              <Link href="/about" className="flex items-center space-x-2">
                <FaInfoCircle className="text-gray-600" size={24} />
                {isOpen && <span className="text-gray-800">About</span>}
              </Link>
            </li>
            <li>
              <Link href="/services" className="flex items-center space-x-2">
                <FaServicestack className="text-gray-600" size={24} />
                {isOpen && <span className="text-gray-800">Services</span>}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="flex items-center space-x-2">
                <FaEnvelope className="text-gray-600" size={24} />
                {isOpen && <span className="text-gray-800">Contact</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Main Content */}
      <div className={`ml-${isOpen ? "64" : "20"} p-4`}>
        {/* Page Content Goes Here */}
      </div>
    </div>
  );
};

export default Sidebar;
