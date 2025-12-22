import { motion } from "framer-motion";
import { Clock, Trash2 } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";

interface HistoryItem {
  id: string;
  text: string;
  timestamp: Date;
}

interface HistoryScreenProps {
  history: HistoryItem[];
  onBack: () => void;
  onSelectItem: (text: string) => void;
  onClearHistory: () => void;
}

const HistoryScreen = ({
  history,
  onBack,
  onSelectItem,
  onClearHistory,
}: HistoryScreenProps) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    
    return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        title="History"
        showBack
        showActions={false}
        onBack={onBack}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 px-5 pb-8 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground text-sm">
            {history.length} translation{history.length !== 1 ? "s" : ""}
          </p>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-sm text-destructive font-medium flex items-center gap-1 tap-highlight"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center px-8"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Clock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No History Yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Your previous translations will appear here
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectItem(item.text)}
                className="card-elevated text-left tap-highlight hover:shadow-lg transition-shadow"
              >
                <p className="text-foreground font-medium line-clamp-2 mb-2">
                  {item.text}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(item.timestamp)}
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </motion.main>
    </div>
  );
};

export default HistoryScreen;
