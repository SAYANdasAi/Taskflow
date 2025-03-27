"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/lib/firebase/auth-context"
import type { UserRole } from "@/lib/firebase/auth-context"

export default function CompleteProfilePage() {
  const router = useRouter()
  const { user, userRole, loading, updateUserRole } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [role, setRole] = useState<UserRole>(() => {
    // Try to get the role from localStorage if available
    if (typeof window !== "undefined") {
      return (localStorage.getItem("userRole") as UserRole) || "student"
    }
    return "student"
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    try {
      setIsSubmitting(true)

      // Update user role in Firestore
      await updateUserRole(role)

      toast.success("Profile updated", {
        description: `You are now registered as a ${role}`,
      })

      // Clear localStorage
      localStorage.removeItem("userRole")

      // Redirect based on role
      router.push(role === "teacher" ? "/teacher/dashboard" : "/student/dashboard")
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>Please confirm your role to complete your registration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role">I am a:</Label>
              <RadioGroup
                id="role"
                value={role || "student"}
                onValueChange={(value) => setRole(value as UserRole)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher">Teacher</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

