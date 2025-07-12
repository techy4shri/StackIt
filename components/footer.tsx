import Link from 'next/link'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Brand Section */}
            <div className="flex items-center space-x-2">
              <div className="StackIt-gradient flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold">
                S
              </div>
              <span className="text-lg font-bold text-foreground">StackIt</span>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/pages/questions" className="hover:text-foreground transition-colors">
                Questions
              </Link>
              <Link href="/ask" className="hover:text-foreground transition-colors">
                Ask
              </Link>
              <Link href="/search" className="hover:text-foreground transition-colors">
                Search
              </Link>
              <Link href="/pages/tags" className="hover:text-foreground transition-colors">
                Tags
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <Link 
                href="https://github.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="mailto:contact@stackit.dev" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border mt-4 pt-4 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500" /> by the StackIt Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
