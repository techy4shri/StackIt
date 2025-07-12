'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import QuestionItem from '@/components/question-item'
import AskQuestionButton from '@/components/ask-question-button'
import { Question } from '@/lib/types'
import { Filter, TrendingUp, X } from 'lucide-react'

type FilterType = 'newest' | 'active' | 'bountied' | 'unanswered' | 'more'

function QuestionsContent() {
  const searchParams = useSearchParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>('newest')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize selected tags from URL parameters
  useEffect(() => {
    const tagsParam = searchParams.get('tags')
    if (tagsParam) {
      setSelectedTags(tagsParam.split(','))
    }
  }, [searchParams])

  useEffect(() => {
    let isCancelled = false
    
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/questions', {
          next: { revalidate: 30 } // Cache for 30 seconds
        })
        
        if (!isCancelled && response.ok) {
          const text = await response.text()
          try {
            const data = JSON.parse(text)
            const questionsList = data.questions || []
            setQuestions(questionsList)
            
            // Extract unique tags from all questions
            const allTags: string[] = questionsList.flatMap((q: Question) => q.tags || [])
            const uniqueTags = [...new Set(allTags)].sort()
            setAvailableTags(uniqueTags)
          } catch (parseError) {
            console.error('JSON parse error:', parseError)
            console.error('Response text:', text)
            setQuestions([])
          }
        } else if (!isCancelled) {
          console.error('Failed to fetch questions:', response.status, response.statusText)
          setQuestions([])
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error fetching questions:', error)
          setQuestions([])
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchQuestions()
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    let filtered = [...questions]

    // Apply tag filtering first
    if (selectedTags.length > 0) {
      filtered = filtered.filter(q => 
        selectedTags.some(selectedTag => 
          q.tags?.some(questionTag => 
            questionTag.toLowerCase().includes(selectedTag.toLowerCase())
          )
        )
      )
    }

    // Apply button filtering
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
        filtered = filtered.filter(q => (q.votes || 0) >= 5)
        break
      case 'unanswered':
        // Filter questions with no answers - check both answers array and answerCount
        filtered = filtered.filter(q => {
          const answersArray = q.answers || []
          const answerCount = (q as Question & { answerCount?: number }).answerCount || answersArray.length
          return answerCount === 0
        })
        break
      case 'more':
        // Sort by vote count for trending
        filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0))
        break
    }

    setFilteredQuestions(filtered)
  }, [questions, activeFilter, selectedTags])

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
  }

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  const handleTagRemove = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag))
  }

  const clearAllTags = () => {
    setSelectedTags([])
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Top Questions</h1>
          <p className="text-muted-foreground mt-1">
            {filteredQuestions.length} questions
          </p>
        </div>
        <div className="flex-shrink-0">
          <AskQuestionButton />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="stats-card card-glow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{questions.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">questions</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {questions.reduce((total, q) => total + (q.answers?.length || 0), 0)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">answers</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {questions.filter(q => !q.answers || q.answers.length === 0).length}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">unanswered</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {questions.reduce((total, q) => total + q.votes, 0)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">total votes</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Button 
            variant={activeFilter === 'newest' ? 'default' : 'ghost'} 
            size="sm" 
            className={`text-xs sm:text-sm ${activeFilter === 'newest' ? 'StackIt-gradient text-white btn-modern' : 'btn-modern'}`}
            onClick={() => handleFilterChange('newest')}
          >
            Newest
          </Button>
          <Button 
            variant={activeFilter === 'active' ? 'default' : 'ghost'} 
            size="sm" 
            className={`text-xs sm:text-sm ${activeFilter === 'active' ? 'StackIt-gradient text-white btn-modern' : 'btn-modern'}`}
            onClick={() => handleFilterChange('active')}
          >
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Active
          </Button>
          <Button 
            variant={activeFilter === 'bountied' ? 'default' : 'ghost'} 
            size="sm" 
            className={`text-xs sm:text-sm ${activeFilter === 'bountied' ? 'StackIt-gradient text-white btn-modern' : 'btn-modern'}`}
            onClick={() => handleFilterChange('bountied')}
          >
            Bountied
          </Button>
          <Button 
            variant={activeFilter === 'unanswered' ? 'default' : 'ghost'} 
            size="sm" 
            className={`text-xs sm:text-sm ${activeFilter === 'unanswered' ? 'StackIt-gradient text-white btn-modern' : 'btn-modern'}`}
            onClick={() => handleFilterChange('unanswered')}
          >
            <span className="hidden xs:inline">Unanswered</span>
            <span className="xs:hidden">No Ans</span>
          </Button>
          <Button 
            variant={activeFilter === 'more' ? 'default' : 'ghost'} 
            size="sm" 
            className={`text-xs sm:text-sm ${activeFilter === 'more' ? 'StackIt-gradient text-white btn-modern' : 'btn-modern'}`}
            onClick={() => handleFilterChange('more')}
          >
            <span className="hidden xs:inline">Most Voted</span>
            <span className="xs:hidden">Top</span>
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="btn-modern text-xs sm:text-sm w-full sm:w-auto"
          onClick={() => {
            // Cycle through filters when filter button is clicked
            const filterOrder: FilterType[] = ['newest', 'active', 'bountied', 'unanswered', 'more']
            const currentIndex = filterOrder.indexOf(activeFilter)
            const nextIndex = (currentIndex + 1) % filterOrder.length
            handleFilterChange(filterOrder[nextIndex])
          }}
        >
          <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Filter
        </Button>
      </div>
      
      {/* Tag Filters */}
      {(selectedTags.length > 0 || availableTags.length > 0) && (
        <div className="space-y-3">
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Filtered by:</span>
              {selectedTags.map(tag => (
                <Badge 
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer"
                  onClick={() => handleTagRemove(tag)}
                >
                  {tag}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllTags}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
          
          {/* Available Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Filter by tags:</span>
                <span className="text-xs text-muted-foreground">
                  {filteredQuestions.length} of {questions.length} questions
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 max-h-32 overflow-y-auto">
                {availableTags.slice(0, 20).map(tag => (
                  <Badge 
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedTags.includes(tag) 
                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                        : 'hover:bg-orange-50 hover:border-orange-300'
                    }`}
                    onClick={() => selectedTags.includes(tag) ? handleTagRemove(tag) : handleTagSelect(tag)}
                  >
                    {tag}
                    <span className="ml-1 text-xs opacity-70">
                      {questions.filter(q => q.tags?.includes(tag)).length}
                    </span>
                  </Badge>
                ))}
                {availableTags.length > 20 && (
                  <span className="text-xs text-muted-foreground">
                    +{availableTags.length - 20} more tags
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-3 sm:space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              {selectedTags.length > 0 ? 'No questions found with selected tags' :
               activeFilter === 'unanswered' ? 'No unanswered questions' : 
               activeFilter === 'bountied' ? 'No highly voted questions' :
               'No questions yet'}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
              {selectedTags.length > 0 ? 
                'Try removing some tag filters or browse all questions.' :
                activeFilter === 'unanswered' ? 
                'All questions have been answered!' :
                activeFilter === 'bountied' ?
                'No questions with 5+ votes yet.' :
                'Be the first to ask a question and start the discussion!'
              }
            </p>
            {selectedTags.length > 0 ? (
              <Button variant="outline" onClick={clearAllTags}>
                Clear tag filters
              </Button>
            ) : (
              activeFilter === 'newest' && <AskQuestionButton className="mt-4" />
            )}
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <QuestionItem key={question._id?.toString()} question={question} />
          ))
        )}
      </div>
      
      {filteredQuestions.length > 0 && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">Previous</Button>
            <span className="text-xs sm:text-sm text-muted-foreground">Page 1 of 1</span>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-48 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 w-32 rounded"></div>
          </div>
          <div className="bg-gray-200 h-10 w-32 rounded"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-gray-200 h-20 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-gray-200 h-32 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    }>
      <QuestionsContent />
    </Suspense>
  )
}
