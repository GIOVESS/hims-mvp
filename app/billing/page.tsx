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
import { DollarSign, CreditCard, Clock, CheckCircle, Plus, Eye, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const billingStats = [
  { title: "Total Revenue", value: "$45,231", change: "+12%", icon: DollarSign },
  { title: "Pending Payments", value: "$8,420", change: "+5%", icon: Clock },
  { title: "Paid Today", value: "$12,350", change: "+18%", icon: CheckCircle },
  { title: "Outstanding", value: "$3,890", change: "-8%", icon: CreditCard },
]

const pendingBills = [
  {
    id: "INV001",
    patientName: "John Doe",
    patientId: "P12345",
    services: ["Consultation", "Lab Tests", "Medication"],
    totalAmount: 450.0,
    dueDate: "2024-01-15",
    status: "Pending",
    insuranceProvider: "HealthCare Plus",
    createdDate: "2024-01-08",
  },
  {
    id: "INV002",
    patientName: "Jane Smith",
    patientId: "P12346",
    services: ["Surgery", "Room Charges", "Anesthesia"],
    totalAmount: 2850.0,
    dueDate: "2024-01-20",
    status: "Pending",
    insuranceProvider: "MediCare",
    createdDate: "2024-01-09",
  },
  {
    id: "INV003",
    patientName: "Robert Johnson",
    patientId: "P12347",
    services: ["Emergency Care", "X-Ray", "Medication"],
    totalAmount: 680.0,
    dueDate: "2024-01-12",
    status: "Overdue",
    insuranceProvider: "Self Pay",
    createdDate: "2024-01-05",
  },
]

const paidBills = [
  {
    id: "INV004",
    patientName: "Alice Cooper",
    patientId: "P12348",
    services: ["Consultation", "Blood Test"],
    totalAmount: 180.0,
    paidDate: "2024-01-10",
    paymentMethod: "Credit Card",
    status: "Paid",
    insuranceProvider: "HealthCare Plus",
  },
  {
    id: "INV005",
    patientName: "David Miller",
    patientId: "P12349",
    services: ["Physical Therapy", "Consultation"],
    totalAmount: 320.0,
    paidDate: "2024-01-10",
    paymentMethod: "Insurance",
    status: "Paid",
    insuranceProvider: "BlueCross",
  },
]

const insuranceClaims = [
  {
    id: "CLM001",
    patientName: "Sarah Taylor",
    patientId: "P12350",
    insuranceProvider: "HealthCare Plus",
    claimAmount: 1250.0,
    submittedDate: "2024-01-08",
    status: "Under Review",
    expectedResolution: "2024-01-15",
  },
  {
    id: "CLM002",
    patientName: "Mark Brown",
    patientId: "P12351",
    insuranceProvider: "MediCare",
    claimAmount: 890.0,
    submittedDate: "2024-01-07",
    status: "Approved",
    expectedResolution: "2024-01-14",
  },
]

export default function BillingPage() {
  const [selectedBill, setSelectedBill] = useState<any>(null)
  const [isBillDetailsOpen, setIsBillDetailsOpen] = useState(false)
  const [isNewBillOpen, setIsNewBillOpen] = useState(false)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "default"
      case "Pending":
        return "secondary"
      case "Overdue":
        return "destructive"
      case "Approved":
        return "default"
      case "Under Review":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleCreateBill = () => {
    toast({
      title: "Bill Created",
      description: "New bill has been successfully created and sent to patient.",
    })
    setIsNewBillOpen(false)
  }

  const handleProcessPayment = () => {
    toast({
      title: "Payment Processed",
      description: "Payment has been successfully processed and recorded.",
    })
    setIsBillDetailsOpen(false)
    setSelectedBill(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Finance</h1>
          <p className="text-muted-foreground">Manage patient billing, payments, and insurance claims</p>
        </div>
        <Dialog open={isNewBillOpen} onOpenChange={setIsNewBillOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Bill</DialogTitle>
              <DialogDescription>Generate a new bill for patient services.</DialogDescription>
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
              <div className="space-y-2">
                <Label htmlFor="services">Services Provided</Label>
                <Textarea id="services" placeholder="List all services provided..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input id="totalAmount" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurance provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthcare-plus">HealthCare Plus</SelectItem>
                    <SelectItem value="medicare">MediCare</SelectItem>
                    <SelectItem value="bluecross">BlueCross</SelectItem>
                    <SelectItem value="self-pay">Self Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" placeholder="Enter any additional notes..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewBillOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBill}>Create Bill</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {billingStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Bills</TabsTrigger>
          <TabsTrigger value="paid">Paid Bills</TabsTrigger>
          <TabsTrigger value="insurance">Insurance Claims</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Bills</CardTitle>
              <CardDescription>Bills awaiting payment from patients or insurance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bill.patientName}</div>
                          <div className="text-sm text-muted-foreground">{bill.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {bill.services.slice(0, 2).join(", ")}
                          {bill.services.length > 2 && "..."}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${bill.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{bill.dueDate}</TableCell>
                      <TableCell>{bill.insuranceProvider}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(bill.status)}>{bill.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBill(bill)
                              setIsBillDetailsOpen(true)
                            }}
                          >
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

        <TabsContent value="paid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paid Bills</CardTitle>
              <CardDescription>Recently processed payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paidBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bill.patientName}</div>
                          <div className="text-sm text-muted-foreground">{bill.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{bill.services.join(", ")}</div>
                      </TableCell>
                      <TableCell className="font-medium">${bill.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{bill.paidDate}</TableCell>
                      <TableCell>{bill.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(bill.status)}>{bill.status}</Badge>
                      </TableCell>
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

        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Claims</CardTitle>
              <CardDescription>Submitted insurance claims and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Insurance Provider</TableHead>
                    <TableHead>Claim Amount</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expected Resolution</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insuranceClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{claim.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{claim.patientName}</div>
                          <div className="text-sm text-muted-foreground">{claim.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{claim.insuranceProvider}</TableCell>
                      <TableCell className="font-medium">${claim.claimAmount.toFixed(2)}</TableCell>
                      <TableCell>{claim.submittedDate}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(claim.status)}>{claim.status}</Badge>
                      </TableCell>
                      <TableCell>{claim.expectedResolution}</TableCell>
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

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue Report</CardTitle>
                <CardDescription>Today's financial summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-medium">$12,350</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash Payments:</span>
                    <span>$3,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Card Payments:</span>
                    <span>$5,150</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance:</span>
                    <span>$4,000</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
                <CardDescription>January 2024 overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-medium">$345,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outstanding:</span>
                    <span className="text-red-600">$23,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collection Rate:</span>
                    <span className="text-green-600">93.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Bill Amount:</span>
                    <span>$287</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insurance Analytics</CardTitle>
                <CardDescription>Claims processing overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Claims Submitted:</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Claims Approved:</span>
                    <span className="text-green-600">142</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Claims Denied:</span>
                    <span className="text-red-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approval Rate:</span>
                    <span className="text-green-600">91.0%</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bill Details Dialog */}
      <Dialog open={isBillDetailsOpen} onOpenChange={setIsBillDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Bill Details</DialogTitle>
            <DialogDescription>View and process bill payment</DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedBill.patientName}
                    </p>
                    <p>
                      <strong>ID:</strong> {selectedBill.patientId}
                    </p>
                    <p>
                      <strong>Insurance:</strong> {selectedBill.insuranceProvider}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Bill Information</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Invoice ID:</strong> {selectedBill.id}
                    </p>
                    <p>
                      <strong>Created:</strong> {selectedBill.createdDate}
                    </p>
                    <p>
                      <strong>Due Date:</strong> {selectedBill.dueDate}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedBill.status}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Label>Services Provided</Label>
                <div className="mt-2 text-sm">
                  <ul className="list-disc list-inside">
                    {selectedBill.services.map((service: string, index: number) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Amount</Label>
                  <div className="mt-2 text-2xl font-bold">${selectedBill.totalAmount.toFixed(2)}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="debit-card">Debit Card</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentNotes">Payment Notes</Label>
                <Textarea id="paymentNotes" placeholder="Enter payment notes..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBillDetailsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayment}>Process Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
