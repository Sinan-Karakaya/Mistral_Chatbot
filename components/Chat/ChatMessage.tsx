'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import StreamingText from './StreamingText'
import type { Message } from '@/lib/types'
import { Bot, User, Copy, Check, AlertCircle, RotateCcw } from 'lucide-react'

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
  onRetry?: () => void
}

export default function ChatMessage({
  message,
  isStreaming,
  onRetry,
}: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-4 w-full px-4 py-6 ${
        isUser ? 'bg-transparent' : 'bg-beige-200/50 dark:bg-stone-800/30'
      }`}
    >
      {/* Avatar */}
      <div className='shrink-0'>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-hard-sm ${
            isUser
              ? 'bg-accent text-white border-beige-900 dark:border-beige-100'
              : 'bg-beige-300 dark:bg-stone-700 text-beige-900 dark:text-beige-200 border-beige-600 dark:border-stone-500'
          }`}
        >
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>
      </div>

      {/* Message Content */}
      <div className='flex-1 min-w-0 pt-1'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-sm font-medium text-beige-800 dark:text-beige-300'>
            {isUser ? 'You' : 'Mistral'}
          </div>
          {/* Copy button for assistant messages */}
          {!isUser && !isStreaming && message.content && (
            <button
              onClick={handleCopy}
              className='p-1.5 hover:bg-beige-300 dark:hover:bg-stone-700 rounded-lg transition-colors group border-2 border-transparent hover:border-beige-400 dark:hover:border-stone-600'
              aria-label='Copy message'
            >
              {copied ? (
                <Check
                  size={14}
                  className='text-green-600 dark:text-green-400'
                />
              ) : (
                <Copy
                  size={14}
                  className='text-beige-600 group-hover:text-beige-900 dark:text-beige-500 dark:group-hover:text-beige-300'
                />
              )}
            </button>
          )}
        </div>
        <div className='text-beige-900 dark:text-beige-100'>
          {isUser ? (
            <div className='space-y-3'>
              {/* Display attached images */}
              {message.files && message.files.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {message.files.map((file) =>
                    file.type.startsWith('image/') &&
                    (file.data || file.url) ? (
                      <img
                        key={file.id}
                        src={file.data || file.url}
                        alt={file.name}
                        className='max-w-xs max-h-64 object-contain rounded-lg border-2 border-beige-400 dark:border-stone-600 shadow-hard'
                      />
                    ) : null
                  )}
                </div>
              )}
              {/* Display text content */}
              {message.content && (
                <div className='whitespace-pre-wrap wrap-break-word'>
                  {message.content}
                </div>
              )}
            </div>
          ) : message.error ? (
            <div className='space-y-3'>
              <div className='flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-800 rounded-lg shadow-hard-sm'>
                <AlertCircle
                  size={18}
                  className='text-red-600 dark:text-red-400 shrink-0 mt-0.5'
                />
                <div className='flex-1'>
                  <p className='text-sm font-medium text-red-800 dark:text-red-300 mb-1'>
                    Error occurred
                  </p>
                  <p className='text-sm text-red-700 dark:text-red-400'>
                    {message.errorMessage ||
                      'Failed to get a response. Please try again.'}
                  </p>
                </div>
              </div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className='flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors text-sm font-medium border-2 border-beige-900 dark:border-beige-100 shadow-hard-sm'
                >
                  <RotateCcw size={16} />
                  Retry
                </button>
              )}
            </div>
          ) : (
            <StreamingText
              content={message.content}
              isStreaming={isStreaming}
            />
          )}
        </div>

        {/* Tool calls indicator */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className='mt-3 p-3 bg-beige-200 dark:bg-stone-800 rounded-lg border-2 border-beige-400 dark:border-stone-700 shadow-hard-sm'
          >
            <div className='text-xs font-medium text-beige-800 dark:text-beige-400 mb-2'>
              🔧 Tool Calls
            </div>
            {message.toolCalls.map((tool, idx) => (
              <div
                key={idx}
                className='text-xs text-beige-900 dark:text-beige-300'
              >
                {tool.name}
              </div>
            ))}
          </motion.div>
        )}

        {/* File attachments */}
        {message.files && message.files.length > 0 && (
          <div className='mt-3 flex flex-wrap gap-2'>
            {message.files.map((file) => (
              <div
                key={file.id}
                className='px-3 py-2 bg-beige-200 dark:bg-stone-800 rounded-lg text-xs text-beige-900 dark:text-beige-300 border-2 border-beige-400 dark:border-stone-700 shadow-hard-sm'
              >
                📎 {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
