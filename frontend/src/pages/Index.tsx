import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "@/screens/SplashScreen";
import HomeScreen from "@/screens/HomeScreen";
import TranslationScreen from "@/screens/TranslationScreen";
import InfoModal from "@/screens/InfoModal";
import AuthScreen from "@/screens/AuthScreen";
import ForgotPasswordScreen from "@/screens/ForgotPasswordScreen";
import OTPVerificationScreen from "@/screens/OTPVerificationScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import FingerspellingScreen from "@/screens/FingerspellingScreen";
import TextInputScreen from "@/screens/TextInputScreen";
import HelpScreen from "@/screens/HelpScreen";
import SupportScreen from "@/screens/SupportScreen";
import AboutScreen from "@/screens/AboutScreen";
import BottomNavigation from "@/components/BottomNavigation";

type Screen =
  | "splash"
  | "home"
  | "translation"
  | "history"
  | "auth"
  | "forgot-password"
  | "otp-verification"
  | "profile"
  | "settings"
  | "fingerspelling"
  | "text-input"
  | "help"
  | "support"
  | "about";

interface User {
  name: string;
  email: string;
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [translationText, setTranslationText] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const savedUser = localStorage.getItem("signsarthi-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSplashComplete = () => {
    setCurrentScreen("home");
  };

  const handleTranslate = (text: string) => {
    if (!text) {
      // No text provided, go to text input screen
      setCurrentScreen("text-input");
      return;
    }

    setTranslationText(text);

    setCurrentScreen("translation");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
  };

  const handleEditText = (text: string) => {
    setTranslationText(text);
    setCurrentScreen("text-input");
  };

  const handleBackFromTranslation = () => {
    setCurrentScreen("text-input");
  };

  const handleNewTranslation = () => {
    setTranslationText("");
    setCurrentScreen("text-input");
  };


  // Auth handlers
  const handleGoToAuth = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setCurrentScreen("auth");
  };

  const handleLogin = (email: string, _password: string) => {
    const newUser = { name: "User", email };
    setUser(newUser);
    localStorage.setItem("signsarthi-user", JSON.stringify(newUser));
    setCurrentScreen("home");
  };

  const handleSignup = (name: string, email: string, _password: string) => {
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem("signsarthi-user", JSON.stringify(newUser));
    setCurrentScreen("home");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("signsarthi-user");
    setCurrentScreen("home");
  };

  const handleForgotPassword = () => {
    setCurrentScreen("forgot-password");
  };

  const handleSendOTP = (email: string) => {
    setResetEmail(email);
    setCurrentScreen("otp-verification");
  };

  const handleVerifyOTP = (_otp: string) => {
    // In real app, would navigate to reset password screen
    setCurrentScreen("auth");
  };

  const handleResendOTP = () => {
    // In real app, would trigger resend API
    console.log("Resending OTP to", resetEmail);
  };

  const handleProfile = () => {
    setCurrentScreen("profile");
  };

  const handleSettings = () => {
    setCurrentScreen("settings");
  };

  const handleChangePassword = () => {
    setCurrentScreen("forgot-password");
  };

  const handleHelp = () => setCurrentScreen("help");
  const handleSupport = () => setCurrentScreen("support");
  const handleAbout = () => setCurrentScreen("about");

  const handleFingerspelling = () => {
    setCurrentScreen("fingerspelling");
  };

  const handleFingerspellingToTranslation = (text: string) => {
    setTranslationText(text);
    setCurrentScreen("home");
  };

  const handleTabChange = (tab: "home" | "history" | "profile" | "settings") => {
    switch (tab) {
      case "home":
        setCurrentScreen("home");
        break;
      case "history":
        setCurrentScreen("history");
        break;
      case "profile":
        if (user) setCurrentScreen("profile");
        else handleGoToAuth("login");
        break;
      case "settings":
        setCurrentScreen("settings");
        break;
    }
  };

  const getActiveTab = (): "home" | "history" | "profile" | "settings" => {
    if (currentScreen === "settings") return "settings";
    if (currentScreen === "history") return "history";
    if (currentScreen === "profile") return "profile";
    return "home";
  };

  const showBottomNav = ["home", "history", "profile", "settings"].includes(currentScreen);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Mobile container for realistic preview */}
      <div className="max-w-md mx-auto min-h-screen relative">
        <AnimatePresence mode="wait">
          {currentScreen === "splash" && (
            <motion.div
              key="splash"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SplashScreen onComplete={handleSplashComplete} />
            </motion.div>
          )}

          {currentScreen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HomeScreen
                onTranslate={handleTranslate}
                onInfo={() => setShowInfo(true)}
                onFingerspelling={handleFingerspelling}
                onSettings={handleSettings}
                isLoggedIn={!!user}
                userName={user?.name}
              />
            </motion.div>
          )}

          {currentScreen === "text-input" && (
            <motion.div
              key="text-input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TextInputScreen
                onBack={handleBackToHome}
                onTranslate={handleTranslate}
                initialText={translationText}
              />
            </motion.div>
          )}

          {currentScreen === "translation" && (
            <motion.div
              key="translation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TranslationScreen
                text={translationText}
                onBack={handleNewTranslation}
                onEdit={handleEditText}
                onNewTranslation={handleNewTranslation}
              />
            </motion.div>
          )}

          {currentScreen === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
            </motion.div>
          )}

          {currentScreen === "auth" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AuthScreen
                initialMode={authMode}
                onBack={handleBackToHome}
                onLogin={handleLogin}
                onSignup={handleSignup}
                onForgotPassword={handleForgotPassword}
              />
            </motion.div>
          )}

          {currentScreen === "forgot-password" && (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ForgotPasswordScreen
                onBack={() => setCurrentScreen("auth")}
                onSendOTP={handleSendOTP}
              />
            </motion.div>
          )}

          {currentScreen === "otp-verification" && (
            <motion.div
              key="otp-verification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <OTPVerificationScreen
                email={resetEmail}
                onBack={() => setCurrentScreen("forgot-password")}
                onVerify={handleVerifyOTP}
                onResendOTP={handleResendOTP}
              />
            </motion.div>
          )}

          {currentScreen === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileScreen
                onBack={handleBackToHome}
                onSettings={handleSettings}
                onLogout={handleLogout}
                onChangePassword={handleChangePassword}
              />
            </motion.div>
          )}

          {currentScreen === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsScreen
                onBack={() => setCurrentScreen("profile")}
                onChangePassword={handleChangePassword}
                onHelp={handleHelp}
                onSupport={handleSupport}
                onAbout={handleAbout}
              />
            </motion.div>
          )}

          {currentScreen === "fingerspelling" && (
            <motion.div
              key="fingerspelling"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <FingerspellingScreen
                onBack={handleBackToHome}
                onUseInTranslation={handleFingerspellingToTranslation}
              />
            </motion.div>
          )}

          {currentScreen === "help" && (
            <motion.div
              key="help"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <HelpScreen onBack={handleSettings} />
            </motion.div>
          )}

          {currentScreen === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <SupportScreen onBack={handleSettings} />
            </motion.div>
          )}

          {currentScreen === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AboutScreen onBack={handleSettings} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Modal */}
        <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNavigation
            activeTab={getActiveTab()}
            onTabChange={handleTabChange}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
