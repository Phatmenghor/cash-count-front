// src/hocs/withAnimation.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

// Animation variants
const variants = {
  initial: { opacity: 0, y: 50 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};

const withAnimation = (WrappedComponent: React.FC) => {
  const AnimatedComponent: React.FC = (props) => {
    return (
      <motion.div
        initial="initial"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.5 }}
      >
        <WrappedComponent {...props} />
      </motion.div>
    );
  };

  return AnimatedComponent;
};

export default withAnimation;
