"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check } from "lucide-react"
import { notificationsAPI } from "@/lib/api"

interface Notification {
  id: number
  title: string
  description: string
  notification_type: string
  is_read: boolean
  created_at: string
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await notificationsAPI.getNotifications()
        setNotifications(response.data)
        setError("")
      } catch (err) {
        console.error("Error fetching notifications:", err)
        setError("Using demo data")
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Simulate real-time notifications in demo mode
    const interval = setInterval(() => {
      // Add a new demo notification occasionally
      if (Math.random() < 0.1) {
        // 10% chance every 30 seconds
        const demoNotifications = [
          {
            id: Date.now(),
            title: "Lab Results Available",
            description: "Blood test results for patient John Doe are ready for review.",
            notification_type: "info",
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: Date.now() + 1,
            title: "Medication Alert",
            description: "Low stock alert for Paracetamol 500mg tablets.",
            notification_type: "alert",
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ]

        const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)]
        setNotifications((prev) => [randomNotification, ...prev])
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const markAsRead = async (id: number) => {
    try {
      await notificationsAPI.markAsRead([id])
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    } catch (err) {
      console.error("Error marking notification as read:", err)
      // Still update UI in demo mode
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

    if (unreadIds.length === 0) return

    try {
      await notificationsAPI.markAsRead(unreadIds)
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
      // Still update UI in demo mode
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
    }
  }

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-500 hover:bg-red-600"
      case "alert":
        return "bg-amber-500 hover:bg-amber-600"
      case "success":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Notifications</CardTitle>
          <Button variant="outline" size="sm" disabled>
            Mark all as read
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>Notifications</CardTitle>
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} new</Badge>}
          {error && (
            <Badge variant="outline" className="text-xs">
              Demo Mode
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
          Mark all as read
        </Button>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-3 rounded-lg ${!notification.is_read ? "bg-muted/50" : ""}`}
              >
                <Badge
                  className={`${getNotificationTypeColor(notification.notification_type)} h-8 w-8 rounded-full p-1`}
                >
                  <Bell className="h-6 w-6 text-white" />
                </Badge>
                <div className="space-y-1 flex-1">
                  <div className="flex items-start justify-between">
                    <p className="font-medium">{notification.title}</p>
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(notification.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
