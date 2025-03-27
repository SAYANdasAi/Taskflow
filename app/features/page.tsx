"use client"

import { useSession } from "next-auth/react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileUp,
  FileText,
  BarChart2,
  Shield,
  RefreshCw,
  FileSearch,
  PieChart,
  Layers,
  Users,
  BookOpen,
  Award,
  Clock,
} from "lucide-react"

import styles from "@/styles/features.module.css"

export default function FeaturesPage() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || "student"

  const studentFeatures = [
    {
      icon: FileUp,
      title: "Submit Assignments",
      description: "Upload your answer scripts in multiple formats including PDF, JPG, or DOCS.",
    },
    {
      icon: BarChart2,
      title: "View Results",
      description: "Get detailed feedback and scores on your submitted assignments.",
    },
    {
      icon: Clock,
      title: "Track Deadlines",
      description: "Stay on top of upcoming assignment deadlines with notifications.",
    },
    {
      icon: FileSearch,
      title: "Review Feedback",
      description: "See detailed comments and suggestions from your teachers.",
    },
    {
      icon: Shield,
      title: "Secure Submissions",
      description: "All uploads are secure and only accessible to you and your teachers.",
    },
    {
      icon: RefreshCw,
      title: "Revision History",
      description: "Track your progress over time with historical submission data.",
    },
  ]

  const teacherFeatures = [
    {
      icon: FileText,
      title: "Create Assignments",
      description: "Create and distribute assignments with detailed instructions and reference answers.",
    },
    {
      icon: Users,
      title: "Manage Classes",
      description: "Organize students into classes for easier assignment distribution and grading.",
    },
    {
      icon: PieChart,
      title: "Performance Analytics",
      description: "View comprehensive analytics on student performance across assignments.",
    },
    {
      icon: BookOpen,
      title: "Question Bank",
      description: "Build and maintain a repository of questions and answer keys.",
    },
    {
      icon: Award,
      title: "Automated Grading",
      description: "Use AI-powered tools to assist with grading and provide consistent feedback.",
    },
    {
      icon: Layers,
      title: "Batch Processing",
      description: "Grade multiple submissions efficiently with batch processing tools.",
    },
  ]

  return (
    <div className={styles.featuresPage}>
      <Navbar />
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h1>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Discover all the powerful tools Taskflow offers to streamline your answer script comparison process
              </p>
            </div>

            <Tabs defaultValue={userRole === "teacher" ? "teacher" : "student"} className="w-full max-w-4xl mt-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student Features</TabsTrigger>
                <TabsTrigger value="teacher" disabled={userRole !== "teacher"}>
                  Teacher Features {userRole !== "teacher" && "(Restricted)"}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="student" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studentFeatures.map((feature, index) => (
                    <Card key={index} className={`h-full ${styles.featureCard}`}>
                      <CardHeader>
                        <feature.icon className="h-6 w-6 text-primary mb-2" />
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="teacher" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teacherFeatures.map((feature, index) => (
                    <Card key={index} className={`h-full ${styles.featureCard}`}>
                      <CardHeader>
                        <feature.icon className="h-6 w-6 text-primary mb-2" />
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

