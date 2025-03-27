"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileUp, Clock, FileText } from "lucide-react"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"

export default function AssignmentSubmissionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Mock assignment data - in a real app, this would come from your database
  const assignment = {
    id: params.id,
    title: "Wave Mechanics and Quantum Physics",
    description: "Answer the questions about wave-particle duality and quantum mechanics principles.",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    class: "Physics 101",
    teacher: "Dr. Richard Feynman",
    questionPaperUrl: "/assignments/physics-quantum.pdf",
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      toast.success("File selected", {
        description: `${e.target.files[0].name} (${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB)`,
      })
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload with progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          toast.success("Assignment submitted successfully")
          router.push("/student/dashboard")
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <>
      <Navbar />
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{assignment.title}</h1>
            <p className="text-muted-foreground mt-1">
              {assignment.class} • {assignment.teacher}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Due {assignment.dueDate.toLocaleDateString()} at {assignment.dueDate.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
              <CardDescription>Read the instructions carefully before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{assignment.description}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Question Paper</h3>
                <Button variant="outline" className="gap-2" asChild>
                  <a href={assignment.questionPaperUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4" />
                    Download Question Paper
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit Your Answer</CardTitle>
              <CardDescription>Upload your completed assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
                  file ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <FileUp className="mb-2 h-8 w-8 text-muted-foreground" />
                  {file ? (
                    <div className="text-center">
                      <p className="font-medium text-primary">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · Click or drag to replace
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="font-medium">Drag & drop file here or click to browse</p>
                      <p className="text-sm text-muted-foreground">Supports PDF, JPG, DOC, and DOCX</p>
                    </div>
                  )}
                </label>
              </div>

              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              ) : (
                <Button className="w-full" onClick={handleSubmit} disabled={!file}>
                  Submit Assignment
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}

