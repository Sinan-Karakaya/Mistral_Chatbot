'use client'

import React, { useRef, useState, KeyboardEvent } from 'react'
import { Send, Paperclip, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { FileAttachment } from '@/lib/types'

interface ComposerProps {
  onSend: (content: string, files?: FileAttachment[]) => void
  disabled?: boolean
  isLoading?: boolean
}

export default function Composer({
  onSend,
  disabled,
  isLoading,
}: ComposerProps) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState<FileAttachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    // Convert files to base64
    const filePromises = selectedFiles.map(async (file) => {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64,
      }
    })

    const newFiles: FileAttachment[] = await Promise.all(filePromises)
    setFiles((prev) => [...prev, ...newFiles])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleSend = () => {
    if ((!text.trim() && files.length === 0) || disabled || isLoading) return
    onSend(text, files)
    setText('')
    setFiles([])
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  return (
    <div className='border-t-[3px] border-beige-400 dark:border-stone-700 bg-beige-100 dark:bg-stone-900/50 p-4'>
      <div className='max-w-4xl mx-auto'>
        {/* File attachments */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='mb-3 flex flex-wrap gap-2'
            >
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className='flex items-center gap-2 px-3 py-2 bg-beige-200 dark:bg-stone-800 rounded-lg border-2 border-beige-400 dark:border-stone-700 text-sm shadow-hard-sm'
                >
                  {file.type.startsWith('image/') && file.data ? (
                    <img
                      src={file.data}
                      alt={file.name}
                      className='w-8 h-8 object-cover rounded border border-beige-400 dark:border-stone-600'
                    />
                  ) : (
                    <Paperclip
                      size={14}
                      className='text-beige-700 dark:text-beige-400'
                    />
                  )}
                  <span className='text-beige-900 dark:text-beige-300 max-w-[150px] truncate'>
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFile(file.id)}
                    className='text-beige-600 hover:text-beige-900 dark:text-beige-500 dark:hover:text-beige-200 transition-colors'
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <div className='flex items-center gap-2 bg-beige-200 dark:bg-stone-800 rounded-2xl border-[3px] border-beige-400 dark:border-stone-700 shadow-hard focus-within:shadow-hard-lg focus-within:border-accent transition-all'>
          {/* File upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className='p-3 text-beige-700 dark:text-beige-400 hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Attach file'
          >
            <Paperclip size={20} />
          </button>
          <input
            ref={fileInputRef}
            type='file'
            multiple
            onChange={handleFileSelect}
            className='hidden'
          />

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder='Ask Mistral anything...'
            disabled={disabled || isLoading}
            rows={1}
            className='flex-1 py-3 bg-transparent border-none outline-none resize-none text-beige-900 dark:text-beige-100 placeholder-beige-600 dark:placeholder-beige-500 disabled:opacity-50'
            style={{ maxHeight: '200px' }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={
              disabled || isLoading || (!text.trim() && files.length === 0)
            }
            className='m-2 p-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent border-2 border-beige-900 dark:border-beige-100 shadow-hard-sm'
            aria-label='Send message'
          >
            <Send size={18} />
          </button>
        </div>

        {/* Helper text */}
        <div className='mt-2 text-xs text-beige-700 dark:text-beige-500 text-center'>
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}
