import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Sidebar from '@/components/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StackIt - Developer Q&A Platform',
  description: 'A modern Q&A platform for developers built with Next.js and TypeScript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/20 flex flex-col">
            <Navbar />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}