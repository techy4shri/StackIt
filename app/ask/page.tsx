'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import RichTextEditor from '@/components/rich-text-editor'
import TagInput from '@/components/tag-input'
import { sendMentionNotifications } from '@/lib/mentions'

export default function AskQuestionPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
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
        
        // Send mention notifications
        await sendMentionNotifications(description, 'question')
        
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Ask a Public Question</h1>
        <p className="text-muted-foreground">
          Get help from millions of developers worldwide. Be specific and provide enough context for others to understand your problem.
        </p>
      </div>
      
      <Card className="card-glow shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="StackIt-gradient h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              ?
            </div>
            Writing a good question
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            You&apos;re ready to ask a programming-related question and this form will help guide you through the process.
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <Label htmlFor="title" className="text-base font-semibold">Title</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Be specific and imagine you&apos;re asking a question to another person.
              </p>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., How do I implement authentication in Next.js 15?"
                className="mt-1 input-enhanced text-base p-4 h-12"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-semibold">What are the details of your problem?</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Introduce the problem and expand on what you put in the title. Minimum 20 characters.
              </p>
              <div className="mt-1 border border-border rounded-lg overflow-hidden">
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags" className="text-base font-semibold">Tags</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
              </p>
              <div className="mt-1">
                <TagInput
                  tags={tags}
                  onChange={setTags}
                  placeholder="e.g., javascript react nextjs typescript"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="StackIt-gradient text-white btn-modern px-8 py-3 text-base font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-pulse mr-2 h-4 w-4 rounded-full bg-white/50"></div>
                    Publishing...
                  </>
                ) : (
                  'Post Your Question'
                )}
              </Button>
              <Button 
                type="button"
                variant="outline"
                className="btn-modern px-6"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Help sidebar */}
      <Card className="mt-8 bg-blue-50/50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Tips for getting answers</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Search for similar questions before posting</li>
            <li>• Provide a minimal, reproducible example</li>
            <li>• Include relevant error messages</li>
            <li>• Describe what you&apos;ve tried already</li>
            <li>• Be specific about your environment</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}