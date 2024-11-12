"use client";

import { motion } from "framer-motion";
import { route } from "@/constants/routed";
import { UserRoleEnum } from "@/constants/userRole";
import TokenStorage from "@/utils/localStorage/tokenStorage";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function App() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(true);

  // Check if the token exists
  if (!TokenStorage.getToken() && !isAnimating) {
    router.push(`/${route.LOGIN}`);
    return;
  }

  // Redirect based on the user role
  if (
    (UserRoleStorage.getUserRole() == UserRoleEnum.IT_ADMIN_USER ||
      UserRoleStorage.getUserRole() == UserRoleEnum.OPERATION_ADMIN_USER) &&
    !isAnimating
  ) {
    router.push(`/${route.USER_MANAGEMENT}`);
  } else {
    router.push("/cash-management");
  }

  // Triggered when the animation is completed
  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen  text-white overflow-hidden">
      {/* Logo Animation */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        onAnimationComplete={handleAnimationComplete}
      >
        <img src="img/images.png" alt="Logo" className="w-[35vw] h-auto" />
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
        onAnimationComplete={handleAnimationComplete}
      >
        Get ready for an amazing experience.
      </motion.p>
    </div>
  );
}
