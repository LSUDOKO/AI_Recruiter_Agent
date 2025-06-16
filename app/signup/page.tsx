"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, AlertCircle, CheckCircle, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.name, formData.company)
      setSuccess("Account created successfully! Please check your email to verify your account before signing in.")

      // Clear form
      setFormData({
        name: "",
        company: "",
        email: "",
        password: "",
      })
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20 backdrop-blur-3xl"></div>
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              RecruitAI
            </span>
          </div>
          <CardTitle className="text-white text-2xl">Create Account</CardTitle>
          <CardDescription className="text-purple-200">Start your AI-powered recruiting journey</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <Alert className="bg-green-500/10 border-green-500/20 text-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Mail className="h-12 w-12 text-purple-300 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Check Your Email</h3>
                <p className="text-purple-200 text-sm mb-4">
                  We've sent you a verification link. Click it to activate your account, then return here to sign in.
                </p>
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg">
                    Go to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="bg-red-500/10 border-red-500/20 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-white">
                  Company
                </Label>
                <Input
                  id="company"
                  placeholder="Enter your company name"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          )}

          {!success && (
            <div className="text-center text-sm mt-4">
              <span className="text-purple-200">Already have an account? </span>
              <Link href="/login" className="text-white hover:text-purple-200 font-medium">
                Sign in
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
