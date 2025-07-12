'use client'

import { useUser } from '@clerk/nextjs'
import { UserRole, getUserRole, getPermissions } from '@/lib/roles'

export function useUserRole() {
  const { user, isLoaded } = useUser()
  
  const role = getUserRole(user)
  const permissions = getPermissions(role)
  
  return {
    role,
    permissions,
    isLoaded,
    isGuest: role === UserRole.GUEST,
    isUser: role === UserRole.USER,
    isAdmin: role === UserRole.ADMIN,
    isAuthenticated: role !== UserRole.GUEST
  }
}
