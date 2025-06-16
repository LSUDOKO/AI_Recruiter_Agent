"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JotFormService } from "@/lib/jotform-integration"
import { FileText, ExternalLink, User, Mail, Upload, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

interface JotFormEmbedProps {
  formId?: string
  jobTitle: string
  companyName?: string
  onSubmit?: (data: any) => void
  embedHeight?: number
}

export function JotFormEmbed({
  formId,
  jobTitle,
  companyName = "RecruitAI",
  onSubmit,
  embedHeight = 700,
}: JotFormEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showEmbed, setShowEmbed] = useState(JotFormService.shouldEmbedForm())
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const openJotForm = () => {
    const url = JotFormService.generateFormUrl(formId, jobTitle, companyName)
    window.open(url, "_blank", "width=900,height=700,scrollbars=yes,resizable=yes")
  }

  const formUrl = JotFormService.getEmbedUrl(formId, jobTitle, companyName)
  const formFields = JotFormService.getFormFields()

  if (!showEmbed) {
    // Show redirect option instead of embed
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-fit mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-white text-2xl">Apply for {jobTitle}</CardTitle>
          <CardDescription className="text-purple-200 text-lg">
            Complete our secure application form to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">What you'll need to provide:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {formFields.map((field) => (
                <div key={field.id} className="flex items-center text-purple-200">
                  {field.type === "text" && <User className="h-4 w-4 mr-2" />}
                  {field.type === "email" && <Mail className="h-4 w-4 mr-2" />}
                  {field.type === "file" && <Upload className="h-4 w-4 mr-2" />}
                  <span>{field.title}</span>
                  {field.validations?.required && <span className="text-red-400 ml-1">*</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={openJotForm}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg text-lg py-3"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Open Application Form
            </Button>

            <Button
              onClick={() => setShowEmbed(true)}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Show Form Here Instead
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className={`${isDark ? "text-white" : "text-gray-900"} text-xl`}>
                Apply for {jobTitle}
              </CardTitle>
              <CardDescription className={`${isDark ? "text-purple-200" : "text-gray-600"}`}>
                Fill out the form below to submit your application
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={openJotForm}
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10 bg-white/5"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Open in New Tab
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-96 bg-white/5 rounded-xl border border-white/20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className={`${isDark ? "text-purple-200" : "text-gray-600"}`}>Loading application form...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl border border-white/20 overflow-hidden">
            <iframe
              src={formUrl}
              width="100%"
              height={embedHeight}
              frameBorder="0"
              scrolling="auto"
              title={`Application form for ${jobTitle}`}
              className="w-full"
              style={{ minHeight: `${embedHeight}px` }}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        )}

        <div className="mt-4 text-center">
          <p className={`${isDark ? "text-purple-300" : "text-gray-500"} text-sm`}>
            Powered by JotForm • Your information is secure and encrypted
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
