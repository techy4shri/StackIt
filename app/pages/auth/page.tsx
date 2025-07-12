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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
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
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
                        formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
                        card: 'shadow-none border-0',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-indigo-300',
                        formFieldInput: 'border-2 border-gray-200 focus:border-indigo-400',
                        footerActionLink: 'text-indigo-600 hover:text-indigo-700'
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
                    className="w-full border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400"
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
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
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
                        formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
                        card: 'shadow-none border-0',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-purple-300',
                        formFieldInput: 'border-2 border-gray-200 focus:border-purple-400',
                        footerActionLink: 'text-purple-600 hover:text-purple-700'
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
                    className="w-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
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
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">?</span>
              </div>
              <span>Ask Questions</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">💡</span>
              </div>
              <span>Share Knowledge</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">⭐</span>
              </div>
              <span>Build Reputation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
