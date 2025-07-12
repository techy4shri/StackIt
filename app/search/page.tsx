'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import QuestionCard from '@/components/question-card'
import { Question } from '@/lib/types'
import { Search } from 'lucide-react'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)

  const searchQuestions = useCallback(async () => {
    if (!query.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Error searching questions:', error)
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    if (query) {
      searchQuestions()
    }
  }, [query, searchQuestions])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchQuestions()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Questions</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>
      
      {questions.length > 0 && (
        <div className="mb-4">
          <p className="text-muted-foreground">
            Found {questions.length} result{questions.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {questions.length === 0 && query ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No questions found matching your search.
            </p>
          </div>
        ) : (
          questions.map((question) => (
            <QuestionCard key={question._id?.toString()} question={question} />
          ))
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}