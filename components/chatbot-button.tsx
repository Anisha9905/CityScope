"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"
import CivicChatbot from "./civic-chatbot"
import { motion, AnimatePresence } from "framer-motion"

interface ChatbotButtonProps {
  userType: "citizen" | "mcc"
}

export default function ChatbotButton({ userType }: ChatbotButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Chatbot Circle */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-16 h-16 rounded-full gradient-bg hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* Animated Chatbot Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-28 right-6 w-96 h-[520px] z-50 flex flex-col shadow-2xl rounded-xl bg-white"
          >
            <CivicChatbot onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
