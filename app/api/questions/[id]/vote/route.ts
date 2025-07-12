import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { voteType } = await request.json()
    
    if (!['up', 'down'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      )
    }

    const { id } = await params

    const client = await clientPromise
    const db = client.db('stackit')
    
    // Check if user already voted
    const existingVote = await db.collection('votes').findOne({
      userId,
      targetId: id,
      targetType: 'question',
    })

    // Prevent multiple votes per user
    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted on this question' },
        { status: 400 }
      )
    }

    // Create new vote (only one vote allowed per user)
    await db.collection('votes').insertOne({
      userId,
      targetId: id,
      targetType: 'question',
      voteType,
      createdAt: new Date(),
    })
    
    const increment = voteType === 'up' ? 1 : -1
    await db.collection('questions').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { votes: increment } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json(
      { error: 'Failed to vote' },
      { status: 500 }
    )
  }
}