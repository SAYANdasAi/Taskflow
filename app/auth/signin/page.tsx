"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const error = searchParams.get("error")

  useEffect(() => {
    if (session) {
      router.push(callbackUrl)
    }
  }, [session, router, callbackUrl])

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In to Taskflow</CardTitle>
          <CardDescription className="text-center">Choose your preferred sign in method</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 text-sm text-red-500 bg-red-50 rounded-md">
              {error === "OAuthSignin" && "Error starting OAuth sign in. Please try again."}
              {error === "OAuthCallback" && "Error during OAuth callback. Please try again."}
              {error === "OAuthCreateAccount" && "Error creating OAuth account. Please try again."}
              {error === "EmailCreateAccount" && "Error creating email account. Please try again."}
              {error === "Callback" && "Error during callback. Please try again."}
              {error === "OAuthAccountNotLinked" && "Email already in use with different provider."}
              {error === "EmailSignin" && "Error sending email sign in link. Please try again."}
              {error === "CredentialsSignin" && "Invalid credentials. Please try again."}
              {error === "SessionRequired" && "Please sign in to access this page."}
              {error === "Default" && "Error signing in. Please try again."}
            </div>
          )}
          <SignInForm onSuccess={() => {}} />
        </CardContent>
      </Card>
    </div>
  )
}

