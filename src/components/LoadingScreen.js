import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      className="loading-animation"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '4px solid transparent',
          borderTopColor: '#3b82f6',
          borderBottomColor: '#3b82f6',
        }}
      />
    </motion.div>
  );
};

export default LoadingScreen;
