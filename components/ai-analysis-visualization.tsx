// ai-chart.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Brain, Lightbulb, FileText, FileUp, RefreshCw } from "lucide-react"
import { extractTextFromDocument, analyzeAnswer, type AnswerAnalysis } from "@/lib/services/vertex-ai"
import { toast } from "sonner"

export function AIAnalysisVisualization() {
  const [file, setFile] = useState<File | null>(null)
  const [referenceText, setReferenceText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisResults, setAnalysisResults] = useState<AnswerAnalysis | null>(null)
  const [studentAnswerText, setStudentAnswerText] = useState("")

  // Processed data for visualizations
  const [visualizationData, setVisualizationData] = useState({
    conceptMastery: [],
    gradeDistribution: [],
    commonMisconceptions: []
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      toast.success("File uploaded successfully", {
        description: `${e.target.files[0].name} (${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB)`,
      })
    }
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
      // Simulate progress steps
      setProgress(20)
      const processedDoc = await extractTextFromDocument(file)
      setStudentAnswerText(processedDoc.text)
      
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
          { name: "A", value: Math.round(analysis.score / 20), color: "#22c55e" },
          { name: "B", value: Math.round(analysis.score / 25), color: "#3b82f6" },
          { name: "C", value: Math.round(analysis.score / 30), color: "#facc15" },
          { name: "D", value: Math.round(analysis.score / 35), color: "#f97316" },
          { name: "F", value: analysis.score < 60 ? 1 : 0, color: "#ef4444" }
        ],
        commonMisconceptions: analysis.missingConcepts.map((concept, index) => ({
          name: concept,
          count: Math.round((analysis.score / 100) * (10 - index)) // Simulate frequency
        }))
      })

      setProgress(100)
      toast.success("Analysis complete", {
        description: "Document has been analyzed successfully",
      })
    } catch (error) {
      toast.error("Analysis failed", {
        description: error.message,
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setReferenceText("")
    setAnalysisResults(null)
    setProgress(0)
    toast.info("Analysis reset", {
      description: "Ready for new analysis",
    })
  }

  return (
    <div className="space-y-6">
      {!analysisResults ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Document Analysis
            </CardTitle>
            <CardDescription>
              Upload a student answer and reference text for AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Upload Student Answer</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileUp className="w-8 h-8 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT</p>
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                </div>
                {file && (
                  <div className="text-sm text-muted-foreground">
                    Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Reference Answer</label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Paste the reference answer here..."
                  value={referenceText}
                  onChange={(e) => setReferenceText(e.target.value)}
                />
              </div>
            </div>

            {isAnalyzing ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing document...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ) : (
              <div className="flex gap-4">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!file || !referenceText}
                  className="gap-2"
                >
                  <Brain className="h-4 w-4" />
                  Analyze Document
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI-Powered Analysis Results
            </CardTitle>
            <CardDescription>
              Comprehensive analysis of student submission with score:{" "}
              <Badge className="ml-1">{analysisResults.score}%</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="concepts" className="space-y-4">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="concepts">Concept Mastery</TabsTrigger>
                <TabsTrigger value="grades">Grade Analysis</TabsTrigger>
                <TabsTrigger value="details">Detailed Feedback</TabsTrigger>
                <TabsTrigger value="misconceptions">Improvements</TabsTrigger>
              </TabsList>

              <TabsContent value="concepts">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-4">Concept Mastery</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={visualizationData.conceptMastery}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#3b82f6" name="Mastery Score (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Detailed Breakdown</h3>
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
              </TabsContent>

              <TabsContent value="grades">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-4">Score Distribution</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={visualizationData.gradeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {visualizationData.gradeDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-4">Performance Summary</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Overall Score:</span>
                        <Badge className="text-lg">{analysisResults.score}%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Content Accuracy:</span>
                        <Badge className="text-lg" variant={
                          analysisResults.score >= 80 ? "default" : 
                          analysisResults.score >= 60 ? "secondary" : "destructive"
                        }>
                          {analysisResults.categoryScores.find(c => c.category === "Content Accuracy")?.score || 0}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Grammar:</span>
                        <Badge className="text-lg" variant={
                          analysisResults.score >= 80 ? "default" : 
                          analysisResults.score >= 60 ? "secondary" : "destructive"
                        }>
                          {analysisResults.categoryScores.find(c => c.category === "Grammar")?.score || 0}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Completeness:</span>
                        <Badge className="text-lg" variant={
                          analysisResults.score >= 80 ? "default" : 
                          analysisResults.score >= 60 ? "secondary" : "destructive"
                        }>
                          {analysisResults.categoryScores.find(c => c.category === "Completeness")?.score || 0}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-4">Detailed Feedback</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{analysisResults.feedback}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-4">Strengths</h3>
                      <ul className="space-y-2">
                        {analysisResults.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-4">Areas for Improvement</h3>
                      <ul className="space-y-2">
                        {analysisResults.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-amber-500">!</span>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="misconceptions">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-4">Common Misconceptions</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart 
                        data={visualizationData.commonMisconceptions} 
                        layout="vertical"
                        margin={{ left: 100 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={150} 
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="count" 
                          fill="#ef4444" 
                          name="Frequency" 
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Teaching Recommendations
                    </h3>
                    <ul className="space-y-3 list-disc list-inside">
                      {analysisResults.missingConcepts.map((concept, index) => (
                        <li key={index}>
                          <span className="font-medium">{concept}:</span> Suggested focus area based on analysis
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="gap-2"
              >
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