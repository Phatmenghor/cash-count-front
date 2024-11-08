"use client";

import "../globals.css";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import MenuSidebar from "@/components/sidebar/MenuSidebar";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import Aos from "aos";
import Navbar from "@/components/layout/Navbar";
import { ToastContainer } from "react-toastify";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
      easing: "ease-out",
    });
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen container">
          <MenuSidebar />
          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-y-scroll flex flex-col pb-16">
            <Navbar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
