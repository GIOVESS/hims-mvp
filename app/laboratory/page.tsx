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
import { FlaskRoundIcon as Flask, Clock, CheckCircle, AlertCircle, Plus, Eye, Download, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const labStats = [
  { title: "Pending Tests", value: "24", change: "+6", icon: Clock },
  { title: "In Progress", value: "18", change: "+3", icon: Flask },
  { title: "Completed Today", value: "67", change: "+15", icon: CheckCircle },
  { title: "Critical Results", value: "3", change: "+1", icon: AlertCircle },
]

const pendingTests = [
  {
    id: "LAB001",
    patientName: "John Doe",
    patientId: "P12345",
    testType: "Complete Blood Count",
    category: "Hematology",
    orderedBy: "Dr. Sarah Wilson",
    orderTime: "08:30 AM",
    priority: "Urgent",
    sampleStatus: "Collected",
  },
  {
    id: "LAB002",
    patientName: "Jane Smith",
    patientId: "P12346",
    testType: "Lipid Profile",
    category: "Biochemistry",
    orderedBy: "Dr. Michael Brown",
    orderTime: "09:15 AM",
    priority: "Normal",
    sampleStatus: "Pending Collection",
  },
  {
    id: "LAB003",
    patientName: "Robert Johnson",
    patientId: "P12347",
    testType: "Chest X-Ray",
    category: "Radiology",
    orderedBy: "Dr. Emily Davis",
    orderTime: "09:45 AM",
    priority: "Normal",
    sampleStatus: "Collected",
  },
]

const inProgressTests = [
  {
    id: "LAB004",
    patientName: "Alice Cooper",
    patientId: "P12348",
    testType: "Blood Culture",
    category: "Microbiology",
    technician: "Tech. Mark Wilson",
    startTime: "07:30 AM",
    estimatedCompletion: "11:30 AM",
    progress: 75,
  },
  {
    id: "LAB005",
    patientName: "David Miller",
    patientId: "P12349",
    testType: "Liver Function Test",
    category: "Biochemistry",
    technician: "Tech. Lisa Anderson",
    startTime: "08:00 AM",
    estimatedCompletion: "10:00 AM",
    progress: 90,
  },
]

const completedTests = [
  {
    id: "LAB006",
    patientName: "Sarah Taylor",
    patientId: "P12350",
    testType: "Thyroid Function Test",
    category: "Biochemistry",
    completedTime: "08:45 AM",
    result: "Normal",
    technician: "Tech. Mark Wilson",
    verifiedBy: "Dr. James Lee",
    critical: false,
  },
  {
    id: "LAB007",
    patientName: "Mark Brown",
    patientId: "P12351",
    testType: "Cardiac Enzymes",
    category: "Biochemistry",
    completedTime: "09:20 AM",
    result: "Elevated Troponin",
    technician: "Tech. Lisa Anderson",
    verifiedBy: "Dr. Maria Garcia",
    critical: true,
  },
]

export default function LaboratoryPage() {
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [isTestDetailsOpen, setIsTestDetailsOpen] = useState(false)
  const [isNewTestOpen, setIsNewTestOpen] = useState(false)
  const { toast } = useToast()

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

  const getSampleStatusColor = (status: string) => {
    switch (status) {
      case "Collected":
        return "default"
      case "Pending Collection":
        return "secondary"
      case "Processing":
        return "outline"
      default:
        return "outline"
    }
  }

  const getResultColor = (critical: boolean) => {
    return critical ? "destructive" : "default"
  }

  const handleOrderTest = () => {
    toast({
      title: "Test Ordered",
      description: "Laboratory test has been successfully ordered.",
    })
    setIsNewTestOpen(false)
  }

  const handleCompleteTest = () => {
    toast({
      title: "Test Completed",
      description: "Test results have been recorded and verified.",
    })
    setIsTestDetailsOpen(false)
    setSelectedTest(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laboratory</h1>
          <p className="text-muted-foreground">Manage laboratory tests and results</p>
        </div>
        <Dialog open={isNewTestOpen} onOpenChange={setIsNewTestOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Order Test
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Laboratory Test</DialogTitle>
              <DialogDescription>Create a new laboratory test order for a patient.</DialogDescription>
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
                  <Label htmlFor="testCategory">Test Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hematology">Hematology</SelectItem>
                      <SelectItem value="biochemistry">Biochemistry</SelectItem>
                      <SelectItem value="microbiology">Microbiology</SelectItem>
                      <SelectItem value="radiology">Radiology</SelectItem>
                      <SelectItem value="pathology">Pathology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testType">Test Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cbc">Complete Blood Count</SelectItem>
                      <SelectItem value="lipid">Lipid Profile</SelectItem>
                      <SelectItem value="liver">Liver Function Test</SelectItem>
                      <SelectItem value="thyroid">Thyroid Function Test</SelectItem>
                      <SelectItem value="cardiac">Cardiac Enzymes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderingDoctor">Ordering Doctor</Label>
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
              <div className="space-y-2">
                <Label htmlFor="clinicalNotes">Clinical Notes</Label>
                <Textarea id="clinicalNotes" placeholder="Enter clinical indication and notes..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTestOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleOrderTest}>Order Test</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {labStats.map((stat, index) => (
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
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Tests</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Laboratory Tests</CardTitle>
              <CardDescription>Tests waiting to be processed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Ordered By</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Sample Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{test.patientName}</div>
                          <div className="text-sm text-muted-foreground">{test.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{test.testType}</TableCell>
                      <TableCell>{test.category}</TableCell>
                      <TableCell>{test.orderedBy}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(test.priority)}>{test.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSampleStatusColor(test.sampleStatus)}>{test.sampleStatus}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTest(test)
                              setIsTestDetailsOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="sm">
                            Start
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

        <TabsContent value="inprogress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tests In Progress</CardTitle>
              <CardDescription>Currently being processed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Est. Completion</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inProgressTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{test.patientName}</div>
                          <div className="text-sm text-muted-foreground">{test.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{test.testType}</TableCell>
                      <TableCell>{test.technician}</TableCell>
                      <TableCell>{test.startTime}</TableCell>
                      <TableCell>{test.estimatedCompletion}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${test.progress}%` }} />
                          </div>
                          <span className="text-sm">{test.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
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

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tests</CardTitle>
              <CardDescription>Recently completed laboratory tests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Completed Time</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Verified By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{test.patientName}</div>
                          <div className="text-sm text-muted-foreground">{test.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{test.testType}</TableCell>
                      <TableCell>
                        <Badge variant={getResultColor(test.critical)}>{test.result}</Badge>
                      </TableCell>
                      <TableCell>{test.completedTime}</TableCell>
                      <TableCell>{test.technician}</TableCell>
                      <TableCell>{test.verifiedBy}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
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
              <CardTitle>Search Laboratory Tests</CardTitle>
              <CardDescription>Search for tests by patient, test type, or date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by patient name, test ID, or test type..." className="pl-8" />
                </div>
                <Button>Search</Button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <Flask className="mx-auto h-12 w-12 mb-4" />
                <p>Enter search criteria to find laboratory tests</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Details Dialog */}
      <Dialog open={isTestDetailsOpen} onOpenChange={setIsTestDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Test Details</DialogTitle>
            <DialogDescription>View and update test information</DialogDescription>
          </DialogHeader>
          {selectedTest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Test Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Test ID:</strong> {selectedTest.id}
                    </p>
                    <p>
                      <strong>Test Type:</strong> {selectedTest.testType}
                    </p>
                    <p>
                      <strong>Category:</strong> {selectedTest.category}
                    </p>
                    <p>
                      <strong>Priority:</strong> {selectedTest.priority}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Patient Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedTest.patientName}
                    </p>
                    <p>
                      <strong>ID:</strong> {selectedTest.patientId}
                    </p>
                    <p>
                      <strong>Ordered By:</strong> {selectedTest.orderedBy}
                    </p>
                    <p>
                      <strong>Order Time:</strong> {selectedTest.orderTime}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="testResults">Test Results</Label>
                <Textarea id="testResults" placeholder="Enter test results and findings..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="normalRange">Normal Range</Label>
                  <Input id="normalRange" placeholder="Enter normal range" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Units</Label>
                  <Input id="units" placeholder="Enter units" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interpretation">Interpretation</Label>
                <Textarea id="interpretation" placeholder="Enter clinical interpretation..." />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="critical" className="rounded" />
                <Label htmlFor="critical">Mark as critical result</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestDetailsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteTest}>Save Results</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
