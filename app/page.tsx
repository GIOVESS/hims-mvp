"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is already logged in
        const token = localStorage.getItem("accessToken")
        const tokenExpiry = localStorage.getItem("tokenExpiry")

        if (token && tokenExpiry && Date.now() < Number.parseInt(tokenExpiry)) {
          // User is authenticated, redirect to dashboard
          router.replace("/dashboard")
        } else {
          // User is not authenticated, redirect to login
          router.replace("/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // On error, redirect to login
        router.replace("/login")
      }
    }

    checkAuth()
  }, [router])

  // Show loading while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading Hospital Management System</h2>
          <p className="text-sm text-gray-600 text-center">Please wait while we prepare your dashboard...</p>
        </CardContent>
      </Card>
    </div>
  )
}
