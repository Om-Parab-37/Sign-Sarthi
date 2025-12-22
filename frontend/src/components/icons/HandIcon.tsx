import { motion } from "framer-motion";

interface HandIconProps {
  className?: string;
  animate?: boolean;
}

const HandIcon = ({ className = "", animate = false }: HandIconProps) => {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      animate={animate ? { rotate: [0, 15, -15, 0] } : undefined}
      transition={animate ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      {/* Palm */}
      <ellipse cx="50" cy="60" rx="28" ry="32" fill="currentColor" opacity="0.9" />
      
      {/* Thumb */}
      <motion.ellipse
        cx="22"
        cy="50"
        rx="8"
        ry="16"
        fill="currentColor"
        style={{ transformOrigin: "30px 60px" }}
        animate={animate ? { rotate: [0, 10, 0] } : undefined}
        transition={animate ? { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 } : undefined}
      />
      
      {/* Index finger */}
      <motion.rect
        x="30"
        y="10"
        width="10"
        height="35"
        rx="5"
        fill="currentColor"
        style={{ transformOrigin: "35px 45px" }}
        animate={animate ? { scaleY: [1, 0.95, 1] } : undefined}
        transition={animate ? { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 } : undefined}
      />
      
      {/* Middle finger */}
      <motion.rect
        x="45"
        y="5"
        width="10"
        height="40"
        rx="5"
        fill="currentColor"
        style={{ transformOrigin: "50px 45px" }}
        animate={animate ? { scaleY: [1, 0.95, 1] } : undefined}
        transition={animate ? { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 } : undefined}
      />
      
      {/* Ring finger */}
      <motion.rect
        x="60"
        y="12"
        width="10"
        height="32"
        rx="5"
        fill="currentColor"
        style={{ transformOrigin: "65px 45px" }}
        animate={animate ? { scaleY: [1, 0.95, 1] } : undefined}
        transition={animate ? { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 } : undefined}
      />
      
      {/* Pinky */}
      <motion.rect
        x="72"
        y="22"
        width="8"
        height="25"
        rx="4"
        fill="currentColor"
        style={{ transformOrigin: "76px 47px" }}
        animate={animate ? { scaleY: [1, 0.95, 1] } : undefined}
        transition={animate ? { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 } : undefined}
      />
    </motion.svg>
  );
};

export default HandIcon;
