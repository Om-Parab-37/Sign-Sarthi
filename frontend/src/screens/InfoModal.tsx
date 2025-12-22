import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, Eye, Zap, Heart, Type } from "lucide-react";
import HandIcon from "@/components/icons/HandIcon";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal = ({ isOpen, onClose }: InfoModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[2rem] z-50 max-h-[85vh] overflow-y-auto safe-area-bottom"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-muted rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center tap-highlight"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="px-6 pb-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center">
                  <HandIcon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">SignSarthi</h2>
                  <p className="text-muted-foreground text-sm">Your Sign Language Companion</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-foreground leading-relaxed mb-8">
                SignSarthi helps bridge communication gaps by translating English text
                into sign language animations. Our goal is to make sign language
                more accessible to everyone.
              </p>

              {/* Key Features */}
              <h3 className="text-lg font-semibold text-foreground mb-4">Key Features</h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-secondary/50 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <HandIcon className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Text to Sign</h4>
                  <p className="text-xs text-muted-foreground">Convert meaningful English sentences into ISL animations.</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                    <Type className="w-4 h-4 text-accent" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Fingerspelling</h4>
                  <p className="text-xs text-muted-foreground">Learn sign language alphabet characters one by one.</p>
                </div>
              </div>

              {/* How it works */}
              <h3 className="text-lg font-semibold text-foreground mb-4">How It Works</h3>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Natural Language Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      We use NLTK to analyze and tokenize your English text into
                      meaningful components.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Pose Estimation</h4>
                    <p className="text-sm text-muted-foreground">
                      OpenPose technology generates accurate hand and body poses
                      for each sign.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Real-time Animation</h4>
                    <p className="text-sm text-muted-foreground">
                      Animations are generated and played back smoothly so you
                      can learn at your own pace.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-secondary/50 rounded-2xl p-4 flex items-center gap-3">
                <Heart className="w-5 h-5 text-accent flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Built with love to make communication accessible for everyone.
                </p>
              </div>

              {/* Tech Stack */}
              <p className="text-xs text-center text-muted-foreground mt-6">
                React • Vite • Tailwind • Framer Motion • FastAPI • NLTK
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;
