import { useState } from "react";
import { motion } from "framer-motion";

interface SurpresaFormProps {
  onSubmit: (name: string, whatsapp: string) => void;
  loading: boolean;
  error: string | null;
}

const formatWhatsApp = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

const SurpresaForm = ({ onSubmit, loading, error }: SurpresaFormProps) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errors.name = "Informe seu nome (mínimo 2 caracteres)";
    }

    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) {
      errors.whatsapp = "Informe um WhatsApp válido com DDD";
    }

    if (!consent) {
      errors.consent = "Você precisa aceitar os termos para participar";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(name.trim(), whatsapp.replace(/\D/g, ""));
    }
  };

  return (
    <motion.div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="text-5xl mb-4"
      >
        🍰
      </motion.div>

      <h2 className="font-heading text-2xl md:text-3xl font-bold text-chocolate-deep text-center mb-2">
        Quase lá!
      </h2>
      <p className="text-chocolate-light font-body text-center mb-8 max-w-sm">
        Informe seus dados para participar e descobrir seu presente.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        {/* Name field */}
        <div>
          <label htmlFor="surpresa-name" className="block text-sm font-body font-semibold text-chocolate mb-1.5">
            Seu nome
          </label>
          <input
            id="surpresa-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Como podemos te chamar?"
            className="w-full px-4 py-3.5 rounded-xl border-2 border-peach/50 bg-white/80 backdrop-blur-sm font-body text-chocolate-deep placeholder:text-chocolate-light/40 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            autoComplete="given-name"
            autoFocus
          />
          {formErrors.name && (
            <p className="text-red-500 text-xs mt-1 font-body">{formErrors.name}</p>
          )}
        </div>

        {/* WhatsApp field */}
        <div>
          <label htmlFor="surpresa-whatsapp" className="block text-sm font-body font-semibold text-chocolate mb-1.5">
            Seu WhatsApp
          </label>
          <input
            id="surpresa-whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
            placeholder="(00) 00000-0000"
            className="w-full px-4 py-3.5 rounded-xl border-2 border-peach/50 bg-white/80 backdrop-blur-sm font-body text-chocolate-deep placeholder:text-chocolate-light/40 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            autoComplete="tel"
            inputMode="numeric"
            maxLength={15}
          />
          {formErrors.whatsapp && (
            <p className="text-red-500 text-xs mt-1 font-body">{formErrors.whatsapp}</p>
          )}
        </div>

        {/* LGPD Consent */}
        <div className="flex items-start gap-3">
          <input
            id="surpresa-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-peach accent-gold cursor-pointer flex-shrink-0"
          />
          <label htmlFor="surpresa-consent" className="text-xs text-chocolate-light font-body leading-relaxed cursor-pointer">
            Autorizo a Caseirinhos a Confeitaria a utilizar meu nome e WhatsApp
            exclusivamente para validar minha participação nesta campanha e enviar
            informações sobre meu prêmio. Seus dados não serão compartilhados com terceiros.
          </label>
        </div>
        {formErrors.consent && (
          <p className="text-red-500 text-xs font-body -mt-2">{formErrors.consent}</p>
        )}

        {/* API Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-body text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full py-4 rounded-xl font-body font-bold text-lg text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          style={{
            background: loading
              ? "hsl(34 20% 70%)"
              : "linear-gradient(135deg, hsl(34 47% 60%), hsl(34 40% 50%))",
          }}
          id="surpresa-submit-btn"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                ⏳
              </motion.span>
              Verificando...
            </span>
          ) : (
            "PARTICIPAR 🎁"
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-xs text-chocolate-light/50 font-body text-center max-w-xs">
        Cada cliente pode participar apenas uma vez por campanha.
        O prêmio será escolhido aleatoriamente.
      </p>
    </motion.div>
  );
};

export default SurpresaForm;
