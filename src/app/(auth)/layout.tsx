"use client";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import "aos/dist/aos.css";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import Aos from "aos";
import { ToastContainer } from "react-toastify";

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
      <body className={`antialiased min-h-screen flex flex-col`}>
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
