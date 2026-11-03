import { googleAI } from '@genkit-ai/google-genai'
import { genkit, z } from 'genkit'

const MODEL = 'gemini-3.5-flash-lite'

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model(MODEL),
})

type Turn = { role: 'user' | 'model'; content: [{ text: string }] }

const SESSION_TTL_MS = 60 * 60 * 1000

const sessions = new Map<string, { turns: Turn[]; lastUsed: number }>()

export function clearSession(sessionId: string) {
  sessions.delete(sessionId)
}

setInterval(
  () => {
    const cutoff = Date.now() - SESSION_TTL_MS
    for (const [id, s] of sessions) if (s.lastUsed < cutoff) sessions.delete(id)
  },
  5 * 60 * 1000,
).unref()

export const chatFlow = ai.defineFlow(
  {
    name: 'chat',
    inputSchema: z.object({
      sessionId: z.string().min(1),
      message: z.string().min(1),
    }),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async ({ sessionId, message }, { sendChunk }) => {
    const session = sessions.get(sessionId) ?? { turns: [], lastUsed: Date.now() }

    const { stream, response } = ai.generateStream({
      system: 'You are a helpful, concise assistant.',
      messages: session.turns,
      prompt: message,
    })

    for await (const chunk of stream) sendChunk(chunk.text)

    const reply = (await response).text
    session.turns.push(
      { role: 'user', content: [{ text: message }] },
      { role: 'model', content: [{ text: reply }] },
    )
    session.lastUsed = Date.now()
    sessions.set(sessionId, session)
    return reply
  },
)
