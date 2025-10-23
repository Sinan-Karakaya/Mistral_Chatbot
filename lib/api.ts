import type { Message, StreamChunk } from './types'

export interface SendMessageParams {
  messages: Message[]
  model: string
  useTools?: boolean
  onChunk?: (chunk: StreamChunk) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

export async function sendChatMessage({
  messages,
  model,
  useTools = true,
  onChunk,
  onComplete,
  onError,
}: SendMessageParams): Promise<void> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map((m) => {
          // If the message has files (images), format as multi-modal content
          if (m.files && m.files.length > 0) {
            const content: Array<{
              type: string
              text?: string
              imageUrl?: string
            }> = []

            // Add text content if present
            if (m.content) {
              content.push({
                type: 'text',
                text: m.content,
              })
            }

            // Add image URLs
            for (const file of m.files) {
              if (file.type.startsWith('image/')) {
                content.push({
                  type: 'image_url',
                  imageUrl: file.url || file.data || '',
                })
              }
            }

            return {
              role: m.role,
              content,
            }
          }

          // Plain text message
          return {
            role: m.role,
            content: m.content,
          }
        }),
        model,
        useTools,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No response body')
    }

    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        onComplete?.()
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))

          if (data.type === 'content') {
            onChunk?.({
              id: Date.now().toString(),
              delta: data.content,
              role: 'assistant',
            })
          } else if (data.type === 'tool_calls') {
            onChunk?.({
              id: Date.now().toString(),
              delta: '',
              toolCalls: data.toolCalls,
            })
          } else if (data.type === 'done') {
            onChunk?.({
              id: Date.now().toString(),
              delta: '',
              finishReason: data.finishReason,
            })
          }
        }
      }
    }
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error('Unknown error'))
    throw error
  }
}
