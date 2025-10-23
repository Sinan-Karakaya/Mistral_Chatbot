'use client'

import ReactMarkdown from 'react-markdown'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python'
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash'
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'

// Register languages
SyntaxHighlighter.registerLanguage('javascript', js)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('json', json)

// Custom dark style for code blocks
const customCodeStyle = {
  ...atomOneDark,
  hljs: {
    ...atomOneDark['hljs'],
    background: '#1e293b', // dark background
    color: '#f8fafc', // light text
    padding: '1rem',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem', // Bigger font size
    lineHeight: '1.3', // Reduced line spacing
  },
}

interface StreamingTextProps {
  content: string
  isStreaming?: boolean
}

export default function StreamingText({
  content,
  isStreaming,
}: StreamingTextProps) {
  return (
    <div className='markdown-content'>
      <ReactMarkdown
        components={{
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || '')
            const codeString = String(children).replace(/\n$/, '')
            const isInline = !className

            return !isInline && match ? (
              <div className='my-3'>
                <SyntaxHighlighter
                  style={customCodeStyle}
                  language={match[1]}
                  PreTag='div'
                  customStyle={{
                    margin: 0,
                    background: '#1e293b',
                    color: '#f8fafc',
                  }}
                  codeTagProps={{
                    style: {
                      color: '#f8fafc',
                      background: 'transparent',
                    },
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className='px-1.5 py-0.5 bg-mistral-200 dark:bg-mistral-700 text-mistral-900 dark:text-mistral-100 rounded text-sm font-mono'>
                {children}
              </code>
            )
          },
          p({ children }) {
            return <p className='mb-2 last:mb-0'>{children}</p>
          },
          ul({ children }) {
            return <ul className='list-disc ml-4 mb-2'>{children}</ul>
          },
          ol({ children }) {
            return <ol className='list-decimal ml-4 mb-2'>{children}</ol>
          },
          li({ children }) {
            return <li className='mb-1'>{children}</li>
          },
          h1({ children }) {
            return <h1 className='text-2xl font-bold mt-4 mb-2'>{children}</h1>
          },
          h2({ children }) {
            return <h2 className='text-xl font-bold mt-3 mb-2'>{children}</h2>
          },
          h3({ children }) {
            return (
              <h3 className='text-lg font-semibold mt-2 mb-1'>{children}</h3>
            )
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                className='text-accent hover:text-accent-hover underline'
              >
                {children}
              </a>
            )
          },
          blockquote({ children }) {
            return (
              <blockquote className='border-l-4 border-mistral-300 dark:border-mistral-700 pl-4 italic my-2'>
                {children}
              </blockquote>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className='inline-block w-2 h-4 ml-1 bg-accent animate-pulse' />
      )}
    </div>
  )
}
