'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { Menu, X, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn } = useUser()

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="flex items-center space-x-2">
            <div className="StackIt-gradient flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold">
              S
            </div>
            <span className="text-lg font-bold text-foreground">StackIt</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/questions"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Questions
            </Link>
            <Link
              href="/search"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-4 w-4" />
            </Link>
            {isSignedIn && (
              <Link href="/ask">
                <Button size="sm" className="StackIt-gradient text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Ask Question
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="hidden sm:flex space-x-2">
                <Link href="/auth">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth?mode=signup">
                  <Button size="sm" className="StackIt-gradient text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link
                href="/questions"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Questions
              </Link>
              <Link
                href="/search"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Search
              </Link>
              {isSignedIn && (
                <Link href="/ask" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="StackIt-gradient text-white w-fit">
                    <Plus className="h-4 w-4 mr-1" />
                    Ask Question
                  </Button>
                </Link>
              )}
              {!isSignedIn && (
                <div className="flex space-x-2">
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="StackIt-gradient text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
