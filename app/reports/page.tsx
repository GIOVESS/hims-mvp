"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { FileText, Download, TrendingUp, Users, DollarSign, Activity, Calendar, Filter } from "lucide-react"

// Mock data for charts
const monthlyRevenue = [
  { month: "Jan", revenue: 45000, patients: 320 },
  { month: "Feb", revenue: 52000, patients: 380 },
  { month: "Mar", revenue: 48000, patients: 350 },
  { month: "Apr", revenue: 61000, patients: 420 },
  { month: "May", revenue: 55000, patients: 390 },
  { month: "Jun", revenue: 67000, patients: 450 },
]

const departmentStats = [
  { department: "Emergency", patients: 1250, revenue: 125000 },
  { department: "Cardiology", patients: 890, revenue: 178000 },
  { department: "Orthopedics", patients: 650, revenue: 97500 },
  { department: "Pediatrics", patients: 720, revenue: 86400 },
  { department: "General Medicine", patients: 1100, revenue: 88000 },
]

const patientDemographics = [
  { name: "0-18", value: 15, color: "#8884d8" },
  { name: "19-35", value: 25, color: "#82ca9d" },
  { name: "36-50", value: 30, color: "#ffc658" },
  { name: "51-65", value: 20, color: "#ff7300" },
  { name: "65+", value: 10, color: "#8dd1e1" },
]

const reportStats = [
  { title: "Total Reports", value: "156", change: "+12", icon: FileText },
  { title: "This Month", value: "24", change: "+8", icon: Calendar },
  { title: "Revenue Reports", value: "45", change: "+5", icon: DollarSign },
  { title: "Patient Reports", value: "67", change: "+15", icon: Users },
]

const availableReports = [
  {
    id: "RPT001",
    name: "Monthly Financial Summary",
    category: "Financial",
    description: "Comprehensive monthly revenue and expense report",
    lastGenerated: "2024-01-10",
    frequency: "Monthly",
    status: "Available",
  },
  {
    id: "RPT002",
    name: "Patient Demographics Analysis",
    category: "Patient Care",
    description: "Detailed analysis of patient demographics and trends",
    lastGenerated: "2024-01-09",
    frequency: "Weekly",
    status: "Available",
  },
  {
    id: "RPT003",
    name: "Department Performance Report",
    category: "Operations",
    description: "Performance metrics for all hospital departments",
    lastGenerated: "2024-01-08",
    frequency: "Monthly",
    status: "Generating",
  },
  {
    id: "RPT004",
    name: "Insurance Claims Analysis",
    category: "Financial",
    description: "Analysis of insurance claims and approval rates",
    lastGenerated: "2024-01-07",
    frequency: "Monthly",
    status: "Available",
  },
]

export default function ReportsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState("last-30-days")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "default"
      case "Generating":
        return "secondary"
      case "Error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and view hospital performance reports</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Available Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          {/* Date Range Selector */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analytics Overview</CardTitle>
                <div className="flex space-x-2">
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-7-days">Last 7 days</SelectItem>
                      <SelectItem value="last-30-days">Last 30 days</SelectItem>
                      <SelectItem value="last-3-months">Last 3 months</SelectItem>
                      <SelectItem value="last-year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Charts Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue and patient count over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Patient Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Age Demographics</CardTitle>
                <CardDescription>Distribution of patients by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={patientDemographics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {patientDemographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Patient count and revenue by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="patients" fill="#8884d8" />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Revenue Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+18.5%</div>
                <p className="text-sm text-muted-foreground">Compared to last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Patient Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">4.7/5</div>
                <p className="text-sm text-muted-foreground">Average rating this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Bed Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">87.3%</div>
                <p className="text-sm text-muted-foreground">Current occupancy rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Pre-built reports ready for download</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Last Generated</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{report.description}</div>
                      </TableCell>
                      <TableCell>{report.lastGenerated}</TableCell>
                      <TableCell>{report.frequency}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(report.status)}>{report.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            Generate
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

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Report</CardTitle>
              <CardDescription>Build a custom report with specific parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportName">Report Name</Label>
                    <Input id="reportName" placeholder="Enter report name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportCategory">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="patient-care">Patient Care</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFrom">Date From</Label>
                    <Input id="dateFrom" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateTo">Date To</Label>
                    <Input id="dateTo" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Data Sources</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Patient Records</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Financial Data</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Staff Records</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Inventory Data</span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button>Generate Report</Button>
                  <Button variant="outline">Save Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated reports on schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-4" />
                <p>No scheduled reports configured</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  Create Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
