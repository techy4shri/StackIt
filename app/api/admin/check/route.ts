import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ isAdmin: false })
    }

    const client = await clientPromise
    const db = client.db('stackit')
    
    // Check if user exists in users collection with admin role
    let user = await db.collection('users').findOne({ clerkId: userId })
    
    // If user doesn't exist, create them with default role
    if (!user) {
      const newUser = {
        clerkId: userId,
        role: 'user', // Default role is 'user'
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const result = await db.collection('users').insertOne(newUser)
      user = await db.collection('users').findOne({ _id: result.insertedId })
    }
    
    // Check if user has admin role
    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
    
    return NextResponse.json({ isAdmin, role: user?.role || 'user' })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ isAdmin: false, role: 'user' })
  }
}
