
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

interface CustomThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextType {
  theme?: string;
  setTheme: (theme: string) => void;
  fontSizeMultiplier: number;
  setFontSizeMultiplier: (multiplier: number) => void;
  actualTheme?: string; // resolved theme (light or dark)
}

const CustomThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <InternalThemeProvider>{children}</InternalThemeProvider>
    </NextThemesProvider>
  )
}

function InternalThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [fontSizeMultiplier, setFontSizeMultiplierState] = React.useState<number>(1);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const storedMultiplier = localStorage.getItem("fontSizeMultiplier");
    if (storedMultiplier) {
      setFontSizeMultiplierState(parseFloat(storedMultiplier));
    }
  }, []);

  React.useEffect(() => {
    if(isMounted) {
      document.documentElement.style.setProperty('--font-size-multiplier', fontSizeMultiplier.toString());
      localStorage.setItem("fontSizeMultiplier", fontSizeMultiplier.toString());
    }
  }, [fontSizeMultiplier, isMounted]);
  
  const setFontSizeMultiplier = (multiplier: number) => {
    if (multiplier >= 0.8 && multiplier <= 1.5) { // Example range
      setFontSizeMultiplierState(multiplier);
    }
  };

  if (!isMounted) {
    // Avoid rendering children until client-side hydration is complete to prevent mismatches
    // You can return a loader here if needed, or null.
    // For simplicity, returning children but with theme potentially undefined until mount.
    return <CustomThemeContext.Provider value={{ 
        theme: undefined, // explicitly undefined until resolvedTheme is available
        setTheme: () => {}, // no-op until mounted
        fontSizeMultiplier, 
        setFontSizeMultiplier,
        actualTheme: undefined 
      }}>
      {children}
    </CustomThemeContext.Provider>;
  }


  return (
    <CustomThemeContext.Provider value={{ theme, setTheme, fontSizeMultiplier, setFontSizeMultiplier, actualTheme: resolvedTheme }}>
      {children}
    </CustomThemeContext.Provider>
  )
}


export const useTheme = () => {
  const context = React.useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
