"use client";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import MenuSidebar from "@/components/sidebar/MenuSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <MenuSidebar />

      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col py-16">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
