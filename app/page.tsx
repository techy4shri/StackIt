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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Top Questions</h1>
          <p className="text-muted-foreground mt-1">
            {questions.length} questions
          </p>
        </div>
        <Link href="/ask" className="w-full sm:w-auto">
          <Button className="StackIt-gradient text-white hover:opacity-90 btn-modern w-full sm:w-auto text-sm sm:text-base">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Ask Question</span>
            <span className="xs:hidden">Ask</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="stats-card card-glow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground">23.4k</div>
            <div className="text-xs sm:text-sm text-muted-foreground">questions</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground">34.2k</div>
            <div className="text-xs sm:text-sm text-muted-foreground">answers</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground">12.1k</div>
            <div className="text-xs sm:text-sm text-muted-foreground">users</div>
          </CardContent>
        </Card>
        <Card className="stats-card card-glow">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-foreground">567</div>
            <div className="text-xs sm:text-sm text-muted-foreground">tags</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
          <Button variant="default" size="sm" className="StackIt-gradient text-white btn-modern flex-shrink-0 text-xs sm:text-sm">
            Newest
          </Button>
          <Button variant="ghost" size="sm" className="btn-modern flex-shrink-0 text-xs sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Active</span>
            <span className="xs:hidden">Act</span>
          </Button>
          <Button variant="ghost" size="sm" className="btn-modern flex-shrink-0 text-xs sm:text-sm">
            <span className="hidden xs:inline">Bountied</span>
            <span className="xs:hidden">Boun</span>
          </Button>
          <Button variant="ghost" size="sm" className="btn-modern flex-shrink-0 text-xs sm:text-sm">
            <span className="hidden xs:inline">Unanswered</span>
            <span className="xs:hidden">No Ans</span>
          </Button>
          <Button variant="ghost" size="sm" className="btn-modern flex-shrink-0 text-xs sm:text-sm">
            <span className="hidden xs:inline">Most Voted</span>
            <span className="xs:hidden">Top</span>
          </Button>
        </div>
        <Button variant="outline" size="sm" className="btn-modern w-full sm:w-auto flex-shrink-0 text-xs sm:text-sm">
          <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Filter
        </Button>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">No questions yet</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
              Be the first to ask a question and start the discussion!
            </p>
            <Link href="/ask">
              <Button className="text-sm sm:text-base">Ask the First Question</Button>
            </Link>
          </div>
        ) : (
          questions.map((question) => (
            <QuestionCard key={question._id?.toString()} question={question} />
          ))
        )}
      </div>
      
        {questions.length > 0 && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">Previous</Button>
            <span className="text-xs sm:text-sm text-muted-foreground">Page 1 of 1</span>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}