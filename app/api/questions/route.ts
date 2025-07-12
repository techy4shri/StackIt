import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
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
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session.userId

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
    
    const firstName = (session as any).firstName || ''
    const lastName = (session as any).lastName || ''
    const imageUrl = (session as any).imageUrl || ''

    const question: Omit<Question, '_id'> = {
      title,
      description,
      tags,
      authorId: userId,
      authorName: (firstName + ' ' + lastName).trim() || 'Anonymous',
      authorImage: imageUrl,
      createdAt: new Date(),
      votes: 0,
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