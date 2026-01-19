import { motion } from "framer-motion";

export function SectionTitle({ 
  kicker, 
  title, 
  desc,
  kickerColor = "cyan" // Default to cyan, can be: cyan, green, purple, orange, red
}: { 
  kicker: string; 
  title: string; 
  desc?: string;
  kickerColor?: "cyan" | "green" | "purple" | "orange" | "red";
}) {
  const colorMap = {
    cyan: "border-cyan-400/20 bg-cyan-400/5 text-cyan-300",
    green: "border-green-400/20 bg-green-400/5 text-green-300",
    purple: "border-purple-400/20 bg-purple-400/5 text-purple-300",
    orange: "border-orange-400/20 bg-orange-400/5 text-orange-300",
    red: "border-red-400/20 bg-red-400/5 text-red-300",
  };

  const colors = colorMap[kickerColor];

  return (
    <div className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`inline-block rounded-full border px-4 py-1.5 text-xs font-semibold ${colors}`}>
          {kicker}
        </div>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-4 text-3xl font-bold text-white md:text-4xl"
      >
        {title}
      </motion.h2>
      {desc ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-3 text-white/70 md:text-lg"
        >
          {desc}
        </motion.p>
      ) : null}
    </div>
  );
}
