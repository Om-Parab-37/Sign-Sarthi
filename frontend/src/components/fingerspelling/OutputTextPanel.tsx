import { motion } from "framer-motion";
import { Delete, Space, Trash2, Copy, ArrowRight, Check } from "lucide-react";
import { useState } from "react";

interface OutputTextPanelProps {
  text: string;
  onBackspace: () => void;
  onSpace: () => void;
  onClear: () => void;
  onCopy: () => void;
  onUseInTranslation?: (text: string) => void;
}

const OutputTextPanel = ({
  text,
  onBackspace,
  onSpace,
  onClear,
  onCopy,
  onUseInTranslation,
}: OutputTextPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/95 backdrop-blur-md rounded-t-3xl p-4 pb-6 shadow-lg border-t border-border"
    >
      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Output Text
        </p>
        <div className="flex items-center gap-2">
          {text && (
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Copy text"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClear}
                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                aria-label="Clear all"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Text display area */}
      <div className="min-h-[48px] bg-muted/50 rounded-xl p-3 mb-4 overflow-x-auto">
        {text ? (
          <motion.p
            key={text}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold text-foreground tracking-wider whitespace-nowrap"
          >
            {text.split("").map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={char === " " ? "mx-2" : "mx-0.5"}
              >
                {char === " " ? "␣" : char}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-0.5 h-5 bg-primary ml-1 align-middle"
            />
          </motion.p>
        ) : (
          <p className="text-muted-foreground text-lg">
            Letters will appear here...
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBackspace}
          disabled={!text}
          className="flex-1 py-3 rounded-xl bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-foreground transition-colors"
        >
          <Delete className="w-5 h-5" />
          Backspace
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSpace}
          className="flex-1 py-3 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center gap-2 font-medium text-foreground transition-colors"
        >
          <Space className="w-5 h-5" />
          Space
        </motion.button>
      </div>

      {/* Use in translation button */}
      {text && onUseInTranslation && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onUseInTranslation(text)}
          className="w-full mt-3 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium flex items-center justify-center gap-2 transition-colors"
        >
          Use in Text → Sign Translation
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default OutputTextPanel;
