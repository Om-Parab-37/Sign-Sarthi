import { motion, AnimatePresence } from "framer-motion";

type DetectionState = "loading" | "no-hand" | "low-confidence" | "high-confidence" | "poor-conditions";

interface PredictionCardProps {
  letter: string | null;
  confidence: number; // 0-100
  isAutoMode: boolean;
  onToggleMode: () => void;
  onManualAdd: () => void;
  autoAddProgress?: number; // 0-100, shows ring animation for auto-add
  detectionState: DetectionState;
}

const PredictionCard = ({
  letter,
  confidence,
  isAutoMode,
  onToggleMode,
  onManualAdd,
  autoAddProgress = 0,
  detectionState,
}: PredictionCardProps) => {
  const isDetecting = detectionState !== "no-hand" && detectionState !== "loading";
  const isHighConfidence = confidence >= 80;
  const isMediumConfidence = confidence >= 50 && confidence < 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center"
    >
      {/* Main prediction card */}
      <div className="relative">
        {/* Auto-add progress ring */}
        {autoAddProgress > 0 && (
          <svg
            className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)]"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="hsl(var(--primary) / 0.2)"
              strokeWidth="4"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${autoAddProgress * 2.89} 289`}
              transform="rotate(-90 50 50)"
            />
          </svg>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={letter || "detecting"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: isHighConfidence ? [1, 1.05, 1] : 1,
              opacity: 1
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`
              w-20 h-20 rounded-2xl flex items-center justify-center
              shadow-lg border-2 transition-colors duration-200
              ${isHighConfidence
                ? "bg-black text-primary border-primary shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)]"
                : isMediumConfidence
                  ? "bg-zinc-900 text-foreground border-yellow-500/50"
                  : "bg-zinc-900 text-muted-foreground border-zinc-800"
              }
            `}
          >
            {isDetecting && !letter ? (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-2xl font-bold"
              >
                ...
              </motion.div>
            ) : letter ? (
              <span className="text-4xl font-bold">{letter}</span>
            ) : (
              <span className="text-3xl">–</span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Confidence bar and label */}
      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground mb-1">
          {isDetecting && !letter
            ? "Detecting..."
            : letter
              ? "Current prediction"
              : "Show your hand"
          }
        </p>

        {letter && confidence > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                className={`h-full rounded-full ${isHighConfidence
                  ? "bg-primary"
                  : isMediumConfidence
                    ? "bg-yellow-500"
                    : "bg-muted-foreground"
                  }`}
              />
            </div>
            <span className={`text-xs font-medium ${isHighConfidence
              ? "text-primary"
              : "text-muted-foreground"
              }`}>
              {confidence}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PredictionCard;
