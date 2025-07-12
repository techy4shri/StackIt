import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// For demo purposes, we'll use a simple admin check
// In production, you'd store admin status in your database
const ADMIN_USER_IDS: string[] = [
  // Add your Clerk user IDs here that should have admin access
  // You can get this from Clerk dashboard or when you sign up
]

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ isAdmin: false })
    }

    // For demo purposes, let's make the first user an admin
    // In production, you'd check a user roles table in your database
    const isAdmin = ADMIN_USER_IDS.includes(userId) || userId.length > 0 // This makes everyone admin for demo
    
    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false })
  }
}
