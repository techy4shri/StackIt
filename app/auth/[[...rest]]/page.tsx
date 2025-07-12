'use client'

import { SignIn, SignUp } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function AuthPage() {
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
    <div className="h-full flex flex-col justify-center items-center p-3 sm:p-4 bg-gradient-to-br from-background via-background to-orange-50/20">
      <div className="w-full max-w-sm flex-shrink-0">
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
        
        {/* Card Container with Flip Animation */}
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
                <SignIn 
                  forceRedirectUrl="/dashboard"
                  signUpUrl="/auth?mode=signup"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-0 p-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-border hover:bg-accent text-xs py-1",
                      formButtonPrimary: "StackIt-gradient hover:opacity-90 py-1 text-xs",
                      footerActionLink: "text-primary hover:text-primary/90 text-xs",
                      formFieldInput: "text-xs",
                      formFieldLabel: "text-xs"
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
                <SignUp 
                  forceRedirectUrl="/dashboard"
                  signInUrl="/auth?mode=signin"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-0 p-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-border hover:bg-accent text-xs py-1",
                      formButtonPrimary: "StackIt-gradient hover:opacity-90 py-1 text-xs",
                      footerActionLink: "text-primary hover:text-primary/90 text-xs",
                      formFieldInput: "text-xs",
                      formFieldLabel: "text-xs"
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
