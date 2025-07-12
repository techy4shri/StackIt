'use client'

import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import RichTextEditor from '@/components/rich-text-editor'
import AnswerCard from '@/components/answer-card'
import { Question, Answer } from '@/lib/types'
import { ThumbsUp, ThumbsDown, User, MessageSquare } from 'lucide-react'

interface QuestionPageProps {
  params: { id: string }
}

export default function QuestionPage({ params }: QuestionPageProps) {
  const { isSignedIn } = useAuth()
const { user } = useUser()
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [newAnswer, setNewAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    fetchQuestion()
  }, [params.id])

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`/api/questions/${params.id}`)
      const data = await response.json()
      setQuestion(data.question)
      setAnswers(data.answers || [])
    } catch (error) {
      console.error('Error fetching question:', error)
    }
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newAnswer.trim() || !isSignedIn) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/questions/${params.id}/answers`, {
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
        fetchQuestion()
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVoteQuestion = async (voteType: 'up' | 'down') => {
    if (!isSignedIn || isVoting) return
    
    setIsVoting(true)
    try {
      await fetch(`/api/questions/${params.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      })
      fetchQuestion()
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const handleVoteAnswer = async (answerId: string, voteType: 'up' | 'down') => {
    if (!isSignedIn) return
    
    try {
      await fetch(`/api/answers/${answerId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      })
      fetchQuestion()
    } catch (error) {
      console.error('Error voting:', error)
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
      <Card className="mb-8">
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
                variant="outline"
                size="sm"
                onClick={() => handleVoteQuestion('up')}
                disabled={!isSignedIn || isVoting}
                className="flex items-center space-x-1"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{question.votes}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVoteQuestion('down')}
                disabled={!isSignedIn || isVoting}
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
            onVote={handleVoteAnswer}
            onAccept={handleAcceptAnswer}
          />
        ))}

        {/* Submit Answer Form */}
        {isSignedIn ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
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
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Please log in to post an answer
              </p>
              <Button onClick={() => window.location.href = '/sign-in'}>
                Log In
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}