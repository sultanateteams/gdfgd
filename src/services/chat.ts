import type { 
  Conversation, 
  Message, 
  SendMessagePayload, 
  CreateConversationPayload,
  ChatError 
} from '@/types/chat'
import { apiService } from './api'

export class ChatService {
  private static instance: ChatService
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService()
    }
    return ChatService.instance
  }

  // API Methods
  async getConversations(): Promise<Conversation[]> {
    try {
      const data = await apiService.get<Conversation[]>('/conversations')
      return data.map(this.normalizeConversation)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getConversation(id: string): Promise<Conversation> {
    try {
      const data = await apiService.get<Conversation>(`/conversations/${id}`)
      return this.normalizeConversation(data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createConversation(payload: CreateConversationPayload): Promise<Conversation> {
    try {
      const data = await apiService.post<Conversation>('/conversations', payload)
      return this.normalizeConversation(data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async sendMessage(payload: SendMessagePayload): Promise<Message> {
    try {
      const data = await apiService.post<Message>('/messages', payload)
      return this.normalizeMessage(data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getMessages(conversationId: string, page = 1, limit = 50): Promise<Message[]> {
    try {
      const data = await apiService.get<Message[]>(
        `/conversations/${conversationId}/messages`,
        { params: { page, limit } }
      )
      return data.map(this.normalizeMessage)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async markAsRead(conversationId: string, messageId: string): Promise<void> {
    try {
      await apiService.post(`/messages/${messageId}/read`, { conversationId })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // WebSocket Methods
  connectWebSocket(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return
    }

    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080'
    
    try {
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          this.handleWebSocketMessage(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.handleReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      this.handleReconnect()
    }
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    setTimeout(() => {
      console.log(`Reconnecting WebSocket (attempt ${this.reconnectAttempts})`)
      this.connectWebSocket()
    }, delay)
  }

  private handleWebSocketMessage(message: any): void {
    // Handle different message types
    switch (message.type) {
      case 'new_message':
        // Emit event or update store
        break
      case 'typing':
        // Handle typing indicators
        break
      case 'read':
        // Handle read receipts
        break
      default:
        console.warn('Unknown WebSocket message type:', message.type)
    }
  }

  // Utility Methods
  private normalizeConversation(conversation: any): Conversation {
    return {
      ...conversation,
      createdAt: new Date(conversation.createdAt),
      updatedAt: new Date(conversation.updatedAt),
      messages: conversation.messages?.map(this.normalizeMessage) || []
    }
  }

  private normalizeMessage(message: any): Message {
    return {
      ...message,
      timestamp: new Date(message.timestamp)
    }
  }

  private handleError(error: any): ChatError {
    if (error instanceof Error) {
      return {
        code: 'API_ERROR',
        message: error.message
      }
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred'
    }
  }
}

export const chatService = ChatService.getInstance()