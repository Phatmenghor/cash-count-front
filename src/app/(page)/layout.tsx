"use client";
import localFont from "next/font/local";
import "../globals.css";
import Navbar from "@/components/navbar/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// import { ToastContainer } from "react-toastify";

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
  return (
    <html lang="en">
      <head>
        <title>Your App Title</title>
        <meta name="description" content="Description of your app" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Navbar />
        <div style={{ paddingTop: "64px" }}>
          {/* Adjust this value based on your Navbar height */}
          {children}
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}
