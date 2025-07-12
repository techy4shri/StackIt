import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, MessageSquare, Users, Trophy, Search, Plus } from 'lucide-react'

// Static stats component for better performance
function StatsSection() {
  return (
    <section className="py-8 sm:py-12 bg-muted/30 rounded-lg mx-4">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Join Our Growing Community</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">500+</div>
            <div className="text-sm sm:text-base text-muted-foreground">Questions Asked</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-2">200+</div>
            <div className="text-sm sm:text-base text-muted-foreground">Active Users</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">1K+</div>
            <div className="text-sm sm:text-base text-muted-foreground">Answers Given</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              StackIt
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            A modern Q&A platform where developers help each other solve problems and share knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link href="/ask">
              <Button size="lg" className="StackIt-gradient text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Ask a Question
              </Button>
            </Link>
            <Link href="/questions">
              <Button variant="outline" size="lg" className="px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Browse Questions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Choose StackIt?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-4 sm:pt-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Ask & Answer</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Get help from experienced developers and share your own knowledge with the community.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-4 sm:pt-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Build Community</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Connect with fellow developers, build your reputation, and grow your network.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <CardContent className="pt-4 sm:pt-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Earn Recognition</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Gain reputation points and badges for providing helpful answers and quality questions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <section className="py-8 sm:py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Start?</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            Join thousands of developers who are already helping each other solve problems.
          </p>
          <Link href="/auth">
            <Button size="lg" className="StackIt-gradient text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}