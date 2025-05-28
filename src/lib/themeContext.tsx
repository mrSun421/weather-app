import * as React from "react"
import { getCookie, setCookie } from "./cookies"

type ThemeContextType = {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const ThemeContext = React.createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    // Check if user previously set a preference in cookies
    if (typeof window !== "undefined") {
      const cookieTheme = getCookie("theme")
      if (cookieTheme === "dark") return true
      if (cookieTheme === "light") return false
      // If no cookie, check system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  // Apply theme class on initial load
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleDarkMode = React.useCallback(() => {
    setIsDarkMode((prev) => {
      const newValue = !prev
      if (newValue) {
        document.documentElement.classList.add("dark")
        setCookie("theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        setCookie("theme", "light")
      }
      return newValue
    })
  }, [])

  const value = React.useMemo(
    () => ({
      isDarkMode,
      toggleDarkMode,
    }),
    [isDarkMode, toggleDarkMode]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
} 