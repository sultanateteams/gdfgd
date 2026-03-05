# HRM System with AI Chatbot

Enterprise-grade Human Resource Management system with AI-powered chatbot, built with Vue 3, TypeScript, and modern web technologies.

## 🚀 Features

### AI Chatbot Module
- **Floating Chat Interface**: Always accessible chat widget with keyboard shortcuts
- **Full Chat View**: Dedicated chat page with comprehensive conversation management
- **Real-time Messaging**: WebSocket support for instant communication
- **Message States**: Loading, sent, delivered, read, and error states
- **Typing Indicators**: Real-time typing status
- **Infinite Scroll**: Load more messages as you scroll up
- **Search & Filter**: Find conversations and messages quickly

### Architecture
- **Clean Architecture**: Feature-based folder structure with clear separation of concerns
- **TypeScript**: Strict type checking throughout the application
- **Vue 3 Composition API**: Modern reactive patterns with `<script setup>`
- **Pinia**: State management with proper separation of concerns
- **Vue Router**: Client-side routing with guards and meta information
- **Axios**: HTTP client with interceptors and error handling

### UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Design System**: CSS-in-JS with CSS variables and utility classes
- **Accessibility**: Semantic HTML and keyboard navigation
- **Animations**: Smooth transitions and micro-interactions

## 🛠 Tech Stack

### Frontend
- **Vue 3** with Composition API
- **TypeScript** (strict mode)
- **Pinia** for state management
- **Vue Router** for navigation
- **Axios** for HTTP requests
- **Pure CSS** with modern features

### Development Tools
- **Vite** for fast development and build
- **ESLint** for code quality
- **Prettier** for code formatting
- **TypeScript** for type safety

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Chat/           # Chat-specific components
│       ├── ChatList.vue        # Conversation list
│       ├── ChatWindow.vue      # Main chat interface
│       └── FloatingChat.vue    # Floating chat widget
├── views/              # Page components
│   ├── HomeView.vue    # Landing page
│   ├── ChatView.vue    # Full chat page
│   ├── DashboardView.vue # Admin dashboard
│   └── NotFoundView.vue # 404 page
├── composables/        # Vue composition functions
│   └── useChat.ts      # Chat business logic
├── stores/            # Pinia state stores
│   └── chat.ts        # Chat state management
├── services/          # API layer
│   ├── api.ts         # HTTP client setup
│   └── chat.ts        # Chat API methods
├── types/             # TypeScript type definitions
│   ├── chat.ts        # Chat-related types
│   └── api.ts         # API response types
├── router/            # Vue Router configuration
└── styles/            # Global styles and utilities
```

## 🏗 Architecture Principles

### Clean Architecture Layers
1. **Presentation Layer** (`components/`, `views/`): UI components only
2. **Business Logic Layer** (`composables/`): Reusable logic functions
3. **State Management Layer** (`stores/`): Application state
4. **Service Layer** (`services/`): API calls and external integrations
5. **Type Layer** (`types/`): TypeScript definitions

### Key Principles
- **No business logic in components**: All logic moved to composables and stores
- **Separation of concerns**: Each layer has a single responsibility
- **Type safety**: Strict TypeScript throughout
- **Reusability**: Components and composables designed for reuse
- **Testability**: Clean separation enables easy testing

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hrm-ai-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_WEBSOCKET_URL=ws://localhost:8080
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### API Integration
The application is ready for backend integration:

1. **REST API**: Configure `VITE_API_BASE_URL` in `.env`
2. **WebSocket**: Configure `VITE_WEBSOCKET_URL` for real-time features
3. **Authentication**: JWT tokens handled automatically via interceptors

### AI Integration
Ready for AI service integration:

1. **OpenAI**: API endpoints prepared for OpenAI integration
2. **Custom AI**: Flexible service layer supports any AI provider
3. **Message Processing**: Pipeline ready for AI response handling

## 📡 API Endpoints

The application expects the following API endpoints:

### Chat Management
- `GET /api/conversations` - Get all conversations
- `GET /api/conversations/:id` - Get specific conversation
- `POST /api/conversations` - Create new conversation
- `POST /api/messages` - Send message
- `GET /api/conversations/:id/messages` - Get conversation messages
- `POST /api/messages/:id/read` - Mark message as read

### WebSocket Events
- `new_message` - New message received
- `typing` - Typing indicator
- `read` - Read receipt
- `error` - Error notification

## 🎨 Styling System

### CSS Variables
The application uses a comprehensive CSS-in-JS system with CSS variables:

```css
:root {
  --primary-color: #3b82f6;
  --text-primary: #1f2937;
  --bg-primary: #ffffff;
  /* ... more variables */
}
```

### Utility Classes
Built-in utility classes for common patterns:

```css
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
/* ... more utilities */
```

## 🧪 Testing

The application is structured for easy testing:

1. **Unit Tests**: Components and composables are easily testable
2. **Integration Tests**: Service layer can be mocked for testing
3. **E2E Tests**: Vue Router enables full user journey testing

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Support
```dockerfile
# Development
docker build -t hrm-chatbot .
docker run -p 3000:3000 hrm-chatbot

# Production
docker build --target production -t hrm-chatbot:prod .
```

## 🔐 Security

### Built-in Security Features
- **XSS Protection**: Vue's built-in XSS protection
- **CORS Handling**: Proper CORS configuration in API layer
- **Authentication**: JWT token management with automatic refresh
- **Input Validation**: TypeScript ensures type safety

### Security Best Practices
- No sensitive data in client-side code
- Proper error handling without information leakage
- Secure WebSocket connections (wss://)
- Content Security Policy ready

## 📈 Performance

### Optimizations
- **Code Splitting**: Automatic with Vue Router
- **Lazy Loading**: Components loaded on demand
- **Caching**: API responses can be cached
- **Bundle Size**: Tree-shaking and minification

### Performance Monitoring
- **Vue DevTools**: Built-in Vue performance monitoring
- **Network Monitoring**: Axios interceptors for API monitoring
- **Memory Management**: Proper cleanup in composables

## 🤖 AI Integration

### OpenAI Ready
The application is prepared for OpenAI integration:

1. **API Structure**: Service layer ready for OpenAI endpoints
2. **Message Processing**: Pipeline for AI response handling
3. **Context Management**: Conversation history maintained
4. **Rate Limiting**: Built-in rate limiting support

### Custom AI Models
Flexible architecture supports any AI provider:

1. **Service Layer**: Easy to swap AI providers
2. **Type Safety**: TypeScript ensures consistent interfaces
3. **Error Handling**: Robust error handling for AI failures
4. **Fallbacks**: Graceful degradation when AI is unavailable

## 📱 Browser Support

### Modern Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills
For older browser support, add polyfills in `main.ts`:

```typescript
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the architecture patterns
4. Ensure TypeScript compilation passes
5. Test your changes
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the excellent framework
- TypeScript team for type safety
- Pinia team for modern state management
- All open source contributors

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Email us at support@hrm-system.com# gdfgd
