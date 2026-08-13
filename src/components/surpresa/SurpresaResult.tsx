import { motion } from "framer-motion";
import type { PrizeData } from "@/hooks/useSurpresa";
import ConfettiCelebration from "./ConfettiCelebration";

interface SurpresaResultProps {
  prize: PrizeData;
  rewardCode: string;
  expiresAt: string;
  onContinue: () => void;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatPrizeDisplay = (prize: PrizeData): string => {
  switch (prize.prize_type) {
    case "discount_fixed":
      return `R$ ${Number(prize.value).toFixed(0)} OFF`;
    case "discount_pct":
      return `${Number(prize.value).toFixed(0)}% OFF`;
    case "free_product":
      return `${prize.product_name} GRÁTIS`;
    case "free_shipping":
      return "FRETE GRÁTIS";
    case "bonus_points":
      return `+${Number(prize.value).toFixed(0)} PONTOS`;
    case "special":
      return "PRÊMIO ESPECIAL";
    default:
      return prize.name;
  }
};

const SurpresaResult = ({ prize, rewardCode, expiresAt, onContinue }: SurpresaResultProps) => {
  return (
    <motion.div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12 text-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ConfettiCelebration active />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="text-7xl mb-4"
      >
        🎉
      </motion.div>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-heading text-3xl md:text-4xl font-bold text-chocolate-deep mb-2"
      >
        PARABÉNS!
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="font-body text-lg text-chocolate-light mb-6"
      >
        Você ganhou:
      </motion.p>

      {/* Prize card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
        className="w-full max-w-sm rounded-3xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${prize.color}dd, ${prize.color}99)`,
          boxShadow: `0 10px 40px ${prize.color}40`,
        }}
      >
        {/* Decorative shimmer */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />

        <div className="relative z-10">
          <span className="text-5xl">{prize.emoji}</span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mt-3 mb-1">
            {formatPrizeDisplay(prize)}
          </h2>
          <p className="font-body text-white/80 text-sm">{prize.description}</p>
        </div>
      </motion.div>

      {/* Rules */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="w-full max-w-sm space-y-2 mb-8"
      >
        <div className="flex items-center gap-2 justify-center text-sm text-chocolate-light font-body">
          <span>⏰</span>
          <span>
            Válido até <strong>{formatDate(expiresAt)}</strong>
          </span>
        </div>

        {prize.min_purchase > 0 && (
          <div className="flex items-center gap-2 justify-center text-sm text-chocolate-light font-body">
            <span>🛒</span>
            <span>
              Compra mínima: <strong>R$ {Number(prize.min_purchase).toFixed(2).replace(".", ",")}</strong>
            </span>
          </div>
        )}
      </motion.div>

      {/* Continue button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.3 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        className="w-full max-w-sm py-4 rounded-xl font-body font-bold text-lg text-white shadow-lg"
        style={{
          background: "linear-gradient(135deg, hsl(34 47% 60%), hsl(34 40% 50%))",
        }}
        id="surpresa-continue-btn"
      >
        CONTINUAR 🎁
      </motion.button>
    </motion.div>
  );
};

export default SurpresaResult;
