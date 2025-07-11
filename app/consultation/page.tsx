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
import { Stethoscope, Clock, Users, FileText, User, Eye, Edit, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const consultationStats = [
  { title: "Active Consultations", value: "18", change: "+3", icon: Stethoscope },
  { title: "Waiting Patients", value: "12", change: "-2", icon: Clock },
  { title: "Completed Today", value: "45", change: "+12", icon: Users },
  { title: "Pending Reports", value: "8", change: "+1", icon: FileText },
]

const activeConsultations = [
  {
    id: "C001",
    patientName: "John Doe",
    patientId: "P12345",
    doctor: "Dr. Sarah Wilson",
    department: "Cardiology",
    startTime: "09:30 AM",
    duration: "25 mins",
    status: "In Progress",
    room: "Room 201",
  },
  {
    id: "C002",
    patientName: "Jane Smith",
    patientId: "P12346",
    doctor: "Dr. Michael Brown",
    department: "General Medicine",
    startTime: "10:00 AM",
    duration: "15 mins",
    status: "In Progress",
    room: "Room 105",
  },
  {
    id: "C003",
    patientName: "Robert Johnson",
    patientId: "P12347",
    doctor: "Dr. Emily Davis",
    department: "Orthopedics",
    startTime: "10:15 AM",
    duration: "30 mins",
    status: "In Progress",
    room: "Room 302",
  },
]

const waitingPatients = [
  {
    id: "W001",
    patientName: "Alice Cooper",
    patientId: "P12348",
    appointmentTime: "10:30 AM",
    doctor: "Dr. Sarah Wilson",
    department: "Cardiology",
    priority: "Urgent",
    waitTime: "15 mins",
  },
  {
    id: "W002",
    patientName: "David Miller",
    patientId: "P12349",
    appointmentTime: "10:45 AM",
    doctor: "Dr. Michael Brown",
    department: "General Medicine",
    priority: "Normal",
    waitTime: "5 mins",
  },
  {
    id: "W003",
    patientName: "Sarah Taylor",
    patientId: "P12350",
    appointmentTime: "11:00 AM",
    doctor: "Dr. Emily Davis",
    department: "Orthopedics",
    priority: "Normal",
    waitTime: "0 mins",
  },
]

const completedConsultations = [
  {
    id: "CC001",
    patientName: "Mark Wilson",
    patientId: "P12340",
    doctor: "Dr. James Lee",
    department: "Dermatology",
    completedTime: "09:15 AM",
    duration: "20 mins",
    diagnosis: "Eczema",
    followUp: "2 weeks",
  },
  {
    id: "CC002",
    patientName: "Lisa Anderson",
    patientId: "P12341",
    doctor: "Dr. Maria Garcia",
    department: "Pediatrics",
    completedTime: "08:45 AM",
    duration: "25 mins",
    diagnosis: "Common cold",
    followUp: "As needed",
  },
]

export default function ConsultationPage() {
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const [isNewConsultationOpen, setIsNewConsultationOpen] = useState(false)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "default"
      case "Completed":
        return "secondary"
      case "Waiting":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "destructive"
      case "High":
        return "secondary"
      default:
        return "default"
    }
  }

  const handleCompleteConsultation = () => {
    toast({
      title: "Consultation Completed",
      description: "Patient consultation has been completed and notes saved.",
    })
    setIsConsultationOpen(false)
    setSelectedConsultation(null)
  }

  const handleStartConsultation = () => {
    toast({
      title: "Consultation Started",
      description: "New consultation session has been initiated.",
    })
    setIsNewConsultationOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultation</h1>
          <p className="text-muted-foreground">Manage patient consultations and medical records</p>
        </div>
        <Dialog open={isNewConsultationOpen} onOpenChange={setIsNewConsultationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Start Consultation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Start New Consultation</DialogTitle>
              <DialogDescription>Begin a new consultation session with a patient.</DialogDescription>
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
                  <Label htmlFor="doctor">Consulting Doctor</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="room">Room Number</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room-101">Room 101</SelectItem>
                      <SelectItem value="room-102">Room 102</SelectItem>
                      <SelectItem value="room-201">Room 201</SelectItem>
                      <SelectItem value="room-202">Room 202</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                <Textarea id="chiefComplaint" placeholder="Enter patient's main concern..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewConsultationOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStartConsultation}>Start Consultation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {consultationStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span>{" "}
                from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Consultations</TabsTrigger>
          <TabsTrigger value="waiting">Waiting Queue</TabsTrigger>
          <TabsTrigger value="completed">Completed Today</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Consultations</CardTitle>
              <CardDescription>Currently ongoing consultation sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeConsultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{consultation.patientName}</div>
                          <div className="text-sm text-muted-foreground">{consultation.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{consultation.doctor}</TableCell>
                      <TableCell>{consultation.department}</TableCell>
                      <TableCell>{consultation.startTime}</TableCell>
                      <TableCell>{consultation.duration}</TableCell>
                      <TableCell>{consultation.room}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(consultation.status)}>{consultation.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedConsultation(consultation)
                              setIsConsultationOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="sm">
                            Complete
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

        <TabsContent value="waiting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Waiting Queue</CardTitle>
              <CardDescription>Patients waiting for consultation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Appointment Time</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitingPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{patient.patientName}</div>
                          <div className="text-sm text-muted-foreground">{patient.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.appointmentTime}</TableCell>
                      <TableCell>{patient.doctor}</TableCell>
                      <TableCell>{patient.department}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(patient.priority)}>{patient.priority}</Badge>
                      </TableCell>
                      <TableCell>{patient.waitTime}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <User className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="sm">
                            Call In
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

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Consultations</CardTitle>
              <CardDescription>Consultations completed today</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Completed Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Follow-up</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedConsultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{consultation.patientName}</div>
                          <div className="text-sm text-muted-foreground">{consultation.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{consultation.doctor}</TableCell>
                      <TableCell>{consultation.department}</TableCell>
                      <TableCell>{consultation.completedTime}</TableCell>
                      <TableCell>{consultation.duration}</TableCell>
                      <TableCell>{consultation.diagnosis}</TableCell>
                      <TableCell>{consultation.followUp}</TableCell>
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
      </Tabs>

      {/* Consultation Details Dialog */}
      <Dialog open={isConsultationOpen} onOpenChange={setIsConsultationOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Consultation Details</DialogTitle>
            <DialogDescription>View and update consultation information</DialogDescription>
          </DialogHeader>
          {selectedConsultation && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedConsultation.patientName}
                    </p>
                    <p>
                      <strong>ID:</strong> {selectedConsultation.patientId}
                    </p>
                    <p>
                      <strong>Room:</strong> {selectedConsultation.room}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Consultation Details</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Doctor:</strong> {selectedConsultation.doctor}
                    </p>
                    <p>
                      <strong>Department:</strong> {selectedConsultation.department}
                    </p>
                    <p>
                      <strong>Duration:</strong> {selectedConsultation.duration}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms & History</Label>
                <Textarea id="symptoms" placeholder="Enter patient symptoms and medical history..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examination">Physical Examination</Label>
                <Textarea id="examination" placeholder="Enter examination findings..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input id="diagnosis" placeholder="Enter diagnosis" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUp">Follow-up</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select follow-up" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1week">1 week</SelectItem>
                      <SelectItem value="2weeks">2 weeks</SelectItem>
                      <SelectItem value="1month">1 month</SelectItem>
                      <SelectItem value="3months">3 months</SelectItem>
                      <SelectItem value="asneeded">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prescription">Prescription</Label>
                <Textarea id="prescription" placeholder="Enter medications and dosage..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConsultationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteConsultation}>Complete Consultation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
