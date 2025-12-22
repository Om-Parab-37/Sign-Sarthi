import { motion } from "framer-motion";
import { Camera, Hand, ArrowRight } from "lucide-react";

interface FingerspellingCardProps {
  onClick: () => void;
}

const FingerspellingCard = ({ onClick }: FingerspellingCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-gradient-to-br from-primary/10 via-accent to-primary/5 rounded-2xl p-4 text-left border border-primary/20 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="relative">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent border-2 border-background flex items-center justify-center"
          >
            <Hand className="w-3 h-3 text-primary" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-foreground">
              Fingerspelling → Letters
            </h3>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
              Live
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Use your camera to convert hand fingerspelling into English letters in real time.
          </p>
        </div>

        {/* Arrow */}
        <div className="self-center">
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </motion.button>
  );
};

export default FingerspellingCard;
