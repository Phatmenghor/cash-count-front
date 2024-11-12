"use client";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import "aos/dist/aos.css";
import ReduxProvider from "./ReduxProvider";
import { ToastContainer } from "react-toastify";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
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
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
