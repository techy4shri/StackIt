'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, Hash, MessageCircle, Eye } from 'lucide-react'

const popularTags = [
  {
    name: 'javascript',
    description: 'For questions about the high-level, interpreted programming language JavaScript.',
    questions: 156,
    followers: 89,
    todayQuestions: 12
  },
  {
    name: 'python',
    description: 'For questions about Python programming language.',
    questions: 134,
    followers: 76,
    todayQuestions: 8
  },
  {
    name: 'react',
    description: 'For questions about React, the JavaScript library for building user interfaces.',
    questions: 98,
    followers: 65,
    todayQuestions: 7
  },
  {
    name: 'typescript',
    description: 'For questions about TypeScript, the typed superset of JavaScript.',
    questions: 87,
    followers: 54,
    todayQuestions: 6
  },
  {
    name: 'nodejs',
    description: 'For questions about Node.js, the JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
    questions: 76,
    followers: 43,
    todayQuestions: 5
  },
  {
    name: 'html',
    description: 'For questions about HTML (HyperText Markup Language), the standard markup language.',
    questions: 65,
    followers: 38,
    todayQuestions: 4
  },
  {
    name: 'css',
    description: 'For questions about CSS (Cascading Style Sheets) for styling web pages.',
    questions: 54,
    followers: 32,
    todayQuestions: 3
  },
  {
    name: 'nextjs',
    description: 'For questions about Next.js, the React framework for production.',
    questions: 43,
    followers: 27,
    todayQuestions: 3
  },
  {
    name: 'mongodb',
    description: 'For questions about MongoDB, the document-oriented NoSQL database.',
    questions: 32,
    followers: 21,
    todayQuestions: 2
  },
  {
    name: 'git',
    description: 'For questions about Git, the distributed version control system.',
    questions: 28,
    followers: 19,
    todayQuestions: 2
  },
  {
    name: 'api',
    description: 'For questions about APIs (Application Programming Interfaces).',
    questions: 25,
    followers: 16,
    todayQuestions: 2
  },
  {
    name: 'database',
    description: 'For questions about databases and database management systems.',
    questions: 21,
    followers: 14,
    todayQuestions: 1
  }
]

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')

  const filteredTags = popularTags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedTags = [...filteredTags].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'new':
        return b.todayQuestions - a.todayQuestions
      case 'popular':
      default:
        return b.questions - a.questions
    }
  })

  return (
    <div className="min-h-screen w-full bg-white relative text-gray-800">
      {/* Concentric Squares - Light Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
            repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(75, 85, 99, 0.06) 5px, rgba(75, 85, 99, 0.06) 6px, transparent 6px, transparent 15px),
            repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px),
            repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(107, 114, 128, 0.04) 10px, rgba(107, 114, 128, 0.04) 11px, transparent 11px, transparent 30px)
          `,
        }}
      />
      
      <div className="relative z-10 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tags</h1>
          <p className="text-muted-foreground mt-1">
            A tag is a keyword or label that categorizes your question with other, similar questions.
          </p>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('popular')}
              className="text-xs"
            >
              Popular
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('name')}
              className="text-xs"
            >
              Name
            </Button>
            <Button
              variant={sortBy === 'new' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('new')}
              className="text-xs"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              New
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{popularTags.length}</div>
            <div className="text-sm text-muted-foreground">total tags</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {popularTags.reduce((sum, tag) => sum + tag.questions, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">tagged questions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {popularTags.reduce((sum, tag) => sum + tag.followers, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">tag followers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {popularTags.reduce((sum, tag) => sum + tag.todayQuestions, 0)}
            </div>
            <div className="text-sm text-muted-foreground">questions today</div>
          </CardContent>
        </Card>
      </div>

      {/* Tags Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTags.map((tag, index) => (
          <Link key={index} href={`/search?q=[${tag.name}]`}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-orange-200 cursor-pointer">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className="bg-orange-100 text-orange-800 hover:bg-orange-200 font-mono text-sm px-3 py-1"
                  >
                    <Hash className="h-3 w-3 mr-1" />
                    {tag.name}
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{tag.todayQuestions}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {tag.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{tag.questions.toLocaleString()} questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{tag.followers.toLocaleString()} followers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Results info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {sortedTags.length} of {popularTags.length} tags
        {searchQuery && ` matching "${searchQuery}"`}
      </div>
      </div>
    </div>
  )
}
