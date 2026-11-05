export type HistoryItem = { role: 'user' | 'model'; text: string }

export async function streamChat(
  message: string,
  history: HistoryItem[],
  system: string | undefined,
  onToken: (text: string) => void,
  signal?: AbortSignal,
) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, system }),
    signal,
  })
  if (!res.ok || !res.body) throw new Error('Chat request failed')

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) return
    buffer += value

    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''

    for (const event of events) {
      const dataLine = event.split('\n').find((line) => line.startsWith('data: '))
      if (!dataLine) continue
      const data = JSON.parse(dataLine.slice(6))

      if (event.startsWith('event: error')) throw new Error(String(data))
      if (event.startsWith('event: done')) return
      onToken(data as string)
    }
  }
}