import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import { MentionList } from '../editor/mention-list'

export default {
  items: async ({ query }: { query: string }) => {
    if (!query) return []
    
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      return data.users || []
    } catch (error) {
      console.error('Error fetching users:', error)
      // Fallback to static data
      const users = [
        { id: '1', name: 'John Doe', username: 'johndoe' },
        { id: '2', name: 'Jane Smith', username: 'janesmith' },
        { id: '3', name: 'Bob Johnson', username: 'bobjohnson' },
        { id: '4', name: 'Alice Brown', username: 'alicebrown' },
        { id: '5', name: 'Charlie Wilson', username: 'charliewilson' },
      ]

      return users
        .filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    }
  },

  render: () => {
    let component: ReactRenderer
    let popup: TippyInstance[]

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props: any) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }

        if (component.ref && typeof (component.ref as any).onKeyDown === 'function') {
          return (component.ref as any).onKeyDown(props)
        }
        return false
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}
