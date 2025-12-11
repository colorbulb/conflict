import React from 'react';
import { motion } from 'framer-motion';

interface FloatingShapeProps {
  color: string;
  size: string;
  top: string;
  left: string;
  delay: number;
}

const FloatingShape: React.FC<FloatingShapeProps> = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`absolute rounded-full opacity-30 blur-3xl ${color}`}
      style={{ width: size, height: size, top, left, zIndex: -1 }}
      animate={{
        y: [0, -40, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    />
  );
};

export default FloatingShape;