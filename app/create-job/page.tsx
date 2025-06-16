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
import { X, Copy, CheckCircle } from "lucide-react"

export default function CreateJob() {
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formUrl] = useState("https://recruitai.com/apply/job-12345")

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formUrl)
  }

  if (formSubmitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Job Created Successfully!</CardTitle>
              <CardDescription>
                Your job posting has been created and is now live. Share the form link below with potential candidates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="form-url">Application Form URL</Label>
                <div className="flex mt-2">
                  <Input id="form-url" value={formUrl} readOnly className="rounded-r-none" />
                  <Button onClick={copyToClipboard} className="rounded-l-none bg-blue-600 hover:bg-blue-700">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button onClick={() => setFormSubmitted(false)} variant="outline" className="flex-1">
                  Create Another Job
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">View Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
          <p className="text-gray-600">Fill out the details below to create a new job posting.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Provide the essential information about the position you're hiring for.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input id="job-title" placeholder="e.g. Senior Frontend Developer" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Required Experience (years)</Label>
                <Input id="experience" type="number" min="0" max="20" placeholder="e.g. 3" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <div className="flex space-x-2">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Type a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addSkill()
                      }
                    }}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Add
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Save & Generate Form Link
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
