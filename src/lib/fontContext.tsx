import React, { createContext, useContext, useState } from 'react';
import { getCookie, setCookie } from './cookies';

interface FontContextType {
  useShantellSans: boolean;
  toggleFont: () => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [useShantellSans, setUseShantellSans] = useState(() => {
    // Check if user previously set a preference in cookies
    if (typeof window !== "undefined") {
      const cookieFont = getCookie("font");
      if (cookieFont === "shantell") return true;
      if (cookieFont === "system") return false;
    }
    return true; // Default to Shantell Sans
  });

  const toggleFont = React.useCallback(() => {
    setUseShantellSans((prev) => {
      const newValue = !prev;
      setCookie("font", newValue ? "shantell" : "system");
      return newValue;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      useShantellSans,
      toggleFont,
    }),
    [useShantellSans, toggleFont]
  );

  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
} 