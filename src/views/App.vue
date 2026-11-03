<script setup lang="ts">
import ChatHeader from '@/components/ChatHeader.vue'
import ChatInput from '@/components/ChatInput.vue'
import EmptyState from '@/components/EmptyState.vue'
import MessageList from '@/components/MessageList.vue'
import PromptPanel from '@/components/PromptPanel.vue'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'

const chat = useChatStore()
const { messages, instructions, isStreaming } = storeToRefs(chat)
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-[#212121] text-neutral-100">
    <ChatHeader :can-reset="!!messages.length" @new-chat="chat.newChat()" />

    <div class="relative flex min-h-0 flex-1 flex-col">
      <Transition name="panel">
        <PromptPanel v-if="!messages.length" v-model="instructions" />
      </Transition>

      <MessageList :messages="messages" :streaming="isStreaming">
        <EmptyState />
      </MessageList>
    </div>

    <ChatInput :busy="isStreaming" @send="chat.send" />
  </div>
</template>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateX(-1rem);
}
</style>
