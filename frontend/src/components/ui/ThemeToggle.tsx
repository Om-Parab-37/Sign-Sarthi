import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            <span className="sr-only">Toggle theme</span>
            {theme === "dark" ? (
                <Sun className="h-5 w-5 text-foreground transition-all" />
            ) : (
                <Moon className="h-5 w-5 text-foreground transition-all" />
            )}
        </button>
    );
}
