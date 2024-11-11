"use client";

import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import MenuSidebar from "@/components/sidebar/MenuSidebar";
import Navbar from "@/components/layout/Navbar";
import Aos from "aos";
import "aos/dist/aos.css";
import Head from "next/head";

export default function LayoutWithSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    Aos.init({ duration: 1000, once: true, easing: "ease-out" });
  }, []);

  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="flex h-screen container">
        {/* Toast container should be outside of your main layout content */}
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
        <MenuSidebar />
        <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-y-scroll flex flex-col pb-16">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
