'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface VoteState {
  hasVoted: boolean
  voteType: 'up' | 'down' | null
  votes: number
}

export function useVoting(targetId: string, targetType: 'question' | 'answer', initialVotes: number) {
  const { user } = useUser()
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
    if (!user || loading) return

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
        // Update local state based on voting logic
        setVoteState(prev => {
          let newVotes = prev.votes
          let newVoteType: 'up' | 'down' | null = voteType
          let newHasVoted = true

          if (prev.hasVoted && prev.voteType === voteType) {
            // Remove vote if same type
            newVotes += voteType === 'up' ? -1 : 1
            newVoteType = null
            newHasVoted = false
          } else if (prev.hasVoted && prev.voteType !== voteType) {
            // Change vote type
            newVotes += voteType === 'up' ? 2 : -2
          } else {
            // New vote
            newVotes += voteType === 'up' ? 1 : -1
          }

          return {
            hasVoted: newHasVoted,
            voteType: newVoteType,
            votes: newVotes
          }
        })
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
