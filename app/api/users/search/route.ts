import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json({ users: [] })
    }

    const client = await clientPromise
    const db = client.db('stackit')
    
    const pipeline = [
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: '$author',
          username: { $first: '$author' },
          name: { $first: '$author' }
        }
      },
      {
        $project: {
          id: '$_id',
          username: 1,
          name: 1,
          _id: 0
        }
      },
      { $limit: 10 }
    ]

    const users = await db.collection('questions').aggregate(pipeline).toArray()
    
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error searching users:', error)
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    )
  }
}
