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
import { Progress } from "@/components/ui/progress"
import { Bed, Users, UserCheck, AlertCircle, Plus, Eye, Edit, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const wardStats = [
  { title: "Total Beds", value: "120", change: "0", icon: Bed },
  { title: "Occupied Beds", value: "89", change: "+5", icon: Users },
  { title: "Available Beds", value: "31", change: "-5", icon: UserCheck },
  { title: "Critical Patients", value: "8", change: "+2", icon: AlertCircle },
]

const wards = [
  {
    id: "W001",
    name: "General Medicine",
    floor: "2nd Floor",
    totalBeds: 30,
    occupiedBeds: 24,
    availableBeds: 6,
    occupancyRate: 80,
    headNurse: "Nurse Mary Johnson",
    status: "Active",
  },
  {
    id: "W002",
    name: "ICU",
    floor: "3rd Floor",
    totalBeds: 20,
    occupiedBeds: 18,
    availableBeds: 2,
    occupancyRate: 90,
    headNurse: "Nurse David Wilson",
    status: "Active",
  },
  {
    id: "W003",
    name: "Pediatrics",
    floor: "1st Floor",
    totalBeds: 25,
    occupiedBeds: 15,
    availableBeds: 10,
    occupancyRate: 60,
    headNurse: "Nurse Sarah Davis",
    status: "Active",
  },
  {
    id: "W004",
    name: "Maternity",
    floor: "2nd Floor",
    totalBeds: 20,
    occupiedBeds: 12,
    availableBeds: 8,
    occupancyRate: 60,
    headNurse: "Nurse Lisa Brown",
    status: "Active",
  },
  {
    id: "W005",
    name: "Surgery Recovery",
    floor: "4th Floor",
    totalBeds: 25,
    occupiedBeds: 20,
    availableBeds: 5,
    occupancyRate: 80,
    headNurse: "Nurse Tom Anderson",
    status: "Active",
  },
]

const patients = [
  {
    id: "P001",
    name: "John Doe",
    age: 45,
    gender: "Male",
    ward: "General Medicine",
    bedNumber: "GM-15",
    admissionDate: "2024-01-08",
    condition: "Stable",
    attendingDoctor: "Dr. Sarah Wilson",
    diagnosis: "Pneumonia",
    status: "Admitted",
  },
  {
    id: "P002",
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    ward: "ICU",
    bedNumber: "ICU-05",
    admissionDate: "2024-01-09",
    condition: "Critical",
    attendingDoctor: "Dr. Michael Brown",
    diagnosis: "Cardiac Arrest",
    status: "Critical",
  },
  {
    id: "P003",
    name: "Robert Johnson",
    age: 28,
    gender: "Male",
    ward: "Surgery Recovery",
    bedNumber: "SR-12",
    admissionDate: "2024-01-10",
    condition: "Recovering",
    attendingDoctor: "Dr. Emily Davis",
    diagnosis: "Post-operative care",
    status: "Recovering",
  },
]

const bedAssignments = [
  {
    bedId: "GM-15",
    ward: "General Medicine",
    patientName: "John Doe",
    patientId: "P001",
    admissionDate: "2024-01-08",
    expectedDischarge: "2024-01-15",
    status: "Occupied",
  },
  {
    bedId: "ICU-05",
    ward: "ICU",
    patientName: "Jane Smith",
    patientId: "P002",
    admissionDate: "2024-01-09",
    expectedDischarge: "TBD",
    status: "Occupied",
  },
  {
    bedId: "GM-16",
    ward: "General Medicine",
    patientName: null,
    patientId: null,
    admissionDate: null,
    expectedDischarge: null,
    status: "Available",
  },
]

export default function WardManagementPage() {
  const [selectedWard, setSelectedWard] = useState<any>(null)
  const [isWardDetailsOpen, setIsWardDetailsOpen] = useState(false)
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false)
  const { toast } = useToast()

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Critical":
        return "destructive"
      case "Stable":
        return "default"
      case "Recovering":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case "Occupied":
        return "destructive"
      case "Available":
        return "default"
      case "Maintenance":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return "text-red-600"
    if (rate >= 75) return "text-orange-600"
    return "text-green-600"
  }

  const handleAdmitPatient = () => {
    toast({
      title: "Patient Admitted",
      description: "Patient has been successfully admitted to the ward.",
    })
    setIsAdmissionOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ward Management</h1>
          <p className="text-muted-foreground">Manage hospital wards, beds, and patient admissions</p>
        </div>
        <Dialog open={isAdmissionOpen} onOpenChange={setIsAdmissionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Admit Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Admit New Patient</DialogTitle>
              <DialogDescription>Admit a patient to a ward and assign a bed.</DialogDescription>
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
                  <Label htmlFor="ward">Ward</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Medicine</SelectItem>
                      <SelectItem value="icu">ICU</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="maternity">Maternity</SelectItem>
                      <SelectItem value="surgery">Surgery Recovery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedNumber">Bed Number</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gm-16">GM-16</SelectItem>
                      <SelectItem value="gm-17">GM-17</SelectItem>
                      <SelectItem value="icu-08">ICU-08</SelectItem>
                      <SelectItem value="ped-12">PED-12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="attendingDoctor">Attending Doctor</Label>
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
                  <Label htmlFor="admissionDate">Admission Date</Label>
                  <Input id="admissionDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input id="diagnosis" placeholder="Enter diagnosis" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Admission Notes</Label>
                <Textarea id="notes" placeholder="Enter admission notes..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAdmissionOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdmitPatient}>Admit Patient</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {wardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.change.startsWith("+")
                      ? "text-green-600"
                      : stat.change.startsWith("-")
                        ? "text-red-600"
                        : "text-muted-foreground"
                  }
                >
                  {stat.change === "0" ? "No change" : stat.change}
                </span>{" "}
                from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="wards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wards">Ward Overview</TabsTrigger>
          <TabsTrigger value="patients">Current Patients</TabsTrigger>
          <TabsTrigger value="beds">Bed Management</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="wards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wards.map((ward) => (
              <Card key={ward.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{ward.name}</CardTitle>
                    <Badge variant="outline">{ward.status}</Badge>
                  </div>
                  <CardDescription className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3" />
                    {ward.floor}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Occupancy Rate</span>
                      <span className={getOccupancyColor(ward.occupancyRate)}>{ward.occupancyRate}%</span>
                    </div>
                    <Progress value={ward.occupancyRate} className="h-2" />
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <div className="font-medium">{ward.totalBeds}</div>
                        <div className="text-muted-foreground">Total</div>
                      </div>
                      <div>
                        <div className="font-medium text-red-600">{ward.occupiedBeds}</div>
                        <div className="text-muted-foreground">Occupied</div>
                      </div>
                      <div>
                        <div className="font-medium text-green-600">{ward.availableBeds}</div>
                        <div className="text-muted-foreground">Available</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-sm">
                        <strong>Head Nurse:</strong> {ward.headNurse}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          setSelectedWard(ward)
                          setIsWardDetailsOpen(true)
                        }}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Patients</CardTitle>
              <CardDescription>Patients currently admitted to wards</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Bed</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Attending Doctor</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {patient.age}y, {patient.gender}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.ward}</TableCell>
                      <TableCell>{patient.bedNumber}</TableCell>
                      <TableCell>{patient.admissionDate}</TableCell>
                      <TableCell>
                        <Badge variant={getConditionColor(patient.condition)}>{patient.condition}</Badge>
                      </TableCell>
                      <TableCell>{patient.attendingDoctor}</TableCell>
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

        <TabsContent value="beds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bed Management</CardTitle>
              <CardDescription>Current bed assignments and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bed ID</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Expected Discharge</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bedAssignments.map((bed) => (
                    <TableRow key={bed.bedId}>
                      <TableCell className="font-medium">{bed.bedId}</TableCell>
                      <TableCell>{bed.ward}</TableCell>
                      <TableCell>
                        {bed.patientName ? (
                          <div>
                            <div className="font-medium">{bed.patientName}</div>
                            <div className="text-sm text-muted-foreground">{bed.patientId}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unoccupied</span>
                        )}
                      </TableCell>
                      <TableCell>{bed.admissionDate || "-"}</TableCell>
                      <TableCell>{bed.expectedDischarge || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={getBedStatusColor(bed.status)}>{bed.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {bed.status === "Available" && (
                            <Button variant="default" size="sm">
                              Assign
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Transfers</CardTitle>
              <CardDescription>Manage patient transfers between wards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4" />
                <p>No pending transfers at this time</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  <Plus className="mr-2 h-4 w-4" />
                  Request Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ward Details Dialog */}
      <Dialog open={isWardDetailsOpen} onOpenChange={setIsWardDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Ward Details</DialogTitle>
            <DialogDescription>Detailed information about {selectedWard?.name}</DialogDescription>
          </DialogHeader>
          {selectedWard && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ward Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedWard.name}
                    </p>
                    <p>
                      <strong>ID:</strong> {selectedWard.id}
                    </p>
                    <p>
                      <strong>Floor:</strong> {selectedWard.floor}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedWard.status}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Capacity & Occupancy</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Total Beds:</strong> {selectedWard.totalBeds}
                    </p>
                    <p>
                      <strong>Occupied:</strong> {selectedWard.occupiedBeds}
                    </p>
                    <p>
                      <strong>Available:</strong> {selectedWard.availableBeds}
                    </p>
                    <p>
                      <strong>Occupancy Rate:</strong> {selectedWard.occupancyRate}%
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Label>Staff Information</Label>
                <div className="mt-2 text-sm">
                  <p>
                    <strong>Head Nurse:</strong> {selectedWard.headNurse}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ward Notes</Label>
                <Textarea placeholder="Enter ward-specific notes or updates..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWardDetailsOpen(false)}>
              Close
            </Button>
            <Button>Update Ward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
