'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import ChatMessage from './Chat/ChatMessage'
import type { Message } from '@/lib/types'
import { Loader2 } from 'lucide-react'

interface ChatWindowProps {
  messages: Message[]
  isLoading?: boolean
  streamingMessageId?: string
  onRetry?: (messageId: string) => void
  onSendMessage?: (message: string) => void
}

export default function ChatWindow({
  messages,
  isLoading,
  streamingMessageId,
  onRetry,
  onSendMessage,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      ref={scrollRef}
      className='flex-1 overflow-y-auto chat-scrollbar bg-beige-50 dark:bg-stone-900'
    >
      <div className='max-w-4xl mx-auto pb-4'>
        {/* Welcome message when empty */}
        {messages.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex flex-col items-center justify-center h-full min-h-[60vh] px-4'
          >
            <div className='text-6xl mb-6'>🤖</div>
            <h1 className='text-3xl font-bold text-beige-900 dark:text-beige-50 mb-3'>
              Welcome to Mistral Chat
            </h1>
            <p className='text-beige-700 dark:text-beige-400 text-center max-w-md'>
              Start a conversation with Mistral AI. Ask questions, get creative,
              or explore complex topics with advanced language understanding.
            </p>
            <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl'>
              {[
                '💡 Explain quantum computing',
                '🎨 Write a creative story',
                '📊 Analyze data trends',
                '🔍 Search the web for news',
              ].map((suggestion, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => onSendMessage?.(suggestion)}
                  disabled={isLoading}
                  className='p-4 bg-beige-100 dark:bg-stone-800 rounded-xl border-[3px] border-beige-400 dark:border-stone-700 hover:border-accent dark:hover:border-accent transition-colors cursor-pointer shadow-hard-sm disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <p className='text-sm text-beige-800 dark:text-beige-300'>
                    {suggestion}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={streamingMessageId === message.id}
            onRetry={
              message.error && onRetry ? () => onRetry(message.id) : undefined
            }
          />
        ))}

        {/* Loading indicator */}
        {isLoading && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex items-center justify-center py-12'
          >
            <Loader2
              className='animate-spin text-accent'
              size={32}
            />
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
