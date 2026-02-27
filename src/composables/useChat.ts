import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import type { Message, SendMessagePayload } from '@/types/chat'

export function useChat() {
  const chatStore = useChatStore()
  const messageInput = ref('')
  const isTyping = ref(false)
  const scrollContainer = ref<HTMLElement | null>(null)

  // Computed properties
  const conversations = computed(() => chatStore.conversations)
  const activeConversation = computed(() => chatStore.activeConversation)
  const isLoading = computed(() => chatStore.isLoading)
  const error = computed(() => chatStore.error)

  // Methods
  const initializeChat = async (): Promise<void> => {
    await chatStore.initialize()
  }

  const setActiveConversation = (conversationId: string | null): void => {
    chatStore.setActiveConversation(conversationId)
  }

  const sendMessage = async (): Promise<void> => {
    if (!messageInput.value.trim() || !activeConversation.value) {
      return
    }

    const content = messageInput.value.trim()
    messageInput.value = ''
    isTyping.value = true

    try {
      const payload: SendMessagePayload = {
        conversationId: activeConversation.value.id,
        content
      }

      await chatStore.sendMessage(payload)
      scrollToBottom()
    } catch (error) {
      console.error('Failed to send message:', error)
      // Message will be handled by store error state
    } finally {
      isTyping.value = false
    }
  }

  const handleKeyPress = (event: KeyboardEvent): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const loadMoreMessages = async (): Promise<void> => {
    if (!activeConversation.value) return

    try {
      // Load older messages (page 2, 3, etc.)
      await chatStore.loadMessages(activeConversation.value.id, 2, 50)
    } catch (error) {
      console.error('Failed to load more messages:', error)
    }
  }

  const scrollToBottom = (): void => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  }

  const clearError = (): void => {
    chatStore.clearError()
  }

  // Lifecycle hooks
  onMounted(() => {
    initializeChat()
  })

  onUnmounted(() => {
    // Cleanup if needed
  })

  return {
    // State
    messageInput,
    isTyping,
    scrollContainer,
    
    // Computed
    conversations,
    activeConversation,
    isLoading,
    error,
    
    // Methods
    initializeChat,
    setActiveConversation,
    sendMessage,
    handleKeyPress,
    loadMoreMessages,
    scrollToBottom,
    clearError
  }
}