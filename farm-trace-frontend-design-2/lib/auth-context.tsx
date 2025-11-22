"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "farmer" | "distributor" | "retailer" | "consumer"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, role: UserRole) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("farmtrace_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, role: UserRole) => {
    // Mock login - in a real app this would validate against the backend
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0] || "User",
      email,
      role,
    }
    setUser(newUser)
    localStorage.setItem("farmtrace_user", JSON.stringify(newUser))

    // Redirect based on role
    switch (role) {
      case "farmer":
        router.push("/farmer/dashboard")
        break
      case "distributor":
        router.push("/distributor/dashboard")
        break
      case "retailer":
        router.push("/retailer/dashboard")
        break
      case "consumer":
        router.push("/consumer/products")
        break
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("farmtrace_user")
    router.push("/")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("farmtrace_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
