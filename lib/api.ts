// Enhanced API configuration with error handling and retry logic
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
const API_TIMEOUT = 10000 // 10 seconds

// Enhanced error handling
class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

// Safe localStorage access for SSR
const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, value)
  } catch {
    // Ignore localStorage errors
  }
}

const removeLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore localStorage errors
  }
}

// Retry utility
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0 && error instanceof APIError && (error.status ?? 0) >= 500) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return withRetry(fn, retries - 1, delay * 2)
    }
    throw error
  }
}

// Enhanced fetch wrapper with timeout and error handling
async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
      )
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === "AbortError") {
      throw new APIError("Request timeout", 408, "TIMEOUT")
    }

    if (error instanceof APIError) {
      throw error
    }

    throw new APIError("Network error occurred", 0, "NETWORK_ERROR")
  }
}

// Mock data for development/demo
const mockData = {
  dashboardStats: {
    total_patients: {
      value: 1247,
      change: 12,
      change_label: "+23 from last 30 days",
    },
    bed_occupancy: {
      value: 78.5,
      total_beds: 120,
      occupied_beds: 94,
      change: 5,
      change_label: "Current occupancy rate",
    },
    daily_revenue: {
      value: 45680,
      change: 8.2,
      change_label: "+8.2% from yesterday",
    },
    active_cases: {
      value: 67,
      change: -3,
      change_label: "3 fewer than yesterday",
    },
  },

  patientQueue: [
    {
      id: "P001",
      name: "Alice Johnson",
      age: 34,
      gender: "Female",
      waitTime: "25 min",
      priority: "urgent",
      department: "Emergency",
    },
    {
      id: "P002",
      name: "Bob Smith",
      age: 67,
      gender: "Male",
      waitTime: "15 min",
      priority: "normal",
      department: "Cardiology",
    },
    {
      id: "P003",
      name: "Carol Davis",
      age: 28,
      gender: "Female",
      waitTime: "45 min",
      priority: "emergency",
      department: "Emergency",
    },
    {
      id: "P004",
      name: "David Wilson",
      age: 52,
      gender: "Male",
      waitTime: "8 min",
      priority: "normal",
      department: "Orthopedics",
    },
  ],

  bedOccupancy: {
    overall: [
      { name: "Occupied", value: 94, color: "#ef4444" },
      { name: "Available", value: 26, color: "#22c55e" },
    ],
    wards: [
      { name: "General Ward A", total: 30, occupied: 24 },
      { name: "ICU", total: 15, occupied: 12 },
      { name: "Private Rooms", total: 25, occupied: 18 },
      { name: "Pediatric Ward", total: 20, occupied: 15 },
      { name: "Emergency", total: 30, occupied: 25 },
    ],
  },

  revenueChart: [
    { day: "Mon", revenue: 42500 },
    { day: "Tue", revenue: 38200 },
    { day: "Wed", revenue: 45800 },
    { day: "Thu", revenue: 41200 },
    { day: "Fri", revenue: 48900 },
    { day: "Sat", revenue: 35600 },
    { day: "Sun", revenue: 39400 },
  ],

  recentActivity: [
    {
      id: "1",
      user: {
        name: "Dr. Sarah Johnson",
        avatar: null,
        role: "Doctor",
      },
      action: "completed consultation with",
      target: "Alice Brown",
      time: "5 minutes ago",
    },
    {
      id: "2",
      user: {
        name: "Nurse Emily Wilson",
        avatar: null,
        role: "Nurse",
      },
      action: "recorded vital signs for",
      target: "Bob Davis",
      time: "12 minutes ago",
    },
    {
      id: "3",
      user: {
        name: "Dr. Michael Chen",
        avatar: null,
        role: "Doctor",
      },
      action: "admitted",
      target: "Carol Miller",
      time: "18 minutes ago",
    },
    {
      id: "4",
      user: {
        name: "Maria Garcia",
        avatar: null,
        role: "Nurse",
      },
      action: "discharged",
      target: "David Wilson",
      time: "25 minutes ago",
    },
  ],

  notifications: [
    {
      id: 1,
      title: "New patient admitted",
      message: "Patient Alice Johnson has been admitted to Emergency Ward",
      type: "info",
      is_read: false,
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      title: "Lab results ready",
      message: "Blood test results for Bob Smith are now available",
      type: "success",
      is_read: false,
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      title: "Appointment reminder",
      message: "Dr. Johnson has an appointment in 30 minutes",
      type: "warning",
      is_read: true,
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
  ],
}

// Environment check for mock data usage
const USE_MOCK_DATA = process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_API_URL

// Create a mock API response with realistic delay
const createMockResponse = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve({ data })
      },
      Math.random() * 500 + 200, // Random delay between 200-700ms
    )
  })
}

