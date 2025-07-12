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

    const client = await clientPromise
    const db = client.db('stackit')
    
    const user = await db.collection('users').findOne({ clerkId: userId })
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    
    await db.collection('answers').deleteMany({ questionId: id })
    await db.collection('votes').deleteMany({ targetId: id, targetType: 'question' })
    
    const result = await db.collection('questions').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    )
  }
}
