'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Question } from '@/lib/types'
import { User, Clock, Trash2 } from 'lucide-react'
import { useUserRole } from '@/hooks/useUserRole'
import VotingButtons from '@/components/voting-buttons'

interface QuestionCardProps {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const { isAdmin } = useUserRole()
  
  const timeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'just now'
  }

  // Get answer count - it could be an array or a number
  const answerCount = Array.isArray(question.answers) ? question.answers.length : (question.answers || 0)

  return (
    <Card className="question-card-hover card-glow border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Voting Column */}
          <div className="flex items-start">
            <VotingButtons
              targetId={question._id?.toString() || ''}
              targetType="question"
              initialVotes={question.votes || 0}
              size="md"
            />
          </div>

          {/* Stats Column */}
          <div className="flex flex-col items-center space-y-3 text-sm text-muted-foreground min-w-[80px]">
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-b from-green-50 to-green-100/20">
              <span className="font-bold text-base sm:text-lg text-green-700">{answerCount}</span>
              <span className="text-xs font-medium text-green-600">answers</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100/20">
              <span className="font-bold text-base sm:text-lg text-blue-700">{Math.floor(Math.random() * 100)}</span>
              <span className="text-xs font-medium text-blue-600">views</span>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1 space-y-3 min-w-0">
            {/* Title */}
            <Link 
              href={`/question/${question._id}`}
              className="text-base sm:text-lg font-medium text-foreground hover:text-primary transition-colors line-clamp-2 block"
            >
              {question.title}
            </Link>
            
            {/* Description Preview */}
            <div 
              className="text-sm text-muted-foreground line-clamp-2"
              dangerouslySetInnerHTML={{ 
                __html: question.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || ''
              }}
            />
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {question.tags?.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="tag-modern text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border-blue-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Author and Time */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between pt-2 gap-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{question.authorName || 'Anonymous'}</span>
                <span className="hidden xs:inline">•</span>
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{timeAgo(question.createdAt)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Random activity badge for demo */}
                {Math.random() > 0.7 && (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-600 bg-green-50 font-medium">
                    🔥 Active
                  </Badge>
                )}
                
                {/* Admin Controls */}
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 px-2 text-xs"
                    onClick={(e) => {
                      e.preventDefault()
                      if (confirm('Are you sure you want to delete this question?')) {
                        // In real app, make API call to delete question
                        alert('Question deleted by admin')
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
