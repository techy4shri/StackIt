import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import QuestionCard from '@/components/question-card'
import { Question } from '@/lib/types'
import { Plus, Filter, TrendingUp } from 'lucide-react'

async function getQuestions(): Promise<Question[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/questions`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Top Questions</h1>
          <p className="text-muted-foreground mt-1">
            {questions.length} questions
          </p>
        </div>
        <Link href="/ask">
          <Button className="StackIt-gradient text-white hover:opacity-90 btn-modern">
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="stats-card card-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">23.4k</div>
            <div className="text-sm text-muted-foreground">questions</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">34.2k</div>
            <div className="text-sm text-muted-foreground">answers</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">12.1k</div>
            <div className="text-sm text-muted-foreground">users</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">567</div>
            <div className="text-sm text-muted-foreground">tags</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-1">
          <Button variant="default" size="sm" className="StackIt-gradient text-white btn-modern">
            Newest
          </Button>
          <Button variant="ghost" size="sm" className="btn-modern">
            <TrendingUp className="h-4 w-4 mr-2" />
            Active
          </Button>
          <Button variant="ghost" size="sm" className="btn-modern">
            Bountied
          </Button>
          <Button variant="ghost" size="sm" className="btn-modern">
            Unanswered
          </Button>
          <Button variant="ghost" size="sm" className="btn-modern">
            More
          </Button>
        </div>
        <Button variant="outline" size="sm" className="btn-modern">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
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