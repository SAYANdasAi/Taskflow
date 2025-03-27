import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const submitAssignment = mutation({
  args: {
    assignmentId: v.string(),
    studentId: v.string(),
    submissionUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const submissionId = await ctx.db.insert("submissions", {
      ...args,
      submittedAt: Date.now(),
    })

    return submissionId
  },
})

export const getSubmissionsByStudent = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .collect()
  },
})

export const getSubmissionsByAssignment = query({
  args: { assignmentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("assignmentId"), args.assignmentId))
      .collect()
  },
})

export const gradeSubmission = mutation({
  args: {
    submissionId: v.id("submissions"),
    score: v.number(),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, {
      score: args.score,
      feedback: args.feedback,
      gradedAt: Date.now(),
    })

    return args.submissionId
  },
})

