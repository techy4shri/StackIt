'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useUserRole } from '@/hooks/useUserRole'

interface AskQuestionButtonProps {
  className?: string
}

export default function AskQuestionButton({ className }: AskQuestionButtonProps) {
  const { permissions } = useUserRole()

  if (!permissions.canPostQuestions) {
    return (
      <Link href="/pages/auth">
        <Button className={`StackIt-gradient text-white hover:opacity-90 btn-modern text-sm sm:text-base ${className}`}>
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Sign In to Ask</span>
          <span className="xs:hidden">Sign In</span>
        </Button>
      </Link>
    )
  }

  return (
    <Link href="/ask">
      <Button className={`StackIt-gradient text-white hover:opacity-90 btn-modern text-sm sm:text-base ${className}`}>
        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        <span className="hidden xs:inline">Ask Question</span>
        <span className="xs:hidden">Ask</span>
      </Button>
    </Link>
  )
}
