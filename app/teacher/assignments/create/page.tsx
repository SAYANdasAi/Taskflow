"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, Calendar } from "lucide-react"
import { toast } from "sonner"

export default function CreateAssignmentPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [questionPaper, setQuestionPaper] = useState<File | null>(null)
  const [answerKey, setAnswerKey] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock classes data - in a real app, this would come from your database
  const classes = [
    { id: "1", name: "Physics 101" },
    { id: "2", name: "Chemistry 202" },
    { id: "3", name: "Mathematics Advanced" },
  ]

  const handleQuestionPaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQuestionPaper(e.target.files[0])
      toast.success("Question paper uploaded", {
        description: e.target.files[0].name,
      })
    }
  }

  const handleAnswerKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAnswerKey(e.target.files[0])
      toast.success("Answer key uploaded", {
        description: e.target.files[0].name,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !selectedClass || !dueDate || !questionPaper) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast.success("Assignment created successfully")
      setIsSubmitting(false)
      router.push("/teacher/dashboard")
    }, 2000)
  }

  return (
    <>
      <Navbar />
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Assignment</h1>
            <p className="text-muted-foreground mt-1">Create a new assignment for your students</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
                <CardDescription>Basic information about the assignment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Quantum Mechanics Quiz"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed instructions for the assignment"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assignment Materials</CardTitle>
                <CardDescription>Upload question paper and answer key</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Question Paper (Required)</Label>
                  <div
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                      questionPaper ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                    }`}
                  >
                    <input
                      type="file"
                      id="question-paper"
                      className="hidden"
                      onChange={handleQuestionPaperChange}
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="question-paper"
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                    >
                      <FileUp className="mb-2 h-8 w-8 text-muted-foreground" />
                      {questionPaper ? (
                        <div className="text-center">
                          <p className="font-medium text-primary">{questionPaper.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(questionPaper.size / 1024 / 1024).toFixed(2)} MB · Click or drag to replace
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="font-medium">Upload Question Paper</p>
                          <p className="text-sm text-muted-foreground">PDF, DOC, or DOCX</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Answer Key (Optional)</Label>
                  <div
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                      answerKey ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                    }`}
                  >
                    <input
                      type="file"
                      id="answer-key"
                      className="hidden"
                      onChange={handleAnswerKeyChange}
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="answer-key"
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                    >
                      <FileUp className="mb-2 h-8 w-8 text-muted-foreground" />
                      {answerKey ? (
                        <div className="text-center">
                          <p className="font-medium text-primary">{answerKey.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(answerKey.size / 1024 / 1024).toFixed(2)} MB · Click or drag to replace
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="font-medium">Upload Answer Key</p>
                          <p className="text-sm text-muted-foreground">PDF, DOC, or DOCX</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Assignment..." : "Create Assignment"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
      <Footer />
    </>
  )
}

