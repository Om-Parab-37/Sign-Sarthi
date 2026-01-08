import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  HelpCircle,
  Settings,
  AlertTriangle,
  RefreshCw,
  Sun,
  Hand,
} from "lucide-react";
import CameraPermission from "@/components/fingerspelling/CameraPermission";
import PoseOverlay from "@/components/fingerspelling/PoseOverlay";
import PredictionCard from "@/components/fingerspelling/PredictionCard";
import OutputTextPanel from "@/components/fingerspelling/OutputTextPanel";
import FingerspellingOnboarding from "@/components/fingerspelling/FingerspellingOnboarding";
import FingerspellingSettings from "@/components/fingerspelling/FingerspellingSettings";
import { useFingerspellingDetection } from "@/hooks/useFingerspellingDetection";

interface FingerspellingScreenProps {
  onBack: () => void;
  onUseInTranslation: (text: string) => void;
}

type CameraState = "checking" | "prompt" | "requesting" | "denied" | "granted" | "error";
type DetectionState = "loading" | "no-hand" | "low-confidence" | "high-confidence" | "poor-conditions";

const FingerspellingScreen = ({
  onBack,
  onUseInTranslation,
}: FingerspellingScreenProps) => {
  // Camera state
  const [cameraState, setCameraState] = useState<CameraState>("checking");
  // stream state removed in favor of hook management
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Use the real detection hook
  const {
    isLoading: isModelLoading,
    isModelReady,
    error: modelError,
    result: detectionResult,
    processFrame,
    startCamera: hookStartCamera,
    stopCamera: hookStopCamera,
    activeStream,
  } = useFingerspellingDetection();

  // Detection state derived from hook results
  const [detectionState, setDetectionState] = useState<DetectionState>("loading");
  const [outputText, setOutputText] = useState("");
  const [autoAddProgress, setAutoAddProgress] = useState(0);

  // Mode
  const [isAutoMode, setIsAutoMode] = useState(true);

  // UI state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    showPoseOverlay: true,
    showBoundingBox: true,
    autoAddDelay: 500,
    vibrationFeedback: true,
  });

  // Warnings
  const [warning, setWarning] = useState<string | null>(null);

  // Current letter and confidence from detection
  const currentLetter = detectionResult?.letter || null;
  const confidence = detectionResult?.confidence || 0;
  const landmarks = detectionResult?.landmarks || null;

  // Update detection state based on results
  useEffect(() => {
    if (isModelLoading) {
      setDetectionState("loading");
    } else if (!detectionResult || !detectionResult.landmarks) {
      setDetectionState("no-hand");
    } else if (confidence >= 80) {
      setDetectionState("high-confidence");
    } else if (confidence >= 40) {
      setDetectionState("low-confidence");
    } else {
      setDetectionState("no-hand");
    }
  }, [isModelLoading, detectionResult, confidence]);

  // Check if onboarding should show
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("fingerspelling-onboarding-seen");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Check camera permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: "camera" as PermissionName });
        if (result.state === "granted") {
          setCameraState("granted");
          await hookStartCamera();
        } else if (result.state === "denied") {
          setCameraState("denied");
        } else {
          setCameraState("prompt");
        }
      } catch {
        // Fallback for browsers that don't support permissions API
        setCameraState("prompt");
      }
    };

    checkPermission();

    return () => {
      hookStopCamera();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Real-time detection loop
  const runDetectionLoop = useCallback(() => {
    const detect = async () => {
      if (videoRef.current && isModelReady && videoRef.current.readyState >= 2) {
        await processFrame(videoRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(detect);
    };
    detect();
  }, [isModelReady, processFrame]);

  // Attach stream to video when ready
  useEffect(() => {
    if (cameraState === "granted" && videoRef.current && activeStream) {
      videoRef.current.srcObject = activeStream;
    }
  }, [cameraState, activeStream]);

  // Start detection loop when model is ready
  useEffect(() => {
    if (isModelReady && cameraState === "granted") {
      runDetectionLoop();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isModelReady, cameraState, runDetectionLoop]);

  const requestPermission = async () => {
    setCameraState("requesting");
    try {
      const stream = await hookStartCamera(); // No video element needed initially
      if (stream) {
        setCameraState("granted");
      } else {
        setCameraState("denied");
      }
    } catch {
      setCameraState("denied");
    }
  };

  const openSettings = () => {
    alert("This would open device settings to enable camera permission");
  };

  // Auto-add tracking
  const autoAddIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAddedLetterRef = useRef<string | null>(null);
  const continuousDeleteRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-add letter when high confidence
  useEffect(() => {
    if (isAutoMode && detectionState === "high-confidence" && currentLetter && confidence >= 80) {
      // Special handling for backspace - continuous delete
      if (currentLetter === "back") {
        // Start continuous delete after initial delay
        if (!continuousDeleteRef.current) {
          setAutoAddProgress(0);
          const startTime = Date.now();

          autoAddIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / settings.autoAddDelay) * 100, 100);
            setAutoAddProgress(progress);

            if (progress >= 100 && !continuousDeleteRef.current) {
              // First delete
              addLetter("back");
              setAutoAddProgress(0);

              // Start continuous delete with same delay as initial
              continuousDeleteRef.current = setInterval(() => {
                addLetter("back");
              }, settings.autoAddDelay);

              if (autoAddIntervalRef.current) {
                clearInterval(autoAddIntervalRef.current);
              }
            }
          }, 50);
        }

        return () => {
          if (autoAddIntervalRef.current) clearInterval(autoAddIntervalRef.current);
          if (continuousDeleteRef.current) {
            clearInterval(continuousDeleteRef.current);
            continuousDeleteRef.current = null;
          }
        };
      }

      // Normal letter handling - don't auto-add if same letter
      if (currentLetter === lastAddedLetterRef.current) {
        return;
      }

      setAutoAddProgress(0);

      const startTime = Date.now();
      autoAddIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / settings.autoAddDelay) * 100, 100);
        setAutoAddProgress(progress);

        if (progress >= 100) {
          addLetter(currentLetter);
          lastAddedLetterRef.current = currentLetter;
          setAutoAddProgress(0);
          if (autoAddIntervalRef.current) {
            clearInterval(autoAddIntervalRef.current);
          }
        }
      }, 50);

      return () => {
        if (autoAddIntervalRef.current) {
          clearInterval(autoAddIntervalRef.current);
        }
      };
    } else {
      setAutoAddProgress(0);
      if (autoAddIntervalRef.current) {
        clearInterval(autoAddIntervalRef.current);
      }
      // Stop continuous delete when gesture changes
      if (continuousDeleteRef.current) {
        clearInterval(continuousDeleteRef.current);
        continuousDeleteRef.current = null;
      }
      // Reset last added letter when hand is removed
      if (detectionState === "no-hand") {
        lastAddedLetterRef.current = null;
      }
    }
  }, [isAutoMode, detectionState, currentLetter, settings.autoAddDelay]);

  const addLetter = useCallback((letter: string) => {
    if (letter === "space") {
      setOutputText((prev) => prev + " ");
    } else if (letter === "back") {
      setOutputText((prev) => prev.slice(0, -1));
    } else {
      setOutputText((prev) => prev + letter);
    }
    if (settings.vibrationFeedback && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [settings.vibrationFeedback]);

  const handleManualAdd = () => {
    if (currentLetter) {
      addLetter(currentLetter);
      lastAddedLetterRef.current = currentLetter;
    }
  };

  const handleBackspace = () => {
    setOutputText((prev) => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setOutputText((prev) => prev + " ");
  };

  const handleClear = () => {
    setOutputText("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const handleDontShowAgain = () => {
    localStorage.setItem("fingerspelling-onboarding-seen", "true");
  };

  // Show permission screens
  if (cameraState === "checking") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (cameraState === "prompt" || cameraState === "requesting" || cameraState === "denied") {
    return (
      <CameraPermission
        status={cameraState}
        onRequestPermission={requestPermission}
        onOpenSettings={openSettings}
        onCancel={onBack}
      />
    );
  }

  if (cameraState === "error" || modelError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          {modelError ? "Model Error" : "Camera Error"}
        </h2>
        <p className="text-muted-foreground text-center mb-6">
          {modelError
            ? `Failed to load detection model: ${modelError.message}`
            : "We couldn't start the camera. Please check your device and try again."}
        </p>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Retry
        </motion.button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Camera feed area */}
      <div className="absolute inset-0 bg-zinc-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Pose overlay with real landmarks */}
        {settings.showPoseOverlay && (
          <PoseOverlay
            isVisible={true}
            confidence={confidence}
            handDetected={detectionState !== "no-hand" && detectionState !== "loading"}
            showBoundingBox={settings.showBoundingBox}
            landmarks={landmarks}
          />
        )}

        {/* Top bar overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between p-4 pt-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>

            <h1 className="text-white font-semibold">Fingerspelling to Text</h1>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOnboarding(true)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <Settings className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Model loading overlay */}
        <AnimatePresence>
          {(detectionState === "loading" || isModelLoading) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-20 left-0 right-0 flex justify-center"
            >
              <div className="px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                <span className="text-white text-sm">Loading detection model...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warning banner */}
        <AnimatePresence>
          {warning && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 right-0 flex justify-center z-10"
            >
              <div className="px-4 py-2 bg-yellow-500/90 backdrop-blur-sm rounded-full flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-900" />
                <span className="text-yellow-900 text-sm font-medium">{warning}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No hand guide */}
        <AnimatePresence>
          {detectionState === "no-hand" && !isModelLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-48 h-48 rounded-3xl border-2 border-dashed border-white/50 flex items-center justify-center mb-4"
                >
                  <Hand className="w-24 h-24 text-white/50" />
                </motion.div>
                <p className="text-white/70 text-sm">Show your hand to start</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom panel area */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-4">
        <div className="relative mx-4 mb-4">
          {/* Prediction card - floating overlap */}
          <PredictionCard
            letter={currentLetter}
            confidence={confidence}
            isAutoMode={isAutoMode}
            onToggleMode={() => setIsAutoMode(!isAutoMode)}
            onManualAdd={handleManualAdd}
            autoAddProgress={autoAddProgress}
            detectionState={detectionState}
          />
        </div>

        {/* Output text panel */}
        <OutputTextPanel
          text={outputText}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
          onClear={handleClear}
          onCopy={handleCopy}
          onUseInTranslation={() => onUseInTranslation(outputText)}
        />
      </div>

      {/* Onboarding modal */}
      <FingerspellingOnboarding
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onDontShowAgain={handleDontShowAgain}
      />

      {/* Settings modal */}
      <FingerspellingSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
};

export default FingerspellingScreen;
