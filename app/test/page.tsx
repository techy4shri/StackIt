// app/test/page.tsx
import { currentUser } from '@clerk/nextjs/server'
import clientPromise from '@/lib/mongodb'

export default async function TestPage() {
  // Test Clerk Authentication
  let clerkStatus = 'Error'
  let userInfo = 'Not signed in'
  let clerkError = ''
  
  try {
    const user = await currentUser()
    if (user) {
      clerkStatus = 'Connected successfully'
      userInfo = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'Unknown user'
    } else {
      clerkStatus = 'Connected (no user signed in)'
      userInfo = 'Not signed in'
    }
  } catch (error) {
    clerkStatus = 'Connection failed'
    clerkError = error instanceof Error ? error.message : 'Unknown error'
  }

  // Test MongoDB Connection
  let dbStatus = 'Error'
  let dbDetails = ''
  let dbError = ''
  
  try {
    const client = await clientPromise
    const db = client.db('stackit')
    
    // Test connection with ping
    await db.admin().ping()
    dbStatus = 'Connected successfully'
    
    // Get additional database info
    const collections = await db.listCollections().toArray()
    dbDetails = `Database: stackit, Collections: ${collections.length}`
    
  } catch (error) {
    dbStatus = 'Connection failed'
    dbError = error instanceof Error ? error.message : 'Unknown error'
    dbDetails = 'Could not retrieve database info'
  }

  // Environment Variables Check
  const envCheck = {
    mongoUri: process.env.MONGODB_URI ? '✅ Set' : '❌ Missing',
    clerkPublishable: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing',
    clerkSecret: process.env.CLERK_SECRET_KEY ? '✅ Set' : '❌ Missing',
    appUrl: process.env.NEXT_PUBLIC_APP_URL ? '✅ Set' : '❌ Missing',
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">🚀 StackIt Setup Test</h1>
          
          {/* Environment Variables */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">📋 Environment Variables</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">MongoDB URI:</span> {envCheck.mongoUri}
              </div>
              <div>
                <span className="font-medium">Clerk Publishable:</span> {envCheck.clerkPublishable}
              </div>
              <div>
                <span className="font-medium">Clerk Secret:</span> {envCheck.clerkSecret}
              </div>
              <div>
                <span className="font-medium">App URL:</span> {envCheck.appUrl}
              </div>
            </div>
          </div>

          {/* Clerk Authentication Test */}
          <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold mb-4 text-green-800">🔐 Clerk Authentication</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                  clerkStatus.includes('successfully') 
                    ? 'bg-green-200 text-green-800' 
                    : clerkStatus.includes('no user')
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-red-200 text-red-800'
                }`}>
                  {clerkStatus}
                </span>
              </div>
              <div>
                <span className="font-medium">User:</span> {userInfo}
              </div>
              {clerkError && (
                <div className="text-red-600 text-sm">
                  <span className="font-medium">Error:</span> {clerkError}
                </div>
              )}
            </div>
          </div>

          {/* MongoDB Connection Test */}
          <div className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">🗄️ MongoDB Connection</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                  dbStatus.includes('successfully') 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {dbStatus}
                </span>
              </div>
              <div>
                <span className="font-medium">Details:</span> {dbDetails}
              </div>
              {dbError && (
                <div className="text-red-600 text-sm">
                  <span className="font-medium">Error:</span> {dbError}
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">🎯 Next Steps</h2>
            <div className="space-y-2">
              {clerkStatus.includes('successfully') && dbStatus.includes('successfully') ? (
                <div className="text-green-600 font-medium">
                  ✅ Everything looks good! Ready to build StackIt!
                </div>
              ) : (
                <div className="space-y-1">
                  {!clerkStatus.includes('successfully') && (
                    <div className="text-red-600">❌ Fix Clerk authentication setup</div>
                  )}
                  {!dbStatus.includes('successfully') && (
                    <div className="text-red-600">❌ Fix MongoDB connection</div>
                  )}
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>To test authentication:</strong> Visit <code>/sign-in</code> to create an account</p>
                <p><strong>To continue setup:</strong> Copy the StackIt application code once tests pass</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
<div className="mt-8 flex gap-4">
  <a 
    href="/sign-in" 
    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
  >
    Test Sign In
  </a>
  <a 
    href="/" 
    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
  >
    Go to Home
  </a>
  <a 
    href="/test" 
    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
  >
    Refresh Test
  </a>
</div>
        </div>
      </div>
    </div>
  )
}