import { NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages = [], model = 'mistral-small-latest' } = body

    const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY ?? '' })

    // Create a readable stream to send back to the client
    const encoder = new TextEncoder()
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          const response = await mistral.chat.stream({
            model,
            messages,
          })

          for await (const chunk of response) {
            const delta = chunk.data.choices[0]?.delta

            if (delta?.content) {
              const data = JSON.stringify({
                type: 'content',
                content: delta.content,
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }

            if (chunk.data.choices[0]?.finishReason) {
              const data = JSON.stringify({
                type: 'done',
                finishReason: chunk.data.choices[0].finishReason,
              })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }

          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
