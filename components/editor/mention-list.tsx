import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

interface User {
  id: string
  name: string
  username: string
}

interface MentionListProps {
  items: User[]
  command: (item: { id: string; label: string }) => void
}

export const MentionList = forwardRef<{onKeyDown: (props: any) => boolean}, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      props.command({ id: item.id, label: item.username })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  if (props.items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px]">
        <div className="text-gray-500 text-sm">No users found</div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[200px] max-h-60 overflow-y-auto">
      {props.items.map((item, index) => (
        <button
          key={item.id}
          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
            index === selectedIndex ? 'bg-blue-50 text-blue-600' : ''
          }`}
          onClick={() => selectItem(index)}
          type="button"
        >
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
            {item.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-gray-500 text-xs">@{item.username}</div>
          </div>
        </button>
      ))}
    </div>
  )
})
