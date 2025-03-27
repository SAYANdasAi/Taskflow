import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const createClass = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    teacherId: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate a random 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()

    const classId = await ctx.db.insert("classes", {
      name: args.name,
      description: args.description,
      teacherId: args.teacherId,
      code,
    })

    return classId
  },
})

export const getClassesByTeacher = query({
  args: { teacherId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classes")
      .filter((q) => q.eq(q.field("teacherId"), args.teacherId))
      .collect()
  },
})

export const joinClass = mutation({
  args: {
    code: v.string(),
    studentId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const classData = await ctx.db
      .query("classes")
      .filter((q) => q.eq(q.field("code"), args.code))
      .first()

    if (!classData) {
      throw new Error("Class not found")
    }

    await ctx.db.patch(args.studentId, { classId: classData._id })

    return classData._id
  },
})

