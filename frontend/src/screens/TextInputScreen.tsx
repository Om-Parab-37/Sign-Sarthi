import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Sparkles, ArrowRight, X } from "lucide-react";
import HandIcon from "@/components/icons/HandIcon";
import Chip from "@/components/ui/Chip";

interface TextInputScreenProps {
  onBack: () => void;
  onTranslate: (text: string) => void;
  initialText?: string;
}

const EXAMPLE_PHRASES = [
  "Hello",
  "Good Morning",
  "Please Help Me",
  "What is your name?",
  "Thank you",
  "I love you",
  "Nice to meet you",
  "How are you?",
];

const MAX_CHARS = 200;

const TextInputScreen = ({
  onBack,
  onTranslate,
  initialText = "",
}: TextInputScreenProps) => {
  const [inputText, setInputText] = useState(initialText);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsTranslating(false);
    onTranslate(inputText.trim());
  };

  const handleExampleClick = (phrase: string) => {
    setInputText(phrase);
  };

  const handleClear = () => {
    setInputText("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border"
      >
        <div className="px-4 py-4 flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>

          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Text to Sign</h1>
            <p className="text-sm text-muted-foreground">Enter text to translate</p>
          </div>

          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <HandIcon className="w-8 h-8 text-primary" />
          </motion.div>
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-5 py-6 flex flex-col"
      >
        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated flex-1 flex flex-col"
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Enter English text
            </label>
            {inputText && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                aria-label="Clear text"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            )}
          </div>

          <div className="relative flex-1 min-h-[150px]">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Type something like 'Good morning, how are you?'"
              className="input-field h-full resize-none text-lg"
              rows={4}
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between mt-3 mb-4">
            <p className="text-xs text-muted-foreground">
              We support simple English sentences
            </p>
            <span
              className={`text-xs font-medium ${
                inputText.length >= MAX_CHARS ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {inputText.length} / {MAX_CHARS}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleTranslate}
            disabled={!inputText.trim() || isTranslating}
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
          >
            {isTranslating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
                Translating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Translate to Sign
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Example Phrases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Try these examples
          </h3>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PHRASES.map((phrase, index) => (
              <motion.div
                key={phrase}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.03 }}
              >
                <Chip onClick={() => handleExampleClick(phrase)} active={inputText === phrase}>
                  {phrase}
                </Chip>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default TextInputScreen;
