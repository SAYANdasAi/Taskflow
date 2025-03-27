"use client"

import { motion } from "framer-motion"
import { FileText, Upload, CheckCircle, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AppPreview() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Taskflow simplifies the process of comparing answer scripts with reference answers
            </p>
          </motion.div>

          <motion.div
            className="mt-8 w-full max-w-5xl rounded-xl border bg-background p-4 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Upload Answer Script</h3>
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg p-8">
                    <div className="text-center">
                      <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Drag & drop PDF, JPG, or DOCS files</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Reference Answer</h3>
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 border rounded-lg p-2">
                    <div className="h-full bg-background rounded p-2 text-sm text-muted-foreground">
                      <p>Paste your reference answer here...</p>
                      <p className="mt-2">The system will compare the uploaded script with this reference.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-2">
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Analysis Results</h3>
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border bg-background p-3">
                    <div className="h-20 bg-primary/20 rounded-md flex items-center justify-center">
                      <span className="text-primary font-medium">Similarity: 78%</span>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-background p-3">
                    <div className="h-20 bg-primary/20 rounded-md flex items-center justify-center">
                      <span className="text-primary font-medium">Keywords: 15/20</span>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-background p-3">
                    <div className="h-20 bg-primary/20 rounded-md flex items-center justify-center">
                      <span className="text-primary font-medium">Score: B+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button size="lg" className="px-8">
                Try It Now
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

