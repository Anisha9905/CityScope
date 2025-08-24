"use client"

import MangaloreMap from "@/components/mangalore-map"
import ChatbotButton from "@/components/chatbot-button"
import { useRouter } from "next/navigation"

export default function MCCMapPage() {
  const router = useRouter()

  const handleClose = () => {
    router.push("/mcc/dashboard")
  }

  return (
    <div className="h-screen">
      <MangaloreMap userType="mcc" onClose={handleClose} />
      <ChatbotButton userType="mcc" />
    </div>
  )
}
