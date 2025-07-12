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
    
    // Create database indexes for better performance
    try {
      await db.collection('questions').createIndex({ createdAt: -1 })
      await db.collection('questions').createIndex({ votes: -1 })
      await db.collection('questions').createIndex({ views: -1 })
      await db.collection('questions').createIndex({ tags: 1 })
      await db.collection('questions').createIndex({ authorId: 1 })
      
      await db.collection('answers').createIndex({ questionId: 1 })
      await db.collection('answers').createIndex({ createdAt: -1 })
      await db.collection('answers').createIndex({ votes: -1 })
      await db.collection('answers').createIndex({ authorId: 1 })
      
      await db.collection('votes').createIndex({ targetId: 1, targetType: 1 })
      await db.collection('votes').createIndex({ userId: 1 })
      
      await db.collection('users').createIndex({ clerkId: 1 }, { unique: true })
      
      console.log('Database indexes created successfully')
    } catch (indexError) {
      console.warn('Some indexes may already exist:', indexError)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Super admin created successfully. Database indexes optimized. You now have full admin access.' 
    })
  } catch (error) {
    console.error('Error in setup:', error)
    return NextResponse.json(
      { error: 'Setup failed' },
      { status: 500 }
    )
  }
}
