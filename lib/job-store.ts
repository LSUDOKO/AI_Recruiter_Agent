"use client"

interface Job {
  id: string
  title: string
  experience: number
  skills: string[]
  description: string
  createdAt: Date
  status: "Active" | "Closed" | "Draft"
  jotformId?: string
  applicationCount?: number
}

class JobStore {
  private jobs: Map<string, Job> = new Map()
  private listeners: Set<() => void> = new Set()

  // Add listener for real-time updates
  addListener(callback: () => void) {
    this.listeners.add(callback)
  }

  removeListener(callback: () => void) {
    this.listeners.delete(callback)
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback())
  }

  createJob(jobData: Omit<Job, "id" | "createdAt" | "status">): string {
    const id = Math.random().toString(36).substr(2, 9)
    const job: Job = {
      ...jobData,
      id,
      createdAt: new Date(),
      status: "Active",
      applicationCount: 0,
    }
    this.jobs.set(id, job)
    this.notifyListeners()
    return id
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id)
  }

  getAllJobs(): Job[] {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  updateJob(id: string, updates: Partial<Job>): boolean {
    const job = this.jobs.get(id)
    if (job) {
      this.jobs.set(id, { ...job, ...updates })
      this.notifyListeners()
      return true
    }
    return false
  }

  updateApplicationCount(jobId: string, count: number) {
    const job = this.jobs.get(jobId)
    if (job) {
      this.jobs.set(jobId, { ...job, applicationCount: count })
      this.notifyListeners()
    }
  }

  deleteJob(id: string): boolean {
    const deleted = this.jobs.delete(id)
    if (deleted) {
      this.notifyListeners()
    }
    return deleted
  }

  // Get jobs with application counts
  getJobsWithStats(): Job[] {
    return this.getAllJobs()
  }
}

export const jobStore = new JobStore()
export type { Job }
