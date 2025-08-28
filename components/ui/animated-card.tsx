'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  whileHover?: boolean;
}

export default function AnimatedCard({ 
  children, 
  className = "", 
  delay = 0,
  whileHover = true 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay * 0.1,
        ease: "easeOut"
      }}
      whileHover={whileHover ? {
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedStatsCard({ 
  children, 
  className = "", 
  delay = 0 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: delay * 0.1,
        ease: "easeOut"
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedProgressBar({ 
  progress, 
  className = "" 
}: { progress: number; className?: string }) {
  return (
    <div className={`w-full bg-neutral-200 rounded-full h-2 overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}
