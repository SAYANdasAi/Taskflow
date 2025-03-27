"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Twitter } from "lucide-react"

export default function Team() {
  const team = [
    {
      name: "Emma Wilson",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=300&width=300",
      bio: "Specializes in React and Next.js development with a focus on creating intuitive user interfaces.",
      social: {
        github: "https://github.com/emmawilson",
        twitter: "https://twitter.com/emmawilson",
        linkedin: "https://linkedin.com/in/emmawilson",
      },
    },
    {
      name: "David Chen",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=300&width=300",
      bio: "Expert in Node.js and database architecture with experience in building scalable APIs and services.",
      social: {
        github: "https://github.com/davidchen",
        twitter: "https://twitter.com/davidchen",
        linkedin: "https://linkedin.com/in/davidchen",
      },
    },
    {
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      avatar: "/placeholder.svg?height=300&width=300",
      bio: "Creates beautiful and functional designs with a focus on user experience and accessibility.",
      social: {
        github: "https://github.com/sarahjohnson",
        twitter: "https://twitter.com/sarahjohnson",
        linkedin: "https://linkedin.com/in/sarahjohnson",
      },
    },
    {
      name: "Michael Rodriguez",
      role: "ML Engineer",
      avatar: "/placeholder.svg?height=300&width=300",
      bio: "Specializes in machine learning algorithms and natural language processing for text comparison.",
      social: {
        github: "https://github.com/michaelrodriguez",
        twitter: "https://twitter.com/michaelrodriguez",
        linkedin: "https://linkedin.com/in/michaelrodriguez",
      },
    },
  ]

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Meet Our Team</h2>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            The talented developers behind Taskflow
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden">
                <div className="aspect-square relative">
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={member.avatar} alt={member.name} className="object-cover" />
                    <AvatarFallback className="rounded-none">{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <p className="mt-2 text-sm">{member.bio}</p>
                  <div className="mt-4 flex space-x-4">
                    <a href={member.social.github} className="text-muted-foreground hover:text-foreground">
                      <Github className="h-5 w-5" />
                      <span className="sr-only">GitHub</span>
                    </a>
                    <a href={member.social.twitter} className="text-muted-foreground hover:text-foreground">
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </a>
                    <a href={member.social.linkedin} className="text-muted-foreground hover:text-foreground">
                      <Linkedin className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

