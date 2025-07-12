'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Answer } from '@/lib/types'
import { ThumbsUp, ThumbsDown, Check, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface AnswerCardProps {
  answer: Answer
  questionAuthorId: string
  onVote: (answerId: string, voteType: 'up' | 'down') => void
  onAccept: (answerId: string) => void
}

export default function AnswerCard({ 
  answer, 
  questionAuthorId, 
  onVote, 
  onAccept 
}: AnswerCardProps) {
  const { userId } = useAuth()
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!userId || isVoting) return
    
    setIsVoting(true)
    try {
      await onVote(answer._id?.toString() || '', voteType)
    } finally {
      setIsVoting(false)
    }
  }

  const handleAccept = () => {
    if (userId === questionAuthorId) {
      onAccept(answer._id?.toString() || '')
    }
  }

  return (
    <Card className={`${answer.isAccepted ? 'border-green-500 bg-green-50' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="font-medium">{answer.authorName}</span>
            {answer.isAccepted && (
              <Badge className="bg-green-500">
                <Check className="h-3 w-3 mr-1" />
                Accepted
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(answer.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: answer.content }}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote('up')}
              disabled={!userId || isVoting}
              className="flex items-center space-x-1"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{answer.votes}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote('down')}
              disabled={!userId || isVoting}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
          
          {userId === questionAuthorId && !answer.isAccepted && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAccept}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <Check className="h-4 w-4 mr-1" />
              Accept Answer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}