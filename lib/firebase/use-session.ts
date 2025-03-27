"use client"

import { useAuth } from "./auth-context"

// This hook mimics NextAuth's useSession for easier migration
export function useSession() {
  const { user, userRole, loading } = useAuth()

  return {
    data: user
      ? {
          user: {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            role: userRole,
          },
        }
      : null,
    status: loading ? "loading" : user ? "authenticated" : "unauthenticated",
  }
}

