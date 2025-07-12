'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import RichTextEditor from '@/components/rich-text-editor'
import TagInput from '@/components/tag-input'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AskQuestionPage() {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isSignedIn) {
    router.push('/sign-in')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !description.trim() || tags.length === 0) {
      alert('Please fill in all fields and add at least one tag')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          tags,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/question/${data.questionId}`)
      } else {
        alert('Error creating question. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting question:', error)
      alert('Error creating question. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your question"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <div className="mt-1">
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="mt-1">
                <TagInput
                  tags={tags}
                  onChange={setTags}
                  placeholder="Add relevant tags (e.g., React, JavaScript, CSS)"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Publishing...' : 'Submit Question'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}