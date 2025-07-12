import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simple admin check - in production, check user role in database
    const isAdmin = true // For demo purposes

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const client = await clientPromise
    const db = client.db('stackit')
    
    // Delete related votes first
    await db.collection('votes').deleteMany({ targetId: id, targetType: 'answer' })
    
    // Delete the answer
    const result = await db.collection('answers').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting answer:', error)
    return NextResponse.json(
      { error: 'Failed to delete answer' },
      { status: 500 }
    )
  }
}
