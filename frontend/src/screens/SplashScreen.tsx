import { motion } from "framer-motion";
import HandIcon from "@/components/icons/HandIcon";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 gradient-splash flex flex-col items-center justify-center safe-area-top safe-area-bottom"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
  onAnimationComplete={() => {
        setTimeout(onComplete, 1500);
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/5"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-white/5"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Logo and branding */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Logo container */}
        <motion.div
          className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-[2rem] flex items-center justify-center mb-6 border border-white/20"
          animate={{ boxShadow: ["0 0 30px rgba(255,255,255,0.1)", "0 0 50px rgba(255,255,255,0.2)", "0 0 30px rgba(255,255,255,0.1)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <HandIcon className="w-16 h-16 text-white" animate />
        </motion.div>

        {/* App name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-white tracking-tight"
        >
          SignSarthi
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white/80 text-lg mt-3 font-medium"
        >
          English to Sign Language, Instantly
        </motion.p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-20 flex flex-col items-center"
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-white/50 text-xs"
      >
        Powered by NLP & FastAPI
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
