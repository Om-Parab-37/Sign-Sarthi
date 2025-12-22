import { motion } from "framer-motion";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";

interface PoseOverlayProps {
  isVisible: boolean;
  confidence: number; // 0-100
  handDetected: boolean;
  showBoundingBox?: boolean;
  landmarks?: NormalizedLandmark[] | null; // Real landmarks from MediaPipe
}

// MediaPipe hand connections (21 landmarks)
const CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm
  [5, 9], [9, 13], [13, 17],
];

const PoseOverlay = ({
  isVisible,
  confidence,
  handDetected,
  showBoundingBox = true,
  landmarks,
}: PoseOverlayProps) => {
  // Calculate bounding box from landmarks
  const getBoundingBox = () => {
    if (!landmarks || landmarks.length === 0) {
      return null;
    }

    let minX = 1, maxX = 0, minY = 1, maxY = 0;
    for (const lm of landmarks) {
      minX = Math.min(minX, lm.x);
      maxX = Math.max(maxX, lm.x);
      minY = Math.min(minY, lm.y);
      maxY = Math.max(maxY, lm.y);
    }

    // Add padding
    const padding = 0.05;
    return {
      x: Math.max(0, minX - padding) * 100,
      y: Math.max(0, minY - padding) * 100,
      width: Math.min(1, (maxX - minX) + padding * 2) * 100,
      height: Math.min(1, (maxY - minY) + padding * 2) * 100,
    };
  };

  const opacity = Math.min(confidence / 100, 1) * 0.9 + 0.1;
  const strokeWidth = confidence > 70 ? 1.5 : 1.0;

  if (!isVisible || !handDetected) {
    return null;
  }

  const boundingBox = getBoundingBox();

  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1 1"
      preserveAspectRatio="xMidYMid slice"
      style={{ transform: "scaleX(-1)" }} // Mirror to match video
    >
      {/* Bounding box */}
      {showBoundingBox && boundingBox && (
        <motion.rect
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: opacity * 0.3, scale: 1 }}
          x={boundingBox.x / 100}
          y={boundingBox.y / 100}
          width={boundingBox.width / 100}
          height={boundingBox.height / 100}
          rx="0.02" // Scaled radius
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.003"
          strokeDasharray="0.03 0.015"
        />
      )}

      {/* Connection lines (bones) - only if we have real landmarks */}
      {landmarks && landmarks.length >= 21 && CONNECTIONS.map(([startIdx, endIdx], i) => {
        const start = landmarks[startIdx];
        const end = landmarks[endIdx];
        if (!start || !end) return null;

        return (
          <motion.line
            key={`line-${i}`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.15 }}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth / 100}
            strokeLinecap="round"
            opacity={opacity}
          />
        );
      })}

      {/* Joint points */}
      {landmarks && landmarks.map((lm, i) => (
        <motion.circle
          key={`point-${i}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.1 }}
          cx={lm.x}
          cy={lm.y}
          r={(i === 0 ? 0.015 : i % 4 === 0 ? 0.012 : 0.008)} // Wrist and fingertips larger
          fill={i % 4 === 0 ? "hsl(var(--accent))" : "hsl(var(--primary))"}
          opacity={opacity}
        />
      ))}

      {/* Fingertip highlights */}
      {landmarks && [4, 8, 12, 16, 20].map((tipIdx) => {
        const tip = landmarks[tipIdx];
        if (!tip) return null;

        return (
          <motion.circle
            key={`tip-glow-${tipIdx}`}
            animate={{
              r: [0.012, 0.02, 0.012],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            cx={tip.x}
            cy={tip.y}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.006"
          />
        );
      })}
    </motion.svg>
  );
};

export default PoseOverlay;
