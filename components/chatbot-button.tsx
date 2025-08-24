"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import CivicChatbot from "./civic-chatbot"

interface ChatbotButtonProps {
  userType: "citizen" | "mcc"
}

export default function ChatbotButton({ userType }: ChatbotButtonProps) {
  const [showChatbot, setShowChatbot] = useState(false)

  return (
    <>
      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowChatbot(true)}
          className="w-14 h-14 rounded-full gradient-bg hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Chatbot Dialog */}
      <CivicChatbot userType={userType} isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </>
  )
}
