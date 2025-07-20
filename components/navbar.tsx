'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Trophy, Shield } from 'lucide-react'
import NotificationDropdown from '@/components/notification-dropdown'
import { useUserRole } from '@/hooks/useUserRole'
import ThemeToggle from '@/components/theme-toggle'

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const { isAdmin } = useUserRole()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border dark:border-gray-700 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900/80 dark:shadow-lg dark:shadow-green-500/20">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <div className="StackIt-gradient flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded text-white font-bold text-sm sm:text-base shadow-lg dark:shadow-green-400/30">
              S
            </div>
            <span className="text-base sm:text-lg lg:text-xl font-bold text-foreground dark:text-white dark:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] hidden xs:block">StackIt</span>
          </Link>

          {/* Navigation Links */}
          {isSignedIn && (
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 ml-4 lg:ml-8">
              <Link href="/questions" className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white dark:hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] transition-all duration-300 text-sm">
                Questions
              </Link>
              <Link href="/dashboard" className="text-muted-foreground dark:text-gray-300 hover:text-foreground dark:hover:text-white dark:hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] transition-all duration-300 text-sm">
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 dark:hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all duration-300 flex items-center space-x-1 text-sm">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-sm lg:max-w-md mx-2 sm:mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-6 sm:pl-10 pr-3 sm:pr-4 w-full text-sm py-1 sm:py-2 dark:bg-gray-800/80 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-500/20 dark:shadow-[0_0_10px_rgba(34,197,94,0.2)]"
              />
            </form>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {isSignedIn ? (
              <>
                {/* Reputation & Badges - Hidden on mobile */}
                <div className="hidden xl:flex items-center space-x-3 text-xs lg:text-sm">
                  <div className="flex items-center space-x-1 dark:text-gray-300">
                    <Trophy className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-500 dark:text-yellow-400 dark:drop-shadow-[0_0_6px_rgba(234,179,8,0.6)]" />
                    <span className="font-medium dark:text-white dark:drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]">1,247</span>
                  </div>
                  <div className="flex items-center space-x-1 dark:text-gray-300">
                    <Badge variant="secondary" className="h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-yellow-500 dark:bg-yellow-400 dark:shadow-[0_0_6px_rgba(234,179,8,0.6)] p-0"></Badge>
                    <span className="dark:text-white dark:drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]">8</span>
                    <Badge variant="secondary" className="h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-gray-400 dark:bg-gray-500 dark:shadow-[0_0_6px_rgba(107,114,128,0.6)] p-0"></Badge>
                    <span className="dark:text-white dark:drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]">23</span>
                    <Badge variant="secondary" className="h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-amber-600 dark:bg-amber-500 dark:shadow-[0_0_6px_rgba(245,158,11,0.6)] p-0"></Badge>
                    <span className="dark:text-white dark:drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]">42</span>
                  </div>
                </div>

                {/* Notifications */}
                <NotificationDropdown />

                {/* Ask Question Button */}
                <Link href="/ask" className="hidden sm:block">
                  <Button className="StackIt-gradient text-white hover:opacity-90 btn-modern text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 dark:shadow-[0_0_12px_rgba(34,197,94,0.4)] dark:hover:shadow-[0_0_16px_rgba(34,197,94,0.6)] transition-all duration-300">
                    <Plus className="mr-1 lg:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden lg:inline">Ask Question</span>
                    <span className="lg:hidden">Ask</span>
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
                <Link href="/auth?mode=signin">
                  <Button variant="outline" className="StackIt-gradient text-white hover:opacity-90 btn-modern text-sm border-0">
                    <span className="hidden xs:inline">Log in</span>
                    <span className="xs:hidden">Login</span>
                  </Button>
                </Link>
                <Link href="/auth?mode=signup">
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
