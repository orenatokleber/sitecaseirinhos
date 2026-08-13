import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { CampaignPrize, PrizeData } from "@/hooks/useSurpresa";

interface SurpresaWheelProps {
  prizes: CampaignPrize[];
  wonPrize: PrizeData;
  onSpinComplete: () => void;
}

const SPIN_DURATION = 5000; // 5 seconds
const EXTRA_ROTATIONS = 5; // Extra full rotations for dramatic effect

const SurpresaWheel = ({ prizes, wonPrize, onSpinComplete }: SurpresaWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const targetRotationRef = useRef(0);

  const segmentAngle = (2 * Math.PI) / prizes.length;

  const drawWheel = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;

    ctx.clearRect(0, 0, size, size);

    // Draw segments
    prizes.forEach((prize, i) => {
      const startAngle = i * segmentAngle + rotation;
      const endAngle = startAngle + segmentAngle;

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Emoji
      ctx.font = `${Math.max(16, radius * 0.12)}px sans-serif`;
      ctx.fillText(prize.emoji, radius * 0.55, -2);

      // Name (shortened)
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${Math.max(9, radius * 0.07)}px 'Nunito', sans-serif`;
      const displayName = prize.name.length > 14 ? prize.name.slice(0, 12) + "…" : prize.name;
      ctx.fillText(displayName, radius * 0.55, 12);

      ctx.restore();
    });

    // Center circle
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, 30);
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(1, "#f0e6d6");
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = "hsl(34 47% 60%)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center emoji
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🍰", center, center);

    // Outer ring
    ctx.beginPath();
    ctx.arc(center, center, radius + 3, 0, 2 * Math.PI);
    ctx.strokeStyle = "hsl(34 47% 60%)";
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw pegs around the wheel
    for (let i = 0; i < prizes.length; i++) {
      const angle = i * segmentAngle + rotation;
      const pegX = center + (radius + 2) * Math.cos(angle);
      const pegY = center + (radius + 2) * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(pegX, pegY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "hsl(34 30% 50%)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [prizes, segmentAngle]);

  // Initial draw
  useEffect(() => {
    drawWheel(0);
  }, [drawWheel]);

  // Start spin animation
  useEffect(() => {
    if (!spinning) return;

    // Find the index of the won prize
    const wonIndex = prizes.findIndex((p) => p.id === wonPrize.id);
    if (wonIndex === -1) return;

    // Calculate target angle: the pointer is at the TOP (-π/2 or 3π/2)
    // We need the winning segment centered at the top
    // Segment center angle = wonIndex * segmentAngle + segmentAngle/2
    // Target: -(wonIndex * segmentAngle + segmentAngle/2) + π/2 (to align with top)
    // Plus extra full rotations
    const targetSegmentCenter = wonIndex * segmentAngle + segmentAngle / 2;
    const targetAngle = -(targetSegmentCenter) - Math.PI / 2 + EXTRA_ROTATIONS * 2 * Math.PI;

    targetRotationRef.current = targetAngle;
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / SPIN_DURATION, 1);

      // Easing: cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);

      const rotation = eased * targetAngle;
      setCurrentRotation(rotation);
      drawWheel(rotation);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin complete
        setTimeout(onSpinComplete, 500);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [spinning, prizes, wonPrize, drawWheel, onSpinComplete, segmentAngle]);

  // Auto-start spin
  useEffect(() => {
    const timer = setTimeout(() => setSpinning(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const canvasSize = Math.min(typeof window !== "undefined" ? window.innerWidth - 48 : 340, 380);

  return (
    <motion.div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-heading text-2xl md:text-3xl font-bold text-chocolate-deep text-center mb-6"
      >
        {spinning ? "Girando..." : "Preparando sua sorte..."}
      </motion.h2>

      {/* Wheel container with pointer */}
      <div className="relative">
        {/* Pointer (triangle at top) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: "24px solid hsl(34 47% 55%)",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />
        </div>

        {/* Canvas */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="rounded-full"
            style={{
              filter: spinning
                ? "drop-shadow(0 0 20px rgba(232, 168, 124, 0.3))"
                : "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
            }}
          />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: spinning ? 1 : 0.5 }}
        className="mt-6 text-sm text-chocolate-light/60 font-body text-center"
      >
        {spinning ? "✨ Boa sorte! ✨" : "A roleta vai girar em instantes..."}
      </motion.p>
    </motion.div>
  );
};

export default SurpresaWheel;
