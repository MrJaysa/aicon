<script setup lang="ts">
import { ChevronDown, SlidersHorizontal } from 'lucide-vue-next'
import { ref } from 'vue'

const model = defineModel<string>({ required: true })
const open = ref(false)

const presets = [
  { label: 'Concise', text: 'Keep answers short and to the point.' },
  { label: 'Friendly', text: 'Be warm, casual and encouraging.' },
  { label: 'Formal', text: 'Use a formal, professional tone.' },
  { label: 'Beginner', text: 'Explain things simply, as if to a beginner, using analogies.' },
]

function add(text: string) {
  const current = model.value.trim()
  model.value = current ? `${current}\n${text}` : text
}
</script>

<template>
  <aside
    class="z-10 w-full shrink-0 px-3 pb-2 sm:px-4 lg:absolute lg:left-4 lg:top-2 lg:w-72 lg:px-0 lg:pb-0 xl:w-80"
  >
    <div class="rounded-2xl bg-[#303030]">
      <button
        type="button"
        class="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-neutral-200 lg:hidden"
        :aria-expanded="open"
        aria-controls="instructions-body"
        @click="open = !open"
      >
        <SlidersHorizontal class="size-4 text-neutral-400" />
        <span class="flex-1">How should the AI behave?</span>
        <span v-if="model.trim() && !open" class="size-2 rounded-full bg-emerald-400" />
        <ChevronDown
          class="size-4 text-neutral-400 transition-transform"
          :class="{ 'rotate-180': open }"
        />
      </button>

      <div
        id="instructions-body"
        class="max-h-[45dvh] overflow-y-auto px-4 pb-4 lg:block lg:max-h-none lg:overflow-visible lg:pt-4"
        :class="open ? 'block' : 'hidden'"
      >
        <label
          for="instructions"
          class="sr-only text-sm font-medium text-neutral-200 lg:not-sr-only lg:block"
        >
          How should the AI behave?
        </label>
        <p class="text-xs text-neutral-400 lg:mt-1">
          Set this before you start. It locks once you send a message.
        </p>

        <textarea
          id="instructions"
          v-model="model"
          rows="4"
          maxlength="1000"
          placeholder="e.g. Answer like a pirate. Always end with a question."
          class="mt-3 max-h-60 w-full resize-none rounded-xl bg-black/20 p-3 text-base text-neutral-100 outline-none placeholder:text-neutral-500 field-sizing-content lg:text-sm"
        />

        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="p in presets"
            :key="p.label"
            type="button"
            class="rounded-full border border-white/10 px-3 py-1.5 text-xs text-neutral-300 transition hover:bg-white/10 lg:py-1"
            @click="add(p.text)"
          >
            {{ p.label }}
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
