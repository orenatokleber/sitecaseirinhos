import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
  shape: "circle" | "rect" | "star";
}

const COLORS = [
  "#E8A87C", "#F4A460", "#DDA0DD", "#FFB6C1", "#87CEEB",
  "#FFD700", "#FF69B4", "#85CDCA", "#D4A574", "#8B6F47",
];

const createParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 10,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    shape: (["circle", "rect", "star"] as const)[Math.floor(Math.random() * 3)],
  }));
};

const ConfettiCelebration = ({ active = true }: { active?: boolean }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      setParticles(createParticles(50));
      // Regenerate particles for continuous effect
      const interval = setInterval(() => {
        setParticles(createParticles(30));
      }, 3000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={`${p.id}-${Math.random()}`}
          className="absolute"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.shape === "rect" ? p.size * 0.6 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "star" ? "2px" : "2px",
          }}
          initial={{
            y: p.y,
            rotate: p.rotation,
            opacity: 1,
            scale: 0,
          }}
          animate={{
            y: "110vh",
            rotate: p.rotation + 720,
            opacity: [1, 1, 0.8, 0],
            scale: [0, 1, 1, 0.5],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiCelebration;
