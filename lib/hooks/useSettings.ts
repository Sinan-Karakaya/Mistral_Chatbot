import { useState } from 'react'
import type { ChatSettings } from '@/lib/types'

export function useSettings(initialDarkMode: boolean = false) {
  const [settings, setSettings] = useState<ChatSettings>({
    model: 'mistral-small-latest',
    temperature: 0.7,
    maxTokens: 4096,
    darkMode: initialDarkMode,
  })

  const [settingsOpen, setSettingsOpen] = useState(false)

  return {
    settings,
    setSettings,
    settingsOpen,
    setSettingsOpen,
  }
}
