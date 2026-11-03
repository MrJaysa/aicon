<script setup lang="ts">
const model = defineModel<string>({ required: true })

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
    class="z-10 w-full shrink-0 space-y-3 px-4 pb-2 md:absolute md:left-4 md:top-2 md:w-72 md:px-0"
  >
    <div class="rounded-2xl bg-[#303030] p-4">
      <label for="instructions" class="block text-sm font-medium text-neutral-200">
        How should the AI behave?
      </label>
      <p class="mt-1 text-xs text-neutral-400">
        Set this before you start. It locks once you send a message.
      </p>

      <textarea
        id="instructions"
        v-model="model"
        rows="5"
        maxlength="1000"
        placeholder="e.g. Answer like a pirate. Always end with a question."
        class="mt-3 max-h-60 w-full resize-none rounded-xl bg-black/20 p-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 field-sizing-content"
      />

      <div class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="p in presets"
          :key="p.label"
          type="button"
          class="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300 transition hover:bg-white/10"
          @click="add(p.text)"
        >
          {{ p.label }}
        </button>
      </div>
    </div>
  </aside>
</template>
