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

    const client = await clientPromise
    const db = client.db('stackit')
    
    // Get the answer to find the question
    const answer = await db.collection('answers').findOne({
      _id: new ObjectId(params.id)
    })
    
    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      )
    }

    // Check if user is the question author
    const question = await db.collection('questions').findOne({
      _id: new ObjectId(answer.questionId)
    })
    
    if (!question || question.authorId !== userId) {
      return NextResponse.json(
        { error: 'Only question author can accept answers' },
        { status: 403 }
      )
    }

    // Remove accepted status from all answers for this question
    await db.collection('answers').updateMany(
      { questionId: answer.questionId },
      { $set: { isAccepted: false } }
    )
    
    // Set this answer as accepted
    await db.collection('answers').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { isAccepted: true } }
    )
    
    // Create notification for answer author
    if (answer.authorId !== userId) {
      await db.collection('notifications').insertOne({
        userId: answer.authorId,
        type: 'accepted',
        message: `Your answer to "${question.title}" was accepted`,
        read: false,
        createdAt: new Date(),
        relatedId: answer.questionId,
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error accepting answer:', error)
    return NextResponse.json(
      { error: 'Failed to accept answer' },
      { status: 500 }
    )
  }
}