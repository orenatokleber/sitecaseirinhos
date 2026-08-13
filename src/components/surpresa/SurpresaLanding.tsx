import { motion } from "framer-motion";

interface SurpresaLandingProps {
  onStart: () => void;
}

const SurpresaLanding = ({ onStart }: SurpresaLandingProps) => {
  return (
    <motion.div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12 text-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🍰", "🧁", "🍫", "🎂", "🍪", "🎁", "✨", "🌟"].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl md:text-3xl opacity-20"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${5 + (i * 15) % 85}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="text-7xl md:text-8xl mb-6"
      >
        🎁
      </motion.div>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="font-heading text-3xl md:text-5xl font-bold text-chocolate-deep leading-tight mb-4"
      >
        TEM UMA SURPRESA
        <br />
        <span className="text-gradient-gold">PARA VOCÊ!</span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-lg md:text-xl text-chocolate-light font-body max-w-md mb-10"
      >
        A Caseirinhos preparou um presente especial para você.
        Descubra o que ganhamos juntos! 🍰
      </motion.p>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(232, 168, 124, 0.4)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="relative px-10 py-5 rounded-2xl font-body font-bold text-lg md:text-xl text-white shadow-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(34 47% 60%), hsl(34 40% 50%))",
        }}
        id="surpresa-discover-btn"
      >
        <span className="relative z-10">DESCOBRIR MEU PRÊMIO 🍰</span>
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-sm text-chocolate-light/60 font-body"
      >
        🎉 Milhares de prêmios esperando por você
      </motion.p>
    </motion.div>
  );
};

export default SurpresaLanding;
