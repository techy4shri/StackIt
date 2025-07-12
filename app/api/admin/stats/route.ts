import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simple admin check - in production, check user role in database
    const isAdmin = true // For demo purposes

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const client = await clientPromise
    const db = client.db('stackit')
    
    // Get statistics
    const [totalQuestions, totalAnswers, totalVotes] = await Promise.all([
      db.collection('questions').countDocuments(),
      db.collection('answers').countDocuments(),
      db.collection('votes').countDocuments()
    ])

    // Get recent questions for moderation
    const recentQuestions = await db.collection('questions')
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    const stats = {
      totalQuestions,
      totalAnswers,
      totalUsers: 50, // Mock data - you'd get this from your users collection
      totalVotes
    }
    
    return NextResponse.json({ stats, recentQuestions })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin data' },
      { status: 500 }
    )
  }
}
