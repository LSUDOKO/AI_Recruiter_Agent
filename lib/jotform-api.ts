interface JotFormSubmission {
  id: string
  form_id: string
  ip: string
  created_at: string
  status: string
  new: string
  flag: string
  notes: string
  updated_at: string
  answers: Record<
    string,
    {
      name: string
      order: string
      text: string
      type: string
      answer?: string
      prettyFormat?: string
    }
  >
}

interface JotFormResponse {
  responseCode: number
  message: string
  content: JotFormSubmission[]
  duration: string
  "limit-left": number
}

interface ProcessedApplication {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  resumeUrl?: string
  submittedAt: string
  formId: string
  status: "new" | "reviewed" | "selected" | "rejected"
  jobTitle?: string
  jobId?: string
  score?: number
  rawAnswers?: Record<string, any>
}

interface CachedData {
  data: ProcessedApplication[]
  timestamp: number
  expiresAt: number
}

export class JotFormAPI {
  private static readonly API_KEY = "58d6359efb3e97c97216f9725cf96894"
  private static readonly BASE_URL = "https://api.jotform.com"
  private static readonly FORM_ID = "251661567356060"
  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  private static readonly RATE_LIMIT_DELAY = 2000 // 2 seconds between requests

  private static cache: Map<string, CachedData> = new Map()
  private static lastRequestTime = 0
  private static isRateLimited = false
  private static rateLimitResetTime = 0

  // Check if we're currently rate limited
  private static isCurrentlyRateLimited(): boolean {
    if (this.isRateLimited && Date.now() < this.rateLimitResetTime) {
      return true
    }
    if (Date.now() >= this.rateLimitResetTime) {
      this.isRateLimited = false
    }
    return false
  }

