import { deleteSession, streamChat } from '@/utils/chat'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

export const useChatStore = defineStore('chat', () => {
  const sessionId = ref(crypto.randomUUID())
  const messages = ref<ChatMessage[]>([])
  const isStreaming = ref(false)

  let controller: AbortController | null = null

  async function send(text: string) {
    const message = text.trim()
    if (!message || isStreaming.value) return

    messages.value.push({ id: crypto.randomUUID(), role: 'user', content: message })
    messages.value.push({ id: crypto.randomUUID(), role: 'assistant', content: '' })
    const reply = messages.value[messages.value.length - 1]!

    isStreaming.value = true
    controller = new AbortController()

    try {
      await streamChat(
        sessionId.value,
        message,
        (token) => {
          reply.content += token
        },
        controller.signal,
      )
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      reply.error = true
      reply.content ||= 'Something went wrong. Please try again.'
    } finally {
      isStreaming.value = false
      controller = null
    }
  }

  async function newChat() {
    controller?.abort()
    const oldId = sessionId.value
    messages.value = []
    isStreaming.value = false
    sessionId.value = crypto.randomUUID()
    try {
      await deleteSession(oldId)
    } catch {}
  }

  return { sessionId, messages, isStreaming, send, newChat }
})
