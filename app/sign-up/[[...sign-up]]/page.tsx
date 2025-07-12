import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="StackIt-gradient mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-xl mb-4 shadow-lg">
            S
          </div>
          <h1 className="text-2xl font-bold text-foreground">Join StackIt</h1>
          <p className="text-muted-foreground mt-2">Create an account to start asking and answering questions</p>
        </div>
        
        <div className="bg-card p-8 rounded-xl shadow-xl border border-border backdrop-blur-sm">
          <SignUp 
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
          By creating an account, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  )
}