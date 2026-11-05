import { streamChat, type HistoryItem } from '@/utils/chat'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

const MAX_HISTORY = 40

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const instructions = ref('')
  const isStreaming = ref(false)

  let controller: AbortController | null = null

  function buildHistory(): HistoryItem[] {
    const out: HistoryItem[] = []
    const list = messages.value
    for (let i = 0; i < list.length; i++) {
      const m = list[i]!
      const next = list[i + 1]
      if (m.role !== 'user' || !next || next.role !== 'assistant' || next.error || !next.content) {
        continue
      }
      out.push({ role: 'user', text: m.content }, { role: 'model', text: next.content })
      i++
    }
    return out.slice(-MAX_HISTORY)
  }

  async function send(text: string) {
    const message = text.trim()
    if (!message || isStreaming.value) return

    const history = buildHistory()

    messages.value.push({ id: crypto.randomUUID(), role: 'user', content: message })
    messages.value.push({ id: crypto.randomUUID(), role: 'assistant', content: '' })
    const reply = messages.value[messages.value.length - 1]!

    isStreaming.value = true
    controller = new AbortController()

    try {
      await streamChat(
        message,
        history,
        instructions.value.trim() || undefined,
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

  function newChat() {
    controller?.abort()
    messages.value = []
    isStreaming.value = false
  }

  return { messages, instructions, isStreaming, send, newChat }
})