"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, authHelpers, type UserProfile } from "./supabase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, company: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Function to ensure user profile exists
  const ensureUserProfile = async (user: User) => {
    try {
      let profile = await authHelpers.getUserProfile(user.id)

      if (!profile && user.user_metadata) {
        // Try to create profile from user metadata
        const fullName = user.user_metadata.full_name || user.email?.split("@")[0] || "User"
        const company = user.user_metadata.company || "Unknown Company"

        try {
          profile = await authHelpers.createUserProfile(user.id, user.email!, fullName, company)
        } catch (profileError) {
          console.error("Failed to create profile:", profileError)
          // Continue without profile for now
        }
      }

      setUserProfile(profile)
    } catch (error) {
      console.error("Error ensuring user profile:", error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        setUser(session?.user ?? null)

        if (session?.user) {
          await ensureUserProfile(session.user)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)

      setUser(session?.user ?? null)

      if (session?.user) {
        await ensureUserProfile(session.user)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string, company: string) => {
    try {
      setLoading(true)
      const result = await authHelpers.signUp(email, password, fullName, company)

      // Don't try to create profile here - it will be created on first login
      console.log("Signup successful, user will need to verify email")

      return result
    } catch (error: any) {
      console.error("Signup failed:", error)
      throw new Error(error.message || "Failed to sign up")
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const result = await authHelpers.signIn(email, password)

      if (result.user) {
        await ensureUserProfile(result.user)
      }

      router.push("/dashboard")
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await authHelpers.signOut()
      router.push("/")
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign out")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in")

    try {
      const updatedProfile = await authHelpers.updateUserProfile(user.id, updates)
      setUserProfile(updatedProfile)
    } catch (error: any) {
      throw new Error(error.message || "Failed to update profile")
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Hook for optional auth (doesn't throw error if not in provider)
export function useOptionalAuth() {
  const context = useContext(AuthContext)
  return (
    context || {
      user: null,
      userProfile: null,
      loading: false,
      signUp: async () => {},
      signIn: async () => {},
      signOut: async () => {},
      updateProfile: async () => {},
    }
  )
}
