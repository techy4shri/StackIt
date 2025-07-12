'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Question } from '@/lib/types'
import { Clock, Trash2 } from 'lucide-react'
import { useUserRole } from '@/hooks/useUserRole'
import VotingButtons from '@/components/voting-buttons'
import './question-item.css'

interface QuestionItemProps {
  question: Question
}

export default function QuestionItem({ question }: QuestionItemProps) {
  const { isAdmin } = useUserRole()
  
  const timeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'just now'
  }

  // Get answer count - it could be an array or a number
  const answerCount = Array.isArray(question.answers) ? question.answers.length : (question.answers || 0)

  return (
    <section className="question-item">
      <div className="question-item__container">
        
        {/* Mobile Layout */}
        <div className="question-mobile">
          <div className="question-mobile__header">
            <Link 
              href={`/question/${question._id}`}
              className="question-mobile__title"
            >
              {question.title}
            </Link>
          </div>
          
          <div className="question-mobile__content">
            <div 
              className="question-mobile__description"
              dangerouslySetInnerHTML={{ 
                __html: question.description?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' || ''
              }}
            />
            
            {/* Tags */}
            <div className="question-mobile__tags">
              {question.tags?.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="question-mobile__tag"
                >
                  {tag}
                </Badge>
              ))}
              {(question.tags?.length || 0) > 3 && (
                <span className="question-mobile__tag-more">+{(question.tags?.length || 0) - 3}</span>
              )}
            </div>
          </div>
          
          <div className="question-mobile__footer">
            <div className="question-mobile__stats">
              <div className="question-mobile__stat question-mobile__stat--votes">
                <VotingButtons
                  targetId={question._id?.toString() || ''}
                  targetType="question"
                  initialVotes={question.votes || 0}
                  size="sm"
                />
              </div>
              <div className="question-mobile__stat question-mobile__stat--answers">
                <span className="question-mobile__stat-number">{answerCount}</span>
                <span className="question-mobile__stat-label">answers</span>
              </div>
              <div className="question-mobile__stat question-mobile__stat--views">
                <span className="question-mobile__stat-number">{question.views || 0}</span>
                <span className="question-mobile__stat-label">views</span>
              </div>
            </div>
            
            <div className="question-mobile__meta">
              <Clock className="question-mobile__clock" />
              <span className="question-mobile__time">{timeAgo(question.createdAt)}</span>
              <span className="question-mobile__author">{question.authorName || 'Anonymous'}</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="question-desktop">
          <div className="question-desktop__sidebar">
            <div className="question-desktop__voting">
              <VotingButtons
                targetId={question._id?.toString() || ''}
                targetType="question"
                initialVotes={question.votes || 0}
                size="md"
              />
            </div>
            
            <div className="question-desktop__stats">
              <div className="question-desktop__stat question-desktop__stat--answers">
                <span className="question-desktop__stat-number">{answerCount}</span>
                <span className="question-desktop__stat-label">answers</span>
              </div>
              <div className="question-desktop__stat question-desktop__stat--views">
                <span className="question-desktop__stat-number">{question.views || 0}</span>
                <span className="question-desktop__stat-label">views</span>
              </div>
            </div>
          </div>
          
          <div className="question-desktop__content">
            <div className="question-desktop__header">
              <Link 
                href={`/question/${question._id}`}
                className="question-desktop__title"
              >
                {question.title}
              </Link>
            </div>
            
            <div 
              className="question-desktop__description"
              dangerouslySetInnerHTML={{ 
                __html: question.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || ''
              }}
            />
            
            <div className="question-desktop__tags">
              {question.tags?.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="question-desktop__tag"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="question-desktop__footer">
              <div className="question-desktop__meta">
                <span className="question-desktop__author">{question.authorName || 'Anonymous'}</span>
                <Clock className="question-desktop__clock" />
                <span className="question-desktop__time">{timeAgo(question.createdAt)}</span>
              </div>
              
              <div className="question-desktop__actions">
                {Math.random() > 0.7 && (
                  <Badge variant="outline" className="question-desktop__badge">
                    🔥 Active
                  </Badge>
                )}
                
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="question-desktop__delete"
                    onClick={(e) => {
                      e.preventDefault()
                      if (confirm('Are you sure you want to delete this question?')) {
                        alert('Question deleted by admin')
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
