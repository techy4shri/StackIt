import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { Question } from '@/lib/types'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('stackit')
    
    const questions = await db
      .collection<Question>('questions')
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error fetching questions:', error)
    
    // During build, return empty result instead of failing
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json({ questions: [] })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, tags } = await request.json()
    
    if (!title || !description || !tags || tags.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('stackit')

    const question: Omit<Question, '_id'> = {
      title,
      description,
      tags,
      authorId: userId,
      authorName: user?.firstName + ' ' + user?.lastName || 'Anonymous',
      authorImage: user?.imageUrl,
      createdAt: new Date(),
      votes: 0,
      views: 0,
      answers: [],
    }

    const result = await db.collection('questions').insertOne(question)
    
    return NextResponse.json({ 
      success: true, 
      questionId: result.insertedId 
    })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}