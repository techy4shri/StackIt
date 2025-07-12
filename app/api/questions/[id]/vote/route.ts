import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const client = await clientPromise
    const db = client.db('stackit')
    
    // Check if user already voted
    const existingVote = await db.collection('votes').findOne({
      userId,
      targetId: params.id,
      targetType: 'question',
    })

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote if same type
        await db.collection('votes').deleteOne({ _id: existingVote._id })
        
        const increment = voteType === 'up' ? -1 : 1
        await db.collection('questions').updateOne(
          { _id: new ObjectId(params.id) },
          { $inc: { votes: increment } }
        )
      } else {
        // Update vote type
        await db.collection('votes').updateOne(
          { _id: existingVote._id },
          { $set: { voteType } }
        )
        
        const increment = voteType === 'up' ? 2 : -2
        await db.collection('questions').updateOne(
          { _id: new ObjectId(params.id) },
          { $inc: { votes: increment } }
        )
      }
    } else {
      // Create new vote
      await db.collection('votes').insertOne({
        userId,
        targetId: params.id,
        targetType: 'question',
        voteType,
        createdAt: new Date(),
      })
      
      const increment = voteType === 'up' ? 1 : -1
      await db.collection('questions').updateOne(
        { _id: new ObjectId(params.id) },
        { $inc: { votes: increment } }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json(
      { error: 'Failed to vote' },
      { status: 500 }
    )
  }
}