'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import QuestionCard from '@/components/question-card'
import AskQuestionButton from '@/components/ask-question-button'
import { Question } from '@/lib/types'
import { Filter, TrendingUp } from 'lucide-react'

type FilterType = 'newest' | 'active' | 'bountied' | 'unanswered' | 'more'

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/questions')
        if (response.ok) {
          const data = await response.json()
          setQuestions(data.questions || [])
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  useEffect(() => {
    let filtered = [...questions]

    switch (activeFilter) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'active':
        // Sort by questions with most recent answers
        filtered.sort((a, b) => {
          const aLatestAnswer = a.answers?.length > 0 ? 
            Math.max(...a.answers.map(ans => new Date(ans.createdAt).getTime())) : 
            new Date(a.createdAt).getTime()
          const bLatestAnswer = b.answers?.length > 0 ? 
            Math.max(...b.answers.map(ans => new Date(ans.createdAt).getTime())) : 
            new Date(b.createdAt).getTime()
          return bLatestAnswer - aLatestAnswer
        })
        break
      case 'bountied':
        // Filter questions with high votes as "bountied"
        filtered = filtered.filter(q => q.votes >= 5)
        break
      case 'unanswered':
        // Filter questions with no answers
        filtered = filtered.filter(q => !q.answers || q.answers.length === 0)
        break
      case 'more':
        // Sort by vote count for trending
        filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0))
        break
    }

    setFilteredQuestions(filtered)
  }, [questions, activeFilter])

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Top Questions</h1>
          <p className="text-muted-foreground mt-1">
            {filteredQuestions.length} questions
          </p>
        </div>
        <AskQuestionButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="stats-card card-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{questions.length}</div>
            <div className="text-sm text-muted-foreground">questions</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {questions.reduce((total, q) => total + (q.answers?.length || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">answers</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {questions.filter(q => !q.answers || q.answers.length === 0).length}
            </div>
            <div className="text-sm text-muted-foreground">unanswered</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {questions.reduce((total, q) => total + q.votes, 0)}
            </div>
            <div className="text-sm text-muted-foreground">total votes</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-1">
          <Button 
            variant={activeFilter === 'newest' ? 'default' : 'ghost'} 
            size="sm" 
            className={activeFilter === 'newest' ? 'StackIt-gradient text-white btn-modern' : 'btn-modern'}
            onClick={() => handleFilterChange('newest')}
          >
            Newest
          </Button>
          <Button 
            variant={activeFilter === 'active' ? 'default' : 'ghost'} 
            size="sm" 
            className={activeFilter === 'active' ? 'StackIt-gradient text-white btn-modern' : 'btn-modern'}
            onClick={() => handleFilterChange('active')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Active
          </Button>
          <Button 
            variant={activeFilter === 'bountied' ? 'default' : 'ghost'} 
            size="sm" 
            className={activeFilter === 'bountied' ? 'StackIt-gradient text-white btn-modern' : 'btn-modern'}
            onClick={() => handleFilterChange('bountied')}
          >
            Bountied
          </Button>
          <Button 
            variant={activeFilter === 'unanswered' ? 'default' : 'ghost'} 
            size="sm" 
            className={activeFilter === 'unanswered' ? 'StackIt-gradient text-white btn-modern' : 'btn-modern'}
            onClick={() => handleFilterChange('unanswered')}
          >
            Unanswered
          </Button>
          <Button 
            variant={activeFilter === 'more' ? 'default' : 'ghost'} 
            size="sm" 
            className={activeFilter === 'more' ? 'StackIt-gradient text-white btn-modern' : 'btn-modern'}
            onClick={() => handleFilterChange('more')}
          >
            Most Voted
          </Button>
        </div>
        <Button variant="outline" size="sm" className="btn-modern">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">
              {activeFilter === 'unanswered' ? 'No unanswered questions' : 
               activeFilter === 'bountied' ? 'No highly voted questions' :
               'No questions yet'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {activeFilter === 'unanswered' ? 
                'All questions have been answered!' :
                activeFilter === 'bountied' ?
                'No questions with 5+ votes yet.' :
                'Be the first to ask a question and start the discussion!'
              }
            </p>
            {activeFilter === 'newest' && <AskQuestionButton className="mt-4" />}
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <QuestionCard key={question._id?.toString()} question={question} />
          ))
        )}
      </div>
      
      {filteredQuestions.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Previous</Button>
            <span className="text-sm text-muted-foreground">Page 1 of 1</span>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
