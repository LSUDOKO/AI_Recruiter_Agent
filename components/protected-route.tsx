"use client"

import type React from "react"

import { useOptionalAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function ProtectedRoute({ children, redirectTo = "/login", requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useOptionalAuth()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && !loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo, requireAuth])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
          <CardContent className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-purple-300 mx-auto mb-4" />
            <p className="text-white">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null // Will redirect
  }

  return <>{children}</>
}
