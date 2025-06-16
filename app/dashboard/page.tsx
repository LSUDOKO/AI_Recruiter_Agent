"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Calendar, Users, Eye, TrendingUp, Sparkles, RefreshCw, Target, Award, Briefcase } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { JotFormAPI } from "@/lib/jotform-api"
import { jobStore, type Job } from "@/lib/job-store"
import { useOptionalAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"
import Image from "next/image"

export default function Dashboard() {
  const { userProfile } = useOptionalAuth()
  const [totalApplications, setTotalApplications] = useState(0)
  const [newApplications, setNewApplications] = useState(0)
  const [avgScore, setAvgScore] = useState(0)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Default user profile for demo purposes
  const displayProfile = userProfile || {
    full_name: "Demo User",
    company: "Demo Company",
    email: "demo@example.com",
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [applications, allJobs] = await Promise.all([
          JotFormAPI.getSubmissions(),
          Promise.resolve(jobStore.getAllJobs()),
        ])

        setTotalApplications(applications.length)
        setNewApplications(applications.filter((app) => app.status === "new").length)
        setJobs(allJobs)

        if (applications.length > 0) {
          const totalScore = applications.reduce((sum, app) => sum + (app.score || 0), 0)
          setAvgScore(Math.round(totalScore / applications.length))
        }

        // Update job application counts
        allJobs.forEach((job) => {
          const jobApplications = applications.filter(
            (app) =>
              // For now, we'll distribute applications across jobs
              // You can enhance this logic based on your needs
              Math.random() > 0.5,
          )
          jobStore.updateApplicationCount(job.id, jobApplications.length)
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()

    // Listen for job store updates
    const handleJobUpdate = () => {
      setJobs(jobStore.getAllJobs())
    }

    jobStore.addListener(handleJobUpdate)

    return () => {
      jobStore.removeListener(handleJobUpdate)
    }
  }, [])

  return (
    <ProtectedRoute requireAuth={false}>
      <DashboardLayout>
        <div className="space-y-8 animate-fade-in">
          {/* Welcome Section */}
          <div className="relative bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/data-visualization.png')] bg-cover bg-center opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Sparkles className="h-6 w-6 text-purple-300" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      Welcome back, {displayProfile.full_name.split(" ")[0]}!
                    </h1>
                  </div>
                  <p className={`${isDark ? "text-gray-300" : "text-gray-600"} text-lg`}>
                    Here's what's happening with your recruitment process today.
                  </p>
                </div>
                <div className="hidden md:block">
                  <Image
                    src="/images/ai-brain.png"
                    alt="AI Analytics"
                    width={120}
                    height={120}
                    className="rounded-xl opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/create-job">
              <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border-white/20 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl w-fit mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Create New Job</h3>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Start hiring for a new position
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/applications">
              <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border-white/20 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl w-fit mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Review Applications</h3>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Check new candidate submissions
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/analytics">
              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border-white/20 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl w-fit mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>View Analytics</h3>
                  <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Track hiring performance</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-600"}`}>
                  Active Jobs
                </CardTitle>
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:shadow-lg transition-all duration-300">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>
                  {jobs.filter((job) => job.status === "Active").length}
                </div>
                <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-500"} flex items-center`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {jobs.length > 0 ? `${jobs.length} total jobs` : "No jobs yet"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-600"}`}>
                  Total Applications
                </CardTitle>
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg group-hover:shadow-lg transition-all duration-300">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} flex items-center mb-2`}>
                  {isLoading ? <RefreshCw className="h-6 w-6 animate-spin" /> : totalApplications}
                </div>
                <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-500"} flex items-center`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {newApplications} new this week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-600"}`}>
                  Avg. AI Score
                </CardTitle>
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg group-hover:shadow-lg transition-all duration-300">
                  <Eye className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>
                  {isLoading ? <RefreshCw className="h-6 w-6 animate-spin" /> : `${avgScore}%`}
                </div>
                <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-500"} flex items-center`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Live from JotForm
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Your Job Posts */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Your Job Posts</h2>
              <Link href="/create-job">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:scale-105 transition-all duration-200">
                  <Target className="h-4 w-4 mr-2" />
                  Create New Job
                </Button>
              </Link>
            </div>

            {jobs.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/team-collaboration.png')] bg-cover bg-center opacity-10"></div>
                <CardContent className="relative z-10">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-fit mx-auto mb-6">
                    <Briefcase className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">No Jobs Created Yet</h3>
                  <p className="text-purple-200 mb-8 max-w-md mx-auto">
                    Create your first job posting to start receiving applications and experience the power of AI-driven
                    recruitment.
                  </p>
                  <Link href="/create-job">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:scale-105 transition-all duration-200">
                      <Target className="h-5 w-5 mr-2" />
                      Create Your First Job
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl group-hover:shadow-lg transition-all duration-300">
                            <Briefcase className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className={`${isDark ? "text-white" : "text-gray-900"} text-xl`}>
                              {job.title}
                            </CardTitle>
                            <CardDescription className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                              Posted on {job.createdAt.toLocaleDateString()} • {job.experience} years experience
                              required
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant={job.status === "Active" ? "default" : "secondary"}
                          className={
                            job.status === "Active"
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                              : "bg-gray-500 text-white"
                          }
                        >
                          {job.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex items-center space-x-6 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                        >
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {job.applicationCount || 0} applicants
                          </span>
                          {job.skills.length > 0 && (
                            <span className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              Skills: {job.skills.slice(0, 2).join(", ")}
                              {job.skills.length > 2 && ` +${job.skills.length - 2} more`}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/apply/${job.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Form
                            </Button>
                          </Link>
                          <Link href="/applications">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-all duration-200"
                            >
                              <Users className="h-4 w-4 mr-1" />
                              Applications
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
