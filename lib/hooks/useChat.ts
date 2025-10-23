import { useState, useCallback } from 'react'
import type { Message, FileAttachment, StreamChunk } from '@/lib/types'
import { sendChatMessage } from '@/lib/api'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<
    string | undefined
  >(undefined)

  const handleSend = useCallback(
    async (content: string, model: string, files?: FileAttachment[]) => {
      if (!content.trim() && (!files || files.length === 0)) return

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        files,
        createdAt: Date.now(),
      }
      setMessages((prev) => [...prev, userMessage])

      // Create placeholder for assistant message
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        createdAt: Date.now() + 1,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setStreamingMessageId(assistantMessageId)
      setIsLoading(true)

      // Send to API with streaming
      try {
        await sendChatMessage({
          messages: [...messages, userMessage],
          model,
          useTools: true,
          onChunk: (chunk: StreamChunk) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: msg.content + chunk.delta }
                  : msg
              )
            )
          },
          onComplete: () => {
            setIsLoading(false)
            setStreamingMessageId(undefined)
          },
          onError: (error) => {
            console.error('Chat error:', error)
            const errorMessage =
              error.message || 'Failed to get a response. Please try again.'
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content: '',
                      error: true,
                      errorMessage,
                    }
                  : msg
              )
            )
            setIsLoading(false)
            setStreamingMessageId(undefined)
          },
        })
      } catch (error) {
        console.error('Error sending message:', error)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: '',
                  error: true,
                  errorMessage:
                    'Network error. Please check your connection and try again.',
                }
              : msg
          )
        )
        setIsLoading(false)
        setStreamingMessageId(undefined)
      }
    },
    [messages]
  )

  const handleRetry = useCallback(
    (messageId: string, model: string) => {
      // Find the failed message and the user message before it
      const messageIndex = messages.findIndex((m) => m.id === messageId)
      if (messageIndex > 0) {
        const previousUserMessage = messages[messageIndex - 1]
        if (previousUserMessage.role === 'user') {
          // Remove the failed message and retry
          setMessages((prev) => prev.filter((m) => m.id !== messageId))
          handleSend(
            previousUserMessage.content,
            model,
            previousUserMessage.files
          )
        }
      }
    },
    [messages, handleSend]
  )

  return {
    messages,
    isLoading,
    streamingMessageId,
    handleSend,
    handleRetry,
  }
}
