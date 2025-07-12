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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/pages/homepage" className="flex items-center space-x-2">
            <div className="StackIt-gradient flex h-8 w-8 items-center justify-center rounded text-white font-bold">
              S
            </div>
            <span className="text-xl font-bold text-foreground">StackIt</span>
          </Link>
          
          {/* Navigation Links */}
          {isSignedIn && (
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <Link href="/pages/questions" className="text-muted-foreground hover:text-foreground transition-colors">
                Questions
              </Link>
              <Link href="/pages/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </div>
          )}
          
          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search questions, tags, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
            </form>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                {/* Reputation & Badges */}
                <div className="hidden md:flex items-center space-x-4 text-sm">
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
                <Link href="/ask">
                  <Button className="StackIt-gradient text-white hover:opacity-90 btn-modern">
                    <Plus className="mr-2 h-4 w-4" />
                    Ask Question
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
                <Link href="/pages/auth">
                  <Button variant="ghost" className="btn-modern">Log in</Button>
                </Link>
                <Link href="/pages/auth">
                  <Button className="StackIt-gradient text-white hover:opacity-90 btn-modern">
                    Sign up
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
