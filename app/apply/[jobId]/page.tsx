"use client"

import { Brain, CheckCircle, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { jobStore, type Job } from "@/lib/job-store"
import { useParams } from "next/navigation"
import { JotFormEmbed } from "@/components/jotform-embed"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApplicantForm() {
  const params = useParams()
  const jobId = params.jobId as string
  const [submitted, setSubmitted] = useState(false)
  const [job, setJob] = useState<Job | null>(null)

  useEffect(() => {
    if (jobId) {
      const foundJob = jobStore.getJob(jobId)
      setJob(foundJob || null)
    }
  }, [jobId])

  const handleFormSubmit = (data: any) => {
    console.log("Application submitted:", data)
    setSubmitted(true)
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20 backdrop-blur-3xl"></div>
        <Card className="w-full max-w-md text-center bg-white/10 backdrop-blur-sm border-white/20 relative z-10">
          <CardHeader>
            <CardTitle className="text-white">Job Not Found</CardTitle>
            <CardDescription className="text-purple-200">
              The job posting you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20 backdrop-blur-3xl"></div>
        <Card className="w-full max-w-md text-center bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl relative z-10 animate-fade-in">
          <CardHeader>
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Application Submitted!</CardTitle>
            <CardDescription className="text-purple-200 text-lg">
              Thank you for your application. Our AI will review your information and get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm text-purple-200 flex items-center justify-center">
                <Sparkles className="h-4 w-4 mr-2" />
                You should receive a confirmation email shortly with next steps.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20 backdrop-blur-3xl"></div>
      <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              RecruitAI
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Apply for Position
          </h1>
          <p className="text-2xl text-purple-200 font-medium">{job.title}</p>

          {/* Job Details Card */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-purple-200 text-sm mb-1">
                  <strong className="text-white">Experience Required:</strong>
                </p>
                <p className="text-white">{job.experience} years</p>
              </div>

              {job.skills.length > 0 && (
                <div>
                  <p className="text-purple-200 text-sm mb-2">
                    <strong className="text-white">Required Skills:</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="text-purple-300 text-xs px-2 py-1">+{job.skills.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {job.description && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-purple-200 text-sm mb-2">
                  <strong className="text-white">About this role:</strong>
                </p>
                <p className="text-purple-200 text-sm leading-relaxed">
                  {job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* JotForm Integration */}
        <JotFormEmbed jobTitle={job.title} companyName="RecruitAI" onSubmit={handleFormSubmit} embedHeight={800} />
      </div>
    </div>
  )
}
