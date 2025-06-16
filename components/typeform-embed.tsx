"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TypeformService } from "@/lib/typeform-integration"
import { FileText, Linkedin, Github, Mail, User, Upload, ExternalLink } from "lucide-react"
import { useState } from "react"

interface TypeformEmbedProps {
  formId: string
  jobTitle: string
  companyName?: string
  onSubmit?: (data: any) => void
}

interface DemoFormData {
  name: string
  email: string
  resume: File | null
  linkedin: string
  github: string
  coverLetter: string
}

export function TypeformEmbed({ formId, jobTitle, companyName = "RecruitAI", onSubmit }: TypeformEmbedProps) {
  const [formData, setFormData] = useState<DemoFormData>({
    name: "",
    email: "",
    resume: null,
    linkedin: "",
    github: "",
    coverLetter: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileName, setFileName] = useState("")

  // Check if this is a demo form or real Typeform
  const isDemoForm = TypeformService.isDemoForm(formId)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }))
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (onSubmit) {
      onSubmit({
        ...formData,
        jobTitle,
        companyName,
        submittedAt: new Date().toISOString(),
      })
    }

    setIsSubmitting(false)
  }

  const openTypeform = () => {
    const url = TypeformService.generateFormUrl(formId, jobTitle, companyName)
    window.open(url, "_blank", "width=800,height=600,scrollbars=yes,resizable=yes")
  }

  if (!isDemoForm) {
    // Real Typeform integration
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-fit mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-white text-2xl">Apply for {jobTitle}</CardTitle>
          <CardDescription className="text-purple-200 text-lg">
            Complete our application form to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
            <p className="text-purple-200 mb-4">
              We use Typeform to provide you with the best application experience. Your information is secure and will
              only be used for this application.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-purple-300">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Personal Info
              </span>
              <span className="flex items-center">
                <Upload className="h-4 w-4 mr-1" />
                Resume Upload
              </span>
              <span className="flex items-center">
                <Linkedin className="h-4 w-4 mr-1" />
                Social Profiles
              </span>
            </div>
          </div>
          <Button
            onClick={openTypeform}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg text-lg px-8 py-3"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Open Application Form
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Demo form for development
  const demoConfig = TypeformService.getDemoFormConfig(jobTitle)

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-xl">{demoConfig.title}</CardTitle>
            <CardDescription className="text-purple-200">{demoConfig.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white flex items-center">
              <User className="h-4 w-4 mr-2" />
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="your.email@example.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume" className="text-white flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Resume (PDF) *
            </Label>
            <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-white/50 transition-colors bg-white/5 backdrop-blur-sm">
              <Upload className="h-8 w-8 text-purple-300 mx-auto mb-3" />
              <div className="text-sm text-purple-200 mb-3">
                {fileName ? (
                  <span className="text-white font-medium flex items-center justify-center">
                    <FileText className="h-4 w-4 mr-2" />
                    {fileName}
                  </span>
                ) : (
                  "Click to upload your resume (PDF format)"
                )}
              </div>
              <input id="resume" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" required />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("resume")?.click()}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Choose File
              </Button>
            </div>
          </div>

          {/* LinkedIn Profile */}
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="text-white flex items-center">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn Profile (Optional)
            </Label>
            <Input
              id="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/in/yourprofile"
              className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
            />
          </div>

          {/* GitHub Profile */}
          <div className="space-y-2">
            <Label htmlFor="github" className="text-white flex items-center">
              <Github className="h-4 w-4 mr-2" />
              GitHub Profile (Optional)
            </Label>
            <Input
              id="github"
              type="url"
              value={formData.github}
              onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
              placeholder="https://github.com/yourusername"
              className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
            />
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="cover-letter" className="text-white">
              Why are you interested in this position?
            </Label>
            <Textarea
              id="cover-letter"
              value={formData.coverLetter}
              onChange={(e) => setFormData((prev) => ({ ...prev, coverLetter: e.target.value }))}
              placeholder="Tell us what excites you about this role and why you'd be a great fit..."
              rows={4}
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
                Submitting Application...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
