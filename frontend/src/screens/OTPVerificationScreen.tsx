import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OTPVerificationScreenProps {
  email: string;
  onBack: () => void;
  onVerify: (otp: string) => void;
  onResendOTP: () => void;
}

const OTPVerificationScreen = ({
  email,
  onBack,
  onVerify,
  onResendOTP,
}: OTPVerificationScreenProps) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);
    setError("");

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or last input
    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const isComplete = otp.every((digit) => digit !== "");

  const handleVerify = async () => {
    if (!isComplete) return;

    setIsLoading(true);
    setError("");

    // Simulate API verification
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success (in real app, check response)
    const otpString = otp.join("");
    if (otpString === "123456") {
      setIsVerified(true);
      setTimeout(() => {
        onVerify(otpString);
      }, 1000);
    } else {
      setError("Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
    setIsLoading(false);
  };

  const handleResend = () => {
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
    onResendOTP();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Mask email for privacy
  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

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
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Verify Your Email
          </h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-foreground">{maskedEmail}</span>
          </p>
        </motion.div>

        {/* OTP Card */}
        <motion.div
          className="card-elevated"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {!isVerified ? (
            <>
              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none bg-secondary/50 ${
                      digit
                        ? "border-primary bg-primary/5"
                        : "border-border focus:border-primary focus:bg-background"
                    } ${error ? "border-destructive" : ""}`}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <motion.p
                  className="text-destructive text-sm text-center mb-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}

              {/* Timer */}
              <div className="text-center mb-6">
                {resendTimer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend OTP in{" "}
                    <span className="font-semibold text-foreground">
                      {formatTime(resendTimer)}
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {/* Helper Text */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive the code? Check your spam folder or request a new one.
                </p>
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerify}
                disabled={!isComplete || isLoading}
                className="btn-primary w-full text-base h-14"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify OTP</span>
                )}
              </Button>
            </>
          ) : (
            <motion.div
              className="text-center py-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Email Verified!
              </h3>
              <p className="text-muted-foreground text-sm">
                Redirecting you to reset your password...
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Back to Login */}
        <motion.p
          className="text-center mt-6 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Wrong email?{" "}
          <button onClick={onBack} className="text-primary font-semibold hover:underline">
            Go Back
          </button>
        </motion.p>
      </div>
    </div>
  );
};

export default OTPVerificationScreen;
