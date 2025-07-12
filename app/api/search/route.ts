import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json({ questions: [] })
    }

    const client = await clientPromise
    const db = client.db('stackit')
    
    // Create text search index on title, description, and tags
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
    return NextResponse.json(
      { error: 'Failed to search questions' },
      { status: 500 }
    )
  }
}