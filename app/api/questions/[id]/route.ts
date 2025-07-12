import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('stackit')
    
    const question = await db
      .collection('questions')
      .findOne({ _id: new ObjectId(params.id) })
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    const answers = await db
      .collection('answers')
      .find({ questionId: params.id })
      .sort({ isAccepted: -1, votes: -1, createdAt: 1 })
      .toArray()

    return NextResponse.json({ question, answers })
  } catch (error) {
    console.error('Error fetching question:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    )
  }
}