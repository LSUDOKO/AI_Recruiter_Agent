import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { userId, email, fullName, company } = await request.json()

    if (!userId || !email || !fullName || !company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("id", userId).single()

    if (existingProfile) {
      return NextResponse.json({ success: true, message: "Profile already exists" })
    }

    // Create the profile
    const { data, error } = await supabase
      .from("user_profiles")
      .insert([
        {
          id: userId,
          email,
          full_name: fullName,
          company,
        },
      ])
      .select()

    if (error) {
      console.error("API error creating profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Exception in create-profile API:", error)
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 })
  }
}
