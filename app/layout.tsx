import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import Sidebar from '../components/sidebar'
import Footer from '@/components/footer'
import { ThemeProvider } from '@/lib/theme'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StackIt - Q&A Platform',
  description: 'A modern question and answer platform inspired by StackOverflow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <head>
          <link rel="preload" href="https://clerk.com/assets/clerk.js" as="script" />
        </head>
        <body className={inter.className}>
          <ThemeProvider>
            <div className="min-h-screen w-full relative bg-background flex flex-col">
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
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <div className="flex flex-col md:flex-row flex-1">
                <Sidebar />
                <main className="flex-1 px-2 sm:px-4 lg:px-6 pt-1 sm:pt-2 lg:pt-4 page-enter w-full min-w-0 pb-8">
                  <div className="mx-auto max-w-6xl w-full">
                    {children}
                  </div>
                </main>
              </div>
              <Footer />
            </div>
          </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}