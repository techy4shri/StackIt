/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'

export type UserRole = 'user' | 'admin' | 'super_admin'

export interface AuthenticatedUser {
  clerkId: string
  role: UserRole
  _id?: any
}

export async function checkUserRole(requiredRole: UserRole): Promise<{
  authorized: boolean
  user: AuthenticatedUser | null
}> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { authorized: false, user: null }
    }

    const client = await clientPromise
    const db = client.db('stackit')
    
    let user = await db.collection('users').findOne({ clerkId: userId })
    
    if (!user) {
      const newUser = {
        clerkId: userId,
        role: 'user' as UserRole,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const result = await db.collection('users').insertOne(newUser)
      user = await db.collection('users').findOne({ _id: result.insertedId })
    }

    if (!user) {
      return { authorized: false, user: null }
    }

    const roleHierarchy: Record<UserRole, number> = {
      'user': 1,
      'admin': 2,
      'super_admin': 3
    }

    const userRoleLevel = roleHierarchy[user.role as UserRole] || 0
    const requiredRoleLevel = roleHierarchy[requiredRole]

    const authorized = userRoleLevel >= requiredRoleLevel

    return {
      authorized,
      user: {
        clerkId: user.clerkId,
        role: user.role as UserRole,
        _id: user._id
      }
    }
  } catch (error) {
    console.error('Error checking user role:', error)
    return { authorized: false, user: null }
  }
}

export async function isAdmin(): Promise<boolean> {
  const { authorized } = await checkUserRole('admin')
  return authorized
}

export async function isSuperAdmin(): Promise<boolean> {
  const { authorized } = await checkUserRole('super_admin')
  return authorized
}
