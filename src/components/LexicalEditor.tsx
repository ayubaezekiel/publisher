import { useCallback, useEffect, useState } from 'react'

import { $createCodeNode, CodeNode } from '@lexical/code'
import {
  $createListItemNode,
  $createListNode,
  ListItemNode,
  ListNode,
} from '@lexical/list'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingNode,
  QuoteNode,
} from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'

// ─── Types ──────────────────────────────────────────────────────────────────────

type BlockFormat =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'quote'
  | 'bullet'
  | 'number'
  | 'code'

// ─── SVG icons (inline, no dependency) ──────────────────────────────────────────

const Icon = {
  Undo: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M3 6H9C11.2 6 13 7.8 13 10s-1.8 4-4 4H5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M5 4L3 6l2 2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Redo: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M12 6H6C3.8 6 2 7.8 2 10s1.8 4 4 4h4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M10 4l2 2-2 2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Bold: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M4 3h5a3 3 0 010 6H4V3zM4 9h5.5a3.5 3.5 0 010 7H4V9z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Italic: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M6 3h5M4 12h5M9 3l-3 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  Underline: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M3 2v5a4 4 0 008 0V2M2 13h11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  Strikethrough: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 7.5h11M5 4c0-1.1.9-2 2.5-2S10 3 10 4.5c0 .8-.4 1.5-1 2M5 11c0 1.1 1 2 2.5 2S10 12.1 10 11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  Code: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M5 4L1 7.5 5 11M10 4l4 3.5L10 11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  AlignLeft: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 3h11M2 6h8M2 9h11M2 12h6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  AlignCenter: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 3h11M3.5 6h8M2 9h11M4.5 12h6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  AlignRight: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 3h11M5 6h8M2 9h11M7 12h6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  AlignJustify: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 3h11M2 6h11M2 9h11M2 12h11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  IndentIncrease: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 3h11M6 6h7M6 9h7M2 12h11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M2 6.5l2.5 1L2 8.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  IndentDecrease: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 3h11M6 6h7M6 9h7M2 12h11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M4.5 6.5L2 7.5l2.5 1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

// ─── Toolbar (inside LexicalComposer) ───────────────────────────────────────────

function ToolbarPlugin({
  wordCount,
  readingTime,
  onPublish,
}: {
  wordCount: number
  readingTime: number
  onPublish: () => void
}) {
  const [editor] = useLexicalComposerContext()
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
  const [blockType, setBlockType] = useState<BlockFormat>('paragraph')
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) return

          const formats = new Set<string>()
          if (selection.hasFormat('bold')) formats.add('bold')
          if (selection.hasFormat('italic')) formats.add('italic')
          if (selection.hasFormat('underline')) formats.add('underline')
          if (selection.hasFormat('strikethrough')) formats.add('strikethrough')
          if (selection.hasFormat('code')) formats.add('inlinecode')
          setActiveFormats(formats)

          const anchorNode = selection.anchor.getNode()
          const element =
            anchorNode.getKey() === 'root'
              ? anchorNode
              : ($findMatchingParent(anchorNode, (e) => {
                  const parent = e.getParent()
                  return parent !== null && parent.getKey() === 'root'
                }) ?? anchorNode.getTopLevelElementOrThrow())

          const type = (element as any).getType?.()
          if (type === 'heading') {
            setBlockType(
              ($isHeadingNode(element as any)
                ? (element as any).getTag()
                : 'paragraph') as BlockFormat,
            )
          } else if (type === 'quote') {
            setBlockType('quote')
          } else if (type === 'list') {
            setBlockType(
              (element as ListNode).getListType() === 'bullet'
                ? 'bullet'
                : 'number',
            )
          } else if (type === 'code') {
            setBlockType('code')
          } else {
            setBlockType('paragraph')
          }
        })
      }),
      editor.registerCommand(
        UNDO_COMMAND,
        () => {
          setCanUndo(true)
          return false
        },
        1,
      ),
      editor.registerCommand(
        REDO_COMMAND,
        () => {
          setCanRedo(true)
          return false
        },
        1,
      ),
    )
  }, [editor])

  const applyBlock = useCallback(
    (format: BlockFormat) => {
      editor.update(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return
        switch (format) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
            $setBlocksType(selection, () => $createHeadingNode(format))
            break
          case 'quote':
            $setBlocksType(selection, () => $createQuoteNode())
            break
          case 'bullet':
            $setBlocksType(selection, () => {
              const list = $createListNode('bullet')
              list.append($createListItemNode())
              return list
            })
            break
          case 'number':
            $setBlocksType(selection, () => {
              const list = $createListNode('number')
              list.append($createListItemNode())
              return list
            })
            break
          case 'code':
            $setBlocksType(selection, () => $createCodeNode())
            break
          default:
            $setBlocksType(selection, () => $createParagraphNode())
        }
      })
    },
    [editor],
  )

  const fmt = (f: string) =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, f as any)
  const is = (f: string) => activeFormats.has(f)

  const blockOptions: Array<{ value: BlockFormat; label: string }> = [
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
    { value: 'h4', label: 'Heading 4' },
    { value: 'quote', label: 'Block Quote' },
    { value: 'bullet', label: 'Bullet List' },
    { value: 'number', label: 'Numbered List' },
    { value: 'code', label: 'Code Block' },
  ]

  return (
    <div className="sticky top-0 z-30 bg-background border-b">
      {/* Top row: title + stats + publish */}
      <div className="flex items-center justify-between px-4 h-12 gap-4">
        <span className="text-sm font-semibold text-foreground">Editor</span>

        <div className="flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
          <span>{wordCount.toLocaleString()} words</span>
          <span>·</span>
          <span>{readingTime} min read</span>
        </div>

        <Button size="sm" onClick={onPublish}>
          Publish
        </Button>
      </div>

      {/* Formatting row */}
      <div className="flex items-center gap-0.5 px-2 h-10 border-t overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Block type */}
        <Select
          value={blockType}
          onValueChange={(v) => applyBlock(v as BlockFormat)}
        >
          <SelectTrigger className="h-7 w-36 text-xs shrink-0 border-none shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {blockOptions.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-xs">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Undo / Redo */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={!canUndo}
          onMouseDown={(e) => {
            e.preventDefault()
            editor.dispatchCommand(UNDO_COMMAND, undefined)
          }}
          title="Undo (⌘Z)"
        >
          <Icon.Undo />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={!canRedo}
          onMouseDown={(e) => {
            e.preventDefault()
            editor.dispatchCommand(REDO_COMMAND, undefined)
          }}
          title="Redo (⌘⇧Z)"
        >
          <Icon.Redo />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Text formats */}
        <Toggle
          size="sm"
          className="h-7 w-7 p-0"
          pressed={is('bold')}
          onPressedChange={() => fmt('bold')}
          title="Bold (⌘B)"
        >
          <Icon.Bold />
        </Toggle>
        <Toggle
          size="sm"
          className="h-7 w-7 p-0"
          pressed={is('italic')}
          onPressedChange={() => fmt('italic')}
          title="Italic (⌘I)"
        >
          <Icon.Italic />
        </Toggle>
        <Toggle
          size="sm"
          className="h-7 w-7 p-0"
          pressed={is('underline')}
          onPressedChange={() => fmt('underline')}
          title="Underline (⌘U)"
        >
          <Icon.Underline />
        </Toggle>
        <Toggle
          size="sm"
          className="h-7 w-7 p-0"
          pressed={is('strikethrough')}
          onPressedChange={() => fmt('strikethrough')}
          title="Strikethrough"
        >
          <Icon.Strikethrough />
        </Toggle>
        <Toggle
          size="sm"
          className="h-7 w-7 p-0"
          pressed={is('inlinecode')}
          onPressedChange={() => fmt('code')}
          title="Inline Code"
        >
          <Icon.Code />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Alignment */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
          }}
          title="Align Left"
        >
          <Icon.AlignLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
          }}
          title="Align Center"
        >
          <Icon.AlignCenter />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
          }}
          title="Align Right"
        >
          <Icon.AlignRight />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
          }}
          title="Justify"
        >
          <Icon.AlignJustify />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-5" />

        {/* Indent */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
          }}
          title="Indent (Tab)"
        >
          <Icon.IndentIncrease />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onMouseDown={(e) => {
            e.preventDefault()
            editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
          }}
          title="Outdent (⇧Tab)"
        >
          <Icon.IndentDecrease />
        </Button>
      </div>
    </div>
  )
}

