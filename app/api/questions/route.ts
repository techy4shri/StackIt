import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'
import { Question } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('stackit')
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter')
    const tags = searchParams.get('tags')
    
    // Build aggregation pipeline
    const pipeline: Array<Record<string, unknown>> = [
      {
        $addFields: {
          _idString: { $toString: '$_id' }
        }
      },
      {
        $lookup: {
          from: 'answers',
          localField: '_idString',
          foreignField: 'questionId',
          as: 'answers'
        }
      },
      {
        $addFields: {
          answerCount: { $size: '$answers' }
        }
      }
    ]
    
    // Add filtering based on query parameters
    if (filter === 'unanswered') {
      pipeline.push({
        $match: {
          answerCount: 0
        }
      })
    } else if (filter === 'bountied') {
      pipeline.push({
        $match: {
          votes: { $gte: 5 }
        }
      })
    }
    
    // Add tag filtering
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim())
      pipeline.push({
        $match: {
          tags: { $in: tagList }
        }
      })
    }
    
    // Add sorting based on filter
    if (filter === 'active') {
      // Sort by most recently answered questions
      pipeline.push({
        $addFields: {
          lastActivity: {
            $cond: {
              if: { $gt: [{ $size: '$answers' }, 0] },
              then: { $max: '$answers.createdAt' },
              else: '$createdAt'
            }
          }
        }
      })
      pipeline.push({ $sort: { lastActivity: -1 } })
    } else if (filter === 'more') {
      pipeline.push({ $sort: { votes: -1 } })
    } else {
      // Default to newest
      pipeline.push({ $sort: { createdAt: -1 } })
    }
    
    pipeline.push(
      { $limit: 50 },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          tags: 1,
          authorId: 1,
          authorName: 1,
          authorImage: 1,
          createdAt: 1,
          votes: 1,
          views: 1,
          answers: 1,
          answerCount: 1,
          acceptedAnswerId: 1
        }
      }
    )
    
    // Use aggregation pipeline to populate answers and get accurate counts
    const questions = await db
      .collection<Question>('questions')
      .aggregate(pipeline)
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