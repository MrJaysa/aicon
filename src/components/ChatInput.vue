<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps<{ busy: boolean }>()
const emit = defineEmits<{ send: [text: string] }>()

const model = 'gemini-3.5-flash-lite'

const draft = ref('')

function submit() {
  const text = draft.value
  if (!text.trim() || props.busy) return
  draft.value = ''
  emit('send', text)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    submit()
  }
}
</script>

<template>
  <footer class="shrink-0 px-4 pb-5 pt-2">
    <form
      class="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-3xl bg-[#303030] py-2 pl-5 pr-2"
      @submit.prevent="submit"
    >
      <textarea
        v-model="draft"
        rows="1"
        placeholder="Ask anything"
        class="max-h-40 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-neutral-100 outline-none placeholder:text-neutral-400 field-sizing-content"
        @keydown="onKeydown"
      />
      <button
        type="submit"
        :disabled="!draft.trim() || busy"
        class="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition disabled:bg-white/20 disabled:text-white/40"
        aria-label="Send"
      >
        <ArrowUp class="size-5" />
      </button>
    </form>

    <p class="mx-auto mt-2 max-w-3xl text-end text-xs text-neutral-500">{{ model }}</p>
  </footer>
</template>
