'use client'

import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/auth')
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  )
}