export async function streamChat(
  sessionId: string,
  message: string,
  system: string | undefined,
  onToken: (text: string) => void,
  signal?: AbortSignal,
) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message, system }),
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

export async function deleteSession(sessionId: string) {
  await fetch(`/api/chat/${encodeURIComponent(sessionId)}`, { method: 'DELETE' })
}
