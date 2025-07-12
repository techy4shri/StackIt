'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Trash2, 
  Eye, 
  Search,
  Users,
  MessageSquare,
  AlertTriangle,
  BarChart3
} from 'lucide-react'

interface AdminPanelProps {
  className?: string
}

export default function AdminPanel({ className }: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mock data - in real app, this would come from API
  const stats = {
    totalUsers: 1247,
    totalQuestions: 3456,
    totalAnswers: 7891,
    reportedContent: 23
  }

  const recentReports = [
    {
      id: 1,
      type: 'question',
      title: 'How to hack into systems?',
      reporter: 'user123',
      reason: 'Inappropriate content',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'answer',
      title: 'Answer contains spam links',
      reporter: 'dev456',
      reason: 'Spam',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      type: 'comment',
      title: 'Offensive language in comment',
      reporter: 'coder789',
      reason: 'Harassment',
      timestamp: '1 day ago'
    }
  ]

  const handleDeleteContent = (id: number, type: string) => {
    // In real app, make API call to delete content
    console.log(`Deleting ${type} with id: ${id}`)
    alert(`${type} deleted successfully`)
  }

  const handleApproveContent = (id: number) => {
    // In real app, make API call to approve content
    console.log(`Approving content with id: ${id}`)
    alert('Content approved')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Admin Header */}
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-red-600" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Manage and moderate StackIt content</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{stats.totalQuestions.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{stats.totalAnswers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Answers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{stats.reportedContent}</div>
            <div className="text-sm text-muted-foreground">Reports Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Moderation */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Content Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Content Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search questions, answers, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All Questions
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Recent Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {report.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{report.timestamp}</span>
                </div>
                <p className="font-medium text-sm">{report.title}</p>
                <p className="text-xs text-muted-foreground">
                  Reported by {report.reporter} for: {report.reason}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteContent(report.id, report.type)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleApproveContent(report.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <MessageSquare className="h-6 w-6 mb-2" />
              <span>Review Questions</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Shield className="h-6 w-6 mb-2" />
              <span>Security Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
