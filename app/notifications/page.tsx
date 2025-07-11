"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Bell, AlertTriangle, Info, Plus, Eye, Settings, Send, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const notificationStats = [
  { title: "Unread Notifications", value: "23", change: "+5", icon: Bell },
  { title: "Critical Alerts", value: "3", change: "+1", icon: AlertTriangle },
  { title: "System Messages", value: "8", change: "+2", icon: Info },
  { title: "Sent Today", value: "45", change: "+12", icon: Send },
]

const notifications = [
  {
    id: "NOT001",
    title: "Critical Patient Alert",
    message: "Patient John Doe (P12345) in ICU requires immediate attention - vital signs unstable",
    type: "Critical",
    category: "Patient Care",
    timestamp: "2024-01-10 14:30",
    sender: "ICU Monitoring System",
    recipients: ["Dr. Sarah Wilson", "Nurse Mary Johnson"],
    status: "Unread",
    priority: "High",
  },
  {
    id: "NOT002",
    title: "Lab Results Available",
    message: "Blood test results for Jane Smith (P12346) are now available for review",
    type: "Info",
    category: "Laboratory",
    timestamp: "2024-01-10 13:45",
    sender: "Laboratory System",
    recipients: ["Dr. Michael Brown"],
    status: "Read",
    priority: "Normal",
  },
  {
    id: "NOT003",
    title: "Medication Stock Alert",
    message: "Amoxicillin 500mg is running low - current stock: 25 units (minimum: 50)",
    type: "Warning",
    category: "Pharmacy",
    timestamp: "2024-01-10 12:15",
    sender: "Pharmacy System",
    recipients: ["Pharmacist John", "Inventory Manager"],
    status: "Read",
    priority: "Medium",
  },
  {
    id: "NOT004",
    title: "Appointment Reminder",
    message: "Reminder: Alice Cooper has an appointment with Dr. James Lee at 10:30 AM tomorrow",
    type: "Info",
    category: "Appointments",
    timestamp: "2024-01-10 11:00",
    sender: "Appointment System",
    recipients: ["Reception Staff"],
    status: "Unread",
    priority: "Low",
  },
  {
    id: "NOT005",
    title: "System Maintenance",
    message: "Scheduled system maintenance will occur tonight from 2:00 AM to 4:00 AM",
    type: "System",
    category: "IT",
    timestamp: "2024-01-10 09:30",
    sender: "IT Department",
    recipients: ["All Staff"],
    status: "Read",
    priority: "Medium",
  },
]

const alertRules = [
  {
    id: "RULE001",
    name: "Critical Vital Signs",
    description: "Alert when patient vital signs exceed critical thresholds",
    category: "Patient Care",
    triggers: ["Heart Rate > 120", "Blood Pressure > 180/110", "SpO2 < 90%"],
    recipients: ["ICU Staff", "Attending Physicians"],
    status: "Active",
    priority: "Critical",
  },
  {
    id: "RULE002",
    name: "Low Medication Stock",
    description: "Alert when medication stock falls below minimum threshold",
    category: "Pharmacy",
    triggers: ["Stock < Minimum Level"],
    recipients: ["Pharmacy Staff", "Inventory Manager"],
    status: "Active",
    priority: "Medium",
  },
  {
    id: "RULE003",
    name: "Appointment Reminders",
    description: "Send appointment reminders to staff and patients",
    category: "Appointments",
    triggers: ["24 hours before appointment", "1 hour before appointment"],
    recipients: ["Reception Staff", "Patients"],
    status: "Active",
    priority: "Low",
  },
]

export default function NotificationsPage() {
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isNewNotificationOpen, setIsNewNotificationOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { toast } = useToast()

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Critical":
        return "destructive"
      case "Warning":
        return "secondary"
      case "Info":
        return "default"
      case "System":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Unread":
        return "destructive"
      case "Read":
        return "default"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Critical":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "default"
      default:
        return "outline"
    }
  }

  const handleSendNotification = () => {
    toast({
      title: "Notification Sent",
      description: "Notification has been successfully sent to recipients.",
    })
    setIsNewNotificationOpen(false)
  }

  const handleMarkAsRead = () => {
    toast({
      title: "Marked as Read",
      description: "Notification has been marked as read.",
    })
    setIsNotificationOpen(false)
    setSelectedNotification(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Manage system notifications and alerts</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Notification Settings</DialogTitle>
                <DialogDescription>Configure your notification preferences.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Desktop Notifications</Label>
                      <p className="text-sm text-muted-foreground">Show desktop notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sound Alerts</Label>
                      <p className="text-sm text-muted-foreground">Play sound for critical alerts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notification Categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Patient Care</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Laboratory</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Pharmacy</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Appointments</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">System</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Emergency</span>
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsSettingsOpen(false)}>Save Settings</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isNewNotificationOpen} onOpenChange={setIsNewNotificationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Send New Notification</DialogTitle>
                <DialogDescription>Create and send a notification to staff members.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter notification title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter notification message..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient-care">Patient Care</SelectItem>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="appointments">Appointments</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-staff">All Staff</SelectItem>
                      <SelectItem value="doctors">All Doctors</SelectItem>
                      <SelectItem value="nurses">All Nurses</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy Staff</SelectItem>
                      <SelectItem value="reception">Reception Staff</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewNotificationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendNotification}>Send Notification</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {notificationStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">All Notifications</TabsTrigger>
          <TabsTrigger value="alerts">Alert Rules</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Latest system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">{notification.message}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeColor(notification.type)}>{notification.type}</Badge>
                      </TableCell>
                      <TableCell>{notification.category}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                      </TableCell>
                      <TableCell>{notification.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(notification.status)}>{notification.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedNotification(notification)
                            setIsNotificationOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules</CardTitle>
              <CardDescription>Automated notification rules and triggers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Triggers</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-sm text-muted-foreground">{rule.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{rule.category}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {rule.triggers.slice(0, 2).join(", ")}
                          {rule.triggers.length > 2 && "..."}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{rule.recipients.join(", ")}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(rule.priority)}>{rule.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{rule.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>Archive of all sent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="mx-auto h-12 w-12 mb-4" />
                <p>Notification history will be displayed here</p>
                <p className="text-sm">This would show a chronological list of all notifications</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>Pre-defined notification templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4" />
                <p>Notification templates will be displayed here</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification Details Dialog */}
      <Dialog open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
            <DialogDescription>View notification information and take action</DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Notification Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Title:</strong> {selectedNotification.title}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedNotification.type}
                    </p>
                    <p>
                      <strong>Category:</strong> {selectedNotification.category}
                    </p>
                    <p>
                      <strong>Priority:</strong> {selectedNotification.priority}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Delivery Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Sender:</strong> {selectedNotification.sender}
                    </p>
                    <p>
                      <strong>Timestamp:</strong> {selectedNotification.timestamp}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedNotification.status}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <div className="mt-2 p-3 bg-muted rounded text-sm">{selectedNotification.message}</div>
              </div>
              <div className="space-y-2">
                <Label>Recipients</Label>
                <div className="mt-2 text-sm">{selectedNotification.recipients.join(", ")}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotificationOpen(false)}>
              Close
            </Button>
            {selectedNotification?.status === "Unread" && <Button onClick={handleMarkAsRead}>Mark as Read</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
