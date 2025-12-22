import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Edit3, RefreshCw, AlertCircle } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";
import VideoSequencePlayer from "@/components/VideoSequencePlayer";

import {
  translateText,
  TranslationItem,
  TranslationApiError,
} from "@/services/translationApi";
import { useTheme } from "@/contexts/ThemeContext";

interface TranslationScreenProps {
  text: string;
  onBack: () => void;
  onEdit: (text: string) => void;
  onNewTranslation: () => void;
}

type TranslationState = "loading" | "success" | "error";

const TranslationScreen = ({
  text,
  onBack,
  onEdit,
  onNewTranslation,
}: TranslationScreenProps) => {
  const { settings } = useTheme();
  const [state, setState] = useState<TranslationState>("loading");
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Get words for timeline (all translations, including fingerspell)
  const words = translations.map((t) => t.original_word);

  useEffect(() => {
    const fetchTranslation = async () => {
      setState("loading");
      setErrorMessage("");

      try {
        const response = await translateText(text);
        setTranslations(response.translations);
        setState("success");
      } catch (error) {
        console.error("Translation failed:", error);
        if (error instanceof TranslationApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Could not connect to translation server");
        }
        setState("error");
      }
    };

    fetchTranslation();
  }, [text]);

  const handleRetry = async () => {
    setState("loading");
    setErrorMessage("");

    try {
      const response = await translateText(text);
      setTranslations(response.translations);
      setState("success");
    } catch (error) {
      console.error("Translation retry failed:", error);
      if (error instanceof TranslationApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Could not connect to translation server");
      }
      setState("error");
    }
  };

  const handleWordChange = (index: number) => {
    setCurrentWordIndex(index);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        title="Translation"
        showBack
        showActions={false}
        onBack={onBack}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-5 pb-8 flex flex-col gap-4"
      >
        {/* Original Text Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Your sentence
              </p>
              <p className="text-lg font-medium text-foreground leading-relaxed">
                {text}
              </p>
            </div>
            <button
              onClick={() => onEdit(text)}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center tap-highlight flex-shrink-0"
            >
              <Edit3 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Video Player or States */}
        {state === "loading" && (
          <VideoSequencePlayer translations={[]} isLoading />
        )}

        {state === "error" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-elevated"
          >
            <div className="aspect-square rounded-2xl bg-destructive/5 flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Translation Failed
              </h3>
              <p className="text-muted-foreground text-center text-sm mb-6">
                {errorMessage || "We couldn't generate the sign animation right now."}
                <br />
                Please check your connection and try again.
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                className="btn-primary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Translation
              </motion.button>
            </div>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <VideoSequencePlayer
              translations={translations}
              onWordChange={handleWordChange}
              autoPlay={settings.autoPlay}
            />
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-auto pt-4 flex flex-col gap-3"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onNewTranslation}
            className="btn-primary w-full text-base"
          >
            Translate New Text
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onEdit(text)}
            className="btn-secondary w-full text-base"
          >
            Edit This Text
          </motion.button>
        </motion.div>
      </motion.main>
    </div >
  );
};

export default TranslationScreen;

