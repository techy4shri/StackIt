// Helper function to extract @mentions from content
export function extractMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g
  const mentions: string[] = []
  let match

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1])
  }

  return [...new Set(mentions)] // Remove duplicates
}

// Helper function to send mention notifications
export async function sendMentionNotifications(
  content: string,
  type: 'question' | 'answer' | 'comment' = 'comment'
) {
  const mentions = extractMentions(content)
  
  if (mentions.length === 0) return
  
  try {
    await fetch('/api/mentions/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mentionedUsernames: mentions,
        content,
        type,
      }),
    })
  } catch (error) {
    console.error('Error sending mention notifications:', error)
  }
}
