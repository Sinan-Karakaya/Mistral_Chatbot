import { motion, AnimatePresence } from 'motion/react'
import { Moon, Sun, Settings as SettingsIcon, X } from 'lucide-react'
import type { ChatSettings } from '@/lib/types'

interface SettingsPanelProps {
  settings: ChatSettings
  onSettingsChange: (settings: ChatSettings) => void
  isOpen: boolean
  onClose: () => void
}

export default function SettingsPanel({
  settings,
  onSettingsChange,
  isOpen,
  onClose,
}: SettingsPanelProps) {
  const toggleDarkMode = () => {
    const newDarkMode = !settings.darkMode
    onSettingsChange({ ...settings, darkMode: newDarkMode })

    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/30 backdrop-blur-sm z-40'
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className='fixed right-0 top-0 bottom-0 w-full max-w-md bg-beige-100 dark:bg-stone-900 shadow-hard-lg border-l-4 border-beige-600 dark:border-stone-700 z-50 overflow-y-auto'
          >
            {/* Header */}
            <div className='sticky top-0 bg-beige-200 dark:bg-stone-900 border-b-[3px] border-beige-400 dark:border-stone-700 px-6 py-4 flex items-center justify-between shadow-hard-sm'>
              <div className='flex items-center gap-3'>
                <SettingsIcon
                  size={20}
                  className='text-beige-800 dark:text-beige-400'
                />
                <h2 className='text-xl font-semibold text-beige-900 dark:text-beige-100'>
                  Settings
                </h2>
              </div>
              <button
                onClick={onClose}
                className='p-2 hover:bg-beige-300 dark:hover:bg-stone-800 rounded-lg transition-colors border-2 border-transparent hover:border-beige-400 dark:hover:border-stone-600'
              >
                <X
                  size={20}
                  color={settings.darkMode ? 'white' : 'black'}
                />
              </button>
            </div>

            {/* Content */}
            <div className='p-6 space-y-6'>
              {/* Appearance */}
              <div>
                <h3 className='text-sm font-semibold text-beige-800 dark:text-beige-300 mb-3'>
                  Appearance
                </h3>
                <button
                  onClick={toggleDarkMode}
                  className='w-full flex items-center justify-between p-4 bg-beige-200 dark:bg-stone-800 rounded-xl hover:bg-beige-300 dark:hover:bg-stone-700 transition-colors border-[3px] border-beige-400 dark:border-stone-700 shadow-hard-sm'
                >
                  <div className='flex items-center gap-3'>
                    {settings.darkMode ? (
                      <Moon
                        size={20}
                        className='text-accent'
                      />
                    ) : (
                      <Sun
                        size={20}
                        className='text-accent'
                      />
                    )}
                    <span className='font-medium text-beige-900 dark:text-beige-100'>
                      {settings.darkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                  <div className='text-sm text-beige-700 dark:text-beige-500'>
                    {settings.darkMode ? 'On' : 'Off'}
                  </div>
                </button>
              </div>

              {/* Model Selection */}
              <div>
                <h3 className='text-sm font-semibold text-beige-800 dark:text-beige-300 mb-3'>
                  Model
                </h3>
                <select
                  value={settings.model}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, model: e.target.value })
                  }
                  className='w-full px-4 py-3 bg-beige-200 dark:bg-stone-800 border-[3px] border-beige-400 dark:border-stone-700 rounded-xl text-beige-900 dark:text-beige-100 focus:shadow-hard-sm focus:border-accent transition-all shadow-hard-sm'
                >
                  <option value='mistral-small-latest'>
                    Mistral Small (Fast)
                  </option>
                  <option value='mistral-medium-latest'>Mistral Medium</option>
                  <option value='mistral-large-latest'>
                    Mistral Large (Most Capable)
                  </option>
                </select>
              </div>

              {/* Temperature */}
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-semibold text-beige-800 dark:text-beige-300'>
                    Temperature
                  </h3>
                  <span className='text-sm font-mono text-accent'>
                    {settings.temperature?.toFixed(2) || '0.70'}
                  </span>
                </div>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.05'
                  value={settings.temperature || 0.7}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      temperature: parseFloat(e.target.value),
                    })
                  }
                  className='w-full cursor-pointer'
                />
                <div className='flex justify-between text-xs text-beige-700 dark:text-beige-500 mt-1'>
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-semibold text-beige-800 dark:text-beige-300'>
                    Max Tokens
                  </h3>
                  <span className='text-sm font-mono text-accent'>
                    {settings.maxTokens || 4096}
                  </span>
                </div>
                <input
                  type='range'
                  min='256'
                  max='8192'
                  step='256'
                  value={settings.maxTokens || 4096}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      maxTokens: parseInt(e.target.value),
                    })
                  }
                  className='w-full cursor-pointer'
                />
                <div className='flex justify-between text-xs text-beige-700 dark:text-beige-500 mt-1'>
                  <span>256</span>
                  <span>8192</span>
                </div>
              </div>

              {/* Info */}
              <div className='pt-4 border-t-[3px] border-beige-400 dark:border-stone-700'>
                <p className='text-xs text-beige-700 dark:text-beige-500 leading-relaxed'>
                  This chatbot supports streaming responses, markdown
                  formatting, syntax highlighting, file uploads, and tool
                  calling (web search). Powered by Mistral AI.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
