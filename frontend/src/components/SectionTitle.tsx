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
        <span className={`font-script text-2xl md:text-3xl ${light ? "text-accent" : "text-primary"}`}>
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
      <div className={`flex items-center gap-2 mt-4 ${isCenter ? "justify-center" : ""}`}>
        <div className={`w-8 h-[2px] ${light ? "bg-accent" : "bg-primary/40"}`} />
        <div className={`w-3 h-3 rounded-full ${light ? "bg-accent" : "bg-primary"}`} />
        <div className={`w-8 h-[2px] ${light ? "bg-accent" : "bg-primary/40"}`} />
      </div>
    </motion.div>
  );
};

export default SectionTitle;
