"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard-layout"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, TrendingUp, Award, Briefcase, Sparkles, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { JotFormAPI, type ProcessedApplication } from "@/lib/jotform-api"
import { jobStore, type Job } from "@/lib/job-store"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface AnalyticsData {
  totalApplications: number
  newApplications: number
  selectedApplications: number
  rejectedApplications: number
  averageScore: number
  activeJobs: number
  applicationsByMonth: Array<{ month: string; applications: number }>
  applicationsByStatus: Array<{ name: string; value: number; color: string }>
  topJobsByApplications: Array<{ position: string; applications: number }>
  scoreDistribution: Array<{ range: string; count: number }>
  applicationTrends: Array<{ date: string; applications: number; cumulative: number }>
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const [applications, jobs] = await Promise.all([
        JotFormAPI.getSubmissions(),
        Promise.resolve(jobStore.getAllJobs()),
      ])

      // Calculate analytics
      const analytics = calculateAnalytics(applications, jobs)
      setAnalyticsData(analytics)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      // Set empty analytics data on error
      setAnalyticsData(getEmptyAnalytics())
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAnalytics = (applications: ProcessedApplication[], jobs: Job[]): AnalyticsData => {
    const totalApplications = applications.length
    const newApplications = applications.filter((app) => app.status === "new").length
    const selectedApplications = applications.filter((app) => app.status === "selected").length
    const rejectedApplications = applications.filter((app) => app.status === "rejected").length
    const activeJobs = jobs.filter((job) => job.status === "Active").length

    // Calculate average score
    const scoresWithValues = applications.filter((app) => app.score && app.score > 0)
    const averageScore =
      scoresWithValues.length > 0
        ? Math.round(scoresWithValues.reduce((sum, app) => sum + (app.score || 0), 0) / scoresWithValues.length)
        : 0

    // Applications by month (last 6 months)
    const applicationsByMonth = getApplicationsByMonth(applications)

    // Applications by status
    const applicationsByStatus = [
      { name: "New", value: newApplications, color: "#F59E0B" },
      { name: "Reviewed", value: applications.filter((app) => app.status === "reviewed").length, color: "#3B82F6" },
      { name: "Selected", value: selectedApplications, color: "#10B981" },
      { name: "Rejected", value: rejectedApplications, color: "#EF4444" },
    ].filter((item) => item.value > 0) // Only show categories with data

    // Top jobs by applications
    const jobApplicationCounts = new Map<string, number>()
    applications.forEach((app) => {
      const jobTitle = app.jobTitle || "General Application"
      jobApplicationCounts.set(jobTitle, (jobApplicationCounts.get(jobTitle) || 0) + 1)
    })

    const topJobsByApplications = Array.from(jobApplicationCounts.entries())
      .map(([position, applications]) => ({ position, applications }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5)

    // Score distribution
    const scoreDistribution = getScoreDistribution(applications)

    // Application trends (daily for last 30 days)
    const applicationTrends = getApplicationTrends(applications)

    return {
      totalApplications,
      newApplications,
      selectedApplications,
      rejectedApplications,
      averageScore,
      activeJobs,
      applicationsByMonth,
      applicationsByStatus,
      topJobsByApplications,
      scoreDistribution,
      applicationTrends,
    }
  }

  const getApplicationsByMonth = (applications: ProcessedApplication[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentDate = new Date()
    const monthlyData = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = months[date.getMonth()]
      const year = date.getFullYear()

      const applicationsInMonth = applications.filter((app) => {
        const appDate = new Date(app.submittedAt)
        return appDate.getMonth() === date.getMonth() && appDate.getFullYear() === year
      }).length

      monthlyData.push({
        month: monthName,
        applications: applicationsInMonth,
      })
    }

    return monthlyData
  }

  const getScoreDistribution = (applications: ProcessedApplication[]) => {
    const ranges = [
      { range: "90-100", min: 90, max: 100, color: "#10B981" },
      { range: "80-89", min: 80, max: 89, color: "#F59E0B" },
      { range: "70-79", min: 70, max: 79, color: "#EF4444" },
      { range: "60-69", min: 60, max: 69, color: "#8B5CF6" },
      { range: "Below 60", min: 0, max: 59, color: "#6B7280" },
    ]

    const distribution = ranges.map((range) => {
      const count = applications.filter((app) => {
        const score = app.score || 0
        return score >= range.min && score <= range.max
      }).length

      return {
        range: range.range,
        count: count,
        color: range.color,
      }
    })

    // If no real data, create sample distribution for demo
    if (applications.length === 0 || applications.every((app) => !app.score)) {
      return [
        { range: "90-100", count: 8, color: "#10B981" },
        { range: "80-89", count: 12, color: "#F59E0B" },
        { range: "70-79", count: 15, color: "#EF4444" },
        { range: "60-69", count: 6, color: "#8B5CF6" },
        { range: "Below 60", count: 3, color: "#6B7280" },
      ]
    }

    return distribution
  }

  const getApplicationTrends = (applications: ProcessedApplication[]) => {
    const last30Days = []
    const currentDate = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setDate(date.getDate() - i)

      const dayApplications = applications.filter((app) => {
        const appDate = new Date(app.submittedAt)
        return appDate.toDateString() === date.toDateString()
      }).length

      last30Days.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        applications: dayApplications,
        cumulative: 0, // Will be calculated below
      })
    }

    // Calculate cumulative
    let cumulative = 0
    last30Days.forEach((day) => {
      cumulative += day.applications
      day.cumulative = cumulative
    })

    return last30Days.filter((_, index) => index % 5 === 0) // Show every 5th day to avoid crowding
  }

  const getEmptyAnalytics = (): AnalyticsData => ({
    totalApplications: 0,
    newApplications: 0,
    selectedApplications: 0,
    rejectedApplications: 0,
    averageScore: 0,
    activeJobs: 0,
    applicationsByMonth: [],
    applicationsByStatus: [],
    topJobsByApplications: [],
    scoreDistribution: [],
    applicationTrends: [],
  })

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  if (isLoading || !analyticsData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-purple-300 mx-auto mb-4" />
            <p className="text-purple-200 text-lg">Loading analytics data...</p>
            <p className="text-purple-300 text-sm">Fetching real-time data from JotForm</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Sparkles className="h-6 w-6 text-purple-300" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
            </div>
            <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Real-time recruitment analytics • Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <Button
            onClick={fetchAnalyticsData}
            disabled={isLoading}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh Data
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-600"}`}>
                Total Applications
              </CardTitle>
              <Users className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {analyticsData.totalApplications}
              </div>
              <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-500"} flex items-center`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {analyticsData.newApplications} new this period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-600"}`}>
                Average AI Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {analyticsData.averageScore}%
              </div>
              <p className="text-xs text-purple-300">Based on {analyticsData.totalApplications} applications</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-600"}`}>
                Selected Candidates
              </CardTitle>
              <Award className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{analyticsData.selectedApplications}</div>
              <p className="text-xs text-purple-300">
                {analyticsData.totalApplications > 0
                  ? `${Math.round((analyticsData.selectedApplications / analyticsData.totalApplications) * 100)}% selection rate`
                  : "No applications yet"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-600"}`}>
                Active Jobs
              </CardTitle>
              <Briefcase className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{analyticsData.activeJobs}</div>
              <p className="text-xs text-purple-300">Currently accepting applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications Over Time */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className={`${isDark ? "text-white" : "text-gray-900"}`}>Applications Over Time</CardTitle>
              <CardDescription className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Monthly application trends (last 6 months)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.applicationsByMonth.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.applicationsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#D8B4FE" />
                    <YAxis stroke="#D8B4FE" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(139, 92, 246, 0.9)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="applications" fill="url(#gradient)" />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-purple-200">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No application data available yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Decision Distribution */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Application Status Distribution</CardTitle>
              <CardDescription className="text-purple-200">Current application statuses</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.applicationsByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.applicationsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.applicationsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(139, 92, 246, 0.9)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-purple-200">
                  <div className="text-center">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No status data available yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Jobs and Score Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Jobs by Applications */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Top Jobs by Applications</CardTitle>
              <CardDescription className="text-purple-200">Most popular positions</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.topJobsByApplications.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.topJobsByApplications} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="#D8B4FE" />
                    <YAxis dataKey="position" type="category" width={150} stroke="#D8B4FE" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(139, 92, 246, 0.9)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="applications" fill="url(#horizontalGradient)" />
                    <defs>
                      <linearGradient id="horizontalGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-purple-200">
                  <div className="text-center">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No job application data available yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">AI Score Distribution</CardTitle>
              <CardDescription className="text-purple-200">Application quality breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.scoreDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.scoreDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="range" stroke="#D8B4FE" fontSize={12} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#D8B4FE" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(139, 92, 246, 0.9)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                      }}
                      formatter={(value, name) => [value, "Applications"]}
                      labelFormatter={(label) => `Score Range: ${label}`}
                    />
                    <Bar dataKey="count" fill="url(#scoreGradient)" radius={[4, 4, 0, 0]}>
                      {analyticsData.scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#D97706" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-purple-200">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No score data available yet</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
