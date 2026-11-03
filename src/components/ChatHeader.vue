<script setup lang="ts">
import { SquarePen } from 'lucide-vue-next'

defineProps<{ canReset: boolean }>()
defineEmits<{ newChat: [] }>()
</script>

<template>
  <header class="flex shrink-0 justify-end px-3 py-3">
    <button
      type="button"
      :disabled="!canReset"
      class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40"
      @click="$emit('newChat')"
    >
      <SquarePen class="size-4" />
      New chat
    </button>
  </header>
</template>
