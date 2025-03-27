"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedFileUpload } from "@/components/enhanced-file-upload"
import {
  extractTextFromDocument,
  analyzeAnswer,
  type ProcessedDocument,
  type AnswerAnalysis,
} from "@/lib/services/vertex-ai"
import { createAssignmentEvent } from "@/lib/services/google-calendar"
import { toast } from "sonner"
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Brain,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function AssignmentSubmissionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [extractedText, setExtractedText] = useState<ProcessedDocument | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnswerAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [addedToCalendar, setAddedToCalendar] = useState(false)

  // Mock assignment data - in a real app, this would come from your database
  const assignment = {
    id: params.id,
    title: "Physics: Newton's Laws and Applications",
    description: "Answer the questions about Newton's laws of motion and their applications in everyday scenarios.",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    class: "Physics 101",
    teacher: "Dr. Richard Feynman",
    questionPaperUrl: "/assignments/physics-newton.pdf",
    referenceAnswer: `Newton's three laws of motion are fundamental principles that describe the relationship between an object and the forces acting upon it.

The first law, also known as the law of inertia, states that an object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force. This explains why objects tend to maintain their state of motion.

The second law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. Mathematically, this is expressed as F = ma, where F is the net force, m is the mass, and a is the acceleration.

The third law states that for every action, there is an equal and opposite reaction. This means that when one object exerts a force on a second object, the second object exerts an equal and opposite force on the first.

Conservation of momentum is a direct consequence of Newton's laws. In a closed system, the total momentum remains constant if no external forces act on the system.

Gravitational force is described by Newton's law of universal gravitation, which states that every particle of matter attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between them.

These principles have numerous practical applications, from designing vehicles and structures to understanding planetary motion and space travel.`,
  }

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setActiveTab("upload")
    setExtractedText(null)
    setAnalysisResult(null)
  }

  const handleProcessFile = async () => {
    if (!file) return

    try {
      setIsProcessing(true)

      // Extract text from document using Vertex AI
      const result = await extractTextFromDocument(file)
      setExtractedText(result)
      setActiveTab("extracted")

      toast.success("Document processed successfully", {
        description: `Extracted ${result.pages} pages with ${result.confidence.toFixed(2) * 100}% confidence`,
      })
    } catch (error) {
      toast.error("Error processing document", {
        description: "Please try again with a different file",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAnalyzeAnswer = async () => {
    if (!extractedText) return

    try {
      setIsAnalyzing(true)

      // Analyze answer using Gemini AI
      const result = await analyzeAnswer(extractedText.text, assignment.referenceAnswer)
      setAnalysisResult(result)
      setActiveTab("analysis")

      toast.success("Analysis complete", {
        description: `Your answer scored ${result.score}/${result.maxScore}`,
      })
    } catch (error) {
      toast.error("Error analyzing answer", {
        description: "Please try again later",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAddToCalendar = async () => {
    try {
      await createAssignmentEvent(assignment.title, assignment.description, assignment.dueDate)

      setAddedToCalendar(true)
      toast.success("Added to Google Calendar", {
        description: `Deadline reminder set for ${assignment.dueDate.toLocaleDateString()}`,
      })
    } catch (error) {
      toast.error("Error adding to calendar", {
        description: "Please try again later",
      })
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  const getGrade = (score: number) => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
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
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>
                Due {assignment.dueDate.toLocaleDateString()} at {assignment.dueDate.toLocaleTimeString()}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleAddToCalendar}
              disabled={addedToCalendar}
            >
              <Calendar className="h-4 w-4" />
              {addedToCalendar ? "Added to Calendar" : "Add to Calendar"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Document</TabsTrigger>
            <TabsTrigger value="extracted" disabled={!extractedText}>
              Extracted Text
            </TabsTrigger>
            <TabsTrigger value="analysis" disabled={!analysisResult}>
              Analysis & Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
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
                <CardContent>
                  <EnhancedFileUpload onFileSelect={handleFileSelect} />
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleProcessFile} disabled={!file || isProcessing}>
                    {isProcessing ? "Processing..." : "Process Document with Vertex AI"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="extracted" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Extracted Text</CardTitle>
                <CardDescription>Text extracted from your document using Google Vertex AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">Extracted Content</span>
                    </div>
                    <Badge variant="outline">
                      Confidence: {extractedText ? (extractedText.confidence * 100).toFixed(0) : 0}%
                    </Badge>
                  </div>
                  <div className="max-h-96 overflow-y-auto whitespace-pre-wrap">{extractedText?.text}</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("upload")}>
                  Back to Upload
                </Button>
                <Button onClick={handleAnalyzeAnswer} disabled={!extractedText || isAnalyzing}>
                  {isAnalyzing ? "Analyzing..." : "Analyze with Gemini AI"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {analysisResult && (
              <>
                <Card className="border-primary">
                  <CardHeader className="bg-primary/5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Analysis Results
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-lg font-bold">
                          Grade: {getGrade(analysisResult.score)}
                        </Badge>
                        <span className={`text-2xl font-bold ${getScoreColor(analysisResult.score)}`}>
                          {analysisResult.score}/{analysisResult.maxScore}
                        </span>
                      </div>
                    </div>
                    <CardDescription>
                      AI-powered analysis of your answer compared to the reference solution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="font-medium flex items-center gap-2 mb-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Strengths
                        </h3>
                        <ul className="space-y-2">
                          {analysisResult.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium flex items-center gap-2 mb-3">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          Areas for Improvement
                        </h3>
                        <ul className="space-y-2">
                          {analysisResult.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <ArrowUpRight className="h-4 w-4 text-amber-500 mt-1 shrink-0" />
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-medium flex items-center gap-2 mb-3">
                        <Brain className="h-4 w-4 text-primary" />
                        Concept Coverage
                      </h3>
                      <div className="space-y-4">
                        {analysisResult.matches.map((match, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">{match.text}</span>
                              <span className="text-sm font-medium">
                                {match.score}/{match.maxScore}
                              </span>
                            </div>
                            <Progress value={(match.score / match.maxScore) * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-medium flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Missing Concepts
                      </h3>
                      {analysisResult.missingConcepts.length > 0 ? (
                        <ul className="space-y-2">
                          {analysisResult.missingConcepts.map((concept, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-1 shrink-0" />
                              <span>{concept}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No major concepts missing. Great job!</p>
                      )}
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-medium flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Overall Feedback
                      </h3>
                      <div className="rounded-lg border bg-muted/50 p-4">
                        <p className="italic">{analysisResult.feedback}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("extracted")}>
                      Back to Extracted Text
                    </Button>
                    <Button onClick={() => router.push("/student/dashboard")}>Return to Dashboard</Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  )
}

