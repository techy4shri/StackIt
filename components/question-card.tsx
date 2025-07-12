import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Question } from '@/lib/types'
import { User, Clock } from 'lucide-react'

interface QuestionCardProps {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
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
    <Card className="question-card-hover border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Stats Column */}
          <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground min-w-[80px]">
            <div className="flex flex-col items-center">
              <span className="font-medium text-foreground">{question.votes || 0}</span>
              <span className="text-xs">votes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-foreground">{answerCount}</span>
              <span className="text-xs">answers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-foreground">{Math.floor(Math.random() * 100)}</span>
              <span className="text-xs">views</span>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex-1 space-y-3">
            {/* Title */}
            <Link 
              href={`/question/${question._id}`}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
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
            <div className="flex flex-wrap gap-2">
              {question.tags?.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Author and Time */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{question.authorName || 'Anonymous'}</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>{timeAgo(question.createdAt)}</span>
              </div>
              
              {/* Random activity badge for demo */}
              {Math.random() > 0.7 && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                  Active
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
