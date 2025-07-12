import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ 
        hasVoted: false, 
        voteType: null 
      })
    }

    const { id } = await params

    const client = await clientPromise
    const db = client.db('stackit')
    
    // Check if user already voted
    const existingVote = await db.collection('votes').findOne({
      userId,
      targetId: id,
      targetType: 'answer',
    })

    return NextResponse.json({
      hasVoted: !!existingVote,
      voteType: existingVote?.voteType || null
    })
  } catch (error) {
    console.error('Error checking vote:', error)
    return NextResponse.json(
      { error: 'Failed to check vote' },
      { status: 500 }
    )
  }
}
