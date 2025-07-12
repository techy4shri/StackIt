'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
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
  { name: 'Home', href: '/pages/homepage', icon: Home },
  { name: 'Questions', href: '/pages/questions', icon: MessageCircle },
  { name: 'Tags', href: '/pages/tags', icon: Tags },
]

const watching = [
  { name: 'typescript', count: 654 },
  { name: 'next.js', count: 432 },
  { name: 'node.js', count: 321 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
      {/* Mobile Hamburger Bar - Fixed at top, pushes content down */}
      {isMobile && isCollapsed && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-[#FFFBF9] border-b shadow-sm mobile-hamburger-bar">
          <div className="flex items-center justify-between p-3">
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-2 p-2 rounded-lg bg-white border shadow-sm hover:bg-accent transition-colors"
            >
              <Menu className="h-4 w-4" />
              <span className="text-sm font-medium">Menu</span>
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
          {isMobile && !isCollapsed && (
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
                  Watched Tags
                </h3>
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
              <div className="space-y-2">
                {watching.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/questions/tagged/${tag.name}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                      <span className="font-medium">{tag.name}</span>
                    </span>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full font-medium">{tag.count}</span>
                  </Link>
                ))}
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
                
                <Link
                  href="/questions/123"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-orange-50/50">
                    <TrendingUp className="mt-0.5 h-3 w-3 text-orange-500 flex-shrink-0" />
                    <span className="line-clamp-2 font-medium">
                      Best practices for TypeScript error handling
                    </span>
                  </div>
                </Link>
                <Link
                  href="/questions/124"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-orange-50/50">
                    <TrendingUp className="mt-0.5 h-3 w-3 text-orange-500 flex-shrink-0" />
                    <span className="line-clamp-2 font-medium">
                      Database design patterns for scalable apps
                    </span>
                  </div>
                </Link>
                <Link
                  href="/questions/125"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-orange-50/50">
                    <TrendingUp className="mt-0.5 h-3 w-3 text-orange-500 flex-shrink-0" />
                    <span className="line-clamp-2 font-medium">
                      How to optimize React performance in large applications?
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
    </>
  )
}
