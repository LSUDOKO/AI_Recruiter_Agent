"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/dashboard-layout"
import { Search, Download, Eye, Filter } from "lucide-react"
import { useState } from "react"

const mockApplications = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    score: 92,
    decision: "Selected",
    position: "Senior Frontend Developer",
    appliedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    score: 88,
    decision: "Selected",
    position: "Senior Frontend Developer",
    appliedDate: "2024-01-14",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    score: 76,
    decision: "Under Review",
    position: "Senior Frontend Developer",
    appliedDate: "2024-01-13",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    score: 65,
    decision: "Rejected",
    position: "Senior Frontend Developer",
    appliedDate: "2024-01-12",
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    email: "alex.r@email.com",
    score: 84,
    decision: "Selected",
    position: "Product Manager",
    appliedDate: "2024-01-11",
  },
]

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredApplications, setFilteredApplications] = useState(mockApplications)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = mockApplications.filter(
      (app) =>
        app.name.toLowerCase().includes(term.toLowerCase()) ||
        app.email.toLowerCase().includes(term.toLowerCase()) ||
        app.score.toString().includes(term),
    )
    setFilteredApplications(filtered)
  }

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case "Selected":
        return <Badge className="bg-green-100 text-green-800">Selected</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 font-semibold"
    if (score >= 70) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600">Review and manage candidate applications</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or score..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Applications ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Resume Score</TableHead>
                    <TableHead>AI Decision</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.name}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>
                        <span className={getScoreColor(application.score)}>{application.score}%</span>
                      </TableCell>
                      <TableCell>{getDecisionBadge(application.decision)}</TableCell>
                      <TableCell>{application.position}</TableCell>
                      <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Resume
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
