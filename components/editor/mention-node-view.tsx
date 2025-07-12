import React from 'react'
import { NodeViewWrapper } from '@tiptap/react'

export const MentionNodeView = ({ node }: { node: any }) => {
  return (
    <NodeViewWrapper className="inline">
      <span
        className="inline-block px-1 py-0.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors cursor-pointer"
        data-id={node.attrs.id}
        data-label={node.attrs.label}
      >
        @{node.attrs.label}
      </span>
    </NodeViewWrapper>
  )
}
