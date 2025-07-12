'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// Preload Clerk components for faster loading
const DynamicSignIn = dynamic(() => import('@clerk/nextjs').then(mod => ({ default: mod.SignIn })), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-3">
      <div className="bg-gray-200 h-8 rounded"></div>
      <div className="bg-gray-200 h-8 rounded"></div>
      <div className="bg-gray-200 h-8 rounded"></div>
      <div className="bg-gray-200 h-10 rounded"></div>
    </div>
  )
})

const DynamicSignUp = dynamic(() => import('@clerk/nextjs').then(mod => ({ default: mod.SignUp })), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-3">
      <div className="bg-gray-200 h-8 rounded"></div>
      <div className="bg-gray-200 h-8 rounded"></div>
      <div className="bg-gray-200 h-8 rounded"></div>
      <div className="bg-gray-200 h-8 rounded"></div>
      <div className="bg-gray-200 h-10 rounded"></div>
    </div>
  )
})

function AuthContent() {
  const searchParams = useSearchParams()
  const [isSignIn, setIsSignIn] = useState(true)

  useEffect(() => {

    const mode = searchParams.get('mode')
    if (mode === 'signup' || mode === 'sign-up') {
      setIsSignIn(false)
    } else {
      setIsSignIn(true)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 flex items-center justify-center p-1 sm:p-2">
      <div className="w-full max-w-[160px] sm:max-w-[200px] md:max-w-[260px] px-1 sm:px-2 mx-auto">
        <div className="text-center mb-2 sm:mb-3">
          <h1 className="text-sm sm:text-base font-bold text-foreground">
            {isSignIn ? 'Welcome back' : 'Join StackIt'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isSignIn 
              ? 'Sign in to your account' 
              : 'Create an account to get started'
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
            <div className="absolute inset-0 w-full max-w-80 backface-hidden">
              <div className="bg-card p-1 sm:p-2 rounded-md shadow-sm border border-border backdrop-blur-sm">
                <DynamicSignIn 
                  appearance={{
                    elements: {
                      rootBox: "w-full max-w-80",
                      card: "bg-transparent shadow-none border-0 p-0",
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
              <div className="bg-card p-1 sm:p-2 rounded-md shadow-sm border border-border backdrop-blur-sm">
                <DynamicSignUp 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-0 p-0",
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
        <div className="flex gap-1 sm:gap-2 mt-1 sm:mt-2">
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

      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 flex items-center justify-center p-1 sm:p-2">
        <div className="w-full max-w-[160px] sm:max-w-[200px]">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-6 w-20 rounded mx-auto mb-1"></div>
            <div className="bg-gray-200 h-3 w-28 rounded mx-auto mb-3"></div>
            <div className="bg-gray-200 h-32 rounded-md"></div>
          </div>
        </div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
