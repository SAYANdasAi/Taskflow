"use client"

import { motion } from "framer-motion"
import { FileUp, FileText, BarChart2, Zap, Shield, RefreshCw, FileSearch, PieChart, Layers } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Features() {
  const features = [
    {
      icon: FileUp,
      title: "Multiple File Formats",
      description: "Upload PDF, JPG, or DOCS files for comparison with built-in OCR technology.",
    },
    {
      icon: FileText,
      title: "Text Extraction",
      description: "Automatically extract text from various file formats with high accuracy.",
    },
    {
      icon: BarChart2,
      title: "Visual Analysis",
      description: "Get comprehensive visual analysis with charts and highlighted text differences.",
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description: "Process files quickly with our optimized comparison algorithms.",
    },
    {
      icon: Shield,
      title: "Secure Uploads",
      description: "All uploads are secure and automatically deleted after processing.",
    },
    {
      icon: RefreshCw,
      title: "Batch Processing",
      description: "Process multiple answer scripts in a single session with ease.",
    },
    {
      icon: FileSearch,
      title: "Keyword Detection",
      description: "Identify missing or matching keywords between scripts and references.",
    },
    {
      icon: PieChart,
      title: "Score Breakdown",
      description: "Get detailed section-wise score breakdown for comprehensive evaluation.",
    },
    {
      icon: Layers,
      title: "History Tracking",
      description: "Keep track of previous comparisons and access them anytime.",
    },
  ]

  return (
    <section id="features" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Powerful tools to streamline your answer script comparison process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <feature.icon className="h-6 w-6 text-primary mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

