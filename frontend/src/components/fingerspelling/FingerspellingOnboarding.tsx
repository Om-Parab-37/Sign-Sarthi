import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Hand, Sun, Focus, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";

interface FingerspellingOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onDontShowAgain: () => void;
}

const slides = [
  {
    icon: Hand,
    title: "Position Your Hand",
    description: "Hold your hand in front of the camera, about 1-2 feet away. Keep your palm facing the camera.",
    tip: "Center your hand in the frame for best results",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Focus,
    title: "Keep Fingers Clear",
    description: "Make sure all your fingers are visible and not overlapping. Form clear fingerspelling shapes.",
    tip: "Standard ASL fingerspelling works best",
    color: "bg-accent text-primary",
  },
  {
    icon: Sun,
    title: "Good Lighting",
    description: "Use a well-lit environment. Avoid strong backlighting or harsh shadows on your hand.",
    tip: "Natural or even artificial light is ideal",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: Sparkles,
    title: "Stay Steady",
    description: "Hold each letter shape for a moment. The app will automatically detect when you're ready.",
    tip: "Move slowly between letters",
    color: "bg-green-100 text-green-700",
  },
];

const FingerspellingOnboarding = ({
  isOpen,
  onClose,
  onDontShowAgain,
}: FingerspellingOnboardingProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dontShow, setDontShow] = useState(false);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    if (dontShow) {
      onDontShowAgain();
    }
    onClose();
    setCurrentSlide(0);
  };

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-bold text-foreground">How to Use</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center max-w-sm"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className={`w-24 h-24 mx-auto mb-6 rounded-2xl ${slide.color} flex items-center justify-center`}
              >
                <Icon className="w-12 h-12" />
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {slide.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-base mb-4 leading-relaxed">
                {slide.description}
              </p>

              {/* Tip */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{slide.tip}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="p-6">
          {/* Dots indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentSlide
                    ? "w-6 bg-primary"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Don't show again checkbox */}
          <label className="flex items-center justify-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">
              Don't show this again
            </span>
          </label>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="p-3 rounded-xl bg-muted hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
              {currentSlide < slides.length - 1 && <ChevronRight className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FingerspellingOnboarding;
