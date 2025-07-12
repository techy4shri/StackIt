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
    <Card className="question-card-hover card-glow border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Stats Column */}
          <div className="flex sm:flex-col items-center justify-center sm:justify-start space-x-3 sm:space-x-0 sm:space-y-3 text-sm text-muted-foreground min-w-0 sm:min-w-[80px]">
            <div className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-b from-muted/50 to-muted/20">
              <span className="font-bold text-base sm:text-lg text-foreground">{question.votes || 0}</span>
              <span className="text-xs font-medium">votes</span>
            </div>
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
              
              {/* Random activity badge for demo */}
              {Math.random() > 0.7 && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-600 bg-green-50 font-medium flex-shrink-0">
                  🔥 Active
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
