'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  MessageCircle, 
  Tags, 
  Users, 
  Trophy, 
  BookOpen,
  Star,
  TrendingUp
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Questions', href: '/questions', icon: MessageCircle },
  { name: 'Tags', href: '/tags', icon: Tags },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Companies', href: '/companies', icon: Trophy },
  { name: 'Stack Overflow for Teams', href: '/teams', icon: BookOpen },
]

const watching = [
  { name: 'javascript', count: 1247 },
  { name: 'react', count: 892 },
  { name: 'typescript', count: 654 },
  { name: 'next.js', count: 432 },
  { name: 'node.js', count: 321 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-4">
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Watched Tags
          </h3>
          <div className="space-y-2">
            {watching.map((tag) => (
              <Link
                key={tag.name}
                href={`/questions/tagged/${tag.name}`}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex items-center gap-2">
                  <Star className="h-3 w-3" />
                  {tag.name}
                </span>
                <span className="text-xs">{tag.count}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Hot Network Questions
          </h3>
          <div className="space-y-3">
            <Link
              href="/questions/123"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              <div className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-3 w-3 text-orange-500" />
                <span className="line-clamp-2">
                  How to optimize React performance in large applications?
                </span>
              </div>
            </Link>
            <Link
              href="/questions/124"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              <div className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-3 w-3 text-orange-500" />
                <span className="line-clamp-2">
                  Best practices for TypeScript error handling
                </span>
              </div>
            </Link>
            <Link
              href="/questions/125"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              <div className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-3 w-3 text-orange-500" />
                <span className="line-clamp-2">
                  Database design patterns for scalable apps
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
