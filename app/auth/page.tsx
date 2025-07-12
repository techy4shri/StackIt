'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// Dynamically import Clerk components to avoid SSR issues and reduce initial bundle
const DynamicSignIn = dynamic(() => import('@clerk/nextjs').then(mod => ({ default: mod.SignIn })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
    </div>
  )
})

const DynamicSignUp = dynamic(() => import('@clerk/nextjs').then(mod => ({ default: mod.SignUp })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
    </div>
  )
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
    <div className="max-h-[70vh] bg-gradient-to-br from-background via-background to-orange-50/20 flex items-start justify-center p-3 sm:p-4 py-4 sm:py-6">
      <div className="w-full max-w-sm">{/* Reduced from max-w-md to max-w-sm */}
        <div className="text-center mb-2 sm:mb-3">
          <div className="StackIt-gradient mx-auto flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-white font-bold text-sm sm:text-base mb-1 sm:mb-2 shadow-lg">
            S
          </div>
          <h1 className="text-base sm:text-lg font-bold text-foreground">
            {isSignIn ? 'Welcome back' : 'Join StackIt'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isSignIn 
              ? 'Sign in to your account' 
              : 'Create your account'
            }
          </p>
        </div>

        {/* Toggle Buttons at Top */}
        <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3">
          <Button
            variant={isSignIn ? "default" : "outline"}
            className={`flex-1 text-xs py-1 ${isSignIn ? 'StackIt-gradient text-white' : ''}`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </Button>
          <Button
            variant={!isSignIn ? "default" : "outline"}
            className={`flex-1 text-xs py-1 ${!isSignIn ? 'StackIt-gradient text-white' : ''}`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </Button>
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
              <div className="bg-card p-2 sm:p-3 rounded-lg shadow-lg border border-border backdrop-blur-sm">
                <DynamicSignIn 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-0 p-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-border hover:bg-accent text-xs py-1",
                      formButtonPrimary: "StackIt-gradient hover:opacity-90 py-1 text-xs",
                      footerActionLink: "text-primary hover:text-primary/90 text-xs"
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
              <div className="bg-card p-2 sm:p-3 rounded-lg shadow-lg border border-border backdrop-blur-sm">
                <DynamicSignUp 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-0 p-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-border hover:bg-accent text-xs py-1",
                      formButtonPrimary: "StackIt-gradient hover:opacity-90 py-1 text-xs",
                      footerActionLink: "text-primary hover:text-primary/90 text-xs"
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-1 sm:mt-2">
          {isSignIn ? (
            <>
              Don&apos;t have an account?{' '}
              <button 
                onClick={() => setIsSignIn(false)}
                className="text-primary hover:text-primary/90 font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                onClick={() => setIsSignIn(true)}
                className="text-primary hover:text-primary/90 font-medium"
              >
                Sign in
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
      <div className="min-h-[calc(100vh-120px)] bg-gradient-to-br from-background via-background to-orange-50/20 flex items-center justify-center p-3 sm:p-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-12 w-12 rounded-xl mx-auto mb-4"></div>
            <div className="bg-gray-200 h-8 w-48 rounded mx-auto mb-2"></div>
            <div className="bg-gray-200 h-4 w-64 rounded mx-auto mb-6"></div>
            <div className="bg-gray-200 h-48 rounded-xl"></div>
          </div>
        </div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
