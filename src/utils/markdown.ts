import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import diff from 'highlight.js/lib/languages/diff'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import kotlin from 'highlight.js/lib/languages/kotlin'
import markdown from 'highlight.js/lib/languages/markdown'
import php from 'highlight.js/lib/languages/php'
import python from 'highlight.js/lib/languages/python'
import ruby from 'highlight.js/lib/languages/ruby'
import rust from 'highlight.js/lib/languages/rust'
import sql from 'highlight.js/lib/languages/sql'
import swift from 'highlight.js/lib/languages/swift'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import 'highlight.js/styles/github-dark.css'
import { Marked } from 'marked'

const languages = {
  bash,
  c,
  cpp,
  csharp,
  css,
  diff,
  go,
  java,
  javascript,
  json,
  kotlin,
  markdown,
  php,
  python,
  ruby,
  rust,
  sql,
  swift,
  typescript,
  xml,
  yaml,
}

for (const [name, def] of Object.entries(languages)) hljs.registerLanguage(name, def)

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const cache = new Map<string, string>()

function highlight(text: string, language: string) {
  const key = `${language}\n${text}`
  const hit = cache.get(key)
  if (hit !== undefined) return hit

  const out =
    language && hljs.getLanguage(language)
      ? hljs.highlight(text, { language, ignoreIllegals: true }).value
      : escapeHtml(text)

  if (cache.size > 200) cache.clear()
  cache.set(key, out)
  return out
}

const md = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    code({ text, lang }) {
      const language = (lang ?? '').trim().split(/\s+/)[0] ?? ''
      return `<div class="code-block"><div class="code-head"><span>${escapeHtml(language || 'text')}</span><button type="button" data-copy>Copy</button></div><pre><code class="hljs">${highlight(text, language)}</code></pre></div>`
    },
  },
})

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

export function renderMarkdown(source: string) {
  return DOMPurify.sanitize(md.parse(source, { async: false }))
}
