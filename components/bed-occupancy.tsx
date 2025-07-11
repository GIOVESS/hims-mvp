"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bed } from "lucide-react"

interface BedOccupancyData {
  overall: Array<{
    name: string
    value: number
    color: string
  }>
  wards: Array<{
    name: string
    total: number
    occupied: number
  }>
}

interface BedOccupancyProps {
  data: BedOccupancyData
}

export function BedOccupancy({ data }: BedOccupancyProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bed Occupancy</CardTitle>
          <CardDescription>Current bed utilization across wards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Bed className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Loading bed occupancy data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalBeds = data.wards.reduce((sum, ward) => sum + ward.total, 0)
  const occupiedBeds = data.wards.reduce((sum, ward) => sum + ward.occupied, 0)
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bed Occupancy</CardTitle>
        <CardDescription>Current bed utilization across wards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{occupancyRate}%</div>
          <p className="text-sm text-muted-foreground">
            {occupiedBeds} of {totalBeds} beds occupied
          </p>
        </div>

        <div className="space-y-4">
          {data.wards.map((ward, index) => {
            const wardOccupancy = Math.round((ward.occupied / ward.total) * 100)
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{ward.name}</span>
                  <span className="text-muted-foreground">
                    {ward.occupied}/{ward.total}
                  </span>
                </div>
                <Progress value={wardOccupancy} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