// Enhanced Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    if (USE_MOCK_DATA) {
      // Enhanced mock login validation
      if (!email || !password) {
        throw new APIError("Email and password are required", 400, "VALIDATION_ERROR")
      }

      const mockUser = {
        id: 1,
        email: email,
        first_name: "Demo",
        last_name: "User",
        user_type: "admin",
        permissions: ["read", "write", "admin"],
        last_login: new Date().toISOString(),
      }

      // Store mock tokens with expiration
      const accessToken = `mock-access-token-${Date.now()}`
      const refreshToken = `mock-refresh-token-${Date.now()}`

      setLocalStorage("accessToken", accessToken)
      setLocalStorage("refreshToken", refreshToken)
      setLocalStorage("user", JSON.stringify(mockUser))
      setLocalStorage("tokenExpiry", (Date.now() + 24 * 60 * 60 * 1000).toString())

      return {
        access: accessToken,
        refresh: refreshToken,
        user: mockUser,
      }
    }

    return withRetry(() =>
      apiRequest("/auth/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    )
  },

  logout: async () => {
    if (USE_MOCK_DATA) {
      removeLocalStorage("accessToken")
      removeLocalStorage("refreshToken")
      removeLocalStorage("user")
      removeLocalStorage("tokenExpiry")
      return
    }

    const token = getLocalStorage("accessToken")
    if (token) {
      try {
        await apiRequest("/auth/logout/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } finally {
        removeLocalStorage("accessToken")
        removeLocalStorage("refreshToken")
        removeLocalStorage("user")
        removeLocalStorage("tokenExpiry")
      }
    }
  },

  getCurrentUser: async () => {
    if (USE_MOCK_DATA) {
      const user = getLocalStorage("user")
      const tokenExpiry = getLocalStorage("tokenExpiry")

      if (!user || !tokenExpiry || Date.now() > Number.parseInt(tokenExpiry)) {
        throw new APIError("Session expired", 401, "TOKEN_EXPIRED")
      }

      return { data: JSON.parse(user) }
    }

    const token = getLocalStorage("accessToken")
    if (!token) {
      throw new APIError("No authentication token", 401, "NO_TOKEN")
    }

    return withRetry(() =>
      apiRequest("/auth/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    )
  },

  refreshToken: async () => {
    if (USE_MOCK_DATA) {
      const refreshToken = getLocalStorage("refreshToken")
      if (!refreshToken) {
        throw new APIError("No refresh token", 401, "NO_REFRESH_TOKEN")
      }

      const newAccessToken = `mock-access-token-${Date.now()}`
      setLocalStorage("accessToken", newAccessToken)
      setLocalStorage("tokenExpiry", (Date.now() + 24 * 60 * 60 * 1000).toString())

      return { access: newAccessToken }
    }

    const refreshToken = getLocalStorage("refreshToken")
    if (!refreshToken) {
      throw new APIError("No refresh token", 401, "NO_REFRESH_TOKEN")
    }

    return apiRequest("/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    })
  },
}

// Enhanced Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    if (USE_MOCK_DATA) {
      return createMockResponse(mockData.dashboardStats)
    }
    return withRetry(() => apiRequest("/dashboard/stats/"))
  },

  getPatientQueue: async () => {
    if (USE_MOCK_DATA) {
      return createMockResponse(mockData.patientQueue)
    }
    return withRetry(() => apiRequest("/dashboard/patient-queue/"))
  },

  getBedOccupancy: async () => {
    if (USE_MOCK_DATA) {
      return createMockResponse(mockData.bedOccupancy)
    }
    return withRetry(() => apiRequest("/dashboard/bed-occupancy/"))
  },

  getRevenueChart: async () => {
    if (USE_MOCK_DATA) {
      return createMockResponse(mockData.revenueChart)
    }
    return withRetry(() => apiRequest("/dashboard/revenue-chart/"))
  },

  getRecentActivity: async () => {
    if (USE_MOCK_DATA) {
      return createMockResponse(mockData.recentActivity)
    }
    return withRetry(() => apiRequest("/dashboard/recent-activity/"))
  },
}

// Enhanced Notifications API
export const notificationsAPI = {
  getNotifications: async (read?: boolean) => {
    if (USE_MOCK_DATA) {
      let notifications = mockData.notifications
      if (read !== undefined) {
        notifications = notifications.filter((n) => n.is_read === read)
      }
      return createMockResponse(notifications)
    }

    const params = read !== undefined ? `?read=${read}` : ""
    return withRetry(() => apiRequest(`/notifications/${params}`))
  },

  markAsRead: async (notificationIds: number[]) => {
    if (USE_MOCK_DATA) {
      mockData.notifications.forEach((notification) => {
        if (notificationIds.includes(notification.id)) {
          notification.is_read = true
        }
      })
      return createMockResponse({ marked_read: notificationIds.length })
    }

    return withRetry(() =>
      apiRequest("/notifications/mark-read/", {
        method: "POST",
        body: JSON.stringify({ notification_ids: notificationIds }),
      }),
    )
  },

  getSettings: async () => {
    if (USE_MOCK_DATA) {
      return createMockResponse({
        email_notifications: true,
        sms_notifications: false,
        in_app_notifications: true,
        sound_alerts: true,
        desktop_notifications: false,
      })
    }
    return withRetry(() => apiRequest("/notifications/settings/"))
  },

  updateSettings: async (settings: any) => {
    if (USE_MOCK_DATA) {
      return createMockResponse(settings)
    }
    return withRetry(() =>
      apiRequest("/notifications/settings/", {
        method: "PUT",
        body: JSON.stringify(settings),
      }),
    )
  },
}

// Health check API
export const healthAPI = {
  check: async () => {
    if (USE_MOCK_DATA) {
      return createMockResponse({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      })
    }
    return apiRequest("/health/")
  },
}

// Export configuration and utilities
export { APIError, USE_MOCK_DATA, API_BASE_URL }

export default {
  USE_MOCK_DATA,
  API_BASE_URL,
  APIError,
}
