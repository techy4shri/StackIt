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
        <Button className={`StackIt-gradient text-white hover:opacity-90 btn-modern ${className}`}>
          <Plus className="h-4 w-4 mr-2" />
          Sign In to Ask
        </Button>
      </Link>
    )
  }

  return (
    <Link href="/ask">
      <Button className={`StackIt-gradient text-white hover:opacity-90 btn-modern ${className}`}>
        <Plus className="h-4 w-4 mr-2" />
        Ask Question
      </Button>
    </Link>
  )
}
