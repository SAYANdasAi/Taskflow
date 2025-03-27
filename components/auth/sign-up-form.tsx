"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Github, Mail } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/firebase/auth-context"
import type { UserRole } from "@/lib/firebase/auth-context"

interface SignUpFormProps {
  onSuccess: () => void
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("student")
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

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setIsLoading(true)
      await signInOrCreate(email, password, name, role)
      toast.success("Account created successfully")
      onSuccess()
    } catch (error) {
      // Error is handled by the auth provider and displayed via the error effect
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true)
      await signInWithGoogle()
      toast.success("Signed up with Google")
      onSuccess()
    } catch (error) {
      // Error is handled by the auth provider and displayed via the error effect
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubSignUp = async () => {
    try {
      setIsLoading(true)
      await signInWithGithub()
      toast.success("Signed up with GitHub")
      onSuccess()
    } catch (error) {
      // Error is handled by the auth provider and displayed via the error effect
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 py-4">
      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="role">I am a:</Label>
          <RadioGroup
            id="role"
            value={role || "student"}
            onValueChange={(value) => setRole(value as UserRole)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="student" id="student" />
              <Label htmlFor="student">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="teacher" id="teacher" />
              <Label htmlFor="teacher">Teacher</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up with Email"}
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
        <Button variant="outline" onClick={handleGoogleSignUp} disabled={isLoading} className="w-full">
          <Mail className="mr-2 h-4 w-4" />
          Sign up with Google
        </Button>
        <Button variant="outline" onClick={handleGithubSignUp} disabled={isLoading} className="w-full">
          <Github className="mr-2 h-4 w-4" />
          Sign up with GitHub
        </Button>
      </div>
    </div>
  )
}

