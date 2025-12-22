import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Type,
  Play,
  List,
  Lock,
  Shield,
  HelpCircle,
  MessageCircle,
  Info,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, FontSize } from "@/contexts/ThemeContext";

interface SettingsScreenProps {
  onBack: () => void;
  onChangePassword: () => void;
  onHelp: () => void;
  onSupport: () => void;
  onAbout: () => void;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const SettingsScreen = ({ onBack, onChangePassword, onHelp, onSupport, onAbout }: SettingsScreenProps) => {
  const { theme, setTheme, fontSize, setFontSize, settings, updateSettings } = useTheme();
  const isDarkMode = theme === "dark";

  // const [fontSize, setFontSize] = useState<FontSize>("medium");
  // const [autoPlayAnimation, setAutoPlayAnimation] = useState(true);
  // const [showWordBreakdown, setShowWordBreakdown] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const fontSizeLabels: Record<FontSize, string> = {
    small: "Small",
    medium: "Medium",
    large: "Large",
  };

  const fontSizes: FontSize[] = ["small", "medium", "large"];

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // In real app, call delete API here
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  const handleThemeChange = (enabled: boolean) => {
    setTheme(enabled ? "dark" : "light");
  };

  const ToggleSwitch = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-7 rounded-full transition-all duration-200 relative ${enabled ? "bg-primary" : "bg-secondary"
        }`}
      role="switch"
      aria-checked={enabled}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-200 ${enabled ? "left-6" : "left-1"
          }`}
      />
    </button>
  );

  const SettingRow = ({
    icon: Icon,
    label,
    description,
    children,
    onClick,
    destructive,
  }: {
    icon: React.ElementType;
    label: string;
    description?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    destructive?: boolean;
  }) => {
    const Component = onClick ? "button" : "div";

    return (
      <Component
        onClick={onClick}
        className={`w-[calc(100%+3rem)] flex items-center justify-between py-4 px-6 -mx-6 hover:bg-secondary/50 transition-colors rounded-xl ${onClick ? "tap-highlight text-left" : ""
          }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${destructive ? "bg-destructive/10" : "bg-secondary"
              }`}
          >
            <Icon
              className={`w-5 h-5 ${destructive ? "text-destructive" : "text-muted-foreground"
                }`}
            />
          </div>
          <div className="text-left">
            <p
              className={`font-medium ${destructive ? "text-destructive" : "text-foreground"
                }`}
            >
              {label}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {children ||
          (onClick && <ChevronRight className="w-5 h-5 text-muted-foreground" />)}
      </Component>
    );
  };

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border"
      >
        <div className="px-5 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
        </div>
      </motion.header>

      <div className="px-6 pb-24 pt-6">
        {/* Appearance Section */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
            Appearance
          </h2>
          <div className="card-elevated">
            {/* Dark Mode Toggle */}
            <SettingRow
              icon={isDarkMode ? Moon : Sun}
              label={isDarkMode ? "Dark Mode" : "Light Mode"}
              description="Switch between light and dark theme"
            >
              <ToggleSwitch enabled={isDarkMode} onChange={handleThemeChange} />
            </SettingRow>

            <div className="h-px bg-border -mx-6" />

            {/* Font Size */}
            <div className="py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <Type className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Font Size</p>
                  <p className="text-xs text-muted-foreground">
                    Adjust text size for better readability
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 tap-highlight ${fontSize === size
                      ? "gradient-primary text-primary-foreground shadow-button"
                      : "bg-secondary text-secondary-foreground"
                      }`}
                  >
                    {fontSizeLabels[size]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Translation Preferences */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
            Translation Preferences
          </h2>
          <div className="card-elevated">
            <SettingRow
              icon={Play}
              label="Auto-play Animations"
              description="Automatically play sign animation after translation"
            >
              <ToggleSwitch
                enabled={settings.autoPlay}
                onChange={(val) => updateSettings({ autoPlay: val })}
              />
            </SettingRow>

          </div>
        </motion.div>

        {/* Privacy & Security */}
        {/* <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
            Privacy & Security
          </h2>
          <div className="card-elevated">
            <SettingRow
              icon={Lock}
              label="Change Password"
              description="Update your account password"
              onClick={onChangePassword}
            />

            <div className="h-px bg-border -mx-6" />

            <SettingRow
              icon={Shield}
              label="Data & Privacy"
              description="Manage your data preferences"
              onClick={() => { }}
            />
          </div>
        </motion.div> */}

        {/* Support */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
            Support
          </h2>
          <div className="card-elevated">
            <SettingRow
              icon={HelpCircle}
              label="Help & FAQ"
              description="Get answers to common questions"
              onClick={onHelp}
            />

            <div className="h-px bg-border -mx-6" />

            <SettingRow
              icon={MessageCircle}
              label="Contact Support"
              description="Reach out to our support team"
              onClick={onSupport}
            />

            <div className="h-px bg-border -mx-6" />

            <SettingRow
              icon={Info}
              label="About SignSarthi"
              description="Version 1.0.0"
              onClick={onAbout}
            />
          </div>
        </motion.div>

        {/* Danger Zone */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="text-sm font-semibold text-destructive/70 uppercase tracking-wider mb-2 px-4">
            Danger Zone
          </h2>
          <div className="card-elevated border border-destructive/20">
            <SettingRow
              icon={Trash2}
              label="Delete Account"
              description="Permanently delete your account and data"
              onClick={() => setShowDeleteModal(true)}
              destructive
            />
          </div>
        </motion.div> */}
      </div >

      {/* Delete Account Modal */}
      <AnimatePresence>
        {
          showDeleteModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                className="w-full max-w-md bg-card rounded-t-3xl p-6 safe-area-bottom"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-xl hover:bg-secondary transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Warning Icon */}
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>

                <h3 className="text-xl font-bold text-foreground text-center mb-2">
                  Delete Account?
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  This action cannot be undone. All your data, translations, and history will be permanently deleted.
                </p>

                {/* Confirmation Input */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                    placeholder="DELETE"
                    className="input-field text-center font-mono uppercase tracking-widest"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 h-12"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== "DELETE" || isDeleting}
                    className="flex-1 h-12 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <span>Delete Account</span>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >
    </div >
  );
};


export default SettingsScreen;
