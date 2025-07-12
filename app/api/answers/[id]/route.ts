import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { content } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    
    // Check if the answer exists and belongs to the user
    const answer = await db.collection('answers').findOne({
      _id: new ObjectId(id),
      authorId: userId
    })

    if (!answer) {
      return NextResponse.json({ error: 'Answer not found or unauthorized' }, { status: 404 })
    }

    // Update the answer
    await db.collection('answers').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          content: content.trim(),
          updatedAt: new Date()
        } 
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating answer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
