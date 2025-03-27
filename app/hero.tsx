"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import styles from "@/styles/home.module.css"

export default function Hero() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Compare Answer Scripts with Precision
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Upload answer scripts, compare with reference answers, and get instant visual analysis of matches and
                mismatches.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/comparison">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              className={`relative w-full aspect-video overflow-hidden rounded-xl border bg-background shadow-xl ${styles.heroGradient}`}
            >
              <div className="flex h-full items-center justify-center">
                <div className="relative h-full w-full bg-background p-4">
                  <div className="flex h-full flex-col rounded-lg border bg-muted p-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-xs font-medium">Taskflow Analyzer</div>
                    </div>
                    <div className="flex-1 pt-4">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="rounded border border-dashed border-muted-foreground/50 p-2 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Upload Answer Script</span>
                        </div>
                        <div className="rounded border border-muted-foreground/50 p-2 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Reference Answer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

