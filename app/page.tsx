'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, MessageSquare, Users, Trophy, Search, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span>{count}{suffix}</span>
}

// Static stats component for better performance
function StatsSection() {
  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-lg mx-4 relative overflow-hidden">
      {/* Geometric background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-20 h-20 bg-orange-500 rounded-full animate-float"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 bg-amber-500 transform rotate-45 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-yellow-500 rounded-full animate-bounce"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Join Our Growing Community</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">
              <AnimatedCounter end={500} suffix="+" />
            </div>
            <div className="text-sm sm:text-base text-muted-foreground">Questions Asked</div>
          </div>
          <div className="transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-2">
              <AnimatedCounter end={200} suffix="+" />
            </div>
            <div className="text-sm sm:text-base text-muted-foreground">Active Users</div>
          </div>
          <div className="transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">
              <AnimatedCounter end={1000} suffix="+" />
            </div>
            <div className="text-sm sm:text-base text-muted-foreground">Answers Given</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="relative space-y-8 sm:space-y-12 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-300/20 to-amber-300/20 rounded-full animate-float animation-delay-0"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-amber-300/20 to-yellow-300/20 transform rotate-45 animate-pulse animation-delay-200"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full animate-bounce animation-delay-400"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-br from-orange-300/20 to-amber-300/20 transform rotate-12 animate-float animation-delay-600"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-amber-300/20 to-yellow-300/20 rounded-full animate-pulse animation-delay-800"></div>
        
        {/* Animated lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-300/30 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-pulse animation-delay-400"></div>
      </div>

      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent inline-block transform hover:scale-105 transition-transform duration-300 animate-pulse-color">
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
      <section className="py-8 sm:py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Choose StackIt?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center p-4 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 border-orange-200">
              {/* Geometric background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 right-2 w-8 h-8 bg-orange-400 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-amber-400 transform rotate-45"></div>
                <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-yellow-400 rounded-full"></div>
              </div>
              
              <CardContent className="pt-4 sm:pt-6 relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12 animate-bounce border-2 border-orange-400/30">
                  <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-orange-700" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Ask & Answer</h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Get help from experienced developers and share your own knowledge with the community.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-4 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-50 border-amber-200">
              {/* Geometric background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-2 w-6 h-6 bg-amber-400 transform rotate-45"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-yellow-400 rounded-full"></div>
                <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-orange-400 rounded-full"></div>
              </div>
              
              <CardContent className="pt-4 sm:pt-6 relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12 animate-bounce animation-delay-200 border-2 border-amber-400/30">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-amber-700" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Build Community</h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Connect with fellow developers, build your reputation, and grow your network.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-4 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group sm:col-span-2 lg:col-span-1 relative overflow-hidden bg-gradient-to-br from-yellow-50 via-yellow-100 to-orange-50 border-yellow-200">
              {/* Geometric background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-3 right-4 w-7 h-7 bg-yellow-400 transform rotate-45"></div>
                <div className="absolute bottom-3 left-3 w-5 h-5 bg-orange-400 rounded-full"></div>
                <div className="absolute top-2/3 right-1/4 w-6 h-6 bg-amber-400 rounded-full"></div>
              </div>
              
              <CardContent className="pt-4 sm:pt-6 relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12 animate-bounce animation-delay-400 border-2 border-yellow-400/30">
                  <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-700" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">Earn Recognition</h3>
                <p className="text-sm sm:text-base text-gray-700">
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
      <section className="py-8 sm:py-12 text-center relative z-10">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Start?</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            Join thousands of developers who are already helping each other solve problems.
          </p>
          <Link href="/auth">
            <Button size="lg" className="StackIt-gradient text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg hover:scale-105 transition-transform duration-300">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}