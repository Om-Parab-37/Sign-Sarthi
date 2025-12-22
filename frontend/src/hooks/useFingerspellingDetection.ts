
import { useState, useRef, useCallback, useEffect } from "react";
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import * as tf from "@tensorflow/tfjs";

// Types
export interface HandLandmark {
    x: number;
    y: number;
    z: number;
}

export interface DetectionResult {
    letter: string;
    confidence: number;
    landmarks: any; // Using any to avoid complex type compatibility issues between libraries for now
    worldLandmarks: HandLandmark[] | null;
}

interface UseFingerspellingDetectionReturn {
    isLoading: boolean;
    isModelReady: boolean;
    error: Error | null;
    result: DetectionResult | null;
    processFrame: (video: HTMLVideoElement) => Promise<void>;
    startCamera: (videoElement?: HTMLVideoElement | null) => Promise<MediaStream | null>;
    stopCamera: () => void;
    activeStream: MediaStream | null;
}

// Model paths
const WEIGHTS_PATH = "/models/weights.bin";
const WEIGHTS_INFO_PATH = "/models/weights_info.json";
const LABELS_PATH = "/models/labels.json";

/**
 * Build the MLP model with same architecture as the Python model:
 * Dense(128, relu) -> Dropout(0.3) -> Dense(64, relu) -> Dropout(0.3) -> Dense(28, softmax)
 */
async function buildModel(weightsPath: string, infoPath: string): Promise<tf.LayersModel> {
    // Fetch weights info
    const infoRes = await fetch(infoPath);
    const info = await infoRes.json();

    // Fetch weights binary
    const weightsRes = await fetch(weightsPath);
    const weightsBuffer = await weightsRes.arrayBuffer();
    const weights = new Float32Array(weightsBuffer);

    // Build the model architecture
    const model = tf.sequential();

    // Input layer + Dense(128, relu)
    model.add(tf.layers.dense({
        inputShape: [42],
        units: 128,
        activation: "relu",
        name: "dense"
    }));

    // Dropout(0.3)
    model.add(tf.layers.dropout({ rate: 0.3, name: "dropout" }));

    // Dense(64, relu)
    model.add(tf.layers.dense({
        units: 64,
        activation: "relu",
        name: "dense_1"
    }));

    // Dropout(0.3)
    model.add(tf.layers.dropout({ rate: 0.3, name: "dropout_1" }));

    // Dense(28, softmax) - output layer
    model.add(tf.layers.dense({
        units: 28,
        activation: "softmax",
        name: "dense_2"
    }));

    // Parse weights from binary data
    let offset = 0;
    const layerWeights: { [name: string]: tf.Tensor[] } = {};

    for (const layer of info.layers) {
        const kernelSize = layer.kernel_shape[0] * layer.kernel_shape[1];
        const biasSize = layer.bias_shape[0];

        const kernelData = weights.slice(offset, offset + kernelSize);
        offset += kernelSize;

        const biasData = weights.slice(offset, offset + biasSize);
        offset += biasSize;

        layerWeights[layer.name] = [
            tf.tensor2d(kernelData, layer.kernel_shape as [number, number]),
            tf.tensor1d(biasData)
        ];
    }

    // Set weights for each layer
    for (const layer of model.layers) {
        if (layerWeights[layer.name]) {
            layer.setWeights(layerWeights[layer.name]);
        }
    }

    return model;
}

