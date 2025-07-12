'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Question } from '@/lib/types'
import { Shield, Users, MessageSquare, BarChart3, Trash2 } from 'lucide-react'
import UserManagement from '@/components/user-management'

export default function AdminPage() {
  const { userId } = useAuth()
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalAnswers: 0,
    totalUsers: 0,
    totalVotes: 0
  })
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [userRole, setUserRole] = useState('user')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      checkAdminStatus()
      fetchAdminData()
    }
  }, [userId])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/check')
      const data = await response.json()
      setIsAdmin(data.isAdmin)
      setUserRole(data.role || 'user')
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
      setUserRole('user')
    } finally {
      setLoading(false)
    }
  }

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data.stats)
      setRecentQuestions(data.recentQuestions || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return
    
    try {
      await fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE',
      })
      fetchAdminData()
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading-pulse h-8 w-8 rounded-full bg-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="text-center max-w-md">
          <CardContent className="p-8">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don&apos;t have permission to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Badge className="StackIt-gradient text-white">Administrator</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="stats-card card-glow">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalAnswers}</div>
            <div className="text-sm text-muted-foreground">Total Answers</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
            <div className="text-sm text-muted-foreground">Total Votes</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Questions - Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentQuestions.map((question) => (
              <div key={question._id?.toString()} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{question.title}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span>By: {question.authorName}</span>
                    <span>•</span>
                    <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{question.votes} votes</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {question.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/question/${question._id}`, '_blank')}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteQuestion(question._id?.toString() || '')}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <UserManagement currentUserRole={userRole} />
    </div>
  )
}
