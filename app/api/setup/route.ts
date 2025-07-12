import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('stackit')
    
    const existingSuperAdmin = await db.collection('users').findOne({ role: 'super_admin' })
    
    if (existingSuperAdmin) {
      return NextResponse.json({ 
        error: 'Super admin already exists. Setup has already been completed.' 
      }, { status: 400 })
    }
    
    const user = await db.collection('users').findOne({ clerkId: userId })
    
    if (user) {
      await db.collection('users').updateOne(
        { clerkId: userId },
        { 
          $set: { 
            role: 'super_admin',
            updatedAt: new Date()
          }
        }
      )
    } else {
      await db.collection('users').insertOne({
        clerkId: userId,
        role: 'super_admin',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Super admin created successfully. You now have full admin access.' 
    })
  } catch (error) {
    console.error('Error in setup:', error)
    return NextResponse.json(
      { error: 'Setup failed' },
      { status: 500 }
    )
  }
}
