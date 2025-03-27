import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/firebase/auth-context"
import { Toaster } from "sonner"
import { ClerkProvider } from "@clerk/nextjs"
import { Session } from "inspector/promises"
import SessionClientProvider from "@/lib/providers/SessionProviderClient"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Taskflow - Answer Script Comparison Tool",
  description: "Compare uploaded answer scripts with reference answers and get visual analysis",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionClientProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
        </SessionClientProvider>
      </body>
    </html>
  )
}

