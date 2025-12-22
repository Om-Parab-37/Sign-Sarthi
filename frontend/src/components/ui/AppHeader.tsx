import { motion } from "framer-motion";
import { ArrowLeft, Info, Settings, Clock } from "lucide-react";
import HandIcon from "../icons/HandIcon";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showActions?: boolean;
  onBack?: () => void;
  onInfo?: () => void;
  onSettings?: () => void;
  onHistory?: () => void;
  children?: React.ReactNode;
}

const AppHeader = ({
  title = "SignSarthi",
  showBack = false,
  showActions = true,
  onBack,
  onInfo,
  onSettings,
  onHistory,
  children,
}: AppHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-5 py-4 safe-area-top"
    >
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary tap-highlight"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        ) : (
          <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center">
            <HandIcon className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>

      {showActions && (
        <div className="flex items-center gap-2">
          {/* {onHistory && (
            <button
              onClick={onHistory}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary tap-highlight"
            >
              <Clock className="w-5 h-5 text-muted-foreground" />
            </button>
          )} */}
          {onInfo && (
            <button
              onClick={onInfo}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary tap-highlight"
            >
              <Info className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          {onSettings && (
            <button
              onClick={onSettings}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary tap-highlight"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          {children}
        </div>
      )}
    </motion.header>
  );
};

export default AppHeader;
