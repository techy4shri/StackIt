import Link from 'next/link'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Brand Section */}
            <div className="flex items-center space-x-2">
              <div className="StackIt-gradient flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-white font-bold text-sm sm:text-base">
                S
              </div>
              <span className="text-base sm:text-lg font-bold text-foreground">StackIt</span>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <Link href="/questions" className="hover:text-foreground transition-colors">
                Questions
              </Link>
              <Link href="/ask" className="hover:text-foreground transition-colors">
                Ask
              </Link>
              <Link href="/search" className="hover:text-foreground transition-colors">
                Search
              </Link>
              <Link href="/tags" className="hover:text-foreground transition-colors">
                Tags
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              <Link 
                href="https://github.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link 
                href="https://twitter.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link 
                href="mailto:contact@stackit.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border/50 pt-3 sm:pt-4 mt-3 sm:mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
              <p>&copy; 2025 StackIt. All rights reserved.</p>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current" />
                <span>by developers, for developers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
