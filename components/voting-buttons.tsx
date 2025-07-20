'use client'

import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useVoting } from '@/hooks/useVoting'
import { cn } from '@/lib/utils'

interface VotingButtonsProps {
  targetId: string
  targetType: 'question' | 'answer'
  initialVotes: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function VotingButtons({
  targetId,
  targetType,
  initialVotes,
  size = 'md',
  className
}: VotingButtonsProps) {
  const { voteState, vote, loading, canVote } = useVoting(targetId, targetType, initialVotes)

  const sizeClasses = {
    sm: 'h-6 w-8 text-xs',
    md: 'h-8 w-10 text-sm',
    lg: 'h-10 w-12 text-base'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const voteSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <div className={cn('flex flex-col items-center space-y-1', className)}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          sizeClasses[size],
          'p-0 transition-colors border-2',
          voteState.voteType === 'up' 
            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 cursor-default border-orange-500 dark:border-orange-400' 
            : voteState.hasVoted 
              ? 'opacity-50 cursor-not-allowed hover:bg-transparent border-gray-300 dark:border-gray-600' 
              : 'hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 text-orange-600 dark:text-orange-400 border-orange-400 dark:border-orange-500'
        )}
        onClick={() => vote('up')}
        disabled={!canVote || loading || voteState.hasVoted}
        title={
          !canVote ? 'Sign in to vote' : 
          voteState.hasVoted ? 'You have already voted' : 
          'Vote up'
        }
      >
        <ChevronUp className={iconSizes[size]} />
      </Button>
      
      <span className={cn(
        'font-bold text-foreground dark:text-gray-100 min-w-[2rem] text-center',
        voteSizes[size],
        voteState.voteType === 'up' && 'text-orange-700 dark:text-orange-400',
        voteState.voteType === 'down' && 'text-red-700 dark:text-red-400'
      )}>
        {voteState.votes}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          sizeClasses[size],
          'p-0 transition-colors border-2',
          voteState.voteType === 'down' 
            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-default border-red-500 dark:border-red-400' 
            : voteState.hasVoted 
              ? 'opacity-50 cursor-not-allowed hover:bg-transparent border-gray-300 dark:border-gray-600' 
              : 'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 text-red-600 dark:text-red-400 border-red-400 dark:border-red-500'
        )}
        onClick={() => vote('down')}
        disabled={!canVote || loading || voteState.hasVoted}
        title={
          !canVote ? 'Sign in to vote' : 
          voteState.hasVoted ? 'You have already voted' : 
          'Vote down'
        }
      >
        <ChevronDown className={iconSizes[size]} />
      </Button>
      
      {!canVote && (
        <button 
          onClick={() => vote('up')} 
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline mt-1 cursor-pointer"
        >
          Sign in to vote
        </button>
      )}
      
      {voteState.hasVoted && (
        <span className="text-xs text-muted-foreground mt-1">
          Voted {voteState.voteType === 'up' ? '👍' : '👎'}
        </span>
      )}
    </div>
  )
}
