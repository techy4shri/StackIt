'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Trophy } from 'lucide-react'
import NotificationDropdown from '@/components/notification-dropdown' 

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-[#FFFBF9]/60" style={{ backgroundColor: '#FFFBF9' }}>
      <div className="container mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="StackIt-gradient flex h-8 w-8 items-center justify-center rounded text-white font-bold">
              S
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground hidden xs:block">StackIt</span>
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-2 sm:mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full text-sm"
              />
            </form>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {isSignedIn ? (
              <>
                {/* Reputation & Badges */}
                <div className="hidden lg:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant="secondary" className="h-2 w-2 rounded-full bg-yellow-500 p-0"></Badge>
                    <span>8</span>
                    <Badge variant="secondary" className="h-2 w-2 rounded-full bg-gray-400 p-0"></Badge>
                    <span>23</span>
                    <Badge variant="secondary" className="h-2 w-2 rounded-full bg-amber-600 p-0"></Badge>
                    <span>42</span>
                  </div>
                </div>

                {/* Notifications */}
                <NotificationDropdown />

                {/* Ask Question Button */}
                <Link href="/ask" className="hidden sm:block">
                  <Button className="StackIt-gradient text-white hover:opacity-90 btn-modern">
                    <Plus className="mr-1 lg:mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Ask Question</span>
                    <span className="md:hidden">Ask</span>
                  </Button>
                </Link>

                {/* User Menu */}
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="btn-modern text-sm">
                    <span className="hidden xs:inline">Log in</span>
                    <span className="xs:hidden">Login</span>
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="StackIt-gradient text-white hover:opacity-90 btn-modern text-sm">
                    <span className="hidden xs:inline">Sign up</span>
                    <span className="xs:hidden">Join</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
