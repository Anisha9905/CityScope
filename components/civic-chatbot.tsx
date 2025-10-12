"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
}

interface CivicChatbotProps {
  onClose?: () => void
}

export default function CivicChatbot({ onClose }: CivicChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" })

  useEffect(() => scrollToBottom(), [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = { id: messages.length + 1, text: inputValue, sender: "user" }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.text })
      })
      const data = await res.json()
      const botMessage: Message = { id: messages.length + 2, text: data.answer, sender: "bot" }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        { id: messages.length + 2, text: "Sorry, I couldn't fetch an answer.", sender: "bot" }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-xl">
        <h2 className="font-semibold text-lg">Civic Bot</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.sender === "user" ? "bg-blue-100 text-right ml-auto" : "bg-white text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="text-gray-500 text-sm">Bot is typing...</div>}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <div className="flex p-4 gap-2 border-t bg-white">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about Mangalore civic issues..."
          className="flex-1 rounded-full border-gray-300"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} className="rounded-full bg-blue-600 text-white hover:bg-blue-700">
          Send
        </Button>
      </div>
    </div>
  )
}
