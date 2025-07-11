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
import { Pill, Clock, CheckCircle, AlertTriangle, Plus, Eye, Package, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const pharmacyStats = [
  { title: "Pending Prescriptions", value: "32", change: "+8", icon: Clock },
  { title: "Dispensed Today", value: "156", change: "+24", icon: CheckCircle },
  { title: "Low Stock Items", value: "12", change: "+3", icon: AlertTriangle },
  { title: "Total Medications", value: "2,847", change: "+45", icon: Package },
]

const pendingPrescriptions = [
  {
    id: "RX001",
    patientName: "John Doe",
    patientId: "P12345",
    prescribedBy: "Dr. Sarah Wilson",
    medication: "Amoxicillin 500mg",
    dosage: "1 tablet 3 times daily",
    quantity: "21 tablets",
    priority: "Normal",
    orderTime: "09:30 AM",
    status: "Pending",
  },
  {
    id: "RX002",
    patientName: "Jane Smith",
    patientId: "P12346",
    prescribedBy: "Dr. Michael Brown",
    medication: "Lisinopril 10mg",
    dosage: "1 tablet daily",
    quantity: "30 tablets",
    priority: "Urgent",
    orderTime: "10:15 AM",
    status: "In Progress",
  },
  {
    id: "RX003",
    patientName: "Robert Johnson",
    patientId: "P12347",
    prescribedBy: "Dr. Emily Davis",
    medication: "Ibuprofen 400mg",
    dosage: "1 tablet as needed",
    quantity: "20 tablets",
    priority: "Normal",
    orderTime: "10:45 AM",
    status: "Pending",
  },
]

const dispensedMedications = [
  {
    id: "DX001",
    patientName: "Alice Cooper",
    patientId: "P12348",
    medication: "Metformin 500mg",
    quantity: "60 tablets",
    dispensedBy: "Pharmacist John",
    dispensedTime: "08:30 AM",
    prescribedBy: "Dr. James Lee",
    status: "Completed",
  },
  {
    id: "DX002",
    patientName: "David Miller",
    patientId: "P12349",
    medication: "Atorvastatin 20mg",
    quantity: "30 tablets",
    dispensedBy: "Pharmacist Sarah",
    dispensedTime: "09:15 AM",
    prescribedBy: "Dr. Maria Garcia",
    status: "Completed",
  },
]

const inventoryItems = [
  {
    id: "MED001",
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    currentStock: 150,
    minStock: 50,
    maxStock: 500,
    unitPrice: "$0.85",
    expiryDate: "2025-06-15",
    supplier: "PharmaCorp",
    status: "In Stock",
  },
  {
    id: "MED002",
    name: "Lisinopril 10mg",
    category: "Cardiovascular",
    currentStock: 25,
    minStock: 30,
    maxStock: 200,
    unitPrice: "$0.45",
    expiryDate: "2025-03-20",
    supplier: "MediSupply",
    status: "Low Stock",
  },
  {
    id: "MED003",
    name: "Metformin 500mg",
    category: "Diabetes",
    currentStock: 0,
    minStock: 40,
    maxStock: 300,
    unitPrice: "$0.35",
    expiryDate: "N/A",
    supplier: "HealthPlus",
    status: "Out of Stock",
  },
]

export default function PharmacyPage() {
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null)
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false)
  const [isInventoryOpen, setIsInventoryOpen] = useState(false)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "In Progress":
        return "secondary"
      case "Pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "default"
      case "Low Stock":
        return "secondary"
      case "Out of Stock":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleDispenseMedication = () => {
    toast({
      title: "Medication Dispensed",
      description: "Prescription has been successfully dispensed to patient.",
    })
    setIsPrescriptionOpen(false)
    setSelectedPrescription(null)
  }

  const handleUpdateInventory = () => {
    toast({
      title: "Inventory Updated",
      description: "Medication inventory has been successfully updated.",
    })
    setIsInventoryOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pharmacy</h1>
          <p className="text-muted-foreground">Manage prescriptions and medication inventory</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isInventoryOpen} onOpenChange={setIsInventoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Update Inventory
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Update Medication Inventory</DialogTitle>
                <DialogDescription>Add or update medication stock levels.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicationName">Medication Name</Label>
                    <Input id="medicationName" placeholder="Enter medication name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antibiotics">Antibiotics</SelectItem>
                        <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                        <SelectItem value="diabetes">Diabetes</SelectItem>
                        <SelectItem value="painkillers">Pain Killers</SelectItem>
                        <SelectItem value="vitamins">Vitamins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentStock">Current Stock</Label>
                    <Input id="currentStock" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Min Stock</Label>
                    <Input id="minStock" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxStock">Max Stock</Label>
                    <Input id="maxStock" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">Unit Price</Label>
                    <Input id="unitPrice" placeholder="$0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" placeholder="Enter supplier name" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInventoryOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateInventory}>Update Inventory</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {pharmacyStats.map((stat, index) => (
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
      <Tabs defaultValue="prescriptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prescriptions">Pending Prescriptions</TabsTrigger>
          <TabsTrigger value="dispensed">Dispensed</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Prescriptions</CardTitle>
              <CardDescription>Prescriptions waiting to be dispensed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prescription ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage & Quantity</TableHead>
                    <TableHead>Prescribed By</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">{prescription.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{prescription.patientName}</div>
                          <div className="text-sm text-muted-foreground">{prescription.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{prescription.medication}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{prescription.dosage}</div>
                          <div className="text-sm text-muted-foreground">{prescription.quantity}</div>
                        </div>
                      </TableCell>
                      <TableCell>{prescription.prescribedBy}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(prescription.priority)}>{prescription.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(prescription.status)}>{prescription.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPrescription(prescription)
                              setIsPrescriptionOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="sm">
                            <Pill className="h-4 w-4" />
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

        <TabsContent value="dispensed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dispensed Medications</CardTitle>
              <CardDescription>Recently dispensed prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispensed ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Dispensed By</TableHead>
                    <TableHead>Dispensed Time</TableHead>
                    <TableHead>Prescribed By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dispensedMedications.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell className="font-medium">{medication.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{medication.patientName}</div>
                          <div className="text-sm text-muted-foreground">{medication.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{medication.medication}</TableCell>
                      <TableCell>{medication.quantity}</TableCell>
                      <TableCell>{medication.dispensedBy}</TableCell>
                      <TableCell>{medication.dispensedTime}</TableCell>
                      <TableCell>{medication.prescribedBy}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
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

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medication Inventory</CardTitle>
              <CardDescription>Current stock levels and medication details</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{item.currentStock} units</div>
                          <div className="text-xs text-muted-foreground">
                            Min: {item.minStock} | Max: {item.maxStock}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.unitPrice}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>
                        <Badge variant={getStockStatusColor(item.status)}>{item.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Package className="h-4 w-4" />
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
              <CardTitle>Search Medications</CardTitle>
              <CardDescription>Search for medications, prescriptions, or patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by medication name, patient, or prescription ID..." className="pl-8" />
                </div>
                <Button>Search</Button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <Pill className="mx-auto h-12 w-12 mb-4" />
                <p>Enter search criteria to find medications or prescriptions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prescription Details Dialog */}
      <Dialog open={isPrescriptionOpen} onOpenChange={setIsPrescriptionOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>Review and dispense prescription</DialogDescription>
          </DialogHeader>
          {selectedPrescription && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedPrescription.patientName}
                    </p>
                    <p>
                      <strong>ID:</strong> {selectedPrescription.patientId}
                    </p>
                    <p>
                      <strong>Prescribed By:</strong> {selectedPrescription.prescribedBy}
                    </p>
                    <p>
                      <strong>Order Time:</strong> {selectedPrescription.orderTime}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Prescription Details</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Medication:</strong> {selectedPrescription.medication}
                    </p>
                    <p>
                      <strong>Dosage:</strong> {selectedPrescription.dosage}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {selectedPrescription.quantity}
                    </p>
                    <p>
                      <strong>Priority:</strong> {selectedPrescription.priority}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Dispensing Instructions</Label>
                <Textarea id="instructions" placeholder="Enter special instructions for patient..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pharmacist">Dispensed By</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pharmacist" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pharmacist-john">Pharmacist John</SelectItem>
                      <SelectItem value="pharmacist-sarah">Pharmacist Sarah</SelectItem>
                      <SelectItem value="pharmacist-mike">Pharmacist Mike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dispensedQuantity">Dispensed Quantity</Label>
                  <Input id="dispensedQuantity" defaultValue={selectedPrescription.quantity} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" placeholder="Enter any additional notes..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrescriptionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDispenseMedication}>Dispense Medication</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
