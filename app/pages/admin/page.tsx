'use client'

import { useUserRole } from '@/hooks/useUserRole'
import AdminPanel from '@/components/admin-panel'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle } from 'lucide-react'

export default function AdminPage() {
  const { role, isLoaded, isAdmin } = useUserRole()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center max-w-md">
          <CardContent className="space-y-4">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
            <p className="text-gray-600">
              You don&apos;t have permission to access the admin panel. 
              Only administrators can view this page.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Your current role: <span className="font-medium capitalize">{role}</span></p>
              <p>Required role: <span className="font-medium">Admin</span></p>
            </div>
            <Button 
              onClick={() => window.location.href = '/pages/homepage'}
              className="mt-4"
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Admin Badge */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-800">
          <Shield className="h-5 w-5" />
          <span className="font-medium">Administrator Access</span>
        </div>
        <p className="text-red-600 text-sm mt-1">
          You have full administrative privileges. Use them responsibly.
        </p>
      </div>

      <AdminPanel />
    </div>
  )
}
