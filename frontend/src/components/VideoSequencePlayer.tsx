/**
 * VideoSequencePlayer Component
 * Plays a sequence of sign language videos SEAMLESSLY
 * Uses dual video elements with preloading for instant transitions
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { TranslationItem, getSignVideoUrl } from '@/services/translationApi';

interface VideoSequencePlayerProps {
    translations: TranslationItem[];
    isLoading?: boolean;
    onWordChange?: (index: number, word: string) => void;
    autoPlay?: boolean;
}

interface PlayableItem {
    id: string;
    url: string;
    word: string;
    isFingerspell: boolean;
    type: 'video' | 'fingerspell' | 'skipped';
    originalIndex: number;
}

const VideoSequencePlayer = ({
    translations,
    isLoading = false,
    onWordChange,
    autoPlay = true,
}: VideoSequencePlayerProps) => {
    // Refs for dual video elements (for seamless swapping)
    const videoARef = useRef<HTMLVideoElement>(null);
    const videoBRef = useRef<HTMLVideoElement>(null);
    const [activeVideo, setActiveVideo] = useState<'A' | 'B'>('A');

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Flatten the translation list into a playable sequence of videos
    // Fingerspelled words are expanded into individual letter videos
    const playableItems = useMemo(() => {
        const items: PlayableItem[] = [];

        translations.forEach((item, index) => {
            if (item.type === 'video' && item.url) {
                items.push({
                    id: `video-${index}`,
                    url: item.url,
                    word: item.matched_word || item.original_word,
                    isFingerspell: false,
                    type: 'video',
                    originalIndex: index,
                });
            } else if (item.type === 'fingerspell' && item.letters && item.letters.length > 0) {
                // Expand fingerspelling into individual letters
                item.letters.forEach((letter, letterIndex) => {
                    items.push({
                        id: `fingerspell-${index}-${letterIndex}`,
                        url: `/signs/${letter.toLowerCase()}.mp4`,
                        word: item.original_word,
                        isFingerspell: true,
                        type: 'fingerspell',
                        originalIndex: index,
                    });
                });
            }
            // Skipped items are ignored in the video sequence
        });

        return items;
    }, [translations]);

    const currentItem = playableItems[currentIndex];
    const nextItem = playableItems[currentIndex + 1];

    // Get the active and inactive video refs
    const getActiveVideoRef = useCallback(() =>
        activeVideo === 'A' ? videoARef : videoBRef, [activeVideo]);
    const getInactiveVideoRef = useCallback(() =>
        activeVideo === 'A' ? videoBRef : videoARef, [activeVideo]);

    // Preload the next video in the inactive element
    useEffect(() => {
        const inactiveVideo = getInactiveVideoRef().current;
        if (inactiveVideo && nextItem?.url) {
            inactiveVideo.src = getSignVideoUrl(nextItem.url);
            inactiveVideo.load();
        }
    }, [currentIndex, nextItem, getInactiveVideoRef]);

    // Load the current video
    useEffect(() => {
        const activeVideoEl = getActiveVideoRef().current;
        if (activeVideoEl && currentItem?.url) {
            const videoUrl = getSignVideoUrl(currentItem.url);
            if (activeVideoEl.src !== videoUrl) {
                activeVideoEl.src = videoUrl;
                activeVideoEl.load();
            }
        }
    }, [currentItem, getActiveVideoRef]);

    // Auto-play when new items are loaded
    useEffect(() => {
        if (playableItems.length > 0 && !isLoading) {
            setCurrentIndex(0);
            setActiveVideo('A');
            setIsPlaying(false);

            const timer = setTimeout(() => {
                if (autoPlay) {
                    setIsPlaying(true);
                }
            }, 500); // Short delay before auto-starting

            return () => clearTimeout(timer);
        }
    }, [playableItems, isLoading]);

    // Notify parent of word changes
    useEffect(() => {
        if (currentItem && onWordChange) {
            onWordChange(currentItem.originalIndex, currentItem.word);
        }
    }, [currentIndex, currentItem, onWordChange]);

    // Handle video end - INSTANT switch to next video
    const handleVideoEnd = useCallback(() => {
        if (currentIndex < playableItems.length - 1) {
            // Swap to the preloaded video instantly
            const nextActiveVideo = activeVideo === 'A' ? videoBRef.current : videoARef.current;

            setActiveVideo(prev => prev === 'A' ? 'B' : 'A');
            setCurrentIndex(prev => prev + 1);

            // Play the preloaded video immediately
            if (nextActiveVideo && isPlaying) {
                nextActiveVideo.currentTime = 0;
                nextActiveVideo.play().catch(() => { });
            }
        } else {
            // End of sequence
            setCurrentIndex(0);
            setIsPlaying(false);
            setActiveVideo('A');
            // Reset to first video
            const videoA = videoARef.current;
            if (videoA && playableItems[0]?.url) {
                videoA.src = getSignVideoUrl(playableItems[0].url);
                videoA.load();
            }
        }
    }, [currentIndex, playableItems, isPlaying, activeVideo]);

    // Play/pause the active video
    useEffect(() => {
        const video = getActiveVideoRef().current;
        if (!video) return;

        if (isPlaying && isReady) {
            video.play().catch(() => setIsPlaying(false));
        } else {
            video.pause();
        }
    }, [isPlaying, isReady, activeVideo, getActiveVideoRef]); // Added activeVideo dep

    const handleCanPlay = useCallback(() => {
        setIsReady(true);
        if (isPlaying) {
            getActiveVideoRef().current?.play().catch(() => { });
        }
    }, [isPlaying, getActiveVideoRef]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setIsPlaying(false);
            setIsReady(false);
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            // Load the previous video in active element
            const video = getActiveVideoRef().current;
            if (video && playableItems[newIndex]?.url) {
                video.src = getSignVideoUrl(playableItems[newIndex].url);
                video.load();
            }
        }
    };

    const handleNext = () => {
        if (currentIndex < playableItems.length - 1) {
            // Use the preloaded video
            const nextActiveVideo = activeVideo === 'A' ? videoBRef.current : videoARef.current;
            setActiveVideo(prev => prev === 'A' ? 'B' : 'A');
            setCurrentIndex(prev => prev + 1);

            if (nextActiveVideo && isPlaying) {
                nextActiveVideo.currentTime = 0;
                nextActiveVideo.play().catch(() => { });
            }
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setIsPlaying(true);
        setIsReady(false);
        setActiveVideo('A');
        const video = videoARef.current;
        if (video && playableItems[0]?.url) {
            video.src = getSignVideoUrl(playableItems[0].url);
            video.load();
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="card-elevated">
                <div className="aspect-square rounded-2xl bg-secondary/50 flex flex-col items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary"
                    />
                    <p className="mt-4 text-muted-foreground font-medium">
                        Generating sign animation...
                    </p>
                </div>
            </div>
        );
    }

    // No videos available
    if (playableItems.length === 0) {
        return (
            <div className="card-elevated">
                <div className="aspect-square rounded-2xl bg-secondary/50 flex flex-col items-center justify-center p-8">
                    <p className="text-muted-foreground text-center">
                        No sign videos available for this text.
                        <br />
                        <span className="text-sm">Everything was skipped.</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-elevated max-w-sm mx-auto"
        >
            {/* Video Display - Dual videos for seamless switching */}
            <div className="aspect-[3/4] rounded-2xl bg-black relative overflow-hidden">
                {/* Video A */}
                <video
                    ref={videoARef}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-0 ${activeVideo === 'A' ? 'z-10 opacity-100' : 'z-0 opacity-0'
                        }`}
                    muted
                    playsInline
                    onEnded={activeVideo === 'A' ? handleVideoEnd : undefined}
                    onCanPlay={activeVideo === 'A' ? handleCanPlay : undefined}
                />

                {/* Video B (preloaded, hidden until swap) */}
                <video
                    ref={videoBRef}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-0 ${activeVideo === 'B' ? 'z-10 opacity-100' : 'z-0 opacity-0'
                        }`}
                    muted
                    playsInline
                    onEnded={activeVideo === 'B' ? handleVideoEnd : undefined}
                    onCanPlay={activeVideo === 'B' ? handleCanPlay : undefined}
                />
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
                    disabled={currentIndex === 0}
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
                    disabled={currentIndex === playableItems.length - 1}
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center tap-highlight disabled:opacity-40"
                >
                    <SkipForward className="w-5 h-5 text-foreground" />
                </button>

                <div className="w-12 h-12" /> {/* Spacer for balance */}
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                    className="h-full gradient-primary rounded-full"
                    initial={{ width: '0%' }}
                    animate={{
                        width: `${((currentIndex + 1) / playableItems.length) * 100}%`,
                    }}
                    transition={{ duration: 0.1 }}
                />
            </div>
        </motion.div>
    );
};

export default VideoSequencePlayer;
