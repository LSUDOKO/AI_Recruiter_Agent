interface TypeformConfig {
  formId: string
  jobTitle: string
  jobId: string
  companyName: string
}

interface TypeformField {
  id: string
  title: string
  type: string
  properties?: any
  validations?: any
}

export class TypeformService {
  private static readonly TYPEFORM_API_BASE = "https://api.typeform.com"
  private static readonly TYPEFORM_EMBED_BASE = "https://form.typeform.com/to"

  // In a real app, this would be stored securely
  private static readonly API_TOKEN = process.env.NEXT_PUBLIC_TYPEFORM_TOKEN || "demo-token"

  static async createJobApplicationForm(config: TypeformConfig): Promise<string> {
    // In a real implementation, this would create a form via Typeform API
    // For demo purposes, we'll simulate the form creation and return a demo form ID

    const formFields: TypeformField[] = [
      {
        id: "name",
        title: "What is your full name?",
        type: "short_text",
        properties: {
          description: `We're excited to learn more about you for the ${config.jobTitle} position!`,
        },
        validations: {
          required: true,
        },
      },
      {
        id: "email",
        title: "What is your email address?",
        type: "email",
        properties: {
          description: "We'll use this to contact you about your application.",
        },
        validations: {
          required: true,
        },
      },
      {
        id: "resume",
        title: "Please upload your resume (PDF format)",
        type: "file_upload",
        properties: {
          description: "Upload your most recent resume in PDF format.",
          allow_multiple_selection: false,
          allow_only_one_file: true,
        },
        validations: {
          required: true,
        },
      },
      {
        id: "linkedin",
        title: "LinkedIn Profile (Optional)",
        type: "website",
        properties: {
          description: "Share your LinkedIn profile URL if you have one.",
        },
        validations: {
          required: false,
        },
      },
      {
        id: "github",
        title: "GitHub Profile (Optional)",
        type: "website",
        properties: {
          description: "Share your GitHub profile URL if you have one (especially relevant for technical roles).",
        },
        validations: {
          required: false,
        },
      },
      {
        id: "cover_letter",
        title: "Tell us why you're interested in this position",
        type: "long_text",
        properties: {
          description: "Share what excites you about this role and why you'd be a great fit.",
        },
        validations: {
          required: false,
        },
      },
    ]

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, return a demo form ID
    // In production, this would be the actual form ID returned from Typeform API
    return this.generateDemoFormId(config.jobId)
  }

  static generateFormUrl(formId: string, jobTitle: string, companyName = "RecruitAI"): string {
    // Add hidden fields to pre-populate form context
    const params = new URLSearchParams({
      job_title: jobTitle,
      company: companyName,
      source: "recruitai_platform",
    })

    return `${this.TYPEFORM_EMBED_BASE}/${formId}?${params.toString()}`
  }

  static getEmbedUrl(formId: string, jobTitle: string, companyName = "RecruitAI"): string {
    const params = new URLSearchParams({
      job_title: jobTitle,
      company: companyName,
      source: "recruitai_platform",
      embed_type: "popup",
      hide_headers: "true",
      hide_footer: "true",
    })

    return `${this.TYPEFORM_EMBED_BASE}/${formId}?${params.toString()}`
  }

  private static generateDemoFormId(jobId: string): string {
    // Generate a consistent demo form ID based on job ID
    // In production, this would be the actual Typeform form ID
    return `demo-${jobId}-form`
  }

  static isDemoForm(formId: string): boolean {
    return formId.startsWith("demo-")
  }

  // Demo form configuration for development
  static getDemoFormConfig(jobTitle: string) {
    return {
      title: `Apply for ${jobTitle}`,
      description: "We're excited to learn more about you! Please fill out this application form.",
      fields: [
        {
          id: "name",
          label: "Full Name",
          type: "text",
          required: true,
          placeholder: "Enter your full name",
        },
        {
          id: "email",
          label: "Email Address",
          type: "email",
          required: true,
          placeholder: "your.email@example.com",
        },
        {
          id: "resume",
          label: "Resume (PDF)",
          type: "file",
          required: true,
          accept: ".pdf",
          description: "Please upload your resume in PDF format",
        },
        {
          id: "linkedin",
          label: "LinkedIn Profile",
          type: "url",
          required: false,
          placeholder: "https://linkedin.com/in/yourprofile",
        },
        {
          id: "github",
          label: "GitHub Profile",
          type: "url",
          required: false,
          placeholder: "https://github.com/yourusername",
        },
        {
          id: "cover_letter",
          label: "Why are you interested in this position?",
          type: "textarea",
          required: false,
          placeholder: "Tell us what excites you about this role...",
        },
      ],
    }
  }
}

export type { TypeformConfig, TypeformField }
