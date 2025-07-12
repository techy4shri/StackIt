'use client'

import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="page-enter page-enter-active">
      {children}
    </div>
  )
}
