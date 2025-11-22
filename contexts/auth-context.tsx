"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, Role } from "@/lib/types"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  login: (role: Role) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("farmtrace_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (role: Role) => {
    // Mock login with different personas based on role
    const mockUser: User = {
      id: Math.floor(Math.random() * 1000),
      name:
        role === "farmer"
          ? "Rajesh Kumar"
          : role === "distributor"
            ? "Fast Logistics"
            : role === "retailer"
              ? "Fresh Mart"
              : "Priya Singh",
      email: `${role}@example.com`,
      role: role,
      location: role === "farmer" ? "Nasik, Maharashtra" : "Mumbai",
    }

    localStorage.setItem("farmtrace_user", JSON.stringify(mockUser))
    setUser(mockUser)

    // Redirect to appropriate dashboard
    if (role === "consumer") {
      router.push("/consumer/gallery")
    } else {
      router.push(`/${role}/dashboard`)
    }
  }

  const logout = () => {
    localStorage.removeItem("farmtrace_user")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
