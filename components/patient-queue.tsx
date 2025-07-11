"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  waitTime: string
  priority: "emergency" | "urgent" | "normal"
  department: string
}

interface PatientQueueProps {
  data: Patient[]
}

const priorityColors = {
  emergency: "bg-red-500 hover:bg-red-600",
  urgent: "bg-orange-500 hover:bg-orange-600",
  normal: "bg-green-500 hover:bg-green-600",
}

export function PatientQueue({ data }: PatientQueueProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Queue</CardTitle>
          <CardDescription>Current patients waiting for treatment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No patients in queue</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Queue</CardTitle>
        <CardDescription>Current patients waiting for treatment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((patient) => (
            <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-gray-500">
                    {patient.age} years, {patient.gender} • {patient.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {patient.waitTime}
                </div>
                <Badge className={priorityColors[patient.priority]}>{patient.priority}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
