import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import Sidebar from '../components/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StackIt - Q&A Platform',
  description: 'A modern question and answer platform inspired by StackOverflow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-50/10">
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-6 page-enter">
                <div className="mx-auto max-w-6xl">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}