import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
export type FontSize = "small" | "medium" | "large";
export interface TranslationSettings {
    autoPlay: boolean;
}

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
    defaultFontSize?: FontSize;
    storageKey?: string;
    fontSizeStorageKey?: string;
    settingsStorageKey?: string;
}

interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    fontSize: FontSize;
    setFontSize: (fontSize: FontSize) => void;
    settings: TranslationSettings;
    updateSettings: (settings: Partial<TranslationSettings>) => void;
}

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
    fontSize: "medium",
    setFontSize: () => null,
    settings: { autoPlay: true },
    updateSettings: () => null,
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    defaultFontSize = "medium",
    storageKey = "vite-ui-theme",
    fontSizeStorageKey = "signsarthi-ui-fontsize",
    settingsStorageKey = "signsarthi-translation-settings",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    );

    const [fontSize, setFontSize] = useState<FontSize>(
        () => (localStorage.getItem(fontSizeStorageKey) as FontSize) || defaultFontSize
    );

    const [settings, setSettings] = useState<TranslationSettings>(() => {
        const stored = localStorage.getItem(settingsStorageKey);
        return stored ? JSON.parse(stored) : { autoPlay: true };
    });

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement;

        switch (fontSize) {
            case "small":
                root.style.fontSize = "14px";
                break;
            case "medium":
                root.style.fontSize = "16px";
                break;
            case "large":
                root.style.fontSize = "18px";
                break;
            default:
                root.style.fontSize = "16px";
        }
    }, [fontSize]);

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        },
        fontSize,
        setFontSize: (size: FontSize) => {
            localStorage.setItem(fontSizeStorageKey, size);
            setFontSize(size);
        },
        settings,
        updateSettings: (newSettings: Partial<TranslationSettings>) => {
            setSettings(prev => {
                const updated = { ...prev, ...newSettings };
                localStorage.setItem(settingsStorageKey, JSON.stringify(updated));
                return updated;
            });
        }
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};
