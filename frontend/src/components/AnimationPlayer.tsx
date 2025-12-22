import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import HandIcon from "./icons/HandIcon";

interface AnimationPlayerProps {
  words: string[];
  isLoading?: boolean;
}

const AnimationPlayer = ({ words, isLoading = false }: AnimationPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    if (isPlaying && words.length > 0) {
      const interval = setInterval(() => {
        setCurrentWordIndex((prev) => {
          if (prev >= words.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isPlaying, words.length]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentWordIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentWordIndex((prev) => Math.min(words.length - 1, prev + 1));
  };

  const handleRestart = () => {
    setCurrentWordIndex(0);
    setIsPlaying(true);
  };

  if (isLoading) {
    return (
      <div className="card-elevated">
        <div className="aspect-square rounded-2xl bg-secondary/50 flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary"
          />
          <p className="mt-4 text-muted-foreground font-medium">Generating sign animation...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-elevated"
    >
      {/* Animation Display */}
      <div className="aspect-square rounded-2xl bg-gradient-to-br from-secondary to-muted/50 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated background circles */}
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-primary/5"
          animate={isPlaying ? { scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-primary/10"
          animate={isPlaying ? { scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Hand animation */}
        <motion.div
          key={currentWordIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <HandIcon className="w-32 h-32 text-primary" animate={isPlaying} />
        </motion.div>
        
        {/* Current word display */}
        <motion.p
          key={`word-${currentWordIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-2xl font-bold text-foreground relative z-10"
        >
          {words[currentWordIndex] || "Ready"}
        </motion.p>
        
        {/* Progress dots */}
        {words.length > 0 && (
          <div className="absolute bottom-4 flex gap-2">
            {words.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentWordIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                animate={index === currentWordIndex ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={handleRestart}
          className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center tap-highlight"
        >
          <RotateCcw className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <button
          onClick={handlePrevious}
          disabled={currentWordIndex === 0}
          className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center tap-highlight disabled:opacity-40"
        >
          <SkipBack className="w-5 h-5 text-foreground" />
        </button>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayPause}
          className="w-16 h-16 rounded-full gradient-primary shadow-button flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-primary-foreground" />
          ) : (
            <Play className="w-7 h-7 text-primary-foreground ml-1" />
          )}
        </motion.button>
        
        <button
          onClick={handleNext}
          disabled={currentWordIndex === words.length - 1}
          className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center tap-highlight disabled:opacity-40"
        >
          <SkipForward className="w-5 h-5 text-foreground" />
        </button>
        
        <div className="w-12 h-12" /> {/* Spacer for balance */}
      </div>

      {/* Progress bar */}
      {words.length > 0 && (
        <div className="mt-4 h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default AnimationPlayer;
