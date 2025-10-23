'use client'

import { useCallback, useEffect } from 'react'
import ChatWindow from './ChatWindow'
import Composer from './Composer'
import SettingsPanel from './SettingsPanel'
import { Settings, MessageSquare } from 'lucide-react'
import { useTheme, useSettings, useChat } from '@/lib/hooks'
import type { FileAttachment } from '@/lib/types'

export default function ChatPage() {
  const { darkMode, setDarkMode } = useTheme()
  const { settings, setSettings, settingsOpen, setSettingsOpen } =
    useSettings(darkMode)
  const {
    messages,
    isLoading,
    streamingMessageId,
    handleSend: chatHandleSend,
    handleRetry: chatHandleRetry,
  } = useChat()

  // Sync theme with settings
  useEffect(() => {
    setSettings((prev) => ({ ...prev, darkMode }))
  }, [darkMode, setSettings])

  // Sync settings darkMode changes back to theme
  useEffect(() => {
    if (settings.darkMode !== darkMode) {
      setDarkMode(settings.darkMode)
    }
  }, [settings.darkMode, darkMode, setDarkMode])

  const handleSend = useCallback(
    async (content: string, files?: FileAttachment[]) => {
      await chatHandleSend(content, settings.model, files)
    },
    [chatHandleSend, settings.model]
  )

  const handleRetry = useCallback(
    (messageId: string) => {
      chatHandleRetry(messageId, settings.model)
    },
    [chatHandleRetry, settings.model]
  )

  return (
    <div className='flex flex-col h-screen bg-beige-50 dark:bg-stone-900'>
      {/* Header */}
      <header className='shrink-0 border-b-[3px] border-beige-400 dark:border-stone-700 bg-beige-100 dark:bg-stone-900 shadow-hard'>
        <div className='max-w-7xl mx-auto px-4 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-linear-to-br from-accent to-accent-hover rounded-lg flex items-center justify-center border-2 border-beige-900 dark:border-beige-100 shadow-hard-sm'>
              <MessageSquare
                size={18}
                className='text-white'
              />
            </div>
            <div>
              <h1 className='text-lg font-semibold text-beige-900 dark:text-beige-50'>
                Mistral Chat
              </h1>
              <p className='text-xs text-beige-700 dark:text-beige-400'>
                Powered by {settings.model}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className='p-2 hover:bg-beige-200 dark:hover:bg-stone-800 rounded-lg transition-colors border-2 border-transparent hover:border-beige-400 dark:hover:border-stone-600'
            aria-label='Open settings'
          >
            <Settings
              size={20}
              className='text-beige-700 dark:text-beige-400'
            />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        streamingMessageId={streamingMessageId}
        onRetry={handleRetry}
        onSendMessage={(message) => handleSend(message)}
      />

      {/* Composer */}
      <Composer
        onSend={handleSend}
        disabled={isLoading}
        isLoading={isLoading}
      />

      {/* Settings Panel */}
      <SettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
