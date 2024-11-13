"use client";

import { motion } from "framer-motion";
import { route } from "@/constants/routed";
import { UserRoleEnum } from "@/constants/userRole";
import TokenStorage from "@/utils/localStorage/tokenStorage";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function App() {
  const router = useRouter();

  // Check if the token exists
  if (!TokenStorage.getToken()) {
    router.push(`/${route.LOGIN}`);
    return;
  }

  // Redirect based on the user role
  if (
    UserRoleStorage.getUserRole() == UserRoleEnum.IT_ADMIN_USER ||
    UserRoleStorage.getUserRole() == UserRoleEnum.OPERATION_ADMIN_USER
  ) {
    router.push(`/${route.USER_MANAGEMENT}`);
  } else {
    router.push("/cash-management");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen  text-white overflow-hidden">
      {/* Logo Animation */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        <Image
          src="/img/images.png" // Path to your image
          alt="Logo"
          width={500} // You can specify a width (or use dynamic sizing)
          height={281} // Use dynamic height if necessary
          className="w-[35vw] h-auto" // Tailwind styles can still be applied
        />
      </motion.div>

      {/* Heading Animation */}
      <motion.h1
        className="text-4xl font-bold text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        Welcome to Our Website!
      </motion.h1>

      {/* Subheading Animation */}
      <motion.p
        className="text-lg mt-4 text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        Get ready for an amazing experience.
      </motion.p>
    </div>
  );
}
