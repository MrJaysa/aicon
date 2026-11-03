<script setup lang="ts">
import ChatHeader from '@/components/ChatHeader.vue'
import ChatInput from '@/components/ChatInput.vue'
import EmptyState from '@/components/EmptyState.vue'
import MessageList from '@/components/MessageList.vue'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'

const chat = useChatStore()
const { messages, isStreaming } = storeToRefs(chat)
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-[#212121] text-neutral-100">
    <ChatHeader :can-reset="!!messages.length" @new-chat="chat.newChat()" />

    <MessageList :messages="messages">
      <EmptyState />
    </MessageList>

    <ChatInput :busy="isStreaming" @send="chat.send" />
  </div>
</template>
