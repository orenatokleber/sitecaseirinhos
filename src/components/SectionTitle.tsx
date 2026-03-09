import { motion } from "framer-motion";

interface SectionTitleProps {
  script?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  align?: "center" | "left";
}

const SectionTitle = ({ script, title, subtitle, light, align = "center" }: SectionTitleProps) => {
  const isCenter = align === "center";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${isCenter ? "text-center" : "text-left"}`}
    >
      {script && (
        <span className={`font-script text-2xl md:text-3xl ${light ? "text-gold" : "text-accent"}`}>
          {script}
        </span>
      )}
      <h2 className={`font-heading text-3xl md:text-4xl font-semibold mt-1 ${light ? "text-primary-foreground" : "text-foreground"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm md:text-base ${light ? "text-primary-foreground/70" : "text-muted-foreground"} ${isCenter ? "max-w-xl mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
      <div className={`w-16 h-[2px] mt-4 ${light ? "bg-gold" : "bg-accent"} ${isCenter ? "mx-auto" : ""}`} />
    </motion.div>
  );
};

export default SectionTitle;
