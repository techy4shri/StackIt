import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { Answer } from '@/lib/types'
import { ObjectId } from 'mongodb'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await request.json()
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('stackit')
    
    const answer: Omit<Answer, '_id'> = {
      questionId: params.id,
      content,
      authorId: userId,
      authorName: user?.firstName + ' ' + user?.lastName || 'Anonymous',
      authorImage: user?.imageUrl,
      createdAt: new Date(),
      votes: 0,
      isAccepted: false,
    }

    const result = await db.collection('answers').insertOne(answer)
    
    // Create notification for question author
    const question = await db.collection('questions').findOne({ 
      _id: new ObjectId(params.id) 
    })
    
    if (question && question.authorId !== userId) {
      await db.collection('notifications').insertOne({
        userId: question.authorId,
        type: 'answer',
        message: `${answer.authorName} answered your question: ${question.title}`,
        read: false,
        createdAt: new Date(),
        relatedId: params.id,
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      answerId: result.insertedId 
    })
  } catch (error) {
    console.error('Error creating answer:', error)
    return NextResponse.json(
      { error: 'Failed to create answer' },
      { status: 500 }
    )
  }
}
