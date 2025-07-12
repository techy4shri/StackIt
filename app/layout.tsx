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
          <div className="min-h-screen w-full relative bg-white">
            {/* Orange Soft Glow */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at center, #FF7112, transparent)
                `,
                opacity: 0.3,
                mixBlendMode: "multiply",
              }}
            />
            {/* App Content */}
            <div className="relative z-10">
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
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}