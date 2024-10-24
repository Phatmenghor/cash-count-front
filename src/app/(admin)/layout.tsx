"use client";
import "react-toastify/dist/ReactToastify.css";
import localFont from "next/font/local";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
  return (
    <html lang="en">
      <head>
        <title>Your App Title</title>
        <meta name="description" content="Description of your app" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased "`}
      >
        <Navbar />
        <main className="flex flex-col min-h-screen pt-12">{children}</main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
