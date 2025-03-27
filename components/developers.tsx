"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"

export default function Developers() {
  const developers = [
    {
      name: "Alex Chen",
      role: "Frontend Developer",
      bio: "Passionate about creating intuitive user interfaces and seamless user experiences.",
      avatar: "/placeholder.svg?height=200&width=200",
      initials: "AC",
      github: "https://github.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Sarah Johnson",
      role: "Backend Developer",
      bio: "Specializes in building robust and scalable server-side applications.",
      avatar: "/placeholder.svg?height=200&width=200",
      initials: "SJ",
      github: "https://github.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Michael Rodriguez",
      role: "ML Engineer",
      bio: "Expert in machine learning algorithms and natural language processing.",
      avatar: "/placeholder.svg?height=200&width=200",
      initials: "MR",
      github: "https://github.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
    {
      name: "Emily Patel",
      role: "UX Designer",
      bio: "Creates beautiful and functional designs with a focus on accessibility.",
      avatar: "/placeholder.svg?height=200&width=200",
      initials: "EP",
      github: "https://github.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  ]

  return (
    <section className="container py-12 md:py-24" id="team">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">Meet Our Team</h2>
        <p className="max-w-[85%] text-muted-foreground sm:text-lg">
          The talented developers behind Taskflow who made this application possible.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {developers.map((developer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage src={developer.avatar} alt={developer.name} className="object-cover" />
                  <AvatarFallback className="rounded-none text-4xl">{developer.initials}</AvatarFallback>
                </Avatar>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold">{developer.name}</h3>
                <p className="text-sm text-muted-foreground">{developer.role}</p>
                <p className="mt-2 text-sm">{developer.bio}</p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={developer.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href={developer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

