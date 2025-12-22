import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const Chip = ({ children, active = false, onClick, className }: ChipProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "chip",
        active && "chip-active",
        className
      )}
    >
      {children}
    </motion.button>
  );
};

export default Chip;
