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
    
    // Check if this is a tag search (format: [tagname])
    const tagMatch = query.match(/^\[(.+)\]$/)
    
    let searchCondition
    if (tagMatch) {
      // Tag-specific search
      const tagName = tagMatch[1]
      searchCondition = {
        tags: { $in: [new RegExp(tagName, 'i')] }
      }
    } else {
      // General search across title, description, and tags
      searchCondition = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    }
    
    const questions = await db
      .collection('questions')
      .find(searchCondition)
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