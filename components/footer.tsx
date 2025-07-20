import Link from 'next/link'
import { Github, Mail, Heart, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-800 dark:via-amber-800 dark:to-yellow-800 text-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Left side - Logo and description */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-white text-orange-600 flex h-6 w-6 items-center justify-center rounded-lg font-bold text-sm">
                  S
                </div>
                <span className="font-semibold text-white">StackIt</span>
              </div>
              <p className="text-xs text-white/80 text-center sm:text-left">
                A modern Q&A platform for developers
              </p>
            </div>

            {/* Center - Links */}
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/ask" className="text-white/80 hover:text-white transition-colors">
                Ask Question
              </Link>
              <Link href="/search" className="text-white/80 hover:text-white transition-colors">
                Search
              </Link>
            </div>

            {/* Right side - Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/techy4shri/StackIt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/sushri-sangita-jena-331940252/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:sushri4tech@gmail.com"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Email Contact"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/sponsors/techy4shri"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-200 hover:text-red-100 transition-colors"
                aria-label="Sponsor on GitHub"
              >
                <Heart className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/80">
              <p>
                © {new Date().getFullYear()} StackIt. Built with Next.js and TypeScript.
              </p>
              <p className="flex items-center gap-1">
                Made with <Heart className="h-3 w-3 text-red-200" /> by{' '}
                <a
                  href="https://github.com/techy4shri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  techy4shri
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
