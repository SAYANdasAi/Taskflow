"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Award, PlusCircle } from "lucide-react"
import Link from "next/link"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { AIAnalysisVisualization } from "@/components/ai-analysis-visualization"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()

  // Mock class data - in a real app, this would come from your database
  const classData = {
    id: params.id,
    name: "Physics 101",
    description: "Introduction to Classical and Modern Physics",
    studentCount: 24,
    assignmentCount: 8,
    averageScore: 78,
  }

  // Mock chart data
  const assignmentScoresData = {
    labels: ["Assignment 1", "Assignment 2", "Assignment 3", "Assignment 4", "Assignment 5"],
    datasets: [
      {
        label: "Average Score (%)",
        data: [65, 78, 82, 75, 90],
        backgroundColor: "rgba(37, 99, 235, 0.6)",
      },
    ],
  }

  const gradeDistributionData = {
    labels: ["A", "B", "C", "D", "F"],
    datasets: [
      {
        data: [8, 10, 4, 2, 0],
        backgroundColor: [
          "rgba(34, 197, 94, 0.6)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(250, 204, 21, 0.6)",
          "rgba(249, 115, 22, 0.6)",
          "rgba(239, 68, 68, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Mock students data
  const students = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", assignments: 8, averageScore: 92 },
    { id: "2", name: "Bob Smith", email: "bob@example.com", assignments: 7, averageScore: 85 },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", assignments: 8, averageScore: 78 },
    { id: "4", name: "Diana Prince", email: "diana@example.com", assignments: 6, averageScore: 88 },
    { id: "5", name: "Edward Cullen", email: "edward@example.com", assignments: 8, averageScore: 75 },
  ]

  // Mock assignments data
  const assignments = [
    { id: "1", title: "Mechanics Basics", dueDate: "2023-01-15", submissions: 24, averageScore: 82 },
    { id: "2", title: "Wave Properties", dueDate: "2023-02-01", submissions: 23, averageScore: 78 },
    { id: "3", title: "Thermodynamics", dueDate: "2023-02-15", submissions: 22, averageScore: 75 },
    { id: "4", title: "Electromagnetism", dueDate: "2023-03-01", submissions: 24, averageScore: 80 },
    { id: "5", title: "Quantum Mechanics", dueDate: "2023-03-15", submissions: 20, averageScore: 72 },
  ]

  return (
    <>
      <Navbar />
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{classData.name}</h1>
            <p className="text-muted-foreground mt-1">{classData.description}</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button asChild>
              <Link href={`/teacher/assignments/create?class=${classData.id}`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Assignment
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/teacher/classes">Back to Classes</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classData.studentCount}</div>
              <p className="text-xs text-muted-foreground">Enrolled in this class</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classData.assignmentCount}</div>
              <p className="text-xs text-muted-foreground">Created for this class</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classData.averageScore}%</div>
              <p className="text-xs text-muted-foreground">Across all assignments</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Scores</CardTitle>
                  <CardDescription>Average scores for the last 5 assignments</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <Bar
                    data={assignmentScoresData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Overall grade distribution for the class</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <Pie
                    data={gradeDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Class Summary</CardTitle>
                <CardDescription>Overall performance and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Submission Rate</h3>
                      <p className="text-2xl font-bold">92%</p>
                      <p className="text-xs text-muted-foreground">Students submitting assignments on time</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Passing Rate</h3>
                      <p className="text-2xl font-bold">88%</p>
                      <p className="text-xs text-muted-foreground">Students with a grade of C or better</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Performance Trend</h3>
                    <p className="text-muted-foreground">
                      The class is showing steady improvement over time, with average scores increasing by 5% since the
                      beginning of the semester. The most challenging topic appears to be Quantum Mechanics, with the
                      lowest average score.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>Students currently enrolled in this class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Assignments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Average Score
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{student.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              {student.assignments} / {classData.assignmentCount}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">{student.averageScore}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/teacher/students/${student.id}`}>View</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Class Assignments</CardTitle>
                <CardDescription>All assignments for this class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Submissions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Average Score
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {assignments.map((assignment) => (
                        <tr key={assignment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{assignment.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted-foreground">{assignment.dueDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              {assignment.submissions} / {classData.studentCount}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">{assignment.averageScore}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/teacher/assignments/${assignment.id}`}>View</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ai-analysis">
            <AIAnalysisVisualization />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  )
}

