import { User } from '@clerk/nextjs/server'
import { UserResource } from '@clerk/types'

export enum UserRole {
  GUEST = 'guest',
  USER = 'user', 
  ADMIN = 'admin'
}

export interface Permissions {
  canViewContent: boolean
  canRegister: boolean
  canLogin: boolean
  canPostQuestions: boolean
  canPostAnswers: boolean
  canVote: boolean
  canModerateContent: boolean
  canDeleteQuestions: boolean
  canDeleteAnswers: boolean
  canDeleteComments: boolean
}

// Get user role from Clerk user object
export function getUserRole(user: User | UserResource | null | undefined): UserRole {
  if (!user) return UserRole.GUEST
  
  // Check if user is admin (you can customize this logic)
  // For now, we'll check if email contains 'admin' or use a specific admin email
  const adminEmails = ['admin@stackit.com', 'techy4shri@gmail.com'] // Add your admin emails here
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase()
  
  if (userEmail && adminEmails.includes(userEmail)) {
    return UserRole.ADMIN
  }
  
  // You could also check custom metadata or a separate database field
  // Example: user.publicMetadata?.role as UserRole || UserRole.USER
  
  return UserRole.USER
}

// Get permissions based on role
export function getPermissions(role: UserRole): Permissions {
  switch (role) {
    case UserRole.GUEST:
      return {
        canViewContent: true,
        canRegister: true,
        canLogin: true,
        canPostQuestions: false,
        canPostAnswers: false,
        canVote: false,
        canModerateContent: false,
        canDeleteQuestions: false,
        canDeleteAnswers: false,
        canDeleteComments: false
      }
    
    case UserRole.USER:
      return {
        canViewContent: true,
        canRegister: true,
        canLogin: true,
        canPostQuestions: true,
        canPostAnswers: true,
        canVote: true,
        canModerateContent: false,
        canDeleteQuestions: false,
        canDeleteAnswers: false,
        canDeleteComments: false
      }
    
    case UserRole.ADMIN:
      return {
        canViewContent: true,
        canRegister: true,
        canLogin: true,
        canPostQuestions: true,
        canPostAnswers: true,
        canVote: true,
        canModerateContent: true,
        canDeleteQuestions: true,
        canDeleteAnswers: true,
        canDeleteComments: true
      }
    
    default:
      return getPermissions(UserRole.GUEST)
  }
}

// Helper functions for common permission checks
export function canUserPostQuestions(role: UserRole): boolean {
  return getPermissions(role).canPostQuestions
}

export function canUserPostAnswers(role: UserRole): boolean {
  return getPermissions(role).canPostAnswers
}

export function canUserVote(role: UserRole): boolean {
  return getPermissions(role).canVote
}

export function canUserModerate(role: UserRole): boolean {
  return getPermissions(role).canModerateContent
}

export function isAdmin(role: UserRole): boolean {
  return role === UserRole.ADMIN
}

export function isAuthenticated(role: UserRole): boolean {
  return role !== UserRole.GUEST
}
