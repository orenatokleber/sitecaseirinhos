import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { PrizeData } from "@/hooks/useSurpresa";

interface SurpresaShareProps {
  prize: PrizeData;
  rewardCode: string;
  onShareCompleted: () => void;
  onSkip?: () => void;
  instagramHandle?: string;
}

const SurpresaShare = ({
  prize,
  rewardCode,
  onShareCompleted,
  onSkip,
  instagramHandle = "@caseirinhosaconfeitaria",
}: SurpresaShareProps) => {
  const shareCardRef = useRef<HTMLDivElement>(null);

  const formatPrizeText = (prize: PrizeData): string => {
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

  // Render the story artwork to a canvas
  const buildStoryCanvas = useCallback((): HTMLCanvasElement | null => {
    const canvas = document.createElement("canvas");
    // 9:16 aspect ratio for Stories
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
    gradient.addColorStop(0, "#FFF8F0");
    gradient.addColorStop(0.5, "#FFEBD6");
    gradient.addColorStop(1, "#FFF0E6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative circles
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(100, 300, 150, 0, Math.PI * 2);
    ctx.fillStyle = prize.color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(980, 1600, 200, 0, Math.PI * 2);
    ctx.fillStyle = "#E8A87C";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(900, 400, 120, 0, Math.PI * 2);
    ctx.fillStyle = "#DDA0DD";
    ctx.fill();
    ctx.globalAlpha = 1;

    // Top text
    ctx.fillStyle = "#5C3D2E";
    ctx.font = "bold 48px 'Nunito', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎉 EU GANHEI UMA", 540, 500);
    ctx.fillText("SURPRESA DA CASEIRINHOS!", 540, 560);

    // Prize display
    ctx.font = "120px sans-serif";
    ctx.fillText(prize.emoji, 540, 780);

    ctx.font = "bold 72px 'Nunito', sans-serif";
    ctx.fillStyle = "#5C3D2E";
    ctx.fillText("GANHEI", 540, 900);

    ctx.fillStyle = prize.color;
    ctx.font = "bold 80px 'Nunito', sans-serif";
    ctx.fillText(formatPrizeText(prize), 540, 1000);

    // Divider
    ctx.beginPath();
    ctx.moveTo(340, 1100);
    ctx.lineTo(740, 1100);
    ctx.strokeStyle = "#E8A87C";
    ctx.lineWidth = 3;
    ctx.stroke();

    // CTA
    ctx.fillStyle = "#8B6F47";
    ctx.font = "44px 'Nunito', sans-serif";
    ctx.fillText("Será que você também ganha? 🤔", 540, 1200);

    // Instagram handle
    ctx.fillStyle = "#D4A574";
    ctx.font = "bold 40px 'Nunito', sans-serif";
    ctx.fillText(instagramHandle, 540, 1400);

    // Brand
    ctx.fillStyle = "#5C3D2E";
    ctx.font = "italic 60px 'Dancing Script', cursive, sans-serif";
    ctx.fillText("Caseirinhos", 540, 1550);
    ctx.font = "28px 'Nunito', sans-serif";
    ctx.fillStyle = "#8B6F47";
    ctx.fillText("a Confeitaria", 540, 1600);

    // Hashtag
    ctx.fillStyle = "#D4A574";
    ctx.font = "32px 'Nunito', sans-serif";
    ctx.fillText("#SurpresaCaseirinhos", 540, 1750);

    return canvas;
  }, [prize, instagramHandle]);

  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
    new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));

  // Generate and download share image
  const downloadShareImage = useCallback(async () => {
    try {
      const canvas = buildStoryCanvas();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `surpresa-caseirinhos-${rewardCode}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error generating share image:", err);
    }
  }, [buildStoryCanvas, rewardCode]);

  // Share the image directly (native share sheet → Instagram Stories)
  const shareToInstagram = useCallback(async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    try {
      const canvas = buildStoryCanvas();
      const blob = canvas ? await canvasToBlob(canvas) : null;

      if (blob) {
        const file = new File([blob], `surpresa-caseirinhos-${rewardCode}.png`, {
          type: "image/png",
        });
        const nav = navigator as Navigator & {
          canShare?: (data: ShareData) => boolean;
        };
        if (nav.share && nav.canShare?.({ files: [file] })) {
          // Native sheet: user picks Instagram → Stories with the image ready
          await nav.share({
            files: [file],
            text: `Ganhei uma surpresa da Caseirinhos! ${instagramHandle} #SurpresaCaseirinhos`,
          });
          return;
        }
      }

      // Fallback: save the image, then open Instagram's story camera
      await downloadShareImage();
      if (isMobile) {
        window.location.href = "instagram://story-camera";
        setTimeout(() => {
          window.open("https://instagram.com", "_blank");
        }, 1200);
      } else {
        window.open("https://instagram.com", "_blank");
      }
    } catch (err) {
      // User cancelled the native sheet, or sharing failed
      if ((err as DOMException)?.name === "AbortError") return;
      console.error("Error sharing to Instagram:", err);
      window.open("https://instagram.com", "_blank");
    }
  }, [buildStoryCanvas, downloadShareImage, instagramHandle, rewardCode]);


  return (
    <motion.div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12 text-center"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="text-6xl mb-4"
      >
        📲
      </motion.div>

      <h2 className="font-heading text-2xl md:text-3xl font-bold text-chocolate-deep mb-2">
        FALTA SÓ UMA COISA!
      </h2>
      <p className="font-body text-chocolate-light mb-8 max-w-sm">
        Compartilhe sua surpresa nos Stories e libere seu prêmio.
      </p>

      {/* Preview of the share card */}
      <div
        ref={shareCardRef}
        className="w-full max-w-xs rounded-2xl p-5 mb-6 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFF8F0, #FFEBD6)",
          border: "2px solid rgba(232, 168, 124, 0.3)",
        }}
      >
        <p className="text-xs font-body text-chocolate-light mb-2">Preview do seu Story</p>
        <span className="text-4xl block mb-2">{prize.emoji}</span>
        <p className="font-heading text-lg font-bold text-chocolate-deep">
          {formatPrizeText(prize)}
        </p>
        <p className="text-xs font-body text-chocolate-light mt-1">{instagramHandle}</p>
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-sm space-y-3">
        {/* Download image */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadShareImage}
          className="w-full py-3.5 rounded-xl font-body font-bold text-base text-chocolate-deep border-2 border-gold/40 bg-cream/50 hover:bg-peach/30 transition-colors"
          id="surpresa-download-btn"
        >
          📥 BAIXAR IMAGEM PARA STORY
        </motion.button>

        {/* Open Instagram */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={shareToInstagram}
          className="w-full py-4 rounded-xl font-body font-bold text-lg text-white shadow-lg"
          style={{
            background: "linear-gradient(135deg, #E1306C, #C13584, #833AB4)",
          }}
          id="surpresa-instagram-btn"
        >
          📸 COMPARTILHAR NO INSTAGRAM
        </motion.button>

        {/* Mark as shared */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShareCompleted}
          className="w-full py-4 rounded-xl font-body font-bold text-lg text-white shadow-lg"
          style={{
            background: "linear-gradient(135deg, hsl(34 47% 60%), hsl(34 40% 50%))",
          }}
          id="surpresa-shared-btn"
        >
          ✅ JÁ COMPARTILHEI
        </motion.button>

        {/* Skip option */}
        {onSkip && (
          <button
            onClick={onSkip}
            className="text-sm text-chocolate-light/50 hover:text-chocolate-light font-body transition-colors underline"
          >
            Pular por agora
          </button>
        )}
      </div>

      <p className="mt-6 text-xs text-chocolate-light/40 font-body max-w-xs">
        Após compartilhar, nosso time validará seu Story e liberará o prêmio.
      </p>
    </motion.div>
  );
};

export default SurpresaShare;
