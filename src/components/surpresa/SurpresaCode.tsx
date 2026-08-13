import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { PrizeData } from "@/hooks/useSurpresa";

interface SurpresaCodeProps {
  prize: PrizeData;
  rewardCode: string;
  expiresAt: string;
  participantName: string;
  requireShare: boolean;
  shareCompleted: boolean;
  rewardStatus?: string;
  externalMenuUrl?: string;
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
    default:
      return prize.name;
  }
};

const SurpresaCode = ({
  prize,
  rewardCode,
  expiresAt,
  participantName,
  requireShare,
  shareCompleted,
  rewardStatus,
  externalMenuUrl,
}: SurpresaCodeProps) => {
  const [copied, setCopied] = useState(false);

  const isExpired = new Date(expiresAt) < new Date();
  const isRedeemed = rewardStatus === "redeemed";
  const isPendingShare = requireShare && !shareCompleted && rewardStatus === "pending_share";
  const isPendingValidation = rewardStatus === "pending_validation";
  const isValidated = rewardStatus === "validated";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(rewardCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = rewardCode;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = () => {
    if (isRedeemed) return { text: "Resgatado ✅", color: "bg-green-100 text-green-700" };
    if (isExpired) return { text: "Expirado ⏰", color: "bg-red-100 text-red-700" };
    if (isPendingShare) return { text: "Aguardando compartilhamento 📲", color: "bg-yellow-100 text-yellow-700" };
    if (isPendingValidation) return { text: "Aguardando validação ⏳", color: "bg-blue-100 text-blue-700" };
    if (isValidated) return { text: "Validado ✨", color: "bg-green-100 text-green-700" };
    return { text: "Ativo", color: "bg-green-100 text-green-700" };
  };

  const status = getStatusBadge();

  return (
    <motion.div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Prize recap */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <span className="text-5xl">{prize.emoji}</span>
        <h2 className="font-heading text-xl md:text-2xl font-bold text-chocolate-deep mt-2">
          {formatPrizeDisplay(prize)}
        </h2>
        <p className="font-body text-sm text-chocolate-light mt-1">{prize.description}</p>
      </motion.div>

      {/* Status badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-body font-semibold mb-6 ${status.color}`}
      >
        {status.text}
      </motion.div>

      {/* Code card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="w-full max-w-sm rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFF8F0 0%, #FFEBD6 100%)",
          border: "2px dashed hsl(34 47% 60%)",
        }}
      >
        <p className="font-body text-xs text-chocolate-light/60 uppercase tracking-wider mb-2">
          Seu código exclusivo
        </p>

        <div className="flex items-center justify-center gap-3">
          <span
            className="font-mono text-2xl md:text-3xl font-bold tracking-widest text-chocolate-deep"
            style={{ letterSpacing: "0.15em" }}
          >
            {rewardCode}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyCode}
          className="mt-3 px-6 py-2 rounded-lg text-sm font-body font-semibold text-white transition-all"
          style={{
            background: copied
              ? "hsl(150 60% 45%)"
              : "linear-gradient(135deg, hsl(34 47% 60%), hsl(34 40% 50%))",
          }}
          id="surpresa-copy-btn"
        >
          {copied ? "✅ Copiado!" : "📋 Copiar código"}
        </motion.button>

        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold/30 rounded-tl-md" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold/30 rounded-tr-md" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold/30 rounded-bl-md" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold/30 rounded-br-md" />
      </motion.div>

      {/* Validity info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-sm space-y-2 mb-8"
      >
        {!isExpired && !isRedeemed && (
          <p className="text-sm text-chocolate-light font-body">
            ⏰ Válido até <strong>{formatDate(expiresAt)}</strong>
          </p>
        )}

        {prize.min_purchase > 0 && (
          <p className="text-sm text-chocolate-light font-body">
            🛒 Compra mínima: <strong>R$ {Number(prize.min_purchase).toFixed(2).replace(".", ",")}</strong>
          </p>
        )}

        {isExpired && (
          <p className="text-sm text-red-500 font-body font-semibold">
            ⏰ Seu prêmio expirou em {formatDate(expiresAt)}.
          </p>
        )}

        {isRedeemed && (
          <p className="text-sm text-green-600 font-body font-semibold">
            ✅ Este prêmio já foi resgatado.
          </p>
        )}

        {isPendingValidation && (
          <p className="text-sm text-blue-600 font-body">
            ⏳ Estamos verificando seu compartilhamento. Assim que validarmos, o código estará ativo!
          </p>
        )}
      </motion.div>

      {/* CTA: New order */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="w-full max-w-sm space-y-3"
      >
        <h3 className="font-heading text-xl font-bold text-chocolate-deep mb-3">
          {externalMenuUrl ? "🍰 UTILIZE SEU CUPOM NO NOSSO CARDÁPIO" : "🍰 AGORA VAMOS ESCOLHER SEU PEDIDO?"}
        </h3>

        {externalMenuUrl ? (
          <a
            href={externalMenuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-xl font-body font-bold text-lg text-white shadow-lg text-center transition-all hover:brightness-105"
            style={{
              background: "linear-gradient(135deg, hsl(34 47% 60%), hsl(34 40% 50%))",
            }}
            id="surpresa-menu-btn"
          >
            IR PARA O CARDÁPIO 🍰
          </a>
        ) : (
          <>
            <Link
              to="/cardapio"
              className="block w-full py-4 rounded-xl font-body font-bold text-lg text-white shadow-lg text-center"
              style={{
                background: "linear-gradient(135deg, hsl(34 47% 60%), hsl(34 40% 50%))",
              }}
              id="surpresa-menu-btn"
            >
              VER CARDÁPIO 🍰
            </Link>

            <Link
              to="/montar-pedido"
              className="block w-full py-3.5 rounded-xl font-body font-bold text-base text-chocolate-deep border-2 border-gold/40 bg-cream/50 hover:bg-peach/30 transition-colors text-center"
              id="surpresa-order-btn"
            >
              MONTAR MEU PEDIDO 🎂
            </Link>
          </>
        )}
      </motion.div>

      {/* Footer info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-8 text-xs text-chocolate-light/40 font-body max-w-xs"
      >
        {externalMenuUrl 
          ? "Copie o código acima e insira no campo de cupom ao finalizar o seu pedido no nosso cardápio digital."
          : "Apresente este código ao fazer seu pedido. O prêmio é pessoal e intransferível."}
      </motion.p>
    </motion.div>
  );
};

export default SurpresaCode;
