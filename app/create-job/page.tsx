"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import { X, Copy, CheckCircle, Sparkles, LinkIcon, ExternalLink } from "lucide-react"
import { jobStore } from "@/lib/job-store"
import { JotFormService } from "@/lib/jotform-integration"
import { useTheme } from "next-themes"

export default function CreateJob() {
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [jobId, setJobId] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    experience: "",
    description: "",
  })
  const [copied, setCopied] = useState(false)
  const [jotformId, setJotformId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create job in store
      const newJobId = jobStore.createJob({
        title: formData.title,
        experience: Number.parseInt(formData.experience),
        skills,
        description: formData.description,
      })

      // Create JotForm configuration for this job
      const jotformId = await JotFormService.createJobApplicationForm({
        formId: newJobId,
        jobTitle: formData.title,
        jobId: newJobId,
        companyName: "RecruitAI",
      })

      setJobId(newJobId)
      setJotformId(jotformId)
      setFormSubmitted(true)
    } catch (error) {
      console.error("Error creating job:", error)
      // Handle error appropriately
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async () => {
    const formUrl = `${window.location.origin}/apply/${jobId}`
    await navigator.clipboard.writeText(formUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openJotForm = () => {
    const jotformUrl = JotFormService.generateFormUrl(jotformId, formData.title)
    window.open(jotformUrl, "_blank")
  }

  if (formSubmitted) {
    const formUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/apply/${jobId}`
    const jotformUrl = JotFormService.generateFormUrl(jotformId, formData.title)

    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <CardTitle className={`text-3xl ${isDark ? "text-white" : "text-gray-900"} mb-2`}>
                Job Created Successfully!
              </CardTitle>
              <CardDescription className={`${isDark ? "text-gray-300" : "text-gray-600"} text-lg`}>
                Your job posting has been created and is now live. Share the application link below with potential
                candidates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Label htmlFor="form-url" className="text-white font-medium mb-2 block">
                  Application Page URL
                </Label>
                <div className="flex mt-2">
                  <Input
                    id="form-url"
                    value={formUrl}
                    readOnly
                    className="rounded-r-none bg-white/10 border-white/20 text-white"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="rounded-l-none bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {copied && (
                  <p className="text-green-400 text-sm mt-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Link copied to clipboard!
                  </p>
                )}
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Label className="text-white font-medium mb-2 block">Direct JotForm URL</Label>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Direct link to the JotForm application</span>
                  <Button
                    onClick={openJotForm}
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open Form
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setFormSubmitted(false)}
                  variant="outline"
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                >
                  Create Another Job
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="h-6 w-6 text-purple-300" />
            <h1
              className={`text-3xl font-bold ${isDark ? "bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent" : "text-gray-900"}`}
            >
              Create New Job
            </h1>
          </div>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Fill out the details below to create a new job posting with AI-powered screening.
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">Job Details</CardTitle>
            <CardDescription className="text-purple-200">
              Provide the essential information about the position you're hiring for.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="job-title" className={`${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Job Title
                </Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Senior Frontend Developer"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className={`${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Required Experience (years)
                </Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="20"
                  placeholder="e.g. 3"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className={`${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Required Skills
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Type a skill and press Enter"
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addSkill()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Add
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-1 px-3 py-1"
                      >
                        {skill}
                        <X
                          className="h-3 w-3 cursor-pointer hover:bg-white/20 rounded"
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className={`${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  Job Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={6}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg text-lg py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Job & Form...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Save & Generate Application Link
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
