import { motion } from "framer-motion";

const dots = [
  { x: "8%", y: "15%", size: 8, color: "hsl(var(--primary))", delay: 0 },
  { x: "92%", y: "20%", size: 6, color: "hsl(var(--rose))", delay: 0.3 },
  { x: "15%", y: "80%", size: 10, color: "hsl(var(--peach))", delay: 0.6 },
  { x: "85%", y: "75%", size: 7, color: "hsl(var(--pink-medium))", delay: 0.2 },
  { x: "50%", y: "10%", size: 5, color: "hsl(var(--gold))", delay: 0.5 },
  { x: "75%", y: "90%", size: 9, color: "hsl(var(--primary))", delay: 0.4 },
  { x: "25%", y: "45%", size: 6, color: "hsl(var(--peach))", delay: 0.1 },
  { x: "65%", y: "35%", size: 4, color: "hsl(var(--rose))", delay: 0.7 },
];

const ConfettiDots = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
    {dots.map((dot, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          left: dot.x,
          top: dot.y,
          width: dot.size,
          height: dot.size,
          backgroundColor: dot.color,
          opacity: 0.5,
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: dot.delay,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default ConfettiDots;
