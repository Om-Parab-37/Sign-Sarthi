import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  User,
  Mail,
  Camera,
  Edit3,
  Calendar,
  Languages,
  LogOut,
  Loader2,
  Check,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileScreenProps {
  onBack: () => void;
  onSettings: () => void;
  onLogout: () => void;
  onChangePassword: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  joinedDate: Date;
  totalTranslations: number;
}

const ProfileScreen = ({
  onBack,
  onSettings,
  onLogout,
  onChangePassword,
}: ProfileScreenProps) => {
  // Mock user data
  const [user, setUser] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    joinedDate: new Date("2024-01-15"),
    totalTranslations: 42,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editedName.trim()) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser((prev) => ({ ...prev, name: editedName.trim() }));
    setIsEditing(false);
    setIsSaving(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors tap-highlight"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
        <button
          onClick={onSettings}
          className="p-2 -mr-2 rounded-xl hover:bg-secondary transition-colors tap-highlight"
          aria-label="Settings"
        >
          <Settings className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="px-6 pb-8">
        {/* Profile Header */}
        <motion.div
          className="flex flex-col items-center py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-button">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              className="absolute bottom-0 right-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center border-2 border-background shadow-sm tap-highlight"
              aria-label="Change photo"
            >
              <Camera className="w-4 h-4 text-foreground" />
            </button>
          </div>

          {/* Name & Email */}
          <h2 className="text-xl font-bold text-foreground mb-1">{user.name}</h2>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="card-elevated text-center py-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Languages className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{user.totalTranslations}</p>
            <p className="text-xs text-muted-foreground">Translations</p>
          </div>
          <div className="card-elevated text-center py-4">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm font-bold text-foreground">{formatDate(user.joinedDate)}</p>
            <p className="text-xs text-muted-foreground">Member since</p>
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          className="card-elevated mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Profile Details</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Full Name
            </label>
            {isEditing ? (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="input-field pl-12"
                  placeholder="Enter your name"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{user.name}</span>
              </div>
            )}
          </div>

          {/* Email (Read-only) */}
          <div className="mb-4">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Email Address
            </label>
            <div className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{user.email}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Email cannot be changed
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Password
            </label>
            <button
              onClick={onChangePassword}
              className="w-full flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-3 hover:bg-secondary transition-colors tap-highlight"
            >
              <span className="text-foreground">••••••••</span>
              <span className="text-sm text-primary font-medium">Change</span>
            </button>
          </div>

          {/* Save/Cancel Buttons */}
          {isEditing && (
            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditedName(user.name);
                }}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!editedName.trim() || isSaving}
                className="btn-primary flex-1 h-12"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Save</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full h-14 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileScreen;
