'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import QuestionItem from '@/components/question-item'
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
        <h1 className="text-3xl font-bold mb-2">Search Questions</h1>
        <p className="text-muted-foreground mb-6">Find answers from millions of questions</p>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for questions, tags, or keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 input-enhanced h-12 text-base"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="StackIt-gradient text-white btn-modern px-6 h-12"
          >
            {loading ? (
              <>
                <div className="loading-pulse mr-2 h-4 w-4 rounded-full bg-white/50"></div>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </form>
      </div>
      
      {questions.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <p className="text-green-800 font-medium">
            ✅ Found {questions.length} result{questions.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {questions.length === 0 && query ? (
          <div className="text-center py-12">
            <div className="mb-4 text-4xl">🔍</div>
            <h2 className="text-xl font-semibold mb-2">No questions found</h2>
            <p className="text-muted-foreground mb-4">
              No questions found matching &ldquo;{query}&rdquo;. Try different keywords or check your spelling.
            </p>
            <Button variant="outline" onClick={() => setQuery('')} className="btn-modern">
              Clear Search
            </Button>
          </div>
        ) : questions.length === 0 && !query ? (
          <div className="text-center py-12">
            <div className="mb-4 text-4xl">💡</div>
            <h2 className="text-xl font-semibold mb-2">Start your search</h2>
            <p className="text-muted-foreground">
              Enter keywords to find relevant questions and answers
            </p>
          </div>
        ) : (
          questions.map((question) => (
            <QuestionItem key={question._id?.toString()} question={question} />
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