'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Brain, 
  Users, 
  Zap, 
  Heart, 
  Star, 
  Code, 
  BookOpen,
  Lightbulb,
  Target,
  Rocket,
  Github
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "Smart Q&A System",
    description: "Get answers from experts and fellow developers in your field",
    color: "bg-orange-500"
  },
  {
    icon: Users,
    title: "Growing Community",
    description: "Join thousands of developers sharing knowledge and experiences",
    color: "bg-amber-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with Next.js 15 and modern technologies for speed",
    color: "bg-yellow-500"
  },
  {
    icon: Heart,
    title: "Open Source",
    description: "Free forever and open source - contribute to make it better",
    color: "bg-red-500"
  },
  {
    icon: Star,
    title: "Reputation System",
    description: "Build your reputation by helping others and sharing knowledge",
    color: "bg-orange-600"
  },
  {
    icon: Code,
    title: "Code Snippets",
    description: "Share and discuss code with syntax highlighting and formatting",
    color: "bg-amber-600"
  }
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    content: "StackIt helped me solve complex React issues faster than anywhere else!",
    avatar: "SC"
  },
  {
    name: "Mike Johnson",
    role: "Backend Engineer", 
    content: "The community here is incredibly helpful and knowledgeable.",
    avatar: "MJ"
  },
  {
    name: "Alex Rivera",
    role: "Full Stack Developer",
    content: "I love how clean and modern the interface is. Makes asking questions easy!",
    avatar: "AR"
  }
]

export default function HomePage() {
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-200 rounded-full opacity-30 animate-bounce animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Side - Hero Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent animate-gradient-x">
                  StackIt
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-2xl">
                The modern Q&A platform for developers. Ask questions, share knowledge, and grow together.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/pages/auth">
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Get Started
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pages/questions">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-medium rounded-xl border-2 border-orange-300 hover:border-orange-500 transition-all duration-300">
                  Explore Questions
                  <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>10K+ Developers</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>50K+ Questions</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>100% Free</span>
              </div>
            </div>
          </div>

          {/* Right Side - Animated Feature Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {features.slice(0, 4).map((feature, index) => (
                <Card 
                  key={index}
                  className={`p-4 transform transition-all duration-500 hover:scale-105 ${
                    currentFeature === index ? 'ring-2 ring-orange-400 shadow-xl' : ''
                  }`}
                >
                  <CardContent className="p-0 text-center space-y-2">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mx-auto`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Developers Love StackIt</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built by developers, for developers. Here&apos;s what makes StackIt the perfect place to grow your skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-orange-200"
              >
                <CardContent className="p-0 space-y-4">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600">Join thousands of developers who are already part of the StackIt community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <p className="text-gray-700 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Join the Community?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start asking questions, sharing knowledge, and building your reputation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pages/auth">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg font-medium bg-white text-orange-600 hover:bg-gray-100">
                Sign Up Now
                <Target className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pages/questions">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg font-medium border-white text-white hover:bg-white hover:text-orange-600">
                Browse Questions
                <Lightbulb className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                StackIt
              </h3>
              <p className="text-gray-400">
                The modern Q&A platform for developers. Built with ❤️ by the community.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/techy4shri/StackIt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pages/questions" className="hover:text-white transition-colors">Questions</Link></li>
                <li><Link href="/pages/tags" className="hover:text-white transition-colors">Tags</Link></li>
                <li><Link href="/ask" className="hover:text-white transition-colors">Ask Question</Link></li>
                <li><Link href="/search" className="hover:text-white transition-colors">Search</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Code of Conduct</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StackIt. Built with Next.js, TypeScript, and MongoDB.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