export function useFingerspellingDetection(): UseFingerspellingDetectionReturn {
    const [isLoading, setIsLoading] = useState(true);
    const [isModelReady, setIsModelReady] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<DetectionResult | null>(null);
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);

    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const modelRef = useRef<tf.LayersModel | null>(null);
    const labelsRef = useRef<string[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const lastVideoTimeRef = useRef<number>(-1);
    const isMountedRef = useRef<boolean>(true);

    // Initialize MediaPipe Hand Landmarker and TensorFlow.js model
    useEffect(() => {
        isMountedRef.current = true;
        let isLocallyMounted = true;

        async function initialize() {
            try {
                setIsLoading(true);
                setError(null);

                // Load labels
                const labelsResponse = await fetch(LABELS_PATH);
                if (!labelsResponse.ok) {
                    throw new Error(`Failed to load labels: ${labelsResponse.status}`);
                }
                labelsRef.current = await labelsResponse.json();

                // Initialize Hand Landmarker
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                const handLandmarker = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });

                handLandmarkerRef.current = handLandmarker;

                // Build and load model
                const model = await buildModel(WEIGHTS_PATH, WEIGHTS_INFO_PATH);
                modelRef.current = model;

                if (isLocallyMounted) {
                    setIsModelReady(true);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Initialization error:", err);
                if (isLocallyMounted) {
                    setError(err instanceof Error ? err : new Error(String(err)));
                    setIsLoading(false);
                }
            }
        }

        initialize();

        return () => {
            isMountedRef.current = false;
            isLocallyMounted = false;

            // Release resources
            if (handLandmarkerRef.current) {
                handLandmarkerRef.current.close();
            }

            // Stop camera immediately on unmount
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
                setActiveStream(null);
            }
        };
    }, []);

    // Start camera
    const startCamera = useCallback(
        async (videoElement?: HTMLVideoElement | null): Promise<MediaStream | null> => {
            // Cleanup any existing stream first
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user",
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                    },
                });

                // If component unmounted while waiting for camera, stop it immediately
                if (!isMountedRef.current) {
                    stream.getTracks().forEach(track => track.stop());
                    return null;
                }

                if (videoElement) {
                    videoElement.srcObject = stream;
                }
                streamRef.current = stream;
                setActiveStream(stream);
                return stream;
            } catch (err) {
                console.error("Camera error:", err);
                setError(err instanceof Error ? err : new Error("Camera access denied"));
                return null;
            }
        },
        []
    );

    // Stop camera
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            setActiveStream(null);
        }
    }, []);

    // Process a single video frame
    const processFrame = useCallback(async (video: HTMLVideoElement) => {
        if (!handLandmarkerRef.current || !modelRef.current || !isModelReady) {
            return;
        }

        try {
            // Only detect if video time has advanced
            if (video.currentTime !== lastVideoTimeRef.current) {
                lastVideoTimeRef.current = video.currentTime;

                // Detect hands
                const startTimeMs = performance.now();
                const results = handLandmarkerRef.current.detectForVideo(video, startTimeMs);

                if (!results.worldLandmarks || results.worldLandmarks.length === 0) {
                    // No hand detected
                    setResult({
                        letter: "",
                        confidence: 0,
                        landmarks: null,
                        worldLandmarks: null,
                    });
                    return;
                }

                // Extract landmarks from first hand
                const worldLandmarks = results.worldLandmarks[0];
                const normalizedLandmarks = results.landmarks[0]; // 'landmarks' is the normalized 0-1 coords

                // Flatten to 42 features (21 landmarks × x,y)
                const features: number[] = [];
                for (const lm of worldLandmarks) {
                    features.push(lm.x, lm.y);
                }

                // Run inference
                const inputTensor = tf.tensor2d([features], [1, 42]);
                const outputTensor = modelRef.current.predict(inputTensor) as tf.Tensor;
                const predictions = await outputTensor.data();

                // Cleanup tensors
                inputTensor.dispose();
                outputTensor.dispose();

                // Find max probability
                let maxIdx = 0;
                let maxProb = predictions[0];
                for (let i = 1; i < predictions.length; i++) {
                    if (predictions[i] > maxProb) {
                        maxProb = predictions[i];
                        maxIdx = i;
                    }
                }

                const predictedLetter = labelsRef.current[maxIdx] || "";
                const confidence = Math.round(maxProb * 100);

                setResult({
                    letter: predictedLetter,
                    confidence,
                    landmarks: normalizedLandmarks as any,
                    worldLandmarks: worldLandmarks,
                });
            }
        } catch (err) {
            console.error("Frame processing error:", err);
        }
    }, [isModelReady]);

    return {
        isLoading,
        isModelReady,
        error,
        result,
        processFrame,
        startCamera,
        stopCamera,
        activeStream,
    };
}
