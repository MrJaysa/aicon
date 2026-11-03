import express from 'express'
import path from 'node:path'
import { chatFlow, clearSession } from './ai_flow'

const isProd = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT ?? 3000)

const app = express()
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { sessionId, message } = req.body ?? {}
  if (typeof sessionId !== 'string' || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'sessionId and message are required' })
    return
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    const { stream, output } = chatFlow.stream({ sessionId, message })
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`)
    }
    await output
    res.write('event: done\ndata: {}\n\n')
  } catch (err) {
    console.error(err)
    res.write(`event: error\ndata: ${JSON.stringify('Something went wrong')}\n\n`)
  } finally {
    res.end()
  }
})

app.delete('/api/chat/:sessionId', (req, res) => {
  clearSession(req.params.sessionId)
  res.status(204).end()
})

if (isProd) {
  const dist = path.resolve('dist')
  app.use(express.static(dist))
  app.use((_req, res) => res.sendFile(path.join(dist, 'index.html')))
} else {
  const { createServer } = await import('vite')
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' })
  app.use(vite.middlewares)
}

app.listen(port, () => console.log(`http://localhost:${port}`))
