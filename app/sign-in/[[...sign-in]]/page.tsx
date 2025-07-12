import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="StackIt-gradient mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-xl mb-4 shadow-lg">
            S
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your StackIt account</p>
        </div>
        
        <div className="bg-card p-8 rounded-xl shadow-xl border border-border backdrop-blur-sm">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-0 p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-border hover:bg-accent",
                formButtonPrimary: "StackIt-gradient hover:opacity-90",
                footerActionLink: "text-primary hover:text-primary/90"
              }
            }}
          />
        </div>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          New to StackIt?{' '}
          <Link href="/sign-up" className="text-primary hover:underline font-medium">Create an account</Link>
        </div>
      </div>
    </div>
  )
}