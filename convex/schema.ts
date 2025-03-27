import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.string(), // "teacher" or "student"
    image: v.optional(v.string()),
    classId: v.optional(v.string()), // For students to be associated with a class
  }),

  classes: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    teacherId: v.string(), // Reference to the teacher who created the class
    code: v.string(), // Unique code for students to join
  }),

  assignments: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    classId: v.string(),
    teacherId: v.string(),
    dueDate: v.optional(v.number()),
    questionPaperUrl: v.optional(v.string()),
    answerKeyUrl: v.optional(v.string()),
    createdAt: v.number(),
  }),

  submissions: defineTable({
    assignmentId: v.string(),
    studentId: v.string(),
    submissionUrl: v.string(),
    submittedAt: v.number(),
    score: v.optional(v.number()),
    feedback: v.optional(v.string()),
    gradedAt: v.optional(v.number()),
  }),

  results: defineTable({
    assignmentId: v.string(),
    classId: v.string(),
    averageScore: v.number(),
    highestScore: v.number(),
    lowestScore: v.number(),
    totalSubmissions: v.number(),
    gradedSubmissions: v.number(),
  }),
})

