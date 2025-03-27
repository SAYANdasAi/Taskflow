import type { Adapter } from "next-auth/adapters"
import type { ConvexClient } from "convex/browser"

export function ConvexAdapter(client: ConvexClient): Adapter {
  return {
    async createUser(user) {
      const userId = await client.mutation("users/createUser", {
        email: user.email,
        name: user.name || "User",
        role: "student", // Default role
        image: user.image,
      })

      return {
        id: userId,
        ...user,
      }
    },

    async getUser(id) {
      const user = await client.query("users/getUserById", { userId: id })
      if (!user) return null

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    },

    async getUserByEmail(email) {
      const user = await client.query("users/getUserByEmail", { email })
      if (!user) return null

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    },

    async updateUser(user) {
      // This would update user details
      return user
    },

    // Implement other required methods
    async getUserByAccount({ providerAccountId, provider }) {
      // Implementation would depend on how you store accounts
      return null
    },

    async linkAccount(account) {
      // Implementation would depend on how you store accounts
      return account
    },

    async createSession({ sessionToken, userId, expires }) {
      // Implementation would depend on how you store sessions
      return {
        id: sessionToken,
        sessionToken,
        userId,
        expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      // Implementation would depend on how you store sessions
      return null
    },

    async updateSession({ sessionToken }) {
      // Implementation would depend on how you store sessions
      return null
    },

    async deleteSession(sessionToken) {
      // Implementation would depend on how you store sessions
    },

    async createVerificationToken({ identifier, expires, token }) {
      // Implementation would depend on how you store verification tokens
      return {
        identifier,
        expires,
        token,
      }
    },

    async useVerificationToken({ identifier, token }) {
      // Implementation would depend on how you store verification tokens
      return null
    },
  }
}

