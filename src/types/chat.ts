export interface User {
  id: string
  name: string
  avatar?: string
  role: 'user' | 'assistant' | 'system'
}

export interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
  type: 'text' | 'image' | 'file' | 'system'
}

export interface Conversation {
  id: string
  title: string
  participants: User[]
  messages: Message[]
  lastMessage?: Message
  createdAt: Date
  updatedAt: Date
  isTyping?: boolean
  unreadCount?: number
}

export interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

export interface SendMessagePayload {
  conversationId: string
  content: string
  type?: Message['type']
}

export interface CreateConversationPayload {
  title: string
  participantIds: string[]
}

export interface ChatError {
  code: string
  message: string
  details?: any
}