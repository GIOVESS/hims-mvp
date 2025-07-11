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
import { Calendar, Clock, Users, CheckCircle, Plus, Eye, Edit, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const appointmentStats = [
  { title: "Today's Appointments", value: "47", change: "+8", icon: Calendar },
  { title: "Scheduled", value: "156", change: "+12", icon: Clock },
  { title: "Completed", value: "89", change: "+15", icon: CheckCircle },
  { title: "Total Patients", value: "1,247", change: "+23", icon: Users },
]

const todayAppointments = [
  {
    id: "APT001",
    patientName: "John Doe",
    patientId: "P12345",
    time: "09:00 AM",
    doctor: "Dr. Sarah Wilson",
    department: "Cardiology",
    type: "Follow-up",
    status: "Scheduled",
    duration: "30 mins",
    notes: "Regular check-up for heart condition",
  },
  {
    id: "APT002",
    patientName: "Jane Smith",
    patientId: "P12346",
    time: "09:30 AM",
    doctor: "Dr. Michael Brown",
    department: "General Medicine",
    type: "Consultation",
    status: "In Progress",
    duration: "45 mins",
    notes: "New patient consultation",
  },
  {
    id: "APT003",
    patientName: "Robert Johnson",
    patientId: "P12347",
    time: "10:00 AM",
    doctor: "Dr. Emily Davis",
    department: "Orthopedics",
    type: "Follow-up",
    status: "Completed",
    duration: "30 mins",
    notes: "Post-surgery follow-up",
  },
  {
    id: "APT004",
    patientName: "Alice Cooper",
    patientId: "P12348",
    time: "10:30 AM",
    doctor: "Dr. James Lee",
    department: "Dermatology",
    type: "Consultation",
    status: "Scheduled",
    duration: "30 mins",
    notes: "Skin condition evaluation",
  },
]

const upcomingAppointments = [
  {
    id: "APT005",
    patientName: "David Miller",
    patientId: "P12349",
    date: "2024-01-11",
    time: "02:00 PM",
    doctor: "Dr. Sarah Wilson",
    department: "Cardiology",
    type: "Consultation",
    status: "Scheduled",
  },
  {
    id: "APT006",
    patientName: "Sarah Taylor",
    patientId: "P12350",
    date: "2024-01-11",
    time: "03:30 PM",
    doctor: "Dr. Michael Brown",
    department: "General Medicine",
    type: "Follow-up",
    status: "Scheduled",
  },
  {
    id: "APT007",
    patientName: "Mark Brown",
    patientId: "P12351",
    date: "2024-01-12",
    time: "09:00 AM",
    doctor: "Dr. Emily Davis",
    department: "Orthopedics",
    type: "Surgery Consultation",
    status: "Scheduled",
  },
]

const appointmentRequests = [
  {
    id: "REQ001",
    patientName: "Lisa Anderson",
    patientId: "P12352",
    requestedDate: "2024-01-15",
    preferredTime: "Morning",
    department: "Pediatrics",
    reason: "Child vaccination",
    status: "Pending",
    requestDate: "2024-01-08",
  },
  {
    id: "REQ002",
    patientName: "Tom Wilson",
    patientId: "P12353",
    requestedDate: "2024-01-16",
    preferredTime: "Afternoon",
    department: "Cardiology",
    reason: "Chest pain evaluation",
    status: "Pending",
    requestDate: "2024-01-09",
  },
]

export default function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "In Progress":
        return "secondary"
      case "Scheduled":
        return "outline"
      case "Cancelled":
        return "destructive"
      case "Pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Consultation":
        return "default"
      case "Follow-up":
        return "secondary"
      case "Surgery Consultation":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleScheduleAppointment = () => {
    toast({
      title: "Appointment Scheduled",
      description: "New appointment has been successfully scheduled.",
    })
    setIsNewAppointmentOpen(false)
  }

  const handleUpdateAppointment = () => {
    toast({
      title: "Appointment Updated",
      description: "Appointment details have been successfully updated.",
    })
    setIsAppointmentOpen(false)
    setSelectedAppointment(null)
  }

  const handleCancelAppointment = () => {
    toast({
      title: "Appointment Cancelled",
      description: "Appointment has been cancelled and patient notified.",
      variant: "destructive",
    })
    setIsAppointmentOpen(false)
    setSelectedAppointment(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage patient appointments and scheduling</p>
        </div>
        <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Create a new appointment for a patient.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input id="patientId" placeholder="Enter patient ID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input id="patientName" placeholder="Patient name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="general">General Medicine</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="dermatology">Dermatology</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-wilson">Dr. Sarah Wilson</SelectItem>
                      <SelectItem value="dr-brown">Dr. Michael Brown</SelectItem>
                      <SelectItem value="dr-davis">Dr. Emily Davis</SelectItem>
                      <SelectItem value="dr-lee">Dr. James Lee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Date</Label>
                  <Input id="appointmentDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentTime">Time</Label>
                  <Input id="appointmentTime" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentType">Appointment Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="surgery-consultation">Surgery Consultation</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
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
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Enter appointment notes..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleAppointment}>Schedule Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {appointmentStats.map((stat, index) => (
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
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today's Appointments</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>Appointments scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.time}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">{appointment.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.department}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeColor(appointment.type)}>{appointment.type}</Badge>
                      </TableCell>
                      <TableCell>{appointment.duration}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setIsAppointmentOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Appointments scheduled for the coming days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.date}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">{appointment.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.department}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeColor(appointment.type)}>{appointment.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Requests</CardTitle>
              <CardDescription>Pending appointment requests from patients</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Preferred Time</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointmentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.patientName}</div>
                          <div className="text-sm text-muted-foreground">{request.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.requestedDate}</TableCell>
                      <TableCell>{request.preferredTime}</TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{request.reason}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(request.status)}>{request.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="default" size="sm">
                            Approve
                          </Button>
                          <Button variant="outline" size="sm">
                            <X className="h-4 w-4" />
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

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Visual calendar of all appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-4" />
                <p>Calendar view will be implemented here</p>
                <p className="text-sm">This would show a monthly/weekly calendar with appointments</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      <Dialog open={isAppointmentOpen} onOpenChange={setIsAppointmentOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>View and manage appointment information</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedAppointment.patientName}
                    </p>
                    <p>
                      <strong>ID:</strong> {selectedAppointment.patientId}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Appointment Details</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Time:</strong> {selectedAppointment.time}
                    </p>
                    <p>
                      <strong>Duration:</strong> {selectedAppointment.duration}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedAppointment.type}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedAppointment.status}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Doctor Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Doctor:</strong> {selectedAppointment.doctor}
                    </p>
                    <p>
                      <strong>Department:</strong> {selectedAppointment.department}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Status Update</Label>
                  <div className="mt-2">
                    <Select defaultValue={selectedAppointment.status.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  {selectedAppointment.notes || "No notes available"}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea id="additionalNotes" placeholder="Add notes about this appointment..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Cancel Appointment
            </Button>
            <Button variant="outline" onClick={() => setIsAppointmentOpen(false)}>
              Close
            </Button>
            <Button onClick={handleUpdateAppointment}>Update Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
