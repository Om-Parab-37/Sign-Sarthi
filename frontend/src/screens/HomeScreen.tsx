import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Settings,
  HelpCircle,
  Type,
  Hand,
  Camera,
  Sparkles,
  BookOpen,
  Play,
  Languages,
  Zap,
} from "lucide-react";
import HandIcon from "@/components/icons/HandIcon";
import FeatureCard from "@/components/FeatureCard";
import StatsCard from "@/components/StatsCard";
// import BottomNavigation from "@/components/BottomNavigation";

interface HomeScreenProps {
  onTranslate: (text: string) => void;
  onInfo: () => void;
  onFingerspelling?: () => void;
  onSettings?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  translationCount?: number;
  fingerspellingCount?: number;
}

const HomeScreen = ({
  onTranslate,
  onInfo,
  onFingerspelling,
  onSettings,
  isLoggedIn,
  userName = "Guest",
  translationCount = 0,
  fingerspellingCount = 0,
}: HomeScreenProps) => {
  // const [activeTab, setActiveTab] = useState<"home" | "history" | "profile" | "settings">("home");
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // const handleTabChange = (tab: "home" | "history" | "profile" | "settings") => {
  //   setActiveTab(tab);
  //   if (tab === "history") onHistory();
  //   else if (tab === "profile" && isLoggedIn) onProfile?.();
  //   else if (tab === "profile" && !isLoggedIn) onAuth?.();
  //   else if (tab === "settings") onSettings?.();
  // };

  const handleStartTranslation = () => {
    // Navigate to a text input screen or show input modal
    onTranslate("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Top App Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border"
      >
        <div className="px-5 py-4 flex items-center justify-between">
          {/* Profile & Greeting */}
          <div className="flex items-center gap-3">
            {/* <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={isLoggedIn ? onProfile : onAuth}
              className="relative"
              aria-label={isLoggedIn ? "View profile" : "Log in"}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                {isLoggedIn ? (
                  <span className="text-lg font-bold text-primary">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <HandIcon className="w-6 h-6 text-primary" />
                )}
              </div>
              {isLoggedIn && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
              )}
            </motion.button> */}

            <div>
              <p className="text-lg font-bold text-foreground">
                {greeting}, {isLoggedIn ? userName.split(" ")[0] : "Friend"}
              </p>
              {/* <p className="text-sm text-muted-foreground">
                {isLoggedIn ? "Ready to translate?" : "Sign in to get started"}
              </p> */}
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onInfo}
              className="p-2.5 rounded-xl hover:bg-muted transition-colors"
              aria-label="Help and information"
            >
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
            </motion.button>

          </div>
        </div>
      </motion.header>

      <main className="flex-1 px-5 py-6 space-y-6">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 text-primary-foreground"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              >
                <HandIcon className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full">
                SignSarthi
              </span>
            </div>

            <h1 className="text-xl font-bold mb-2 leading-tight">
              Break the Language Barrier
            </h1>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Translate text into sign language and convert fingerspelling into letters using your camera.
            </p>
          </div>

          {/* Floating icons decoration */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-4 right-4 opacity-20"
          >
            <Languages className="w-16 h-16" />
          </motion.div>
        </motion.div>

        {/* Primary Features Section */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3"
          >
            Core Features
          </motion.h2>

          <div className="space-y-4">
            {/* Text to Sign Feature */}
            <FeatureCard
              icon={Type}
              secondaryIcon={Play}
              title="Text to Sign Translation"
              description="Type any English sentence and view its sign language animation instantly."
              ctaText="Start Translating"
              badge="Most Used"
              badgeVariant="primary"
              onClick={handleStartTranslation}
              variant="primary"
              delay={0.25}
            />

            {/* Fingerspelling Feature */}
            {onFingerspelling && (
              <FeatureCard
                icon={Camera}
                secondaryIcon={Hand}
                title="Live Fingerspelling Detection"
                description="Show fingerspelling in front of your camera and get real-time letter predictions."
                ctaText="Open Camera"
                badge="Real-Time AI"
                badgeVariant="new"
                onClick={onFingerspelling}
                variant="secondary"
                delay={0.35}
              />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Quick Actions
          </h2>
          <div className="flex gap-3">
            {/* <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onHistory}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            >
              <History className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">History</span>
            </motion.button> */}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onInfo}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">How it Works</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Section */}
        {isLoggedIn && (translationCount > 0 || fingerspellingCount > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Your Activity
            </h2>
            <div className="flex gap-3">
              <StatsCard
                icon={Sparkles}
                label="Translations"
                value={translationCount}
                delay={0.55}
              />
              <StatsCard
                icon={Zap}
                label="Fingerspelling"
                value={fingerspellingCount}
                delay={0.6}
              />
            </div>
          </motion.div>
        )}

        {/* First-time user guidance */}
        {/* {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-accent/50 rounded-2xl p-5 border border-primary/10"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Try your first translation!
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Sign in to save your translations and track your progress.
                </p>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onAuth}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Sign in now →
                </motion.button>
              </div>
            </div>
          </motion.div>
        )} */}
      </main>

      {/* Bottom Navigation */}
      {/* <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} /> */}
    </div>
  );
};

export default HomeScreen;
