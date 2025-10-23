import { useState, useEffect } from 'react'

export function useTheme() {
  // Initialize dark mode from system preference
  const isDarkMode =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false

  const [darkMode, setDarkMode] = useState(isDarkMode)

  // Apply dark mode whenever it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return {
    darkMode,
    setDarkMode,
    toggleDarkMode: () => setDarkMode((prev) => !prev),
  }
}
