'use client'

import { useState } from 'react'
import { SignIn, SignUp } from '@clerk/nextjs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)

  const toggleMode = () => {
    setIsSignIn(!isSignIn)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container with Flip Animation */}
        <div className="relative h-[600px] perspective-1000">
          <div 
            className={`absolute inset-0 transition-transform duration-700 transform-style-preserve-3d ${
              isSignIn ? '' : 'rotate-y-180'
            }`}
          >
            {/* Sign In Card (Front) */}
            <Card className="absolute inset-0 backface-hidden shadow-2xl border-0">
              <CardContent className="p-0">
                <div className="p-6 text-center border-b">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Welcome Back
                  </h1>
                  <p className="text-gray-600 mt-2">Sign in to your StackIt account</p>
                </div>
                
                <div className="p-6">
                  <SignIn 
                    routing="hash"
                    signUpUrl="#sign-up"
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700',
                        card: 'shadow-none border-0',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-orange-300',
                        formFieldInput: 'border-2 border-gray-200 focus:border-orange-400',
                        footerActionLink: 'text-orange-600 hover:text-orange-700'
                      }
                    }}
                  />
                </div>

                <div className="p-6 pt-0 text-center border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    Don&apos;t have an account?
                  </p>
                  <Button
                    variant="outline"
                    onClick={toggleMode}
                    className="w-full border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Create Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sign Up Card (Back) */}
            <Card className="absolute inset-0 backface-hidden rotate-y-180 shadow-2xl border-0">
              <CardContent className="p-0">
                <div className="p-6 text-center border-b">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Join StackIt
                  </h1>
                  <p className="text-gray-600 mt-2">Create your account and start learning</p>
                </div>
                
                <div className="p-6">
                  <SignUp 
                    routing="hash"
                    signInUrl="#sign-in"
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
                        card: 'shadow-none border-0',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-amber-300',
                        formFieldInput: 'border-2 border-gray-200 focus:border-amber-400',
                        footerActionLink: 'text-amber-600 hover:text-amber-700'
                      }
                    }}
                  />
                </div>

                <div className="p-6 pt-0 text-center border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    Already have an account?
                  </p>
                  <Button
                    variant="outline"
                    onClick={toggleMode}
                    className="w-full border-2 border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-400"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Below Card */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">?</span>
              </div>
              <span>Ask Questions</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 font-bold">💡</span>
              </div>
              <span>Share Knowledge</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">⭐</span>
              </div>
              <span>Build Reputation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
