import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Question } from '@/lib/types'
import { MessageSquare, ThumbsUp, User, Clock } from 'lucide-react'

interface QuestionCardProps {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Link 
            href={`/question/${question._id}`}
            className="text-lg font-semibold hover:text-blue-600 transition-colors"
          >
            {question.title}
          </Link>
          <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
            {new Date(question.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div 
          className="text-sm text-muted-foreground line-clamp-2"
          dangerouslySetInnerHTML={{ __html: question.description }}
        />
        
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{question.votes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{question.answers?.length || 0}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{question.authorName}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}