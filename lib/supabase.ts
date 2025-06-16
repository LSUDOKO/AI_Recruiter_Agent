import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our user data
export interface UserProfile {
  id: string
  email: string
  full_name: string
  company: string
  created_at: string
  updated_at: string
}

// Auth helper functions
export const authHelpers = {
  // Sign up new user
  async signUp(email: string, password: string, fullName: string, company: string) {
    try {
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company: company,
          },
        },
      })

      if (error) {
        console.error("Auth signup error:", error)
        throw error
      }

      console.log("Auth user created successfully:", data.user?.id)

      // Don't try to create profile immediately - let the auth flow complete first
      // The profile will be created when the user first logs in

      return data
    } catch (err) {
      console.error("Signup error:", err)
      throw err
    }
  },

  // Create user profile (separate function)
  async createUserProfile(userId: string, email: string, fullName: string, company: string) {
    try {
      console.log("Creating user profile for:", userId)

      // Check if profile already exists
      const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("id", userId).single()

      if (existingProfile) {
        console.log("Profile already exists")
        return existingProfile
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: userId,
            email: email,
            full_name: fullName,
            company: company,
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Profile creation error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        throw error
      }

      console.log("Profile created successfully:", data)
      return data
    } catch (err) {
      console.error("Exception creating user profile:", err)
      throw err
    }
  },

  // Sign in user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      return data
    } catch (err) {
      console.error("Exception fetching user profile:", err)
      return null
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase.from("user_profiles").update(updates).eq("id", userId).select().single()

    if (error) throw error
    return data
  },
}
