import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Search, MessageCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <Card className="card-glow shadow-2xl">
          <CardContent className="p-12">
            {/* 404 Visual */}
            <div className="mb-8">
              <div className="text-8xl font-bold StackIt-gradient bg-clip-text text-transparent mb-4">
                404
              </div>
              <div className="text-4xl mb-2">🤔</div>
            </div>
            
            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Page Not Found
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                It might have been deleted, or you may have mistyped the URL.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="StackIt-gradient text-white btn-modern w-full sm:w-auto">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" className="btn-modern w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Search Questions
                </Button>
              </Link>
              <Link href="/ask">
                <Button variant="outline" className="btn-modern w-full sm:w-auto">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Ask a Question
                </Button>
              </Link>
            </div>
            
            {/* Help Text */}
            <div className="mt-8 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> If you think this is a mistake, please check the URL or use the search function to find what you&apos;re looking for.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Popular Links */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p className="mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>•</span>
            <Link href="/questions" className="hover:text-primary transition-colors">Questions</Link>
            <span>•</span>
            <Link href="/tags" className="hover:text-primary transition-colors">Tags</Link>
            <span>•</span>
            <Link href="/users" className="hover:text-primary transition-colors">Users</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
