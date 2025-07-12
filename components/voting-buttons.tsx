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
          'p-0 transition-colors',
          voteState.voteType === 'up' 
            ? 'bg-green-100 text-green-700 hover:bg-green-100 cursor-default' 
            : voteState.hasVoted 
              ? 'opacity-50 cursor-not-allowed hover:bg-transparent' 
              : 'hover:bg-green-50 hover:text-green-600'
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
        'font-bold text-foreground min-w-[2rem] text-center',
        voteSizes[size],
        voteState.voteType === 'up' && 'text-green-700',
        voteState.voteType === 'down' && 'text-red-700'
      )}>
        {voteState.votes}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          sizeClasses[size],
          'p-0 transition-colors',
          voteState.voteType === 'down' 
            ? 'bg-red-100 text-red-700 hover:bg-red-100 cursor-default' 
            : voteState.hasVoted 
              ? 'opacity-50 cursor-not-allowed hover:bg-transparent' 
              : 'hover:bg-red-50 hover:text-red-600'
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
          className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 cursor-pointer"
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
