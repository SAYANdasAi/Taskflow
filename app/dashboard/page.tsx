"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"
import Navbar from "@/components/navbar"

export default function DashboardPage() {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/")
        return
      }

      // Redirect based on user role
      if (userRole === "teacher") {
        router.push("/teacher/dashboard")
      } else if (userRole === "student") {
        router.push("/student/dashboard")
      }
    }
  }, [loading, user, userRole, router])

  return (
    <div>
      <Navbar />
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Redirecting to your dashboard...</h1>
          <p className="mt-2">Please wait while we prepare your dashboard.</p>
        </div>
      </div>
    </div>
  )
}

