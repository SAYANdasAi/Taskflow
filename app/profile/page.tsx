"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import { toast } from "sonner"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserRole } from "@/lib/firebase/auth-context"

export default function ProfilePage() {
  const { user, userRole, loading, updateUserRole, error, clearError } = useAuth()
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [role, setRole] = useState<UserRole>("student")
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Clear any auth errors when component mounts
    clearError()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/")
      return
    }

    // Load user data
    const loadUserData = async () => {
      if (user && db) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setDisplayName(userData.displayName || "")
            setRole((userData.role as UserRole) || "student")
            setEmail(userData.email || "")
          }
          setPageLoading(false)
        } catch (error) {
          console.error("Error loading user data:", error)
          toast.error("Failed to load profile data")
          setPageLoading(false)
        }
      } else if (!loading && user) {
        setDisplayName(user.displayName || "")
        setEmail(user.email || "")
        setRole(userRole || "student")
        setPageLoading(false)
      }
    }

    if (!loading && user) {
      loadUserData()
    }
  }, [user, loading, router, userRole, clearError])

  // Show error toast when auth error occurs
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !db) {
      toast.error("Cannot update profile: User not authenticated")
      return
    }

    try {
      setSaving(true)

      // Update user data in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        displayName,
        updatedAt: new Date().toISOString(),
      })

      // Update role if changed
      if (role !== userRole) {
        await updateUserRole(role)
      }

      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading || pageLoading) {
    return (
      <div>
        <Navbar />
        <div className="container max-w-4xl py-10">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-28" />
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your profile information and preferences</CardDescription>
            </div>
            <Avatar className="h-24 w-24 mt-4 sm:mt-0">
              <AvatarImage src={user?.photoURL || ""} alt={displayName} />
              <AvatarFallback className="text-2xl">
                {displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled={true} className="bg-muted" />
                <p className="text-sm text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <RadioGroup
                  value={role || "student"}
                  onValueChange={(value) => setRole(value as UserRole)}
                  className="flex space-x-4"
                  disabled={saving}
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
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

