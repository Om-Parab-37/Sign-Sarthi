import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ChevronLeft, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import HandIcon from "@/components/icons/HandIcon";

interface AuthScreenProps {
  initialMode?: "login" | "signup";
  onBack: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
  onForgotPassword: () => void;
}

type PasswordStrength = "weak" | "medium" | "strong";

const getPasswordStrength = (password: string): PasswordStrength => {
  if (password.length < 6) return "weak";
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const criteriaCount = [hasUppercase, hasLowercase, hasNumbers, hasSpecial].filter(Boolean).length;
  if (password.length >= 8 && criteriaCount >= 3) return "strong";
  if (password.length >= 6 && criteriaCount >= 2) return "medium";
  return "weak";
};

const strengthColors: Record<PasswordStrength, string> = {
  weak: "bg-destructive",
  medium: "bg-accent",
  strong: "bg-primary",
};

const strengthLabels: Record<PasswordStrength, string> = {
  weak: "Weak",
  medium: "Medium",
  strong: "Strong",
};

const AuthScreen = ({
  initialMode = "login",
  onBack,
  onLogin,
  onSignup,
  onForgotPassword,
}: AuthScreenProps) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "name":
        if (!value.trim()) newErrors.name = "Full name is required";
        else if (value.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
        else delete newErrors.name;
        break;
      case "email":
        if (!value.trim()) newErrors.email = "Email is required";
        else if (!validateEmail(value)) newErrors.email = "Please enter a valid email";
        else delete newErrors.email;
        break;
      case "password":
        if (!value) newErrors.password = "Password is required";
        else if (value.length < 6) newErrors.password = "Password must be at least 6 characters";
        else delete newErrors.password;
        break;
      case "confirmPassword":
        if (!value) newErrors.confirmPassword = "Please confirm your password";
        else if (value !== password) newErrors.confirmPassword = "Passwords do not match";
        else delete newErrors.confirmPassword;
        break;
    }

    setErrors(newErrors);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, field === "name" ? name : field === "email" ? email : field === "password" ? password : confirmPassword);
  };

  const isLoginValid = email && password && validateEmail(email) && password.length >= 6;
  const isSignupValid =
    name.trim().length >= 2 &&
    validateEmail(email) &&
    password.length >= 6 &&
    password === confirmPassword &&
    agreedToTerms;

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (mode === "login") {
      onLogin(email, password);
    } else {
      onSignup(name, email, password);
    }
    setIsLoading(false);
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="px-4 py-3 flex items-center">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors tap-highlight"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="px-6 pb-8">
        {/* Logo & Header */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-button mb-4">
            <HandIcon className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            {mode === "login"
              ? "Log in to continue using SignSarthi."
              : "Start translating English to sign language."}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="card-elevated"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Sign Up Fields */}
              {mode === "signup" && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => handleBlur("name")}
                      placeholder="Enter your full name"
                      className="input-field pl-12"
                    />
                  </div>
                  {touched.name && errors.name && (
                    <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                      <X className="w-3.5 h-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="Enter your email"
                    className="input-field pl-12"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter your password"
                    className="input-field pl-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" />
                    {errors.password}
                  </p>
                )}

                {/* Password Strength Indicator (Sign Up only) */}
                {mode === "signup" && password && (
                  <div className="mt-3">
                    <div className="flex gap-1.5 mb-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i === 0
                              ? strengthColors[passwordStrength]
                              : i === 1 && (passwordStrength === "medium" || passwordStrength === "strong")
                              ? strengthColors[passwordStrength]
                              : i === 2 && passwordStrength === "strong"
                              ? strengthColors[passwordStrength]
                              : "bg-secondary"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength: <span className="font-medium">{strengthLabels[passwordStrength]}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password (Sign Up only) */}
              {mode === "signup" && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Confirm your password"
                      className="input-field pl-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-destructive text-sm mt-1.5 flex items-center gap-1">
                      <X className="w-3.5 h-3.5" />
                      {errors.confirmPassword}
                    </p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-primary text-sm mt-1.5 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Passwords match
                    </p>
                  )}
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {mode === "login" && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={onForgotPassword}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Terms Checkbox (Sign Up only) */}
              {mode === "signup" && (
                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                        agreedToTerms
                          ? "bg-primary border-primary"
                          : "bg-secondary border-border"
                      }`}
                    >
                      {agreedToTerms && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground leading-tight">
                    I agree to the{" "}
                    <button className="text-primary font-medium hover:underline">
                      Terms of Service
                    </button>{" "}
                    &{" "}
                    <button className="text-primary font-medium hover:underline">
                      Privacy Policy
                    </button>
                  </span>
                </label>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={mode === "login" ? !isLoginValid || isLoading : !isSignupValid || isLoading}
                className="btn-primary w-full text-base h-14"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{mode === "login" ? "Logging in..." : "Creating account..."}</span>
                  </>
                ) : (
                  <span>{mode === "login" ? "Log In" : "Sign Up"}</span>
                )}
              </Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Switch Mode */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-center text-muted-foreground">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrors({});
                setTouched({});
              }}
              className="text-primary font-semibold hover:underline"
            >
              {mode === "login" ? "Sign Up" : "Log In"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthScreen;
