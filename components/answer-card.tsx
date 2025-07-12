'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Answer, Comment } from '@/lib/types'
import { Check, User, MessageSquare, Send, Edit2, Save, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { sendMentionNotifications } from '@/lib/mentions'
import VotingButtons from '@/components/voting-buttons'
import RichTextEditor from '@/components/rich-text-editor'
import './answer-card.css'

interface AnswerCardProps {
  answer: Answer
  questionAuthorId: string
  onAccept: (answerId: string) => void
  onUpdate?: () => void
}

export default memo(function AnswerCard({ 
  answer, 
  questionAuthorId, 
  onAccept,
  onUpdate
}: AnswerCardProps) {
  const { userId } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(answer.content)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/answers/${answer._id}/comments`, {
        next: { revalidate: 30 } // Cache for 30 seconds
      })
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

  const handleEditStart = () => {
    setIsEditing(true)
    setEditContent(answer.content)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditContent(answer.content)
  }

  const handleEditSave = async () => {
    if (!editContent.trim() || !userId || isUpdating) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/answers/${answer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent.trim(),
        }),
      })

      if (response.ok) {
        setIsEditing(false)
        onUpdate?.()
      }
    } catch (error) {
      console.error('Error updating answer:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <section className={`answer-card ${answer.isAccepted ? 'answer-card--accepted' : ''}`}>
      <div className={`answer-card__container ${answer.isAccepted ? 'answer-card__container--accepted' : ''}`}>
        
        {/* Header */}
        <div className="answer-card__header">
          <div className="answer-card__author-info">
            <div className="answer-card__author">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="answer-card__author-name">{answer.authorName}</span>
              {answer.isAccepted && (
                <Badge className="bg-green-500 text-xs">
                  <Check className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                  Accepted
                </Badge>
              )}
            </div>
            <span className="answer-card__date">
              {new Date(answer.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="answer-card__content">
          {isEditing ? (
            <div className="answer-card__edit-form">
              <RichTextEditor
                content={editContent}
                onChange={setEditContent}
              />
              <div className="answer-card__edit-buttons">
                <Button
                  size="sm"
                  onClick={handleEditSave}
                  disabled={!editContent.trim() || isUpdating}
                  className="StackIt-gradient text-white text-xs sm:text-sm"
                >
                  <Save className="h-3 w-3 mr-1" />
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleEditCancel}
                  disabled={isUpdating}
                  className="text-xs sm:text-sm"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="answer-card__text"
              dangerouslySetInnerHTML={{ __html: answer.content }}
            />
          )}
          
          {/* Actions */}
          <div className="answer-card__actions">
            <div className="answer-card__voting">
              <VotingButtons
                targetId={answer._id?.toString() || ''}
                targetType="answer"
                initialVotes={answer.votes || 0}
                size="sm"
              />
            </div>
            
            <div className="answer-card__buttons">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
              >
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {comments.length > 0 ? `${comments.length}` : 'Add'}
                <span className="hidden sm:inline ml-1">Comment{comments.length !== 1 ? 's' : ''}</span>
              </Button>
              
              {userId === answer.authorId && !isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditStart}
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
              
              {userId === questionAuthorId && !answer.isAccepted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAccept}
                  className="text-green-600 border-green-600 hover:bg-green-50 text-xs sm:text-sm"
                >
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Accept</span>
                  <span className="sm:hidden">✓</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Comments Section */}
          {showComments && (
            <div className="answer-card__comments">
              {/* Existing Comments */}
              {comments.map((comment) => (
                <div key={comment._id?.toString()} className="answer-card__comment">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="answer-card__comment-content">
                    <div className="answer-card__comment-meta">
                      <span className="font-medium text-xs sm:text-sm">{comment.authorName}</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs sm:text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
              
              {/* Add Comment Form */}
              {userId && (
                <form onSubmit={handleSubmitComment} className="answer-card__comment-form">
                  <Input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 text-xs sm:text-sm"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="StackIt-gradient text-white flex-shrink-0"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
})