"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import NotificationCenter from "./notification-center"

interface NotificationBellProps {
  userType: "citizen" | "mcc"
}

export default function NotificationBell({ userType }: NotificationBellProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Mock unread count based on user type
  useEffect(() => {
    const mockUnreadCount = userType === "citizen" ? 2 : 2
    setUnreadCount(mockUnreadCount)

    // Simulate real-time notifications
    const interval = setInterval(() => {
      // Randomly add new notifications (mock)
      if (Math.random() > 0.95) {
        setUnreadCount((prev) => prev + 1)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [userType])

  const handleNotificationClick = () => {
    setShowNotifications(true)
  }

  const handleNotificationClose = () => {
    setShowNotifications(false)
    // Reset unread count when notifications are viewed
    setUnreadCount(0)
  }

  return (
    <>
      <Button variant="ghost" size="sm" className="relative" onClick={handleNotificationClick}>
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <NotificationCenter userType={userType} isOpen={showNotifications} onClose={handleNotificationClose} />
    </>
  )
}