// ─── Word count plugin ───────────────────────────────────────────────────────────

function WordCountPlugin({ onChange }: { onChange: (n: number) => void }) {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent()
        onChange(text.split(/\s+/).filter(Boolean).length)
      })
    })
  }, [editor, onChange])
  return null
}

// ─── Lexical theme (maps to Tailwind / shadcn base classes) ─────────────────────

const theme = {
  root: 'sp-root focus:outline-none',
  paragraph: 'mb-4 last:mb-0',
  heading: { h1: 'sp-h1', h2: 'sp-h2', h3: 'sp-h3', h4: 'sp-h4' },
  quote: 'sp-quote',
  list: {
    nested: { listitem: 'ml-6' },
    ol: 'sp-ol',
    ul: 'sp-ul',
    listitem: 'sp-li',
    listitemChecked: 'sp-li-checked',
    listitemUnchecked: 'sp-li-unchecked',
  },
  code: 'sp-code',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    subscript: 'align-sub text-[0.75em]',
    superscript: 'align-super text-[0.75em]',
    code: 'sp-inline-code',
    underlineStrikethrough: 'underline line-through',
  },
}

// ─── Main export ─────────────────────────────────────────────────────────────────

export function LexicalEditor() {
  const [wordCount, setWordCount] = useState(0)
  const [published, setPublished] = useState(false)

  const readingTime = Math.max(1, Math.ceil(wordCount / 238))

  const initialConfig = {
    namespace: 'RichEditor',
    theme,
    onError: (e: Error) => console.error(e),
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode],
  }

  return (
    <>
      <style>{`
        .sp-root {
          font-size: 1rem;
          line-height: 1.75;
          color: hsl(var(--foreground));
          caret-color: hsl(var(--primary));
          min-height: 480px;
        }

        .sp-root .sp-h1 {
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin: 0 0 0.5em;
          color: hsl(var(--foreground));
        }
        .sp-root .sp-h2 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 1.4em 0 0.4em;
          color: hsl(var(--foreground));
          border-bottom: 1px solid hsl(var(--border));
          padding-bottom: 0.25em;
        }
        .sp-root .sp-h3 {
          font-size: 1.2rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 1.2em 0 0.35em;
          color: hsl(var(--foreground));
        }
        .sp-root .sp-h4 {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 1em 0 0.3em;
          color: hsl(var(--muted-foreground));
        }
        .sp-root .sp-quote {
          border-left: 3px solid hsl(var(--border));
          margin: 1.25em 0;
          padding: 0.5em 1.2em;
          color: hsl(var(--muted-foreground));
          font-style: italic;
          font-size: 1.05em;
        }
        .sp-root .sp-ul {
          list-style: none;
          padding-left: 1.4em;
          margin: 0.4em 0 1em;
        }
        .sp-root .sp-ul .sp-li::before {
          content: '–';
          color: hsl(var(--muted-foreground));
          display: inline-block;
          width: 1em;
          margin-left: -1em;
        }
        .sp-root .sp-ol {
          list-style: none;
          padding-left: 1.8em;
          margin: 0.4em 0 1em;
          counter-reset: sp-ol;
        }
        .sp-root .sp-ol .sp-li { counter-increment: sp-ol; }
        .sp-root .sp-ol .sp-li::before {
          content: counter(sp-ol) '.';
          color: hsl(var(--muted-foreground));
          display: inline-block;
          width: 1.5em;
          margin-left: -1.8em;
          font-variant-numeric: tabular-nums;
        }
        .sp-root .sp-li { margin: 0.2em 0; }
        .sp-root .sp-code {
          display: block;
          font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
          font-size: 0.85rem;
          line-height: 1.7;
          color: hsl(var(--foreground));
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          padding: 0.9em 1.1em;
          margin: 1em 0;
          overflow-x: auto;
          white-space: pre;
        }
        .sp-root .sp-inline-code {
          font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
          font-size: 0.83em;
          color: hsl(var(--foreground));
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 4px);
          padding: 0.1em 0.4em;
        }

        .sp-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          user-select: none;
          font-size: 1rem;
          line-height: 1.75;
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-background">
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin
            wordCount={wordCount}
            readingTime={readingTime}
            onPublish={() => setPublished(true)}
          />

          <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-8 py-10">
            <div className="relative border rounded-lg bg-card p-8 sm:p-12 shadow-sm">
              <div className="relative">
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable
                      className="outline-none"
                      aria-label="Article editor"
                      spellCheck
                    />
                  }
                  placeholder={
                    <div className="sp-placeholder">
                      Start writing your article…
                    </div>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground text-right tabular-nums">
              {wordCount.toLocaleString()} words · {readingTime} min read
            </p>
          </div>

          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <TabIndentationPlugin />
          <OnChangePlugin onChange={() => {}} />
          <WordCountPlugin onChange={setWordCount} />
        </LexicalComposer>

        {published && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setPublished(false)}
          >
            <div
              className="bg-card border rounded-xl p-8 max-w-sm w-full mx-4 text-center shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-2xl font-semibold text-foreground mb-2">
                Published
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Your article has been published successfully.
              </p>
              <Button className="w-full" onClick={() => setPublished(false)}>
                Continue Editing
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
