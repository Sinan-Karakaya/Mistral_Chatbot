export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  toolCalls?: ToolCall[]
  files?: FileAttachment[]
  createdAt: number
  error?: boolean
  errorMessage?: string
}

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
  result?: unknown
}

export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  url?: string
  data?: string
}

export interface ChatSettings {
  model: string
  temperature?: number
  maxTokens?: number
  darkMode: boolean
}

export interface StreamChunk {
  id: string
  delta: string
  role?: 'assistant'
  toolCalls?: ToolCall[]
  finishReason?: string
}
