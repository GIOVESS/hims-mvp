"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { authAPI } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const tokenExpiry = localStorage.getItem("tokenExpiry")
        // Debug: log localStorage values on dashboard load
        console.log("[Dashboard] accessToken:", token)
        console.log("[Dashboard] tokenExpiry:", tokenExpiry)
        if (!token || !tokenExpiry || Date.now() >= Number.parseInt(tokenExpiry)) {
          router.replace("/login")
          return
        }
        // Verify token is still valid
        const user = await authAPI.getCurrentUser()
        // Debug: log user info from getCurrentUser
        console.log("[Dashboard] getCurrentUser result:", user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Authentication check failed:", error)
        // Debug: log localStorage values on error
        console.log("[Dashboard][Error] accessToken:", localStorage.getItem("accessToken"))
        console.log("[Dashboard][Error] tokenExpiry:", localStorage.getItem("tokenExpiry"))
        router.replace("/login")
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Verifying Access</h2>
            <p className="text-sm text-gray-600 text-center">Please wait while we verify your credentials...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
