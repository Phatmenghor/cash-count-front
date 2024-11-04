"use client";

import "../globals.css";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/layout/Navbar";
import MenuSidebar from "@/components/sidebar/MenuSidebar";
import { useEffect } from "react";
import AOS from "aos";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      easing: "ease-in-out", // Easing function for the animation
      once: false, // Whether animation should happen only once (scroll down)
      mirror: false, // Whether elements should animate out while scrolling past them
      anchorPlacement: "top-bottom", // Defines which position of the element should be used as the anchor
    });
  }, []);

  return (
    <div className="flex h-screen container">
      <MenuSidebar />
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA]  overflow-y-scroll flex flex-col py-16">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
