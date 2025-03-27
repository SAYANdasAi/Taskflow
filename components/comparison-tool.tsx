"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, RefreshCw, Brain, Lightbulb } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { Bar, Pie } from "react-chartjs-2"
import { toast } from "sonner"
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  PieChart,
  Cell,
} from "recharts"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface AnswerAnalysis {
  score: number
  categoryScores: {
    category: string
    score: number
    maxScore: number
  }[]
  missingConcepts: string[]
  feedback: string
  strengths: string[]
  improvements: string[]
  contentBreakdown: {
    matched: number
    missing: number
    extra: number
  }
}

export default function ComparisonTool() {
  const [file, setFile] = useState<File | null>(null)
  const [referenceText, setReferenceText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisResults, setAnalysisResults] = useState<AnswerAnalysis | null>(null)
  const [studentAnswerText, setStudentAnswerText] = useState("")

  // Visualization data
  const [visualizationData, setVisualizationData] = useState({
    conceptMastery: [] as { name: string; score: number }[],
    gradeDistribution: [] as { name: string; value: number; color: string }[],
    commonMisconceptions: [] as { name: string; count: number }[],
    contentBreakdown: { matched: 0, missing: 0, extra: 0 }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      toast.success("File uploaded successfully", {
        description: `${e.target.files[0].name} (${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB)`,
      })
    }
  }

  const extractTextFromDocument = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/process-document', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    return await response.json()
  }

  const analyzeAnswer = async (studentAnswer: string, referenceAnswer: string) => {
    const response = await fetch('/api/analyze-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentAnswer, referenceAnswer }),
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    return await response.json()
  }

  const handleAnalyze = async () => {
    if (!file || !referenceText) {
      toast.error("Missing input", {
        description: "Please upload a file and provide reference text",
      })
      return
    }

    setIsAnalyzing(true)
    setProgress(0)

    try {
      // Step 1: Extract text from document
      setProgress(20)
      const processedDoc = await extractTextFromDocument(file)
      setStudentAnswerText(processedDoc.text)
      
      // Step 2: Analyze the answer
      setProgress(60)
      const analysis = await analyzeAnswer(processedDoc.text, referenceText)
      setAnalysisResults(analysis)
      
      // Transform data for visualizations
      setVisualizationData({
        conceptMastery: analysis.categoryScores.map(category => ({
          name: category.category,
          score: Math.round((category.score / category.maxScore) * 100)
        })),
        gradeDistribution: [
          { name: "A", value: analysis.score >= 90 ? 1 : 0, color: "#22c55e" },
          { name: "B", value: analysis.score >= 80 && analysis.score < 90 ? 1 : 0, color: "#3b82f6" },
          { name: "C", value: analysis.score >= 70 && analysis.score < 80 ? 1 : 0, color: "#facc15" },
          { name: "D", value: analysis.score >= 60 && analysis.score < 70 ? 1 : 0, color: "#f97316" },
          { name: "F", value: analysis.score < 60 ? 1 : 0, color: "#ef4444" }
        ],
        commonMisconceptions: analysis.missingConcepts.map((concept, index) => ({
          name: concept.length > 30 ? concept.substring(0, 30) + "..." : concept,
          count: Math.max(1, 10 - index)
        })),
        contentBreakdown: analysis.contentBreakdown
      })

      setProgress(100)
      setShowResults(true)
      toast.success("Analysis complete", {
        description: "Your document has been analyzed successfully.",
      })
    } catch (error: any) {
      toast.error("Analysis failed", {
        description: error.message || "An error occurred during analysis",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setReferenceText("")
    setShowResults(false)
    setAnalysisResults(null)
    setProgress(0)
    toast.info("Form reset", {
      description: "All fields have been cleared.",
    })
  }

  // Chart data for content breakdown
  const contentBreakdownData = {
    labels: ["Matched Content", "Missing Content", "Extra Content"],
    datasets: [
      {
        data: [
          analysisResults?.contentBreakdown.matched || 0,
          analysisResults?.contentBreakdown.missing || 0,
          analysisResults?.contentBreakdown.extra || 0
        ],
        backgroundColor: ["rgba(37, 99, 235, 0.6)", "rgba(239, 68, 68, 0.6)", "rgba(245, 158, 11, 0.6)"],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="mx-auto max-w-5xl">
      {!showResults ? (
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="h-5 w-5" />
                Upload Answer Script
              </CardTitle>
              <CardDescription>Upload PDF, JPG, or DOCS file to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 bg-muted/50 hover:bg-muted">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.doc,.docx,.txt"
                />
                <label
                  htmlFor="file-upload"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <FileUp className="mb-4 h-10 w-10 text-muted-foreground" />
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
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>Reference Answer</CardTitle>
              <CardDescription>Paste the reference answer to compare against</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your reference answer here..."
                className="h-64 resize-none"
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            {isAnalyzing ? (
              <div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Analyzing document...
                </h3>
                <div className="flex items-center gap-4">
                  <Progress value={progress} className="h-2 w-full" />
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button 
                  size="lg" 
                  className="gap-2" 
                  onClick={handleAnalyze} 
                  disabled={!file || !referenceText}
                >
                  <Brain className="h-5 w-5" />
                  Analyze Now
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={handleReset}>
                  <RefreshCw className="h-5 w-5" />
                  Reset
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI-Powered Analysis Results
            </CardTitle>
            <CardDescription>
              Comprehensive comparison between your document and the reference answer
              {analysisResults && (
                <span className="ml-2">
                  Overall score: <Badge>{analysisResults.score}%</Badge>
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-6 grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="concepts">Concepts</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="h-80">
                    <h3 className="mb-4 text-lg font-medium">Score Breakdown</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={visualizationData.conceptMastery}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <RechartsTooltip 
                          formatter={(value) => [`${value}%`, "Score"]}
                        />
                        <RechartsLegend />
                        <Bar dataKey="score" fill="#3b82f6" name="Score (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-80">
                    <h3 className="mb-4 text-lg font-medium">Content Breakdown</h3>
                    <Pie
                      data={contentBreakdownData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const label = context.label || ''
                                const value = context.raw as number
                                return `${label}: ${value}%`
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 text-lg font-medium">Summary</h3>
                  <p className="whitespace-pre-wrap">{analysisResults?.feedback || "No feedback available"}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="concepts" className="space-y-6">
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 text-lg font-medium">Concept Mastery</h3>
                  <div className="space-y-4">
                    {visualizationData.conceptMastery.map((concept) => (
                      <div key={concept.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span>{concept.name}</span>
                          <span className="font-medium">{concept.score}%</span>
                        </div>
                        <Progress
                          value={concept.score}
                          className="h-2"
                          indicatorClassName={
                            concept.score >= 80 ? "bg-green-500" : 
                            concept.score >= 60 ? "bg-amber-500" : "bg-red-500"
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {analysisResults?.missingConcepts && analysisResults.missingConcepts.length > 0 && (
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-medium flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Missing Concepts
                    </h3>
                    <ul className="list-inside list-disc space-y-2">
                      {analysisResults.missingConcepts.map((concept, index) => (
                        <li key={index}>{concept}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-medium">Strengths</h3>
                    <ul className="space-y-2">
                      {analysisResults?.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-medium">Areas for Improvement</h3>
                    <ul className="space-y-2">
                      {analysisResults?.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-amber-500">!</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 text-lg font-medium">Grade Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={visualizationData.gradeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name }) => name}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {visualizationData.gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <RechartsLegend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="comparison">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-medium">Your Answer</h3>
                    <div className="max-h-96 overflow-y-auto">
                      <p className="whitespace-pre-wrap">
                        {studentAnswerText || "No answer text available"}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 text-lg font-medium">Reference Answer</h3>
                    <div className="max-h-96 overflow-y-auto">
                      <p className="whitespace-pre-wrap">{referenceText}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="gap-2" onClick={handleReset}>
                <RefreshCw className="h-4 w-4" />
                Analyze Another Document
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}