"use client";
import "../globals.css";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Aos from "aos";
import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
      easing: "ease-out",
    });
  }, []);

  return (
    <html lang="en" className="overflow-y-auto">
      <Head>
        <link rel="icon" href="../favicon.ico" />
        
      </Head>
      <body className="antialiased min-h-screen overflow-y-auto">
        <ToastContainer
          position="top-right"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="bg-[#F7F8FA] min-h-screen pb-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
