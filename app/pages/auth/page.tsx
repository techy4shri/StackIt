'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
// Update the import path to the correct location of your Button component
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// Dynamically import Clerk components to avoid SSR issues
const DynamicSignIn = dynamic(() => import('@clerk/nextjs').then(mod => ({ default: mod.SignIn })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
})

const DynamicSignUp = dynamic(() => import('@clerk/nextjs').then(mod => ({ default: mod.SignUp })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
})

function AuthContent() {
  const searchParams = useSearchParams()
  const [isSignIn, setIsSignIn] = useState(true)

  useEffect(() => {
    // Check if there's a mode parameter in the URL
    const mode = searchParams.get('mode')
    if (mode === 'signup' || mode === 'sign-up') {
      setIsSignIn(false)
    } else {
      setIsSignIn(true)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="StackIt-gradient mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl text-white font-bold text-lg sm:text-xl mb-3 sm:mb-4 shadow-lg">
            S
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {isSignIn ? 'Welcome back' : 'Join StackIt'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            {isSignIn 
              ? 'Sign in to your StackIt account' 
              : 'Create an account to start asking and answering questions'
            }
          </p>
        </div>
        
        {/* Card Container */}
        <div className="perspective-1000">
          <motion.div
            className="relative w-full h-auto preserve-3d"
            animate={{ rotateY: isSignIn ? 0 : 180 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Sign In Card */}
            <div className="absolute inset-0 w-full backface-hidden">
              <div className="bg-card p-4 sm:p-8 rounded-xl shadow-xl border border-border backdrop-blur-sm">
                <DynamicSignIn 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-0 p-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-border hover:bg-accent text-sm",
                      formButtonPrimary: "StackIt-gradient hover:opacity-90",
                      footerActionLink: "text-primary hover:text-primary/90"
                    }
                  }}
                />
              </div>
            </div>

            {/* Sign Up Card */}
            <div 
              className="absolute inset-0 w-full backface-hidden"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="bg-card p-4 sm:p-8 rounded-xl shadow-xl border border-border backdrop-blur-sm">
                <DynamicSignUp 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-0 p-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-border hover:bg-accent text-sm",
                      formButtonPrimary: "StackIt-gradient hover:opacity-90",
                      footerActionLink: "text-primary hover:text-primary/90"
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Button
            variant={isSignIn ? "default" : "outline"}
            className={`flex-1 text-sm sm:text-base ${isSignIn ? 'StackIt-gradient text-white' : ''}`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </Button>
          <Button
            variant={!isSignIn ? "default" : "outline"}
            className={`flex-1 text-sm sm:text-base ${!isSignIn ? 'StackIt-gradient text-white' : ''}`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </Button>
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
          {isSignIn ? (
            <>
              Don&apos;t have an account?{' '}
              <button 
                onClick={() => setIsSignIn(false)}
                className="text-primary hover:text-primary/90 font-medium"
              >
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                onClick={() => setIsSignIn(true)}
                className="text-primary hover:text-primary/90 font-medium"
              >
                Sign in here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-md">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-12 w-12 rounded-xl mx-auto mb-4"></div>
            <div className="bg-gray-200 h-8 w-48 rounded mx-auto mb-2"></div>
            <div className="bg-gray-200 h-4 w-64 rounded mx-auto mb-8"></div>
            <div className="bg-gray-200 h-64 rounded-xl"></div>
          </div>
        </div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
