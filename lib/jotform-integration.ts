interface JotFormConfig {
  formId: string
  jobTitle: string
  jobId: string
  companyName: string
}

interface JotFormField {
  id: string
  title: string
  type: string
  properties?: any
  validations?: any
}

export class JotFormService {
  private static readonly JOTFORM_BASE_URL = "https://form.jotform.com"
  private static readonly JOTFORM_EMBED_BASE = "https://form.jotform.com"

  // Your provided JotForm URL
  private static readonly DEFAULT_FORM_ID = "251661567356060"

  static generateFormUrl(formId: string = this.DEFAULT_FORM_ID, jobTitle?: string, companyName = "RecruitAI"): string {
    // Add query parameters to pre-populate or track the form
    const params = new URLSearchParams()

    if (jobTitle) {
      params.set("job_title", jobTitle)
    }
    if (companyName) {
      params.set("company", companyName)
    }
    params.set("source", "recruitai_platform")

    const queryString = params.toString()
    return `${this.JOTFORM_BASE_URL}/${formId}${queryString ? `?${queryString}` : ""}`
  }

  static getEmbedUrl(formId: string = this.DEFAULT_FORM_ID, jobTitle?: string, companyName = "RecruitAI"): string {
    const params = new URLSearchParams()

    if (jobTitle) {
      params.set("job_title", jobTitle)
    }
    if (companyName) {
      params.set("company", companyName)
    }
    params.set("source", "recruitai_platform")

    const queryString = params.toString()
    return `${this.JOTFORM_EMBED_BASE}/${formId}${queryString ? `?${queryString}` : ""}`
  }

  static getEmbedCode(formId: string = this.DEFAULT_FORM_ID, height = 600): string {
    return `<iframe
      id="JotFormIFrame-${formId}"
      title="Application Form"
      onload="window.parent.scrollTo(0,0)"
      allowtransparency="true"
      allowfullscreen="true"
      allow="geolocation; microphone; camera"
      src="${this.getEmbedUrl(formId)}"
      frameborder="0"
      style="min-width:100%;max-width:100%;height:${height}px;border:none;"
      scrolling="no">
    </iframe>`
  }

  // Create a job-specific form configuration (for future use if you want to create dynamic forms)
  static async createJobApplicationForm(config: JotFormConfig): Promise<string> {
    // For now, we'll use the default form ID you provided
    // In the future, this could create dynamic forms via JotForm API

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return the default form ID for now
    return this.DEFAULT_FORM_ID
  }

  static getFormFields(): JotFormField[] {
    // Based on your form screenshot, these are the fields
    return [
      {
        id: "first_name",
        title: "First Name",
        type: "text",
        validations: { required: true },
      },
      {
        id: "last_name",
        title: "Last Name",
        type: "text",
        validations: { required: true },
      },
      {
        id: "email",
        title: "Email",
        type: "email",
        validations: { required: true },
      },
      {
        id: "resume",
        title: "Resume",
        type: "file",
        validations: { required: true },
        properties: {
          accept: ".pdf,.doc,.docx",
          description: "Upload your resume (PDF, DOC, or DOCX)",
        },
      },
    ]
  }

  // Helper method to check if we should show embedded form or redirect
  static shouldEmbedForm(): boolean {
    // You can configure this based on your preferences
    return true // Set to false if you prefer redirecting to JotForm
  }

  // Get form analytics URL (if you have JotForm premium)
  static getAnalyticsUrl(formId: string = this.DEFAULT_FORM_ID): string {
    return `https://www.jotform.com/analytics/${formId}`
  }

  // Get form submissions URL (if you have access)
  static getSubmissionsUrl(formId: string = this.DEFAULT_FORM_ID): string {
    return `https://www.jotform.com/tables/${formId}`
  }
}

export type { JotFormConfig, JotFormField }
