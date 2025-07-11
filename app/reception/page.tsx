"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Search, Clock, Users, Calendar, Phone, Mail, Edit, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const receptionStats = [
  { title: "Today's Registrations", value: "47", change: "+12%", icon: UserPlus },
  { title: "Waiting Patients", value: "23", change: "-5%", icon: Clock },
  { title: "Total Patients", value: "1,247", change: "+8%", icon: Users },
  { title: "Appointments Today", value: "89", change: "+15%", icon: Calendar },
]

const waitingPatients = [
  { id: "P001", name: "John Doe", time: "09:30 AM", priority: "Normal", department: "General Medicine" },
  { id: "P002", name: "Jane Smith", time: "09:45 AM", priority: "Urgent", department: "Cardiology" },
  { id: "P003", name: "Mike Johnson", time: "10:00 AM", priority: "Normal", department: "Orthopedics" },
  { id: "P004", name: "Sarah Wilson", time: "10:15 AM", priority: "High", department: "Emergency" },
  { id: "P005", name: "David Brown", time: "10:30 AM", priority: "Normal", department: "Dermatology" },
]

const recentRegistrations = [
  {
    id: "R001",
    name: "Alice Cooper",
    phone: "+1-555-0123",
    email: "alice@email.com",
    time: "2 mins ago",
    status: "Completed",
  },
  {
    id: "R002",
    name: "Bob Martin",
    phone: "+1-555-0124",
    email: "bob@email.com",
    time: "5 mins ago",
    status: "Pending",
  },
  {
    id: "R003",
    name: "Carol Davis",
    phone: "+1-555-0125",
    email: "carol@email.com",
    time: "8 mins ago",
    status: "Completed",
  },
  {
    id: "R004",
    name: "Daniel Lee",
    phone: "+1-555-0126",
    email: "daniel@email.com",
    time: "12 mins ago",
    status: "Completed",
  },
]

export default function ReceptionPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const { toast } = useToast()

  const handleNewRegistration = () => {
    toast({
      title: "Patient Registered",
      description: "New patient has been successfully registered.",
    })
    setIsRegistrationOpen(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Urgent":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "Pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reception</h1>
          <p className="text-muted-foreground">Manage patient registrations and appointments</p>
        </div>
        <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              New Registration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Patient Registration</DialogTitle>
              <DialogDescription>Register a new patient in the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+1-555-0123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="patient@email.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter full address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input id="emergency" placeholder="Emergency contact name and phone" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRegistrationOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleNewRegistration}>Register Patient</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {receptionStats.map((stat, index) => (
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
      <Tabs defaultValue="waiting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="waiting">Waiting Queue</TabsTrigger>
          <TabsTrigger value="registrations">Recent Registrations</TabsTrigger>
          <TabsTrigger value="search">Patient Search</TabsTrigger>
        </TabsList>

        <TabsContent value="waiting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Waiting Patients</CardTitle>
              <CardDescription>Patients currently waiting for appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Appointment Time</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitingPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.time}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(patient.priority)}>{patient.priority}</Badge>
                      </TableCell>
                      <TableCell>{patient.department}</TableCell>
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

        <TabsContent value="registrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Registrations</CardTitle>
              <CardDescription>Latest patient registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.id}</TableCell>
                      <TableCell>{registration.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="mr-1 h-3 w-3" />
                            {registration.phone}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="mr-1 h-3 w-3" />
                            {registration.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{registration.time}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(registration.status)}>{registration.status}</Badge>
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

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Search</CardTitle>
              <CardDescription>Search for existing patients in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button>Search</Button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <Search className="mx-auto h-12 w-12 mb-4" />
                <p>Enter search criteria to find patients</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
