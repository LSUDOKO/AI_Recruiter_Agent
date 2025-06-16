"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Search,
  Download,
  Eye,
  Filter,
  Sparkles,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Briefcase,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { useState, useEffect } from "react"
import { JotFormAPI, type ProcessedApplication } from "@/lib/jotform-api"
import { jobStore, type Job } from "@/lib/job-store"
import { useTheme } from "next-themes"

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState("")
  const [applications, setApplications] = useState<ProcessedApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<ProcessedApplication[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [apiStatus, setApiStatus] = useState<{
    isRateLimited: boolean
    usingCache: boolean
    usingMockData: boolean
  }>({
    isRateLimited: false,
    usingCache: false,
    usingMockData: false,
  })

  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Fetch applications and jobs
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [submissions, allJobs] = await Promise.all([
        JotFormAPI.getSubmissions(),
        Promise.resolve(jobStore.getAllJobs()),
      ])

      // Check if we're using fallback data
      const cacheStatus = JotFormAPI.getCacheStatus()
      setApiStatus({
        isRateLimited: cacheStatus.isRateLimited,
        usingCache: submissions.length > 0 && submissions[0]?.id?.startsWith("mock"),
        usingMockData: submissions.length > 0 && submissions[0]?.id?.startsWith("mock"),
      })

      // Map applications to jobs
      const applicationsWithJobs = submissions.map((app, index) => {
        // Distribute applications across jobs for demo
        const matchedJob = allJobs[index % allJobs.length] || allJobs[0]
        return {
          ...app,
          jobId: matchedJob?.id,
          jobTitle: matchedJob?.title || app.jobTitle || "General Application",
        }
      })

      setApplications(applicationsWithJobs)
      setJobs(allJobs)
      setLastRefresh(new Date())

      // Update job application counts
      allJobs.forEach((job) => {
        const jobApplications = applicationsWithJobs.filter((app) => app.jobId === job.id)
        jobStore.updateApplicationCount(job.id, jobApplications.length)
      })

      applyFilters(applicationsWithJobs, selectedJob, selectedStatus, searchTerm)
    } catch (error) {
      console.error("Error fetching data:", error)
      // Even if there's an error, we might have gotten mock data
      setApiStatus((prev) => ({ ...prev, usingMockData: true }))
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters
  const applyFilters = (apps: ProcessedApplication[], jobFilter: string, statusFilter: string, search: string) => {
    let filtered = apps

    // Filter by job
    if (jobFilter !== "all") {
      filtered = filtered.filter((app) => app.jobId === jobFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(search.toLowerCase()) ||
          app.email.toLowerCase().includes(search.toLowerCase()) ||
          (app.jobTitle && app.jobTitle.toLowerCase().includes(search.toLowerCase())) ||
          (app.score && app.score.toString().includes(search)),
      )
    }

    setFilteredApplications(filtered)
  }

  // Force refresh (clear cache)
  const forceRefresh = async () => {
    JotFormAPI.clearCache()
    await fetchData()
  }

  // Initial load
  useEffect(() => {
    fetchData()
  }, [])

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFilters(applications, selectedJob, selectedStatus, term)
  }

  // Handle job filter
  const handleJobFilter = (jobId: string) => {
    setSelectedJob(jobId)
    applyFilters(applications, jobId, selectedStatus, searchTerm)
  }

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    applyFilters(applications, selectedJob, status, searchTerm)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selected":
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">Selected</Badge>
      case "rejected":
        return <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">Rejected</Badge>
      case "reviewed":
        return <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">Reviewed</Badge>
      default:
        return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">New</Badge>
    }
  }

  // Get score color
  const getScoreColor = (score?: number) => {
    if (!score) return "text-gray-400"
    if (score >= 85) return "text-green-400 font-bold"
    if (score >= 70) return "text-yellow-400 font-bold"
    return "text-red-400 font-bold"
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Update application status
  const updateStatus = async (id: string, newStatus: "reviewed" | "selected" | "rejected") => {
    try {
      await JotFormAPI.updateSubmissionStatus(id, newStatus)

      // Update local state
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))
      applyFilters(
        applications.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
        selectedJob,
        selectedStatus,
        searchTerm,
      )
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Sparkles className="h-6 w-6 text-purple-300" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Applications
              </h1>
            </div>
            <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {apiStatus.usingMockData ? "Demo data" : "Real-time applications from JotForm"} • Last updated:{" "}
              {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={fetchData}
              disabled={isLoading}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
            {apiStatus.isRateLimited && (
              <Button
                onClick={forceRefresh}
                disabled={isLoading}
                variant="outline"
                className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10"
              >
                <Clock className="h-4 w-4 mr-2" />
                Force Refresh
              </Button>
            )}
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* API Status Alert */}
        {(apiStatus.isRateLimited || apiStatus.usingMockData) && (
          <Alert className="bg-yellow-500/10 border-yellow-500/20 text-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {apiStatus.isRateLimited
                ? "JotForm API rate limit reached. Using cached/demo data. Try refreshing in a few minutes."
                : "Using demo data for development. Connect to JotForm API for real applications."}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {applications.length}
              </div>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Total Applications</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {applications.filter((app) => app.status === "new").length}
              </div>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>New Applications</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {applications.filter((app) => app.status === "selected").length}
              </div>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Selected</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {applications.length > 0
                  ? Math.round(applications.reduce((acc, app) => acc + (app.score || 0), 0) / applications.length)
                  : 0}
                %
              </div>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Avg AI Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                />
              </div>

              <Select value={selectedJob} onValueChange={handleJobFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Filter by Job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={handleStatusFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedJob("all")
                  setSelectedStatus("all")
                  applyFilters(applications, "all", "all", "")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                {apiStatus.usingMockData ? "Demo Applications" : "Live Applications"} ({filteredApplications.length})
                {isLoading && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
              </CardTitle>
              <div className="flex items-center text-purple-200 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                {apiStatus.usingMockData ? "Demo Data" : "Real-time from JotForm"}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && applications.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-300 mx-auto mb-4" />
                <p className="text-purple-200">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-purple-200">No applications found.</p>
                <p className="text-purple-300 text-sm mt-2">
                  {apiStatus.usingMockData
                    ? "This is demo data. Real applications will appear when candidates submit the JotForm."
                    : "Applications will appear here when candidates submit the JotForm."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className={`${isDark ? "text-gray-200" : "text-gray-700"}`}>Applicant Name</TableHead>
                      <TableHead className={`${isDark ? "text-gray-200" : "text-gray-700"}`}>Email</TableHead>
                      <TableHead className={`${isDark ? "text-gray-200" : "text-gray-700"}`}>Applied For</TableHead>
                      <TableHead className={`${isDark ? "text-gray-200" : "text-gray-700"}`}>AI Score</TableHead>
                      <TableHead className={`${isDark ? "text-gray-200" : "text-gray-700"}`}>Status</TableHead>
                      <TableHead className={`${isDark ? "text-gray-200" : "text-gray-700"}`}>Submitted</TableHead>
                      <TableHead className={`${isDark ? "text-gray-200" : "text-gray-700"}`}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                          <div>
                            <div className="font-medium">{application.name}</div>
                            {application.id.startsWith("mock") && (
                              <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Demo Data</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          {application.email}
                        </TableCell>
                        <TableCell className="text-purple-200">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-purple-300" />
                            {application.jobTitle || "General Application"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={getScoreColor(application.score)}>
                            {application.score ? `${application.score}%` : "Pending"}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell className="text-purple-200">{formatDate(application.submittedAt)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {application.resumeUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/30 text-white hover:bg-white/10"
                                onClick={() => window.open(application.resumeUrl, "_blank")}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Resume
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/30 text-white hover:bg-white/10"
                              onClick={() =>
                                window.open(`https://www.jotform.com/submissions/${application.formId}`, "_blank")
                              }
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
