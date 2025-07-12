'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Question } from '@/lib/types'
import { 
  Home, 
  MessageCircle, 
  Tags, 
  Star,
  TrendingUp,
  Menu,
  X
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Questions', href: '/questions', icon: MessageCircle },
  { name: 'Tags', href: '/tags', icon: Tags },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hotQuestions, setHotQuestions] = useState<Question[]>([])
  const [watchedTags, setWatchedTags] = useState<{name: string, count: number}[]>([])

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])
  useEffect(() => {
    let isCancelled = false
    
    async function fetchHotQuestions() {
      try {
        const response = await fetch('/api/questions', {
          cache: 'force-cache',
          next: { revalidate: 60 } // Cache for 1 minute
        })
        
        if (!isCancelled && response.ok) {
          const data = await response.json()
          const questions = data.questions || []
          
          // Get the 3 most recent questions with highest engagement
          const sortedQuestions = questions
            .sort((a: Question, b: Question) => {
              const aScore = (a.votes || 0) * 2 + (a.views || 0) * 0.1
              const bScore = (b.votes || 0) * 2 + (b.views || 0) * 0.1
              if (aScore !== bScore) return bScore - aScore
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            })
            .slice(0, 3)
          setHotQuestions(sortedQuestions)
          
          // Extract popular tags
          const tagCounts: { [key: string]: number } = {}
          questions.forEach((q: Question) => {
            q.tags?.forEach(tag => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1
            })
          })
          
          const popularTags = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([name, count]) => ({ name, count }))
          
          setWatchedTags(popularTags)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error fetching hot questions:', error)
        }
      }
    }

    fetchHotQuestions()
    
    return () => {
      isCancelled = true
    }
  }, [])

  // Check screen size and auto-collapse on mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile Hamburger Bar - Only show when collapsed, no fixed positioning */}
      {isMobile && isCollapsed && (
        <div className="md:hidden bg-[#FFFBF9] border-b shadow-sm">
          <div className="flex items-center justify-between p-3">
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-2 p-2 rounded-lg bg-white border shadow-sm hover:bg-accent transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      <aside className={`
        ${isCollapsed ? 'w-0 md:w-16' : 'w-64'} 
        ${isMobile && !isCollapsed ? 'fixed left-0 top-0 h-full z-50' : 'relative'}
        ${isMobile && isCollapsed ? 'hidden md:block' : ''}
        border-r backdrop-blur-sm 
        transition-all duration-300 ease-in-out overflow-hidden
      `} style={{ backgroundColor: '#FFFBF9' }}>
        {/* Hamburger Button - Inside Sidebar */}
        <div className="flex justify-between items-center p-3 border-b">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="StackIt-gradient flex h-6 w-6 items-center justify-center rounded text-white font-bold text-sm">
                S
              </div>
              <span className="text-lg font-bold text-foreground">Menu</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-accent transition-colors ml-auto"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        </div>
        
        <div className={`${isCollapsed ? 'p-2' : 'p-4'} transition-all duration-300`}>
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''} ${
                  isCollapsed ? 'justify-center px-1 py-3' : ''
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} flex-shrink-0`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {!isCollapsed && (
          <>
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Popular Tags
                </h3>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="space-y-2">
                {watchedTags.length > 0 ? (
                  watchedTags.map((tag) => (
                    <Link
                      key={tag.name}
                      href={`/questions?tags=${tag.name}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105"
                    >
                      <span className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                        <span className="font-medium">{tag.name}</span>
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full font-medium">{tag.count}</span>
                    </Link>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground px-3 py-2">
                    Loading popular tags...
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Hot Network Questions
                </h3>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </div>
              <div className="space-y-3">
                {hotQuestions.length > 0 ? (
                  hotQuestions.map((question) => (
                    <Link
                      key={question._id?.toString()}
                      href={`/question/${question._id?.toString()}`}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-orange-50/50">
                        <TrendingUp className="mt-0.5 h-3 w-3 text-orange-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="line-clamp-2 font-medium">
                            {question.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{question.votes} votes</span>
                            <span>•</span>
                            <span>{question.answers?.length || 0} answers</span>
                            {question.views > 0 && (
                              <>
                                <span>•</span>
                                <span>{question.views} views</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground p-2">
                    Loading hot questions...
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Collapsed Icons for Popular Tags and Hot Questions */}
        {isCollapsed && (
          <div className="mt-4 space-y-6">
            {/* Popular Tags Icon */}
            <div className="flex justify-center">
              <Link
                href="/tags"
                className="p-3 rounded-lg hover:bg-accent transition-colors"
                title="Popular Tags"
              >
                <Star className="h-5 w-5 text-yellow-500" />
              </Link>
            </div>
            
            {/* Hot Questions Icon */}
            <div className="flex justify-center">
              <Link
                href="/questions"
                className="p-3 rounded-lg hover:bg-accent transition-colors"
                title="Hot Network Questions"
              >
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </Link>
            </div>

            {/* Large spacer to compensate for missing content */}
            {/* This accounts for:
                - Popular Tags section header + 3 tag items
                - Hot Questions section header + 3 question items
                - All the spacing between them
            */}
            <div className="h-96"></div>
          </div>
        )}
      </div>
    </aside>
    </>
  )
}