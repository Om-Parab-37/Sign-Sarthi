import { motion } from "framer-motion";
import { Camera, Hand, ShieldCheck, Settings } from "lucide-react";

interface CameraPermissionProps {
  status: "prompt" | "denied" | "requesting";
  onRequestPermission: () => void;
  onOpenSettings: () => void;
  onCancel: () => void;
}

const CameraPermission = ({
  status,
  onRequestPermission,
  onOpenSettings,
  onCancel,
}: CameraPermissionProps) => {
  if (status === "denied") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center"
          >
            <Camera className="w-12 h-12 text-destructive" />
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-3">
            Camera Access Required
          </h2>

          <p className="text-muted-foreground mb-8 text-base leading-relaxed">
            Camera access is needed to detect hand poses and convert fingerspelling into letters in real time.
          </p>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onOpenSettings}
            className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
          >
            <Settings className="w-5 h-5" />
            Open Settings
          </motion.button>

          <button
            onClick={onCancel}
            className="w-full py-3 text-muted-foreground font-medium"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        {/* Illustration */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="relative w-32 h-32 mx-auto mb-8"
        >
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-primary/20 flex items-center justify-center">
            <Camera className="w-10 h-10 text-primary absolute -left-1 top-4" />
            <Hand className="w-12 h-12 text-primary absolute right-2 bottom-3" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
          </motion.div>
        </motion.div>

        <h2 className="text-2xl font-bold text-foreground mb-3">
          Allow Camera Access
        </h2>

        <p className="text-muted-foreground mb-2 text-base leading-relaxed">
          SignSarthi uses your camera to detect hand poses and convert fingerspelling into letters in real time.
        </p>

        <p className="text-sm text-muted-foreground/70 mb-8">
          🔒 No video is stored without your permission.
        </p>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onRequestPermission}
          disabled={status === "requesting"}
          className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
        >
          {status === "requesting" ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              />
              Requesting...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              Allow Camera Access
            </>
          )}
        </motion.button>

        <button
          onClick={onCancel}
          className="w-full py-3 text-muted-foreground font-medium"
        >
          Not Now
        </button>
      </motion.div>
    </div>
  );
};

export default CameraPermission;
