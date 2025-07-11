"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Bed, DollarSign, Activity } from "lucide-react"

interface StatsData {
  total_patients: {
    value: number
    change: number
    change_label: string
  }
  bed_occupancy: {
    value: number
    total_beds: number
    occupied_beds: number
    change: number
    change_label: string
  }
  daily_revenue: {
    value: number
    change: number
    change_label: string
  }
  active_cases: {
    value: number
    change: number
    change_label: string
  }
}

interface DashboardStatsProps {
  data: StatsData
}

export function DashboardStats({ data }: DashboardStatsProps) {
  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Loading data...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: "Total Patients",
      value: data.total_patients.value.toLocaleString(),
      change: data.total_patients.change,
      changeLabel: data.total_patients.change_label,
      icon: Users,
    },
    {
      title: "Bed Occupancy",
      value: `${data.bed_occupancy.value}%`,
      change: data.bed_occupancy.change,
      changeLabel: `${data.bed_occupancy.occupied_beds}/${data.bed_occupancy.total_beds} beds`,
      icon: Bed,
    },
    {
      title: "Daily Revenue",
      value: `$${data.daily_revenue.value.toLocaleString()}`,
      change: data.daily_revenue.change,
      changeLabel: data.daily_revenue.change_label,
      icon: DollarSign,
    },
    {
      title: "Active Cases",
      value: data.active_cases.value.toString(),
      change: data.active_cases.change,
      changeLabel: data.active_cases.change_label,
      icon: Activity,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.change > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : stat.change < 0 ? (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              ) : null}
              <span className={stat.change > 0 ? "text-green-500" : stat.change < 0 ? "text-red-500" : ""}>
                {stat.changeLabel}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
