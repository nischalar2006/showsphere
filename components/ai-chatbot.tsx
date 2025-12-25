"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const CHATBOT_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hi! I'm your ShowSphere assistant. How can I help you book tickets today?",
    "Welcome to ShowSphere! Looking to book some movie tickets? I'm here to help!",
  ],
  movie: [
    "We have a great selection of Bollywood, South Indian, and Hollywood movies. What genre are you interested in?",
    "You can browse movies by category - trending, upcoming, old hits, or events. Which would you like to explore?",
  ],
  booking: [
    "Booking is easy! Just select a movie → choose your date and cinema → pick your seats → complete payment. What movie interests you?",
    "The booking process takes just a few steps. Select your movie, choose seats, and pay securely. Ready to start?",
  ],
  price: [
    "Our ticket prices typically range from ₹300 to ₹650 depending on the theater and show time.",
    "Prices vary by cinema and timing. Premium shows are around ₹650, while standard shows are ₹300-₹500.",
  ],
  seats: [
    "Our seat selector shows available seats in real-time. You can pick your favorite seats with a great view!",
    "Choose your seats based on your preference - we have all standard seat options available.",
  ],
  default: [
    "That's great! Is there anything else you'd like to know about booking tickets with ShowSphere?",
    "I'm here to help! You can ask me about movies, ticket prices, the booking process, or seat selection.",
    "Feel free to ask me anything about booking tickets, available movies, prices, or how our system works.",
  ],
}

function getSmartResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()

  if (message.match(/hi|hello|hey|greet/)) {
    return CHATBOT_RESPONSES.greeting[Math.floor(Math.random() * CHATBOT_RESPONSES.greeting.length)]
  }
  if (message.match(/movie|film|watch|available/)) {
    return CHATBOT_RESPONSES.movie[Math.floor(Math.random() * CHATBOT_RESPONSES.movie.length)]
  }
  if (message.match(/book|booking|how|process|step/)) {
    return CHATBOT_RESPONSES.booking[Math.floor(Math.random() * CHATBOT_RESPONSES.booking.length)]
  }
  if (message.match(/price|cost|₹|rupees|expensive/)) {
    return CHATBOT_RESPONSES.price[Math.floor(Math.random() * CHATBOT_RESPONSES.price.length)]
  }
  if (message.match(/seat|chair|prefer/)) {
    return CHATBOT_RESPONSES.seats[Math.floor(Math.random() * CHATBOT_RESPONSES.seats.length)]
  }

  return CHATBOT_RESPONSES.default[Math.floor(Math.random() * CHATBOT_RESPONSES.default.length)]
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your ShowSphere assistant. How can I help you book tickets today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate delay for better UX
    setTimeout(() => {
      const botResponse = getSmartResponse(inputValue)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 500)
  }

  return (
    <>
      {/* Chatbot Button - Fixed Position */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center animate-bounce"
          aria-label="Open chatbot"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col max-h-96 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-accent text-accent-foreground rounded-t-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">ShowSphere Assistant</h3>
              <p className="text-sm text-accent-foreground/80">Always here to help</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-accent/80 p-2 rounded-lg transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${message.sender === "user"
                      ? "bg-accent text-accent-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                    }`}
                >
                  <p className="text-sm break-words">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 bg-card rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about movies, tickets..."
                disabled={isLoading}
                className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
