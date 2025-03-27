"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { getUpcomingAssignments, type CalendarEvent } from "@/lib/services/google-calendar"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export function CalendarIntegration() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const upcomingEvents = await getUpcomingAssignments()
        setEvents(upcomingEvents)
      } catch (error) {
        console.error("Error fetching calendar events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const formatTimeRemaining = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(date.getTime() - now.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} left`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} left`
    } else {
      return "Due soon"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Google Calendar Integration
        </CardTitle>
        <CardDescription>Your upcoming assignment deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title.replace("Assignment Due: ", "")}</h4>
                    <p className="text-sm text-muted-foreground">
                      Due {event.endTime.toLocaleDateString()} at{" "}
                      {event.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary">{formatTimeRemaining(event.endTime)}</span>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/student/assignments/${event.id.replace("event_", "")}`}>
                        <ArrowRight className="h-4 w-4" />
                        <span className="sr-only">View assignment</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium">No upcoming deadlines</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up! Check back later for new assignments.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

