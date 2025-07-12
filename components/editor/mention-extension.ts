/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { MentionNodeView } from './mention-node-view'

export interface MentionOptions {
  HTMLAttributes: Record<string, any>
  renderText: (_props: { options: MentionOptions; node: any }) => string
  suggestion: any
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mention: {
      insertMention: (attributes: { id: string; label: string }) => ReturnType
    }
  }
}

export const Mention = Node.create<MentionOptions>({
  name: 'mention',

  addOptions() {
    return {
      HTMLAttributes: {},
      renderText({ options, node }) {
        return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
      },
      suggestion: {
        char: '@',
        command: ({ editor, range, props }: any) => {
          const nodeAfter = editor.view.state.selection.$to.nodeAfter
          const overrideSpace = nodeAfter?.text?.startsWith(' ')

          if (overrideSpace) {
            range.to += 1
          }

          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run()

          window.getSelection()?.collapseToEnd()
        },
        allow: ({ state }: any) => {
          const $from = (state as any).selection.$from
          const type = (state as any).schema.nodes[this.name]
          const allow = !!$from.parent.type.contentMatch.matchType(type)

          if (!allow) {
            return false
          }

          return true
        },
      },
    }
  },

  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) return {}
          return { 'data-id': attributes.id }
        },
      },
      label: {
        default: null,
        parseHTML: element => element.getAttribute('data-label'),
        renderHTML: attributes => {
          if (!attributes.label) return {}
          return { 'data-label': attributes.label }
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: `span[data-type="${this.name}"]` }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        { 'data-type': this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      this.options.renderText({
        options: this.options,
        node,
      }),
    ]
  },

  renderText({ node }) {
    return this.options.renderText({
      options: this.options,
      node,
    })
  },

  addNodeView() {
    return ReactNodeViewRenderer(MentionNodeView)
  },

  addCommands() {
    return {
      insertMention:
        (attrs: { id: string; label: string }) =>
        ({ chain }) => {
          return chain().insertContent({
            type: this.name,
            attrs,
          }).run()
        },
    }
  },
})
