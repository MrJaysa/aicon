<script setup lang="ts">
import type { ChatMessage } from '@/stores/chat'
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
    carry += Math.max(40, backlog * 3) * dt
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

const printed = computed(() =>
  isAssistant ? props.message.content.slice(0, shown.value) : props.message.content,
)
const printing = computed(
  () => isAssistant && (props.streaming || shown.value < props.message.content.length),
)
</script>

<template>
  <div class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
    <div
      v-if="message.role === 'user'"
      class="max-w-[80%] whitespace-pre-wrap rounded-3xl bg-[#303030] px-5 py-2.5 leading-7"
    >
      {{ message.content }}
    </div>

    <div
      v-else
      class="max-w-[90%] whitespace-pre-wrap leading-7"
      :class="message.error ? 'text-red-400' : 'text-neutral-100'"
    >
      <span
        v-if="!message.content"
        class="inline-block size-3 animate-pulse rounded-full bg-neutral-400"
      />
      <template v-else
        >{{ printed
        }}<span
          v-if="printing"
          class="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.2em] animate-pulse bg-neutral-300"
      /></template>
    </div>
  </div>
</template>
