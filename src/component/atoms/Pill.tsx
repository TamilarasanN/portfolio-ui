import React from "react";
import { motion } from "framer-motion";
import { cn } from "../utils";

interface PillProps {
  children: React.ReactNode;
  variant?: "cyan" | "green" | "purple" | "orange" | "red" | "blue";
}

const variantClasses = {
  cyan: "border-cyan-400/20 bg-cyan-400/5 text-cyan-300/90 hover:border-cyan-400/30 hover:bg-cyan-400/10",
  green: "border-green-400/20 bg-green-400/5 text-green-300/90 hover:border-green-400/30 hover:bg-green-400/10",
  purple: "border-purple-400/20 bg-purple-400/5 text-purple-300/90 hover:border-purple-400/30 hover:bg-purple-400/10",
  orange: "border-orange-400/20 bg-orange-400/5 text-orange-300/90 hover:border-orange-400/30 hover:bg-orange-400/10",
  red: "border-red-400/20 bg-red-400/5 text-red-300/90 hover:border-red-400/30 hover:bg-red-400/10",
  blue: "border-blue-400/20 bg-blue-400/5 text-blue-300/90 hover:border-blue-400/30 hover:bg-blue-400/10",
};

export function Pill({ children, variant = "cyan" }: PillProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs transition relative",
        variantClasses[variant]
      )}
    >
      {/* Subtle glow effect on hover */}
      <span className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity blur-sm bg-gradient-to-r from-transparent via-current to-transparent" />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </motion.span>
  );
}
