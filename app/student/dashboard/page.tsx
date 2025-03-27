"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ComparisonTool from "@/components/comparison-tool"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, BarChart } from "lucide-react"

export default function StudentDashboardPage() {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Redirect if not authenticated or not a student
    if (!loading) {
      if (!user) {
        router.push("/")
        return
      }

      if (userRole !== "student") {
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
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submit-answer">Submit Answer</TabsTrigger>
            <TabsTrigger value="my-performance">My Performance</TabsTrigger>
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
                    Submit Answer
                  </CardTitle>
                  <CardDescription>Upload your answer scripts for assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Submit your answer scripts and get immediate feedback.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab("submit-answer")}>
                    Submit Now
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    My Performance
                  </CardTitle>
                  <CardDescription>View your performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Track your progress and identify areas for improvement.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setActiveTab("my-performance")}>
                    View Performance
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="submit-answer" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit Answer Script</CardTitle>
                <CardDescription>Upload your answer script for assessment and get immediate feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <ComparisonTool />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-performance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Performance</CardTitle>
                <CardDescription>View your performance metrics and submission history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-muted-foreground">
                    No submissions yet. Submit your first answer to see performance metrics.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

