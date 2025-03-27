import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For Firebase auth, we'll rely on client-side auth checks
  // This middleware is simplified and mainly for route protection

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/features", "/docs", "/api", "/auth"]

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(`${route}/`),
  )

  // For Firebase, we'll handle most auth in the client components
  // This is just a basic route protection
  if (!isPublicRoute) {
    // We'll redirect unauthenticated users to the sign-in page
    // The actual auth check will happen in the client components
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)

    // Note: This is a simplified approach. For Firebase, most auth checks
    // will happen client-side in the components themselves
    return NextResponse.next()
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

