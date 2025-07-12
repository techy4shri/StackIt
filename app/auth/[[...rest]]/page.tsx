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
    const mode = searchParams.get('mode')
    if (mode === 'signup' || mode === 'sign-up') {
      setIsSignIn(false)
    } else {
      setIsSignIn(true)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-background via-background to-orange-50/20">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg px-3 sm:px-4 mx-auto">
        <div className="text-center mb-3">
          <div className="StackIt-gradient mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-base mb-2 shadow-lg">
            S
          </div>
          <h1 className="text-lg font-bold text-foreground">
            {isSignIn ? 'Welcome back' : 'Join StackIt'}
          </h1>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-3">
          <Button
            variant={isSignIn ? "default" : "outline"}
            className={`flex-1 text-sm h-8 ${isSignIn ? 'StackIt-gradient text-white' : ''}`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </Button>
          <Button
            variant={!isSignIn ? "default" : "outline"}
            className={`flex-1 text-sm h-8 ${!isSignIn ? 'StackIt-gradient text-white' : ''}`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </Button>
        </div>

        <div className="perspective-1000">
          <motion.div
            className="relative w-full preserve-3d"
            animate={{ rotateY: isSignIn ? 0 : 180 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Sign In */}
            <div className="absolute inset-0 w-full backface-hidden">
              <div className="bg-card/95 backdrop-blur-sm p-0 sm:p-2 max-w-[480px] w-full mx-auto rounded-xl border border-border shadow-md">
                <SignIn
                  forceRedirectUrl="/dashboard"
                  signUpUrl="/auth?mode=signup"
                  appearance={{
                    elements: {
                      rootBox: "w-full max-w-full",
                      card: "w-full max-w-full bg-w-full shadow-none border-none p-0",
                      form: "!space-y-4 !pt-0 !mt-0",
                      formField: "w-full",
                      formFieldInput: "text-sm h-10 w-full",
                      formFieldLabel: "text-sm font-medium",
                      header: "hidden",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-border hover:bg-accent text-sm h-10 w-full",
                      socialButtonsBlockButtonText: "text-sm font-medium",
                      formButtonPrimary: "StackIt-gradient hover:opacity-90 text-sm h-10 w-full",
                      footerActionLink: "text-primary hover:text-primary/90 text-sm",
                      footer: "mt-4 text-center",
                      dividerRow: "!my-2"
                    }
                  }}
                />
              </div>
            </div>

            {/* Sign Up */}
            <div
              className="absolute inset-0 w-full backface-hidden"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="bg-card/95 backdrop-blur-sm p-0 sm:p-2 max-w-[480px] w-full mx-auto rounded-xl border border-border shadow-md">
                <SignUp
                  forceRedirectUrl="/dashboard"
                  signInUrl="/auth?mode=signin"
                  appearance={{
                    elements: {
                      rootBox: "w-full max-w-full",
                      card: "w-full max-w-full bg-transparent shadow-none border-none p-0",
                      form: "!space-y-4 !pt-0 !mt-0",
                      formField: "w-full",
                      formFieldInput: "text-sm h-10 w-full",
                      formFieldLabel: "text-sm font-medium",
                      header: "hidden",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-border hover:bg-accent text-sm h-10 w-full",
                      socialButtonsBlockButtonText: "text-sm font-medium",
                      formButtonPrimary: "StackIt-gradient hover:opacity-90 text-sm h-10 w-full",
                      footerActionLink: "text-primary hover:text-primary/90 text-sm",
                      footer: "mt-4 text-center"
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
