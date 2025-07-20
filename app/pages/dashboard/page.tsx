'use client'

import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  ThumbsUp, 
  Trophy, 
  TrendingUp,
  BookOpen,
  Star,
  Heart,
  Shield
} from 'lucide-react'
import { useUserRole } from '@/hooks/useUserRole'

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { isAdmin, permissions } = useUserRole()
  const [stats, setStats] = useState({
    questionsCount: 0,
    answersCount: 0,
    totalVotes: 0,
    reputation: 0
  })

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setStats({
        questionsCount: 12,
        answersCount: 34,
        totalVotes: 156,
        reputation: 892
      })
    }
  }, [isLoaded, isSignedIn, user])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 dark:border-orange-400 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">You need to be signed in to view your dashboard.</p>
            <Button onClick={() => window.location.href = '/pages/auth'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  Welcome back, {user.firstName || 'Developer'}!
                </h1>
                {isAdmin && (
                  <Badge 
                    variant="destructive" 
                    className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 capitalize self-start sm:self-auto"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-6">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <MessageSquare className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.questionsCount}</div>
              <div className="text-xs sm:text-sm text-gray-600">Questions Asked</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-6">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.answersCount}</div>
              <div className="text-xs sm:text-sm text-gray-600">Answers Given</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-6">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <ThumbsUp className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalVotes}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Votes</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-6">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{stats.reputation}</div>
              <div className="text-xs sm:text-sm text-gray-600">Reputation</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Asked a question</p>
                  <p className="text-sm text-gray-600">How to optimize React components?</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Answer was upvoted</p>
                  <p className="text-sm text-gray-600">Your answer gained 5 upvotes</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/ask'}
                disabled={!permissions.canPostQuestions}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask a Question
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => window.location.href = '/pages/questions'}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Questions
              </Button>
              {isAdmin && (
                <Button 
                  className="w-full justify-start bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800" 
                  variant="outline"
                  onClick={() => window.location.href = '/pages/admin'}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="font-medium">First Question</p>
                    <p className="text-sm text-gray-600">Asked your first question</p>
                  </div>
                </div>
                <Badge variant="secondary">Earned</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium">Helpful Member</p>
                    <p className="text-sm text-gray-600">Received 10 upvotes</p>
                  </div>
                </div>
                <Badge variant="secondary">Earned</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Community Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 dark:from-blue-900/30 to-indigo-50 dark:to-indigo-900/30 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600 mb-1">156</div>
                <div className="text-sm text-gray-600">People helped by your answers</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 dark:from-green-900/30 to-emerald-50 dark:to-emerald-900/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">23</div>
                <div className="text-sm text-gray-600">Solutions marked as accepted</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