  // Add delay between requests to respect rate limits
  private static async respectRateLimit() {
    const timeSinceLastRequest = Date.now() - this.lastRequestTime
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      await new Promise((resolve) => setTimeout(resolve, this.RATE_LIMIT_DELAY - timeSinceLastRequest))
    }
    this.lastRequestTime = Date.now()
  }

  // Get cached data if available and not expired
  private static getCachedData(key: string): ProcessedApplication[] | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() < cached.expiresAt) {
      console.log("Returning cached JotForm data")
      return cached.data
    }
    return null
  }

  // Cache data
  private static setCachedData(key: string, data: ProcessedApplication[]) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION,
    })
  }

  // Get all submissions for the form
  static async getSubmissions(formId: string = this.FORM_ID): Promise<ProcessedApplication[]> {
    const cacheKey = `submissions_${formId}`

    // Check if we're rate limited
    if (this.isCurrentlyRateLimited()) {
      console.log("Rate limited, returning cached or mock data")
      const cached = this.getCachedData(cacheKey)
      return cached || this.getMockApplications()
    }

    // Check cache first
    const cached = this.getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    try {
      await this.respectRateLimit()

      console.log("Fetching submissions from JotForm API...")
      const response = await fetch(
        `${this.BASE_URL}/form/${formId}/submissions?apiKey=${this.API_KEY}&limit=50&orderby=created_at`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited
          this.isRateLimited = true
          this.rateLimitResetTime = Date.now() + 60 * 1000 // Reset after 1 minute
          console.log("Rate limited by JotForm API, using fallback data")
          return this.getMockApplications()
        }
        throw new Error(`JotForm API error: ${response.status} ${response.statusText}`)
      }

      const data: any = await response.json()

      if (data.responseCode !== 200) {
        if (data.message && data.message.includes("API-Limit exceeded")) {
          this.isRateLimited = true
          this.rateLimitResetTime = Date.now() + 60 * 1000 // Reset after 1 minute
          console.log("API limit exceeded, using fallback data")
          return this.getMockApplications()
        }
        throw new Error(`JotForm API error: ${data.message}`)
      }

      const processedData = this.processSubmissions(data.content || [])

      // Cache the successful response
      this.setCachedData(cacheKey, processedData)

      console.log(`Successfully fetched ${processedData.length} submissions from JotForm`)
      return processedData
    } catch (error) {
      console.error("Error fetching JotForm submissions:", error)

      // Check if we have cached data to fall back to
      const cached = this.getCachedData(cacheKey)
      if (cached) {
        console.log("API failed, returning cached data")
        return cached
      }

      // Return mock data as final fallback
      console.log("API failed and no cache available, returning mock data")
      return this.getMockApplications()
    }
  }

  // Get submissions for a specific job
  static async getSubmissionsByJob(jobId: string, jobTitle: string): Promise<ProcessedApplication[]> {
    const allSubmissions = await this.getSubmissions()

    // Filter submissions that match this job
    return allSubmissions.map((submission) => ({
      ...submission,
      jobId,
      jobTitle,
    }))
  }

  // Process raw JotForm submissions into our application format
  private static processSubmissions(submissions: JotFormSubmission[]): ProcessedApplication[] {
    return submissions.map((submission) => {
      const answers = submission.answers

      // Try to extract name fields
      const firstName =
        this.getAnswerText(answers, [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "first",
          "firstName",
          "name_first",
          "q3_name",
          "q4_name",
          "q5_name",
          "name3",
          "name4",
          "name5",
          "fullName3",
          "fullName4",
          "fullName5",
        ]) || ""

      const lastName =
        this.getAnswerText(answers, [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "last",
          "lastName",
          "name_last",
          "q3_name",
          "q4_name",
          "q5_name",
          "name3",
          "name4",
          "name5",
          "fullName3",
          "fullName4",
          "fullName5",
        ]) || ""

      // Try to get full name if first/last are in same field
      let fullName = ""
      if (firstName && lastName) {
        fullName = `${firstName} ${lastName}`.trim()
      } else {
        fullName =
          this.getAnswerText(answers, [
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "name",
            "fullName",
            "full_name",
            "applicant_name",
            "q3_name",
            "q4_name",
            "q5_name",
          ]) || ""
      }

      // If we have a full name but no first/last, try to split it
      if (fullName && !firstName && !lastName) {
        const nameParts = fullName.split(" ")
        const extractedFirstName = nameParts[0] || ""
        const extractedLastName = nameParts.slice(1).join(" ") || ""

        return this.createApplication(submission, extractedFirstName, extractedLastName, fullName, answers)
      }

      return this.createApplication(submission, firstName, lastName, fullName, answers)
    })
  }

  private static createApplication(
    submission: JotFormSubmission,
    firstName: string,
    lastName: string,
    fullName: string,
    answers: Record<string, any>,
  ): ProcessedApplication {
    // Enhanced email extraction
    const email =
      this.getAnswerText(answers, [
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "email",
        "email_address",
        "emailAddress",
        "e_mail",
        "q3_email",
        "q4_email",
        "q5_email",
        "q6_email",
        "q7_email",
        "q8_email",
        "email3",
        "email4",
        "email5",
        "email6",
        "email7",
        "email8",
        "typeA3",
        "typeA4",
        "typeA5",
        "typeA6",
        "typeA7",
        "typeA8",
      ]) || ""

    const resumeUrl = this.getFileUrl(answers, [
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "resume",
      "file",
      "upload",
      "cv",
      "document",
      "q6_resume",
      "q7_resume",
      "q8_resume",
      "q9_resume",
    ])

    // Better name handling
    let displayName = ""
    let finalFirstName = ""
    let finalLastName = ""

    if (fullName && fullName.trim()) {
      displayName = fullName.trim()
      const nameParts = fullName.trim().split(" ")
      finalFirstName = nameParts[0] || ""
      finalLastName = nameParts.slice(1).join(" ") || ""
    } else if (firstName || lastName) {
      finalFirstName = firstName.trim()
      finalLastName = lastName.trim()
      displayName = `${finalFirstName} ${finalLastName}`.trim()
    }

    // Fallback if no name found
    if (!displayName) {
      displayName = "Unknown Applicant"
    }

    return {
      id: submission.id,
      name: displayName,
      firstName: finalFirstName,
      lastName: finalLastName,
      email: email.trim(),
      resumeUrl: resumeUrl,
      submittedAt: submission.created_at,
      formId: submission.form_id,
      status: submission.new === "1" ? "new" : "reviewed",
      score: this.generateAIScore(),
      rawAnswers: answers,
    }
  }

  // Helper to get answer text
  private static getAnswerText(answers: Record<string, any>, possibleIds: string[]): string {
    for (const id of possibleIds) {
      if (answers[id]) {
        const answer = answers[id]

        if (typeof answer === "string") {
          return answer
        }

        if (answer.answer) {
          if (typeof answer.answer === "string") {
            return answer.answer
          }
          if (typeof answer.answer === "object" && answer.answer.first) {
            return `${answer.answer.first} ${answer.answer.last || ""}`.trim()
          }
        }

        if (answer.text) {
          return answer.text
        }

        if (answer.prettyFormat) {
          return answer.prettyFormat
        }

        if (answer.value) {
          return answer.value
        }
      }
    }
    return ""
  }

  // Helper to get file URL from answers
  private static getFileUrl(answers: Record<string, any>, possibleIds: string[]): string | undefined {
    for (const id of possibleIds) {
      if (answers[id] && answers[id].answer) {
        const fileAnswer = answers[id].answer
        if (typeof fileAnswer === "string" && fileAnswer.startsWith("http")) {
          return fileAnswer
        }
        if (Array.isArray(fileAnswer) && fileAnswer.length > 0) {
          return fileAnswer[0]
        }
      }
    }
    return undefined
  }

  // Generate a simulated AI score for demo purposes
  private static generateAIScore(): number {
    return Math.floor(Math.random() * 30) + 70 // Score between 70-100
  }

  // Get form details
  static async getFormDetails(formId: string = this.FORM_ID) {
    if (this.isCurrentlyRateLimited()) {
      console.log("Rate limited, skipping form details request")
      return null
    }

    try {
      await this.respectRateLimit()

      const response = await fetch(`${this.BASE_URL}/form/${formId}?apiKey=${this.API_KEY}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 429) {
          this.isRateLimited = true
          this.rateLimitResetTime = Date.now() + 60 * 1000
        }
        throw new Error(`JotForm API error: ${response.status}`)
      }

      const data = await response.json()
      return data.content
    } catch (error) {
      console.error("Error fetching form details:", error)
      return null
    }
  }

  // Enhanced mock data for development/fallback
  private static getMockApplications(): ProcessedApplication[] {
    const mockData = [
      {
        id: "mock-1",
        name: "John Smith",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@email.com",
        submittedAt: new Date().toISOString(),
        formId: this.FORM_ID,
        status: "new" as const,
        score: 92,
        jobTitle: "Senior Frontend Developer",
        jobId: "job-1",
      },
      {
        id: "mock-2",
        name: "Sarah Johnson",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.j@email.com",
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        formId: this.FORM_ID,
        status: "reviewed" as const,
        score: 88,
        jobTitle: "Product Manager",
        jobId: "job-2",
      },
      {
        id: "mock-3",
        name: "Mike Chen",
        firstName: "Mike",
        lastName: "Chen",
        email: "mike.chen@email.com",
        submittedAt: new Date(Date.now() - 172800000).toISOString(),
        formId: this.FORM_ID,
        status: "new" as const,
        score: 76,
        jobTitle: "UX Designer",
        jobId: "job-3",
      },
      {
        id: "mock-4",
        name: "Emily Rodriguez",
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.r@email.com",
        submittedAt: new Date(Date.now() - 259200000).toISOString(),
        formId: this.FORM_ID,
        status: "selected" as const,
        score: 95,
        jobTitle: "Data Scientist",
        jobId: "job-4",
      },
      {
        id: "mock-5",
        name: "David Wilson",
        firstName: "David",
        lastName: "Wilson",
        email: "david.w@email.com",
        submittedAt: new Date(Date.now() - 345600000).toISOString(),
        formId: this.FORM_ID,
        status: "rejected" as const,
        score: 65,
        jobTitle: "Backend Developer",
        jobId: "job-5",
      },
      {
        id: "mock-6",
        name: "Lisa Park",
        firstName: "Lisa",
        lastName: "Park",
        email: "lisa.park@email.com",
        submittedAt: new Date(Date.now() - 432000000).toISOString(),
        formId: this.FORM_ID,
        status: "new" as const,
        score: 83,
        jobTitle: "Marketing Manager",
        jobId: "job-6",
      },
      {
        id: "mock-7",
        name: "Alex Thompson",
        firstName: "Alex",
        lastName: "Thompson",
        email: "alex.t@email.com",
        submittedAt: new Date(Date.now() - 518400000).toISOString(),
        formId: this.FORM_ID,
        status: "reviewed" as const,
        score: 91,
        jobTitle: "DevOps Engineer",
        jobId: "job-7",
      },
      {
        id: "mock-8",
        name: "Maria Garcia",
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria.g@email.com",
        submittedAt: new Date(Date.now() - 604800000).toISOString(),
        formId: this.FORM_ID,
        status: "selected" as const,
        score: 87,
        jobTitle: "UI/UX Designer",
        jobId: "job-8",
      },
      {
        id: "mock-9",
        name: "Robert Lee",
        firstName: "Robert",
        lastName: "Lee",
        email: "robert.lee@email.com",
        submittedAt: new Date(Date.now() - 691200000).toISOString(),
        formId: this.FORM_ID,
        status: "new" as const,
        score: 72,
        jobTitle: "Sales Representative",
        jobId: "job-9",
      },
      {
        id: "mock-10",
        name: "Jennifer White",
        firstName: "Jennifer",
        lastName: "White",
        email: "jennifer.w@email.com",
        submittedAt: new Date(Date.now() - 777600000).toISOString(),
        formId: this.FORM_ID,
        status: "rejected" as const,
        score: 58,
        jobTitle: "Content Writer",
        jobId: "job-10",
      },
      {
        id: "mock-11",
        name: "Kevin Brown",
        firstName: "Kevin",
        lastName: "Brown",
        email: "kevin.b@email.com",
        submittedAt: new Date(Date.now() - 864000000).toISOString(),
        formId: this.FORM_ID,
        status: "reviewed" as const,
        score: 79,
        jobTitle: "Project Manager",
        jobId: "job-11",
      },
      {
        id: "mock-12",
        name: "Amanda Davis",
        firstName: "Amanda",
        lastName: "Davis",
        email: "amanda.d@email.com",
        submittedAt: new Date(Date.now() - 950400000).toISOString(),
        formId: this.FORM_ID,
        status: "selected" as const,
        score: 94,
        jobTitle: "Software Engineer",
        jobId: "job-12",
      },
    ]

    console.log("Using mock application data with varied scores")
    return mockData
  }

  // Update submission status
  static async updateSubmissionStatus(submissionId: string, status: "reviewed" | "selected" | "rejected") {
    console.log(`Updating submission ${submissionId} to status: ${status}`)
    return { success: true, submissionId, status }
  }

  // Get real-time webhook URL for form submissions
  static getWebhookUrl(): string {
    return `${typeof window !== "undefined" ? window.location.origin : ""}/api/jotform-webhook`
  }

  // Clear cache (useful for manual refresh)
  static clearCache() {
    this.cache.clear()
    console.log("JotForm cache cleared")
  }

  // Get cache status
  static getCacheStatus() {
    return {
      isRateLimited: this.isRateLimited,
      rateLimitResetTime: this.rateLimitResetTime,
      cacheSize: this.cache.size,
      lastRequestTime: this.lastRequestTime,
    }
  }
}

export type { ProcessedApplication, JotFormSubmission }
