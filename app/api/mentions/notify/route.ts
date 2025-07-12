import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mentionedUsernames, content, type = 'mention' } = await request.json()
    
    if (!mentionedUsernames || !Array.isArray(mentionedUsernames)) {
      return NextResponse.json({ error: 'Invalid mentioned usernames' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('stackit')
    
    // Create notifications for mentioned users
    const notifications = mentionedUsernames.map((username: string) => ({
      userId: username, // In production, you'd convert username to userId
      type,
      title: 'You were mentioned',
      message: `You were mentioned in a ${type}`,
      content: content?.substring(0, 100) + (content?.length > 100 ? '...' : ''),
      createdAt: new Date(),
      read: false,
      actionUrl: request.headers.get('referer') || '/'
    }))
    
    if (notifications.length > 0) {
      await db.collection('notifications').insertMany(notifications)
    }
    
    return NextResponse.json({ success: true, count: notifications.length })
  } catch (error) {
    console.error('Error creating mention notifications:', error)
    return NextResponse.json(
      { error: 'Failed to create notifications' },
      { status: 500 }
    )
  }
}
