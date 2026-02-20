import { motion } from "framer-motion";

interface SectionTitleProps {
  script?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionTitle = ({ script, title, subtitle, light }: SectionTitleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
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
        <p className={`mt-3 max-w-xl mx-auto text-sm md:text-base ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
      <div className={`w-16 h-[2px] mx-auto mt-4 ${light ? "bg-gold" : "bg-accent"}`} />
    </motion.div>
  );
};

export default SectionTitle;
