import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Square, Clock, Vibrate } from "lucide-react";

interface FingerspellingSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    showPoseOverlay: boolean;
    showBoundingBox: boolean;
    autoAddDelay: number; // 500ms - 2000ms
    vibrationFeedback: boolean;
  };
  onSettingsChange: (settings: FingerspellingSettingsProps["settings"]) => void;
}

const FingerspellingSettings = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: FingerspellingSettingsProps) => {
  const handleToggle = (key: keyof typeof settings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleDelayChange = (value: number) => {
    onSettingsChange({
      ...settings,
      autoAddDelay: value,
    });
  };

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
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-h-[70vh] overflow-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                Camera Settings
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Settings list */}
            <div className="p-5 space-y-4">
              {/* Pose overlay toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Pose Overlay</p>
                    <p className="text-sm text-muted-foreground">
                      Show hand skeleton lines
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle("showPoseOverlay")}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    settings.showPoseOverlay ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.showPoseOverlay ? 20 : 2 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                  />
                </button>
              </div>

              {/* Bounding box toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Square className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Bounding Box</p>
                    <p className="text-sm text-muted-foreground">
                      Show detection area
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle("showBoundingBox")}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    settings.showBoundingBox ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.showBoundingBox ? 20 : 2 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                  />
                </button>
              </div>

              {/* Auto-add delay slider */}
              <div className="py-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Auto-add Delay</p>
                    <p className="text-sm text-muted-foreground">
                      {(settings.autoAddDelay / 1000).toFixed(1)}s before adding letter
                    </p>
                  </div>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    min="500"
                    max="2000"
                    step="100"
                    value={settings.autoAddDelay}
                    onChange={(e) => handleDelayChange(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Fast</span>
                    <span>Slow</span>
                  </div>
                </div>
              </div>

              {/* Vibration feedback toggle */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Vibrate className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Vibration</p>
                    <p className="text-sm text-muted-foreground">
                      Vibrate when letter added
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle("vibrationFeedback")}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    settings.vibrationFeedback ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.vibrationFeedback ? 20 : 2 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                  />
                </button>
              </div>
            </div>

            {/* Safe area padding */}
            <div className="h-6" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FingerspellingSettings;
