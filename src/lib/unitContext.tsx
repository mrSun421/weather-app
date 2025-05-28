import { createContext, useContext, useState, type ReactNode } from 'react';
import { type UnitGroup } from './visual-crossing-client';
import { getCookie, setCookie } from './cookies';

interface UnitContextType {
  unitGroup: UnitGroup;
  setUnitGroup: (group: UnitGroup) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unitGroup, setUnitGroup] = useState<UnitGroup>(() => {
    // Check if user previously set a preference in cookies
    if (typeof window !== "undefined") {
      const cookieUnit = getCookie("unit");
      if (cookieUnit === "us") return "us";
      if (cookieUnit === "uk") return "uk";
      if (cookieUnit === "metric") return "metric";
      if (cookieUnit === "base") return "base";
      
      // If no cookie, try to detect user's locale for a reasonable default
      const userLocale = navigator.language.toLowerCase();
      if (userLocale.startsWith('en-us')) return 'us';
      if (userLocale.startsWith('en-gb')) return 'uk';
      return 'metric'; // Default to metric for all other locales
    }
    return 'us'; // Fallback default
  });

  const handleUnitChange = (newUnit: UnitGroup) => {
    setUnitGroup(newUnit);
    setCookie("unit", newUnit);
  };

  return (
    <UnitContext.Provider value={{ unitGroup, setUnitGroup: handleUnitChange }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const context = useContext(UnitContext);
  if (context === undefined) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
} 