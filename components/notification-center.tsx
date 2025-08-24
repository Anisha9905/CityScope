"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bell, X, CheckCircle, AlertTriangle, Clock, Users, Shield } from "lucide-react"

interface Notification {
  id: number
  title: string
  message: string
  type: "issue_update" | "assignment" | "resolved" | "new_issue" | "system"
  timestamp: string
  read: boolean
  priority: "high" | "medium" | "low"
  relatedIssueId?: number
}

interface NotificationCenterProps {
  userType: "citizen" | "mcc"
  isOpen: boolean
  onClose: () => void
}

export default function NotificationCenter({ userType, isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] =
      userType === "citizen"
        ? [
            {
              id: 1,
              title: "Issue Update",
              message: "Your reported pothole on Car Street has been assigned to Worker Team A",
              type: "assignment",
              timestamp: "2 minutes ago",
              read: false,
              priority: "high",
              relatedIssueId: 1,
            },
            {
              id: 2,
              title: "Issue Resolved",
              message: "Street light issue on MG Road has been resolved. Thank you for reporting!",
              type: "resolved",
              timestamp: "1 hour ago",
              read: false,
              priority: "medium",
              relatedIssueId: 2,
            },
            {
              id: 3,
              title: "System Update",
              message: "New feature: You can now track your issues in real-time on the map",
              type: "system",
              timestamp: "3 hours ago",
              read: true,
              priority: "low",
            },
            {
              id: 4,
              title: "Issue Update",
              message: "Work has started on your garbage collection complaint in Kadri area",
              type: "issue_update",
              timestamp: "1 day ago",
              read: true,
              priority: "medium",
              relatedIssueId: 3,
            },
          ]
        : [
            {
              id: 1,
              title: "New Issue Reported",
              message: "Citizen reported water logging issue in Bejai area - Priority: High",
              type: "new_issue",
              timestamp: "5 minutes ago",
              read: false,
              priority: "high",
              relatedIssueId: 4,
            },
            {
              id: 2,
              title: "Worker Assignment",
              message: "Worker Team B has been assigned to pothole repair on Car Street",
              type: "assignment",
              timestamp: "30 minutes ago",
              read: false,
              priority: "medium",
              relatedIssueId: 1,
            },
            {
              id: 3,
              title: "Issue Resolved",
              message: "Street lighting issue on MG Road has been marked as resolved",
              type: "resolved",
              timestamp: "2 hours ago",
              read: true,
              priority: "medium",
              relatedIssueId: 2,
            },
            {
              id: 4,
              title: "System Alert",
              message: "23 pending issues require immediate attention",
              type: "system",
              timestamp: "4 hours ago",
              read: true,
              priority: "high",
            },
          ]

    setNotifications(mockNotifications)
  }, [userType])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "assignment":
        return <Users className="w-5 h-5 text-blue-600" />
      case "new_issue":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case "issue_update":
        return <Clock className="w-5 h-5 text-purple-600" />
      case "system":
        return <Shield className="w-5 h-5 text-gray-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors ${
                    !notification.read ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm leading-tight">{notification.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(notification.priority)} variant="outline">
                              {notification.priority}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                          {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
