"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Mail } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/firebase/auth-context"

interface SignInFormProps {
  onSuccess: () => void
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signInOrCreate, signInWithGoogle, signInWithGithub, error, clearError } = useAuth()

  // Clear any auth errors when component mounts
  useEffect(() => {
    clearError()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Show error toast when auth error occurs
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setIsLoading(true)
      await signInOrCreate(email, password)
      toast.success("Signed in successfully")
      onSuccess()
    } catch (error) {
      // Error is handled by the auth provider and displayed via the error effect
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
      toast.success("Signed in with Google")
      onSuccess()
    } catch (error) {
      // Error is handled by the auth provider and displayed via the error effect
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true)
      await signInWithGithub()
      toast.success("Signed in with GitHub")
      onSuccess()
    } catch (error) {
      // Error is handled by the auth provider and displayed via the error effect
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 py-4">
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In with Email"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full">
          <Mail className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        <Button variant="outline" onClick={handleGithubSignIn} disabled={isLoading} className="w-full">
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
      </div>
    </div>
  )
}

