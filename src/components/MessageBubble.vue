<script setup lang="ts">
import type { ChatMessage } from '@/stores/chat'
import { renderMarkdown } from '@/utils/markdown'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{ message: ChatMessage; streaming?: boolean }>()

const isAssistant = props.message.role === 'assistant'
const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const shown = ref(isAssistant && !props.streaming ? props.message.content.length : 0)

let raf = 0
let last = 0
let carry = 0

function tick(now: number) {
  const target = props.message.content.length
  const dt = Math.min(now - last, 100) / 1000
  last = now

  const backlog = target - shown.value
  if (backlog > 0) {
    const drain = props.streaming ? 0.3 : 0.12
    carry += Math.max(90, backlog / drain) * dt
    const n = Math.floor(carry)
    if (n > 0) {
      carry -= n
      let next = Math.min(target, shown.value + n)
      const code = props.message.content.charCodeAt(next - 1)
      if (code >= 0xd800 && code <= 0xdbff && next < target) next++
      shown.value = next
    }
    raf = requestAnimationFrame(tick)
  } else {
    raf = 0
  }
}

function kick() {
  if (!isAssistant) return
  if (reduceMotion) {
    shown.value = props.message.content.length
    return
  }
  if (!raf) {
    last = performance.now()
    raf = requestAnimationFrame(tick)
  }
}

watch(() => props.message.content.length, kick, { immediate: true })
onBeforeUnmount(() => cancelAnimationFrame(raf))

const printing = computed(
  () => isAssistant && (props.streaming || shown.value < props.message.content.length),
)

const html = computed(() =>
  isAssistant && !props.message.error
    ? renderMarkdown(props.message.content.slice(0, shown.value))
    : '',
)

function onClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]')
  if (!btn) return
  const code = btn.closest('.code-block')?.querySelector('code')?.textContent ?? ''
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copied'
    setTimeout(() => (btn.textContent = 'Copy'), 1500)
  })
}
</script>

<template>
  <div class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
    <div
      v-if="message.role === 'user'"
      class="max-w-[80%] whitespace-pre-wrap rounded-3xl bg-[#303030] px-5 py-2.5 leading-7"
    >
      {{ message.content }}
    </div>

    <div v-else-if="message.error" class="max-w-[90%] whitespace-pre-wrap leading-7 text-red-400">
      {{ message.content }}
    </div>

    <div v-else class="w-full min-w-0 leading-7 text-neutral-100">
      <span
        v-if="!message.content"
        class="inline-block size-3 animate-pulse rounded-full bg-neutral-400"
      />
      <div v-else class="markdown-body" :class="{ printing }" @click="onClick" v-html="html" />
    </div>
  </div>
</template>

<style>
.markdown-body {
  overflow-wrap: anywhere;
}
.markdown-body > :first-child {
  margin-top: 0;
}
.markdown-body > :last-child {
  margin-bottom: 0;
}
.markdown-body p {
  margin: 0.75em 0;
}
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  font-weight: 600;
  line-height: 1.3;
  margin: 1.25em 0 0.5em;
}
.markdown-body h1 {
  font-size: 1.5em;
}
.markdown-body h2 {
  font-size: 1.3em;
}
.markdown-body h3 {
  font-size: 1.15em;
}
.markdown-body h4 {
  font-size: 1em;
}
.markdown-body strong {
  font-weight: 600;
}
.markdown-body ul,
.markdown-body ol {
  margin: 0.75em 0;
  padding-left: 1.5em;
}
.markdown-body ul {
  list-style: disc;
}
.markdown-body ol {
  list-style: decimal;
}
.markdown-body li {
  margin: 0.25em 0;
}
.markdown-body li > p {
  margin: 0.25em 0;
}
.markdown-body li > ul,
.markdown-body li > ol {
  margin: 0.25em 0;
}
.markdown-body a {
  color: #7cb7ff;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.markdown-body blockquote {
  margin: 0.75em 0;
  padding-left: 1em;
  border-left: 3px solid rgba(255, 255, 255, 0.2);
  color: #a3a3a3;
}
.markdown-body hr {
  margin: 1.25em 0;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.markdown-body :not(pre) > code {
  padding: 0.15em 0.4em;
  border-radius: 0.375rem;
  background: #303030;
  font-size: 0.875em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.markdown-body table {
  display: block;
  max-width: 100%;
  margin: 0.75em 0;
  overflow-x: auto;
  border-collapse: collapse;
}
.markdown-body th,
.markdown-body td {
  padding: 0.5em 0.75em;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}
.markdown-body th {
  background: #2a2a2a;
  font-weight: 600;
}
.markdown-body .code-block {
  margin: 1em 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  background: #171717;
}
.markdown-body .code-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.75rem;
  background: #262626;
  color: #a3a3a3;
  font-size: 0.75rem;
}
.markdown-body .code-head button {
  color: inherit;
  cursor: pointer;
  transition: color 0.15s;
}
.markdown-body .code-head button:hover {
  color: #fff;
}
.markdown-body .code-block pre {
  margin: 0;
  padding: 0.875rem 1rem;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.6;
}
.markdown-body .code-block code.hljs {
  padding: 0;
  background: transparent;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.markdown-body.printing > p:last-child::after,
.markdown-body.printing > h1:last-child::after,
.markdown-body.printing > h2:last-child::after,
.markdown-body.printing > h3:last-child::after,
.markdown-body.printing > h4:last-child::after,
.markdown-body.printing > ul:last-child > li:last-child::after,
.markdown-body.printing > ol:last-child > li:last-child::after {
  content: '';
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: #d4d4d4;
  animation: md-caret 1s steps(2, start) infinite;
}
@keyframes md-caret {
  to {
    visibility: hidden;
  }
}
</style>
