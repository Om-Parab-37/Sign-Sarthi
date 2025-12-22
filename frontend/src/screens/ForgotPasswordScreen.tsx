import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ChevronLeft, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onSendOTP: (email: string) => void;
}

const ForgotPasswordScreen = ({ onBack, onSendOTP }: ForgotPasswordScreenProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isValid = email && validateEmail(email);

  const handleSendOTP = async () => {
    if (!isValid) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSent(true);
    setIsLoading(false);
    
    // Trigger navigation after brief delay
    setTimeout(() => {
      onSendOTP(email);
    }, 1000);
  };

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
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Reset Your Password
          </h1>
          <p className="text-muted-foreground">
            Enter your registered email to receive a verification code.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="card-elevated"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {!isSent ? (
            <>
              {/* Email Field */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your registered email"
                    className="input-field pl-12"
                  />
                </div>
                {error && (
                  <p className="text-destructive text-sm mt-1.5">{error}</p>
                )}
              </div>

              {/* Helper Text */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  We'll send a 6-digit verification code to your email. Make sure to check your spam folder if you don't see it.
                </p>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSendOTP}
                disabled={!isValid || isLoading}
                className="btn-primary w-full text-base h-14"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send OTP</span>
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
                OTP Sent Successfully!
              </h3>
              <p className="text-muted-foreground text-sm">
                Check your email for the verification code.
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
          Remember your password?{" "}
          <button onClick={onBack} className="text-primary font-semibold hover:underline">
            Log In
          </button>
        </motion.p>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
