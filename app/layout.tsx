import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StackIt - Q&A Platform',
  description: 'A minimal question and answer platform for collaborative learning',
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
          <Navbar />
          <main className="min-h-screen bg-background">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}