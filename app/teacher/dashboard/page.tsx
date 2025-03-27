"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ComparisonTool from "@/components/comparison-tool"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, Users } from "lucide-react"

export default function TeacherDashboardPage() {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Redirect if not authenticated or not a teacher
    if (!loading) {
      if (!user) {
        router.push("/")
        return
      }

      if (userRole !== "teacher") {
        router.push("/dashboard")
        return
      }
    }
  }, [loading, user, userRole, router])

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container py-10">
          <h1 className="text-2xl font-bold mb-6">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="comparison-tool">Comparison Tool</TabsTrigger>
            <TabsTrigger value="student-submissions">Student Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Update your profile information and preferences.</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => router.push("/profile")}>View Profile</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileUp className="h-5 w-5" />
                    Answer Scripts
                  </CardTitle>
                  <CardDescription>Manage and review answer scripts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Upload reference answers and review student submissions.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab("comparison-tool")}>
                    Manage Scripts
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Performance
                  </CardTitle>
                  <CardDescription>View student performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Track student progress and identify areas for improvement.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab("student-submissions")}>
                    View Performance
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison-tool" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Answer Script Comparison Tool</CardTitle>
                <CardDescription>Upload reference answers and question papers for student assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ComparisonTool />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="student-submissions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Submissions</CardTitle>
                <CardDescription>View and manage student submissions and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-muted-foreground">No student submissions yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

