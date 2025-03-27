"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  AuthError,
  AuthErrorCodes
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase/firebase" // Make sure this path is correct

export type UserRole = "student" | "teacher" | null

interface AuthContextType {
  user: User | null
  userRole: UserRole
  loading: boolean
  error: string | null
  clearError: () => void
  signInOrCreate: (email: string, password: string, name?: string, role?: UserRole) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserRole: (role: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const handleAuthError = useCallback((error: unknown) => {
    let errorMessage = "An unknown error occurred"
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      if ('code' in error) {
        const authError = error as AuthError
        switch (authError.code) {
          case AuthErrorCodes.OPERATION_NOT_ALLOWED:
            errorMessage = "This authentication method is not enabled"
            break
          case AuthErrorCodes.INVALID_EMAIL:
            errorMessage = "Invalid email address"
            break
          case AuthErrorCodes.USER_DISABLED:
            errorMessage = "This account has been disabled"
            break
          case AuthErrorCodes.USER_DELETED:
            errorMessage = "No account found with this email"
            break
          case AuthErrorCodes.INVALID_PASSWORD:
            errorMessage = "Incorrect password"
            break
          case AuthErrorCodes.EMAIL_EXISTS:
            errorMessage = "This email is already in use"
            break
          case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
            errorMessage = "Too many attempts. Please try again later"
            break
          case AuthErrorCodes.NETWORK_REQUEST_FAILED:
            errorMessage = "Network error. Please check your connection"
            break
        }
      }
    }
    
    setError(errorMessage)
    console.error("Auth error:", error)
    throw new Error(errorMessage)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user)
        setLoading(true)

        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid))
            setUserRole(userDoc.exists() ? (userDoc.data().role as UserRole) : null)
          } catch (error) {
            handleAuthError(error)
            setUserRole(null)
          }
        } else {
          setUserRole(null)
        }
      } catch (error) {
        handleAuthError(error)
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [handleAuthError])

  const signInOrCreate = useCallback(async (
    email: string,
    password: string,
    name?: string,
    role: UserRole = 'student'
  ) => {
    try {
      clearError()
      
      // First try to sign in
      try {
        await signInWithEmailAndPassword(auth, email, password)
        return
      } catch (signInError) {
        // Only create account if the error is "user not found"
        if ((signInError as AuthError).code !== AuthErrorCodes.USER_DELETED) {
          throw signInError
        }
      }

      // If user doesn't exist, create account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Set display name if provided
      if (name) {
        await updateProfile(user, { displayName: name })
      }

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name || user.email?.split('@')[0] || 'User',
        role,
        createdAt: new Date().toISOString(),
      })

      setUserRole(role)
      
    } catch (error) {
      handleAuthError(error)
    }
  }, [clearError, handleAuthError])

  const signInWithProvider = useCallback(async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    try {
      clearError()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          role: 'student',
          createdAt: new Date().toISOString(),
        })
        setUserRole('student')
      } else {
        setUserRole(userDoc.data().role as UserRole)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }, [clearError, handleAuthError])

  const signInWithGoogle = useCallback(() => {
    return signInWithProvider(new GoogleAuthProvider())
  }, [signInWithProvider])

  const signInWithGithub = useCallback(() => {
    return signInWithProvider(new GithubAuthProvider())
  }, [signInWithProvider])

  const signOut = useCallback(async () => {
    try {
      clearError()
      await firebaseSignOut(auth)
    } catch (error) {
      handleAuthError(error)
    }
  }, [clearError, handleAuthError])

  const resetPassword = useCallback(async (email: string) => {
    try {
      clearError()
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      handleAuthError(error)
    }
  }, [clearError, handleAuthError])

  const updateUserRole = useCallback(async (role: UserRole) => {
    if (!user) return
    try {
      clearError()
      await setDoc(doc(db, "users", user.uid), { role }, { merge: true })
      setUserRole(role)
    } catch (error) {
      handleAuthError(error)
    }
  }, [user, clearError, handleAuthError])

  const value = {
    user,
    userRole,
    loading,
    error,
    clearError,
    signInOrCreate,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    resetPassword,
    updateUserRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}