'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import RichTextEditor from '@/components/rich-text-editor'
import AnswerCard from '@/components/answer-card'
import { Question, Answer } from '@/lib/types'
import { ThumbsUp, ThumbsDown, User, MessageSquare, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface QuestionPageProps {
  params: Promise<{ id: string }>
}

export default function QuestionPage({ params }: QuestionPageProps) {
  const { isSignedIn, userId } = useAuth()
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [newAnswer, setNewAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [id, setId] = useState<string>('')
  const [submitAttempts, setSubmitAttempts] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [userHasAnswered, setUserHasAnswered] = useState(false)

  useEffect(() => {
    const initParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    initParams()
  }, [params])

  // Load user vote from localStorage
  useEffect(() => {
    if (id) {
      const savedVote = localStorage.getItem(`question_vote_${id}`)
      if (savedVote === 'up' || savedVote === 'down') {
        setUserVote(savedVote)
      }
    }
  }, [id])

  const fetchQuestion = useCallback(async (skipVoteCheck = false) => {
    if (!id) return
    try {
      const response = await fetch(`/api/questions/${id}`, {
        next: { revalidate: 60 } // Cache for 1 minute
      })
      const data = await response.json()
      setQuestion(data.question)
      setAnswers(data.answers || [])
      
      // Check if current user has already answered
      if (isSignedIn && data.answers) {
        const userAnswer = data.answers.find((answer: Answer) => answer.authorId === userId)
        setUserHasAnswered(!!userAnswer)
      }
      
      // Only fetch vote status on initial load or when explicitly requested
      if (isSignedIn && !skipVoteCheck) {
        try {
          const voteResponse = await fetch(`/api/questions/${id}/vote`, {
            next: { revalidate: 300 } // Cache for 5 minutes
          })
          if (voteResponse.ok) {
            const voteData = await voteResponse.json()
            setUserVote(voteData.vote)
            
            // Sync with localStorage
            if (voteData.vote) {
              localStorage.setItem(`question_vote_${id}`, voteData.vote)
            } else {
              localStorage.removeItem(`question_vote_${id}`)
            }
          }
        } catch (voteError) {
          console.error('Error fetching vote status:', voteError)
        }
      }
    } catch (error) {
      console.error('Error fetching question:', error)
    }
  }, [id, isSignedIn, userId])

  useEffect(() => {
    fetchQuestion()
  }, [fetchQuestion])

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newAnswer.trim() || !isSignedIn || !id) return

    // Check if user already has an answer
    if (userHasAnswered) {
      alert('You have already submitted an answer to this question. You can edit your existing answer instead.')
      return
    }

    // Increment submit attempts
    const newAttempts = submitAttempts + 1
    setSubmitAttempts(newAttempts)

    // Show warning after 2 attempts
    if (newAttempts >= 2) {
      setShowWarning(true)
      if (newAttempts > 2) {
        alert('Warning: You have attempted to submit multiple times. Please ensure your answer is complete before submitting.')
        return
      }
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/questions/${id}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newAnswer.trim(),
        }),
      })

      if (response.ok) {
        setNewAnswer('')
        setSubmitAttempts(0)
        setShowWarning(false)
        // Only refresh question data, skip vote check since it's not needed
        fetchQuestion(true)
      } else {
        const errorData = await response.json()
        if (response.status === 409) {
          alert('You have already answered this question.')
          setUserHasAnswered(true)
        } else {
          alert(errorData.error || 'Failed to submit answer')
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVoteQuestion = async (voteType: 'up' | 'down') => {
    if (!isSignedIn || isVoting || !id) return
    
    // Check if user is trying to vote the same way again
    if (userVote === voteType) {
      // Remove vote (toggle off)
      setIsVoting(true)
      try {
        await fetch(`/api/questions/${id}/vote`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        setUserVote(null)
        localStorage.removeItem(`question_vote_${id}`)
        fetchQuestion()
      } catch (error) {
        console.error('Error removing vote:', error)
      } finally {
        setIsVoting(false)
      }
      return
    }
    
    setIsVoting(true)
    try {
      const response = await fetch(`/api/questions/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      })
      
      if (response.ok) {
        setUserVote(voteType)
        localStorage.setItem(`question_vote_${id}`, voteType)
        fetchQuestion()
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const handleAcceptAnswer = async (answerId: string) => {
    if (!isSignedIn) return
    
    try {
      await fetch(`/api/answers/${answerId}/accept`, {
        method: 'POST',
      })
      fetchQuestion()
    } catch (error) {
      console.error('Error accepting answer:', error)
    }
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Question Card */}
      <Card className="mb-8" style={{ backgroundColor: '#FFFBF9' }}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl">{question.title}</CardTitle>
            <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
              {new Date(question.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: question.description }}
          />
          
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Button
                variant={userVote === 'up' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVoteQuestion('up')}
                disabled={!isSignedIn || isVoting}
                className={`flex items-center space-x-1 ${
                  userVote === 'up' 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'hover:bg-green-50 hover:text-green-600 hover:border-green-300'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{question.votes}</span>
              </Button>
              <Button
                variant={userVote === 'down' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVoteQuestion('down')}
                disabled={!isSignedIn || isVoting}
                className={`${
                  userVote === 'down' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{question.authorName}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-semibold">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
        </div>

        {answers.map((answer) => (
          <AnswerCard
            key={answer._id?.toString()}
            answer={answer}
            questionAuthorId={question.authorId}
            onAccept={handleAcceptAnswer}
            onUpdate={fetchQuestion}
          />
        ))}

        {/* Submit Answer Form */}
        {isSignedIn ? (
          userHasAnswered ? (
            <Card style={{ backgroundColor: '#FFFBF9' }}>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You have already submitted an answer to this question.
                </p>
                <p className="text-sm text-muted-foreground">
                  You can edit your existing answer using the Edit button.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card style={{ backgroundColor: '#FFFBF9' }}>
              <CardHeader>
                <CardTitle>Your Answer</CardTitle>
                {showWarning && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Warning: Multiple submission attempts detected. Please review your answer carefully before submitting.
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <RichTextEditor
                    content={newAnswer}
                    onChange={setNewAnswer}
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !newAnswer.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                  {submitAttempts > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Submission attempts: {submitAttempts}
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          )
        ) : (
          <Card style={{ backgroundColor: '#FFFBF9' }}>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Please log in to post an answer
              </p>
              <Button onClick={() => window.location.href = '/auth'}>
                Log In
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}