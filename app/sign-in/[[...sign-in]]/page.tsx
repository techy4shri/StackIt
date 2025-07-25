'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main auth page with sign-in mode
    router.replace('/auth?mode=signin')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-4 sm:px-6 mx-auto">
        <p className="text-muted-foreground">Redirecting to sign in...</p>
      </div>
    </div>
  )
}