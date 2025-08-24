"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Send, X, Bot, User } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "quick_reply" | "suggestion"
}

interface ChatbotProps {
  userType: "citizen" | "mcc"
  isOpen: boolean
  onClose: () => void
}

export default function CivicChatbot({ userType, isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        text:
          userType === "citizen"
            ? "Hello! I'm your Mangalore Civic Assistant. I can help you report issues, track complaints, and answer questions about city services. How can I assist you today?"
            : "Hello! I'm your MCC Assistant. I can help you with issue management, worker assignments, and system guidance. What would you like to know?",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, userType, messages.length])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mock AI responses based on user type and input
  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (userType === "citizen") {
      if (input.includes("report") || input.includes("issue") || input.includes("problem")) {
        return "To report an issue: 1) Click 'Report New Issue' on your dashboard, 2) Use GPS to mark location, 3) Take photos, 4) Add description, 5) Submit. You'll get real-time updates on progress!"
      }
      if (input.includes("track") || input.includes("status") || input.includes("complaint")) {
        return "You can track your issues in the 'My Reported Issues' section on your dashboard. Each issue shows current status: Pending (yellow), In Progress (blue), or Resolved (green). You'll also get notifications for updates!"
      }
      if (input.includes("map") || input.includes("location")) {
        return "The Mangalore Map shows all civic issues across the city. Click 'View Mangalore Map' to see issue locations, their status, and report new problems by clicking anywhere on the map."
      }
      if (input.includes("notification") || input.includes("update")) {
        return "You'll receive notifications when: 1) Your issue is assigned to a worker, 2) Work begins, 3) Issue is resolved. Check the bell icon for all updates!"
      }
      if (input.includes("emergency") || input.includes("urgent")) {
        return "For emergencies, call: Police (100), Fire (101), Ambulance (108). For urgent civic issues, mark priority as 'High' when reporting."
      }
      if (input.includes("water") || input.includes("electricity") || input.includes("power")) {
        return "For utility issues: Water supply problems - contact MCC Water Dept. Power outages - contact MESCOM. You can also report these through our app for tracking."
      }
      return "I can help you with: reporting issues, tracking complaints, using the map, understanding notifications, emergency contacts, and general civic services. What specific help do you need?"
    } else {
      // MCC responses
      if (input.includes("assign") || input.includes("worker") || input.includes("team")) {
        return "To assign workers: 1) Go to Issue Management, 2) Click 'Assign Worker' on any issue, 3) Select appropriate team/department, 4) Citizen gets notified automatically. You can also bulk assign similar issues."
      }
      if (input.includes("priority") || input.includes("urgent") || input.includes("high")) {
        return "Priority levels: High (red) - immediate attention needed, Medium (orange) - address within 24-48 hours, Low (green) - routine maintenance. Sort by priority in the dashboard filters."
      }
      if (input.includes("status") || input.includes("update") || input.includes("progress")) {
        return "Update issue status: 1) Find issue in management panel, 2) Click 'Update Status', 3) Change to In Progress/Resolved, 4) Add notes if needed. Citizens get automatic notifications."
      }
      if (input.includes("map") || input.includes("location") || input.includes("area")) {
        return "Use the MCC Map to: view all issues by location, identify problem areas, assign nearby workers efficiently, and get geographic insights for better resource allocation."
      }
      if (input.includes("report") || input.includes("analytics") || input.includes("stats")) {
        return "Dashboard shows: Total issues, Pending count, In Progress, Resolved. Use filters to generate reports by date, area, priority, or department for better planning."
      }
      if (input.includes("citizen") || input.includes("complaint") || input.includes("feedback")) {
        return "Citizen communication: All updates are automatically sent via notifications. For direct contact, use the citizen ID shown in issue details. Response time targets: High priority - 2 hours, Medium - 24 hours."
      }
      return "I can help with: worker assignments, priority management, status updates, map usage, analytics, and citizen communication. What do you need assistance with?"
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: generateBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickReply = (reply: string) => {
    setInputValue(reply)
    handleSendMessage()
  }

  const quickReplies =
    userType === "citizen"
      ? ["How to report an issue?", "Track my complaints", "Emergency contacts", "View map"]
      : ["Assign workers", "Update status", "Priority levels", "View analytics"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              Civic Assistant
              <Badge variant="secondary" className="text-xs">
                {userType === "citizen" ? "Citizen Help" : "MCC Support"}
              </Badge>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Replies */}
        {messages.length <= 1 && (
          <div className="p-4 border-t bg-gray-50">
            <p className="text-sm text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs"
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="gradient-bg hover:opacity-90 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
