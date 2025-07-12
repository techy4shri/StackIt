'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Answer, Comment } from '@/lib/types'
import { Check, User, MessageSquare, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { sendMentionNotifications } from '@/lib/mentions'
import VotingButtons from '@/components/voting-buttons'

interface AnswerCardProps {
  answer: Answer
  questionAuthorId: string
  onAccept: (answerId: string) => void
}

export default function AnswerCard({ 
  answer, 
  questionAuthorId, 
  onAccept 
}: AnswerCardProps) {
  const { userId } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/answers/${answer._id}/comments`)
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }, [answer._id])

  useEffect(() => {
    if (showComments) {
      fetchComments()
    }
  }, [showComments, fetchComments])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim() || !userId || isSubmittingComment) return

    setIsSubmittingComment(true)
    
    try {
      const response = await fetch(`/api/answers/${answer._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      })

      if (response.ok) {
        setNewComment('')
        fetchComments()
        // Send mention notifications
        await sendMentionNotifications(newComment.trim(), 'comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleAccept = () => {
    if (userId === questionAuthorId) {
      onAccept(answer._id?.toString() || '')
    }
  }

  return (
    <Card className={`${answer.isAccepted ? 'border-green-500 bg-green-50' : ''}`} style={!answer.isAccepted ? { backgroundColor: '#FFFBF9' } : undefined}>
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
          <div className="flex items-center space-x-4">
            <VotingButtons
              targetId={answer._id?.toString() || ''}
              targetType="answer"
              initialVotes={answer.votes || 0}
              size="sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="text-muted-foreground hover:text-foreground"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {comments.length > 0 ? `${comments.length} Comments` : 'Add Comment'}
            </Button>
            
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
        </div>
        
        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {/* Existing Comments */}
            {comments.map((comment) => (
              <div key={comment._id?.toString()} className="flex space-x-3 text-sm">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{comment.authorName}</span>
                    <span className="text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
            
            {/* Add Comment Form */}
            {userId && (
              <form onSubmit={handleSubmitComment} className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || isSubmittingComment}
                  className="StackIt-gradient text-white"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}