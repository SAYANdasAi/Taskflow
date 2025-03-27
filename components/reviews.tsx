"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const reviews = [
    {
      name: "Alex Johnson",
      role: "Professor, University of Technology",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Taskflow has revolutionized how I grade papers. The visual analysis makes it easy to identify where students are missing key concepts.",
    },
    {
      name: "Sarah Williams",
      role: "Teaching Assistant, State College",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "I can process twice as many papers in half the time. The keyword detection feature is particularly helpful for standardized grading.",
    },
    {
      name: "Michael Chen",
      role: "Education Technology Specialist",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The accuracy of the text extraction from scanned documents is impressive. This tool has significantly improved our assessment workflow.",
    },
    {
      name: "Emily Rodriguez",
      role: "High School Teacher",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Taskflow helps me provide more consistent and fair grading. The visual charts make it easy to explain scores to students and parents.",
    },
    {
      name: "David Kim",
      role: "Online Course Instructor",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "As someone who manages hundreds of assignments weekly, Taskflow has been a game-changer for my productivity and grading consistency.",
    },
    {
      name: "Lisa Patel",
      role: "Educational Consultant",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "I recommend Taskflow to all educators I work with. The interface is intuitive and the analysis is thorough and accurate.",
    },
  ]

  // Duplicate reviews for infinite effect
  const allReviews = [...reviews, ...reviews]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [reviews.length])

  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = currentIndex * (containerRef.current.scrollWidth / allReviews.length)
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [currentIndex, allReviews.length])

  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Trusted by educators and professionals worldwide
          </p>
        </motion.div>

        <div className="mt-12 relative">
          <div ref={containerRef} className="flex overflow-x-hidden py-4">
            <div className="flex animate-scroll gap-4 px-4">
              {allReviews.map((review, index) => (
                <Card key={index} className="min-w-[300px] max-w-[350px] shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.name}</p>
                        <p className="text-sm text-muted-foreground">{review.role}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground">&quot;{review.content}&quot;</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10"></div>
        </div>
      </div>
    </section>
  )
}

