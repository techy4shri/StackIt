import { ObjectId } from 'mongodb'

export interface Question {
  _id?: ObjectId
  title: string
  description: string
  tags: string[]
  authorId: string
  authorName: string
  authorImage?: string
  createdAt: Date
  votes: number
  answers: Answer[]
  acceptedAnswerId?: string
}

export interface Answer {
  _id?: ObjectId
  questionId: string
  content: string
  authorId: string
  authorName: string
  authorImage?: string
  createdAt: Date
  votes: number
  isAccepted: boolean
}

export interface Vote {
  _id?: ObjectId
  userId: string
  targetId: string
  targetType: 'question' | 'answer'
  voteType: 'up' | 'down'
  createdAt: Date
}

export interface Notification {
  _id?: ObjectId
  userId: string
  type: 'answer' | 'comment' | 'mention' | 'accepted'
  message: string
  read: boolean
  createdAt: Date
  relatedId?: string
}