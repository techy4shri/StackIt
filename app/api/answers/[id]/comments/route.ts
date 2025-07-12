import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { Comment } from '@/lib/types'
import { ObjectId } from 'mongodb'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await request.json()
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    const { id } = await params // answer ID
    const client = await clientPromise
    const db = client.db('stackit')
    
    // Verify answer exists
    const answer = await db.collection('answers').findOne({ 
      _id: new ObjectId(id) 
    })
    
    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      )
    }
    
    const comment: Omit<Comment, '_id'> = {
      answerId: id,
      content: content.trim(),
      authorId: userId,
      authorName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Anonymous',
      authorImage: user?.imageUrl,
      createdAt: new Date(),
    }

    const result = await db.collection('comments').insertOne(comment)
    
    // Create notification for answer author if different user
    if (answer.authorId !== userId) {
      await db.collection('notifications').insertOne({
        userId: answer.authorId,
        type: 'comment',
        message: `${comment.authorName} commented on your answer`,
        read: false,
        createdAt: new Date(),
        relatedId: answer.questionId,
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      commentId: result.insertedId 
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // answer ID
    const client = await clientPromise
    const db = client.db('stackit')
    
    const comments = await db.collection('comments')
      .find({ answerId: id })
      .sort({ createdAt: 1 })
      .toArray()
    
    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
