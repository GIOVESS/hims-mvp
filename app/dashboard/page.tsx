"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  UserPlus,
  Calendar,
  CalendarPlus,
  Bed,
  BedDouble,
  DollarSign,
  CreditCard,
  TrendingUp,
  Activity,
  Heart,
  Stethoscope,
} from "lucide-react"

import { DashboardStats } from "@/components/dashboard-stats"
import { PatientQueue } from "@/components/patient-queue"
import { BedOccupancy } from "@/components/bed-occupancy"
import { RecentActivity } from "@/components/recent-activity"
import { RevenueChart } from "@/components/revenue-chart"
import { NotificationsPanel } from "@/components/notifications-panel"
import { dashboardAPI } from "@/lib/api"
import { Loader2, AlertCircle } from "lucide-react"

// Mock data for tabs
const mockPatients = [
  { id: "P001", name: "Alice Johnson", age: 34, gender: "Female", lastVisit: "2024-01-15", status: "Active" },
  { id: "P002", name: "Bob Smith", age: 67, gender: "Male", lastVisit: "2024-01-14", status: "Discharged" },
  { id: "P003", name: "Carol Davis", age: 28, gender: "Female", lastVisit: "2024-01-13", status: "Admitted" },
  { id: "P004", name: "David Wilson", age: 52, gender: "Male", lastVisit: "2024-01-12", status: "Active" },
  { id: "P005", name: "Emma Brown", age: 41, gender: "Female", lastVisit: "2024-01-11", status: "Active" },
]

const mockWards = [
  {
    name: "General Ward A",
    type: "General",
    totalBeds: 30,
    occupiedBeds: 24,
    availableBeds: 6,
    occupancyRate: 80,
    patients: [
      { name: "John Doe", bed: "A-01", admitted: "2024-01-10", condition: "Stable" },
      { name: "Jane Smith", bed: "A-03", admitted: "2024-01-12", condition: "Improving" },
      { name: "Mike Johnson", bed: "A-05", admitted: "2024-01-14", condition: "Critical" },
    ],
  },
  {
    name: "ICU",
    type: "Intensive Care",
    totalBeds: 15,
    occupiedBeds: 12,
    availableBeds: 3,
    occupancyRate: 80,
    patients: [
      { name: "Sarah Wilson", bed: "ICU-02", admitted: "2024-01-08", condition: "Critical" },
      { name: "Robert Davis", bed: "ICU-04", admitted: "2024-01-13", condition: "Stable" },
    ],
  },
  {
    name: "Private Rooms",
    type: "Private",
    totalBeds: 25,
    occupiedBeds: 18,
    availableBeds: 7,
    occupancyRate: 72,
    patients: [
      { name: "Lisa Anderson", bed: "PR-101", admitted: "2024-01-09", condition: "Recovering" },
      { name: "Tom Miller", bed: "PR-103", admitted: "2024-01-11", condition: "Stable" },
    ],
  },
  {
    name: "Pediatric Ward",
    type: "Pediatric",
    totalBeds: 20,
    occupiedBeds: 15,
    availableBeds: 5,
    occupancyRate: 75,
    patients: [
      { name: "Emily Chen", bed: "PED-01", admitted: "2024-01-12", condition: "Improving" },
      { name: "Alex Rodriguez", bed: "PED-03", admitted: "2024-01-14", condition: "Stable" },
    ],
  },
]

const mockFinancialData = {
  totalRevenue: 2450000,
  monthlyRevenue: 245000,
  pendingPayments: 45000,
  paidInvoices: 156,
  pendingInvoices: 23,
  recentTransactions: [
    { id: "TXN001", patient: "Alice Johnson", amount: 1250, type: "Payment", date: "2024-01-15", status: "Completed" },
    { id: "TXN002", patient: "Bob Smith", amount: 850, type: "Insurance", date: "2024-01-14", status: "Pending" },
    { id: "TXN003", patient: "Carol Davis", amount: 2100, type: "Payment", date: "2024-01-13", status: "Completed" },
    { id: "TXN004", patient: "David Wilson", amount: 750, type: "Payment", date: "2024-01-12", status: "Completed" },
  ],
}

