import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import styles from "@/styles/docs.module.css"

export const dynamic = "force-static"
export const revalidate = 3600 // Revalidate every hour

export default function DocsPage() {
  return (
    <div className={styles.docsPage}>
      <Navbar />
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Documentation</h1>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Learn how to use Taskflow to compare answer scripts effectively
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Tabs defaultValue="getting-started" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                <TabsTrigger value="file-formats">File Formats</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="getting-started">
                <Card>
                  <CardHeader>
                    <CardTitle>Getting Started with Taskflow</CardTitle>
                    <CardDescription>Learn the basics of using Taskflow for answer script comparison</CardDescription>
                  </CardHeader>
                  <CardContent className={`space-y-4 ${styles.docContent}`}>
                    <h3 className="text-lg font-medium">Step 1: Create an Account</h3>
                    <p>
                      Sign up for a Taskflow account to get started. You can use the free tier to explore the basic
                      features.
                    </p>

                    <h3 className="text-lg font-medium">Step 2: Upload Your First Document</h3>
                    <p>
                      Navigate to the comparison tool and upload your answer script. We support PDF, JPG, and DOCS
                      formats.
                    </p>

                    <h3 className="text-lg font-medium">Step 3: Add Reference Answer</h3>
                    <p>Paste or type your reference answer in the text area provided.</p>

                    <h3 className="text-lg font-medium">Step 4: Analyze</h3>
                    <p>
                      Click the "Analyze Now" button to start the comparison process. Results will be displayed with
                      visual charts and text highlights.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="file-formats">
                <Card>
                  <CardHeader>
                    <CardTitle>Supported File Formats</CardTitle>
                    <CardDescription>Learn about the different file formats Taskflow can process</CardDescription>
                  </CardHeader>
                  <CardContent className={`space-y-4 ${styles.docContent}`}>
                    <h3 className="text-lg font-medium">PDF Files</h3>
                    <p>We support all PDF files up to 10MB in size. Text is extracted using advanced OCR technology.</p>

                    <h3 className="text-lg font-medium">Image Files (JPG/JPEG)</h3>
                    <p>
                      Upload scanned answer scripts as JPG files. Our OCR system can recognize both printed and
                      handwritten text.
                    </p>

                    <h3 className="text-lg font-medium">Document Files (DOC/DOCX)</h3>
                    <p>Microsoft Word documents are fully supported with formatting preserved during analysis.</p>

                    <h3 className="text-lg font-medium">Text Files (TXT)</h3>
                    <p>Simple text files can be uploaded for basic comparison without formatting.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Understanding Analysis Results</CardTitle>
                    <CardDescription>Learn how to interpret the comparison results</CardDescription>
                  </CardHeader>
                  <CardContent className={`space-y-4 ${styles.docContent}`}>
                    <h3 className="text-lg font-medium">Similarity Score</h3>
                    <p>The overall percentage match between the uploaded document and reference answer.</p>

                    <h3 className="text-lg font-medium">Keyword Detection</h3>
                    <p>
                      Important keywords from the reference answer are highlighted and counted in the uploaded document.
                    </p>

                    <h3 className="text-lg font-medium">Section Analysis</h3>
                    <p>
                      For longer documents, we break down the analysis by sections to identify specific areas of
                      strength or weakness.
                    </p>

                    <h3 className="text-lg font-medium">Visual Charts</h3>
                    <p>
                      Bar and pie charts provide a visual representation of the comparison results for quick
                      understanding.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

