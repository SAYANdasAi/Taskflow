"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/firebase/auth-context"
import ComparisonTool from "@/components/comparison-tool"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import styles from "@/styles/comparison.module.css"
import { Button } from "@/components/ui/button"

export default function ComparisonPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!loading && !user && isClient) {
      router.push("/")
    }
  }, [user, loading, isClient, router])

  if (loading || !isClient) {
    return (
      <div className={styles.comparisonPage}>
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Button variant="ghost">
            Loading...
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.comparisonPage}>
      <Navbar />
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Answer Script Comparison
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Upload your answer script and compare it with a reference answer to get detailed analysis
            </p>
          </div>
          <ComparisonTool />
        </div>
      </section>
      <Footer />
    </div>
  )
}