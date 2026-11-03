<script setup lang="ts">
import MessageBubble from '@/components/MessageBubble.vue'
import type { ChatMessage } from '@/stores/chat'
import { ref, watch } from 'vue'

const props = defineProps<{ messages: ChatMessage[]; streaming?: boolean }>()

const scroller = ref<HTMLElement | null>(null)

watch(
  () => props.messages.length,
  () => scroller.value?.scrollTo({ top: 0 }),
)
</script>

<template>
  <main
    ref="scroller"
    class="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
  >
    <slot v-if="!messages.length" />

    <div v-else class="mx-auto w-full max-w-3xl shrink-0 space-y-6 px-4 py-4">
      <MessageBubble
        v-for="(m, i) in messages"
        :key="m.id"
        :message="m"
        :streaming="streaming && i === messages.length - 1"
      />
    </div>
  </main>
</template>
