'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface VoteState {
  hasVoted: boolean
  voteType: 'up' | 'down' | null
  votes: number
}

export function useVoting(targetId: string, targetType: 'question' | 'answer', initialVotes: number) {
  const { user } = useUser()
  const router = useRouter()
  const [voteState, setVoteState] = useState<VoteState>({
    hasVoted: false,
    voteType: null,
    votes: initialVotes
  })
  const [loading, setLoading] = useState(false)

  // Check if user has already voted
  useEffect(() => {
    async function checkUserVote() {
      if (!user) return

      try {
        const response = await fetch(`/api/${targetType}s/${targetId}/vote/check`)
        if (response.ok) {
          const data = await response.json()
          setVoteState(prev => ({
            ...prev,
            hasVoted: data.hasVoted,
            voteType: data.voteType
          }))
        }
      } catch (error) {
        console.error('Error checking vote:', error)
      }
    }

    checkUserVote()
  }, [user, targetId, targetType])

  const vote = async (voteType: 'up' | 'down') => {
    // Redirect guests to auth page
    if (!user) {
      router.push('/auth')
      return
    }

    // Prevent voting if user already voted
    if (voteState.hasVoted) {
      alert('You have already voted on this item.')
      return
    }

    if (loading) return

    setLoading(true)
    try {
      const response = await fetch(`/api/${targetType}s/${targetId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      })

      if (response.ok) {
        // Update local state - one vote per user, no toggling allowed
        setVoteState(prev => ({
          hasVoted: true,
          voteType: voteType,
          votes: prev.votes + (voteType === 'up' ? 1 : -1)
        }))
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to vote')
      }
    } catch (error) {
      console.error('Error voting:', error)
      alert('Failed to vote')
    } finally {
      setLoading(false)
    }
  }

  return {
    voteState,
    vote,
    loading,
    canVote: !!user
  }
}
