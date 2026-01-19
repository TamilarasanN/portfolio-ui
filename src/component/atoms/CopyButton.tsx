"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "../interactive/MagneticButton";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <MagneticButton
        variant="ghost"
        ariaLabel={`Copy ${label}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
          } catch {}
        }}
        className={copied ? "border-green-400/30 bg-green-400/10 text-green-300" : ""}
      >
        <motion.span
          animate={copied ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </motion.span>
        <span>{copied ? "Copied!" : `Copy ${label}`}</span>
      </MagneticButton>
    </motion.div>
  );
}
