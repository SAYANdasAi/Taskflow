import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createAssignment = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    classId: v.string(),
    teacherId: v.string(),
    dueDate: v.optional(v.number()),
    questionPaperUrl: v.optional(v.string()),
    answerKeyUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const assignmentId = await ctx.db.insert("assignments", {
      ...args,
      createdAt: Date.now(),
    })

    return assignmentId
  },
})

export const getAssignmentsByClass = query({
  args: { classId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assignments")
      .filter((q) => q.eq(q.field("classId"), args.classId))
      .collect()
  },
})

export const getAssignmentById = query({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.assignmentId)
  },
})