export default function DashboardPage() {
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [stats, queue, occupancy, revenue, activity] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getPatientQueue(),
        dashboardAPI.getBedOccupancy(),
        dashboardAPI.getRevenueChart(),
        dashboardAPI.getRecentActivity(),
      ])

      setData({
        stats: stats.data,
        queue: queue.data,
        occupancy: occupancy.data,
        revenue: revenue.data,
        activity: activity.data,
      })
    } catch (err: any) {
      console.error("Dashboard data fetch error:", err)
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
            <p className="text-sm text-gray-600 text-center">Fetching the latest hospital data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-sm text-gray-600 text-center mb-4">{error}</p>
            <Button onClick={fetchDashboardData} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Hospital Management System. Here's an overview of today's activities.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="wards">Wards</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <DashboardStats data={data.stats} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart data={data.revenue} />
            </div>
            <div>
              <BedOccupancy data={data.occupancy} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientQueue data={data.queue} />
            <RecentActivity data={data.activity} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NotificationsPanel />

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="text-center">
                    <UserPlus className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Register Patient</div>
                    <div className="text-sm text-muted-foreground">Add new patient</div>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="text-center">
                    <CalendarPlus className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Schedule Appointment</div>
                    <div className="text-sm text-muted-foreground">Book consultation</div>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="text-center">
                    <BedDouble className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Admit Patient</div>
                    <div className="text-sm text-muted-foreground">Ward admission</div>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Emergency Alert</div>
                    <div className="text-sm text-muted-foreground">Quick response</div>
                  </div>
                </Card>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Patient Management</h2>
              <p className="text-muted-foreground">View and manage patient records</p>
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Patient
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Patients</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">67</div>
                <p className="text-xs text-muted-foreground">Currently admitted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground">8 completed</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>Latest patient registrations and visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input placeholder="Search patients..." className="max-w-sm" />
                  <Button variant="outline">Filter</Button>
                </div>

                <div className="rounded-md border">
                  <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
                    <div>Patient ID</div>
                    <div>Name</div>
                    <div>Age</div>
                    <div>Gender</div>
                    <div>Last Visit</div>
                    <div>Status</div>
                  </div>
                  {mockPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 hover:bg-muted/50"
                    >
                      <div className="font-medium">{patient.id}</div>
                      <div>{patient.name}</div>
                      <div>{patient.age}</div>
                      <div>{patient.gender}</div>
                      <div>{patient.lastVisit}</div>
                      <div>
                        <Badge
                          variant={
                            patient.status === "Active"
                              ? "default"
                              : patient.status === "Admitted"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {patient.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wards" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Ward Management</h2>
              <p className="text-muted-foreground">Monitor bed assignments and patient status</p>
            </div>
            <Button>
              <Bed className="mr-2 h-4 w-4" />
              Manage Beds
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
                <Bed className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">Across all wards</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupied Beds</CardTitle>
                <BedDouble className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94</div>
                <p className="text-xs text-muted-foreground">78.3% occupancy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
                <Bed className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">26</div>
                <p className="text-xs text-muted-foreground">Ready for admission</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Patients</CardTitle>
                <Heart className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">8</div>
                <p className="text-xs text-muted-foreground">Require monitoring</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockWards.map((ward) => (
              <Card key={ward.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{ward.name}</CardTitle>
                      <CardDescription>{ward.type} Ward</CardDescription>
                    </div>
                    <Badge variant="outline">{ward.occupancyRate}% occupied</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Bed Occupancy</span>
                    <span>
                      {ward.occupiedBeds}/{ward.totalBeds}
                    </span>
                  </div>
                  <Progress value={ward.occupancyRate} className="h-2" />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{ward.totalBeds}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{ward.occupiedBeds}</div>
                      <div className="text-xs text-muted-foreground">Occupied</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{ward.availableBeds}</div>
                      <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Recent Patients</h4>
                    {ward.patients.map((patient, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Bed {patient.bed} • {patient.admitted}
                          </div>
                        </div>
                        <Badge
                          variant={
                            patient.condition === "Critical"
                              ? "destructive"
                              : patient.condition === "Stable"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {patient.condition}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Financial Overview</h2>
              <p className="text-muted-foreground">Revenue, billing, and payment information</p>
            </div>
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockFinancialData.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+8.2%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockFinancialData.monthlyRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Current month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  ${mockFinancialData.pendingPayments.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">{mockFinancialData.pendingInvoices} invoices</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87.2%</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+2.1%</span> improvement
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by service type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                      <span>Consultations</span>
                    </div>
                    <span className="font-medium">$125,000</span>
                  </div>
                  <Progress value={65} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BedDouble className="h-4 w-4 text-green-600" />
                      <span>Ward Services</span>
                    </div>
                    <span className="font-medium">$85,000</span>
                  </div>
                  <Progress value={45} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-purple-600" />
                      <span>Laboratory</span>
                    </div>
                    <span className="font-medium">$35,000</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest payment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFinancialData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{transaction.patient}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.type} • {transaction.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${transaction.amount}</div>
                        <Badge variant={transaction.status === "Completed" ? "default" : "secondary"}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Revenue distribution by payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">45%</div>
                  <div className="text-sm text-muted-foreground">Credit Card</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">30%</div>
                  <div className="text-sm text-muted-foreground">Cash</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">20%</div>
                  <div className="text-sm text-muted-foreground">Insurance</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold">5%</div>
                  <div className="text-sm text-muted-foreground">Other</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
