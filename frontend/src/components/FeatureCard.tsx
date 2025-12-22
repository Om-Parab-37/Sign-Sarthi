import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  secondaryIcon?: LucideIcon;
  title: string;
  description: string;
  ctaText: string;
  badge?: string;
  badgeVariant?: "primary" | "accent" | "new";
  onClick: () => void;
  variant?: "primary" | "secondary";
  delay?: number;
}

const FeatureCard = ({
  icon: Icon,
  secondaryIcon: SecondaryIcon,
  title,
  description,
  ctaText,
  badge,
  badgeVariant = "primary",
  onClick,
  variant = "primary",
  delay = 0,
}: FeatureCardProps) => {
  const isPrimary = variant === "primary";

  const badgeColors = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent text-primary",
    new: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-5 border transition-all duration-200 ${
        isPrimary
          ? "bg-gradient-to-br from-primary/5 via-card to-accent/30 border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          : "bg-gradient-to-br from-card via-card to-muted/50 border-border hover:border-primary/30 hover:shadow-lg"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon container */}
        <div className="relative shrink-0">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isPrimary ? "bg-primary/10" : "bg-muted"
            }`}
          >
            <Icon className={`w-7 h-7 ${isPrimary ? "text-primary" : "text-foreground"}`} />
          </div>
          {SecondaryIcon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring", stiffness: 300 }}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent border-2 border-background flex items-center justify-center"
            >
              <SecondaryIcon className="w-3 h-3 text-primary" />
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-foreground text-lg">{title}</h3>
            {badge && (
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${badgeColors[badgeVariant]}`}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {description}
          </p>

          {/* CTA Button */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              isPrimary
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {ctaText}
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default FeatureCard;
