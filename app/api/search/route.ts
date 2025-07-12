import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json({ questions: [] })
    }

    // Handle database connection gracefully during build
    const client = await clientPromise
    const db = client.db('stackit')
    
    const questions = await db
      .collection('questions')
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error searching questions:', error)
    
    // During build, return empty result instead of failing
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json({ questions: [] })
    }
    
    return NextResponse.json(
      { error: 'Failed to search questions' },
      { status: 500 }
    )
  }
}