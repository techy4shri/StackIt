import Link from 'next/link'
import { Button } from '@/components/ui/button'
import QuestionCard from '@/components/question-card'
import { Question } from '@/lib/types'
import { Plus, Filter } from 'lucide-react'

async function getQuestions(): Promise<Question[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/questions`, {
      cache: 'no-store'
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.questions || []
  } catch (error) {
    console.error('Error fetching questions:', error)
    return []
  }
}

export default async function HomePage() {
  const questions = await getQuestions()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Latest Questions</h1>
        <Link href="/ask">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </Link>
      </div>
      
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Newest
          </Button>
          <Button variant="ghost" size="sm">
            Unanswered
          </Button>
          <Button variant="ghost" size="sm">
            More
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No questions yet</h2>
            <p className="text-muted-foreground mb-4">
              Be the first to ask a question and start the discussion!
            </p>
            <Link href="/ask">
              <Button>Ask the First Question</Button>
            </Link>
          </div>
        ) : (
          questions.map((question) => (
            <QuestionCard key={question._id?.toString()} question={question} />
          ))
        )}
      </div>
      
      {questions.length > 0 && (
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