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
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Clock, Users, Activity, Stethoscope, Thermometer, Heart, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const triageStats = [
  { title: "Critical Cases", value: "3", change: "+1", icon: AlertTriangle, color: "text-red-600" },
  { title: "Urgent Cases", value: "12", change: "+4", icon: Clock, color: "text-orange-600" },
  { title: "Standard Cases", value: "28", change: "+8", icon: Users, color: "text-blue-600" },
  { title: "Average Wait Time", value: "15m", change: "-3m", icon: Activity, color: "text-green-600" },
]

const triageQueue = [
  {
    id: "T001",
    name: "Emergency Patient",
    age: 45,
    gender: "Male",
    chiefComplaint: "Chest pain, difficulty breathing",
    vitalSigns: { bp: "180/110", hr: "120", temp: "98.6°F", spo2: "92%" },
    priority: "Critical",
    arrivalTime: "08:30 AM",
    waitTime: "5 mins",
    assignedNurse: "Sarah Johnson",
  },
  {
    id: "T002",
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    chiefComplaint: "Severe abdominal pain",
    vitalSigns: { bp: "140/90", hr: "95", temp: "99.2°F", spo2: "98%" },
    priority: "Urgent",
    arrivalTime: "08:45 AM",
    waitTime: "20 mins",
    assignedNurse: "Mike Davis",
  },
  {
    id: "T003",
    name: "Robert Wilson",
    age: 28,
    gender: "Male",
    chiefComplaint: "Ankle sprain from sports injury",
    vitalSigns: { bp: "120/80", hr: "78", temp: "98.4°F", spo2: "99%" },
    priority: "Standard",
    arrivalTime: "09:00 AM",
    waitTime: "35 mins",
    assignedNurse: "Lisa Brown",
  },
  {
    id: "T004",
    name: "Maria Garcia",
    age: 55,
    gender: "Female",
    chiefComplaint: "Persistent headache and dizziness",
    vitalSigns: { bp: "160/95", hr: "88", temp: "98.8°F", spo2: "97%" },
    priority: "Urgent",
    arrivalTime: "09:15 AM",
    waitTime: "10 mins",
    assignedNurse: "Tom Wilson",
  },
]

const completedAssessments = [
  {
    id: "C001",
    name: "John Anderson",
    priority: "Standard",
    completedTime: "08:20 AM",
    assignedTo: "Dr. Smith - General Medicine",
    status: "Transferred",
  },
  {
    id: "C002",
    name: "Emma Thompson",
    priority: "Urgent",
    completedTime: "08:35 AM",
    assignedTo: "Dr. Johnson - Cardiology",
    status: "In Treatment",
  },
  {
    id: "C003",
    name: "David Lee",
    priority: "Standard",
    completedTime: "08:50 AM",
    assignedTo: "Dr. Brown - Orthopedics",
    status: "Waiting",
  },
]

export default function TriagePage() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)
  const { toast } = useToast()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive"
      case "Urgent":
        return "secondary"
      case "Standard":
        return "default"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Transferred":
        return "default"
      case "In Treatment":
        return "secondary"
      case "Waiting":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleCompleteAssessment = () => {
    toast({
      title: "Assessment Completed",
      description: "Patient has been assessed and assigned to appropriate department.",
    })
    setIsAssessmentOpen(false)
    setSelectedPatient(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Triage</h1>
          <p className="text-muted-foreground">Patient assessment and priority management</p>
        </div>
        <Button variant="outline">
          <Stethoscope className="mr-2 h-4 w-4" />
          Quick Assessment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {triageStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span>{" "}
                from last hour
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Triage Queue</TabsTrigger>
          <TabsTrigger value="completed">Completed Assessments</TabsTrigger>
          <TabsTrigger value="protocols">Triage Protocols</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Triage Queue</CardTitle>
              <CardDescription>Patients awaiting triage assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Chief Complaint</TableHead>
                    <TableHead>Vital Signs</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead>Assigned Nurse</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {triageQueue.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {patient.age}y, {patient.gender} • {patient.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{patient.chiefComplaint}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <Heart className="mr-1 h-3 w-3 text-red-500" />
                            BP: {patient.vitalSigns.bp}
                          </div>
                          <div className="flex items-center">
                            <Activity className="mr-1 h-3 w-3 text-blue-500" />
                            HR: {patient.vitalSigns.hr}
                          </div>
                          <div className="flex items-center">
                            <Thermometer className="mr-1 h-3 w-3 text-orange-500" />
                            {patient.vitalSigns.temp}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(patient.priority)}>{patient.priority}</Badge>
                      </TableCell>
                      <TableCell>{patient.waitTime}</TableCell>
                      <TableCell>{patient.assignedNurse}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPatient(patient)
                              setIsAssessmentOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="sm">
                            Assess
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
              <CardTitle>Completed Assessments</CardTitle>
              <CardDescription>Recently completed triage assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Completed Time</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.id}</TableCell>
                      <TableCell>{assessment.name}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(assessment.priority)}>{assessment.priority}</Badge>
                      </TableCell>
                      <TableCell>{assessment.completedTime}</TableCell>
                      <TableCell>{assessment.assignedTo}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(assessment.status)}>{assessment.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Critical Priority</CardTitle>
                <CardDescription>Immediate life-threatening conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Cardiac arrest</li>
                  <li>• Severe respiratory distress</li>
                  <li>• Major trauma</li>
                  <li>• Stroke symptoms</li>
                  <li>• Severe allergic reactions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Urgent Priority</CardTitle>
                <CardDescription>Potentially serious conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Chest pain</li>
                  <li>• Severe abdominal pain</li>
                  <li>• High fever</li>
                  <li>• Moderate trauma</li>
                  <li>• Severe headache</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Standard Priority</CardTitle>
                <CardDescription>Non-urgent conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Minor injuries</li>
                  <li>• Routine check-ups</li>
                  <li>• Prescription refills</li>
                  <li>• Follow-up visits</li>
                  <li>• Preventive care</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Assessment Dialog */}
      <Dialog open={isAssessmentOpen} onOpenChange={setIsAssessmentOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Triage Assessment</DialogTitle>
            <DialogDescription>Complete triage assessment for {selectedPatient?.name}</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedPatient.name}
                    </p>
                    <p>
                      <strong>Age:</strong> {selectedPatient.age}
                    </p>
                    <p>
                      <strong>Gender:</strong> {selectedPatient.gender}
                    </p>
                    <p>
                      <strong>ID:</strong> {selectedPatient.id}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Current Vital Signs</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>BP:</strong> {selectedPatient.vitalSigns.bp}
                    </p>
                    <p>
                      <strong>HR:</strong> {selectedPatient.vitalSigns.hr}
                    </p>
                    <p>
                      <strong>Temp:</strong> {selectedPatient.vitalSigns.temp}
                    </p>
                    <p>
                      <strong>SpO2:</strong> {selectedPatient.vitalSigns.spo2}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Chief Complaint</Label>
                <p className="text-sm bg-muted p-2 rounded">{selectedPatient.chiefComplaint}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessment">Assessment Notes</Label>
                <Textarea id="assessment" placeholder="Enter assessment notes..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select defaultValue={selectedPatient.priority.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Assign to Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="general">General Medicine</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssessmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteAssessment}>Complete Assessment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
