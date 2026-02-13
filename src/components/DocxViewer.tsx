import { useCallback, useRef, useState } from 'react'
import * as mammoth from 'mammoth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

// ─── Types ──────────────────────────────────────────────────────────────────────

interface ParsedPaper {
  title: string
  authors: Array<string>
  headings: Array<{ level: number; text: string }>
  abstract: string
  html: string
  wordCount: number
  fileName: string
  fileSize: string
  file: File
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function estimateReadingTime(wordCount: number) {
  return Math.max(1, Math.ceil(wordCount / 238))
}

/**
 * Extract structured metadata from the raw HTML mammoth produces.
 * mammoth maps Word heading styles → <h1>/<h2>/<h3> etc.
 */
function extractMetadata(
  html: string,
  fileName: string,
): Omit<ParsedPaper, 'html' | 'file' | 'wordCount' | 'fileSize' | 'fileName'> {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // ── Title: first <h1>, or fall back to filename stem ──
  const h1El = doc.querySelector('h1')
  const title =
    h1El?.textContent.trim() ||
    fileName.replace(/\.docx$/i, '').replace(/[-_]/g, ' ')

  // ── Authors: heuristic — paragraph(s) immediately after the first h1
  // that look like author lines (no full stops, relatively short)
  const authors: Array<string> = []
  if (h1El) {
    let sibling = h1El.nextElementSibling
    let checked = 0
    while (sibling && checked < 4) {
      const text = sibling.textContent.trim()
      const tag = sibling.tagName.toLowerCase()
      // Stop if we hit another heading or a long paragraph (body text)
      if (tag.startsWith('h') || text.length > 200) break
      // Author lines are typically short, no sentence-ending punctuation
      if (
        tag === 'p' &&
        text.length > 0 &&
        text.length < 120 &&
        !text.endsWith('.')
      ) {
        // Could be "Author1, Author2" or individual lines
        const parts = text
          .split(/,|;|&|and/i)
          .map((s) => s.trim())
          .filter(Boolean)
        authors.push(...parts)
      }
      sibling = sibling.nextElementSibling
      checked++
    }
  }

  // ── Abstract: paragraph starting with "Abstract" keyword ──
  let abstract = ''
  const paragraphs = Array.from(doc.querySelectorAll('p'))
  for (const p of paragraphs) {
    const text = p.textContent.trim()
    if (/^abstract[:\s]/i.test(text)) {
      abstract = text.replace(/^abstract[:\s]*/i, '').trim()
      break
    }
    // Also check if preceding sibling heading says "Abstract"
    const prev = p.previousElementSibling
    if (
      prev?.textContent.trim().toLowerCase() === 'abstract' &&
      text.length > 30
    ) {
      abstract = text
      break
    }
  }
  if (!abstract) {
    // Fall back: second or third paragraph if long enough
    const candidate = paragraphs.find((p) => p.textContent.trim().length > 100)
    abstract = candidate?.textContent.trim().slice(0, 400) ?? ''
    if (abstract && abstract.length === 400) abstract += '…'
  }

  // ── Headings: all h1–h4 ──
  const headingEls = doc.querySelectorAll('h1, h2, h3, h4')
  const headings = Array.from(headingEls).map((el) => ({
    level: parseInt(el.tagName[1], 10),
    text: el.textContent.trim(),
  }))

  return { title, authors, headings, abstract }
}

// ─── Drop zone ──────────────────────────────────────────────────────────────────

function DropZone({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handle = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.docx')) return
      onFile(file)
    },
    [onFile],
  )

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        handle(file)
      }}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors py-16 px-8',
        dragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/40',
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            className="text-muted-foreground"
          >
            <path
              d="M4 14v3a1 1 0 001 1h12a1 1 0 001-1v-3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M11 3v10M7.5 6.5L11 3l3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Drop your .docx file here
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            or click to browse
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground/60">
          Supports Microsoft Word (.docx) files
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handle(file)
        }}
      />
    </div>
  )
}

// ─── Paper metadata card ─────────────────────────────────────────────────────────

function PaperMetaCard({ paper }: { paper: ParsedPaper }) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground leading-snug">
              {paper.title}
            </h2>

            {paper.authors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {paper.authors.map((author, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {author}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 text-right text-xs text-muted-foreground space-y-1">
            <p>{paper.wordCount.toLocaleString()} words</p>
            <p>{estimateReadingTime(paper.wordCount)} min read</p>
            <p>{paper.fileSize}</p>
          </div>
        </div>

        {paper.abstract && (
          <>
            <Separator className="mt-4 mb-3" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Abstract
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {paper.abstract}
              </p>
            </div>
          </>
        )}
      </CardHeader>

      {paper.headings.length > 0 && (
        <CardContent className="pt-0">
          <Separator className="mb-3" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
            Contents
          </p>
          <div className="space-y-1">
            {paper.headings.slice(0, 12).map((h, i) => (
              <div
                key={i}
                className={cn(
                  'text-sm text-foreground/80 truncate leading-snug',
                  h.level === 1 && 'font-semibold text-foreground',
                  h.level === 2 && 'pl-3 text-foreground/90',
                  h.level === 3 && 'pl-6 text-muted-foreground',
                  h.level >= 4 && 'pl-9 text-muted-foreground text-xs',
                )}
              >
                {h.level >= 2 && (
                  <span className="text-muted-foreground/40 mr-1.5 text-xs">
                    {'─'.repeat(h.level - 1)}
                  </span>
                )}
                {h.text}
              </div>
            ))}
            {paper.headings.length > 12 && (
              <p className="text-xs text-muted-foreground pl-3">
                +{paper.headings.length - 12} more sections
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// ─── Document preview ────────────────────────────────────────────────────────────

function DocPreview({ html }: { html: string }) {
  return (
    <>
      <style>{`
        .docx-preview {
          font-size: 15px;
          line-height: 1.8;
          color: hsl(var(--foreground));
          font-family: ui-serif, Georgia, 'Times New Roman', serif;
        }
        .docx-preview h1 {
          font-size: 1.9rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 0.5em;
          letter-spacing: -0.02em;
          color: hsl(var(--foreground));
        }
        .docx-preview h2 {
          font-size: 1.35rem;
          font-weight: 600;
          margin: 1.6em 0 0.45em;
          padding-bottom: 0.3em;
          border-bottom: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
        }
        .docx-preview h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 1.3em 0 0.35em;
          color: hsl(var(--foreground));
        }
        .docx-preview h4, .docx-preview h5, .docx-preview h6 {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 1em 0 0.3em;
          color: hsl(var(--muted-foreground));
        }
        .docx-preview p {
          margin: 0 0 1em;
        }
        .docx-preview p:last-child { margin-bottom: 0; }
        .docx-preview strong { font-weight: 700; }
        .docx-preview em { font-style: italic; }
        .docx-preview u { text-decoration: underline; }
        .docx-preview s { text-decoration: line-through; }
        .docx-preview blockquote {
          border-left: 3px solid hsl(var(--border));
          margin: 1.4em 0;
          padding: 0.5em 1.2em;
          color: hsl(var(--muted-foreground));
          font-style: italic;
        }
        .docx-preview ul {
          list-style: disc;
          padding-left: 1.6em;
          margin: 0.5em 0 1em;
        }
        .docx-preview ol {
          list-style: decimal;
          padding-left: 1.6em;
          margin: 0.5em 0 1em;
        }
        .docx-preview li { margin: 0.2em 0; }
        .docx-preview table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.2em 0;
          font-size: 0.9em;
        }
        .docx-preview th {
          background: hsl(var(--muted));
          font-weight: 600;
          text-align: left;
          padding: 0.5em 0.75em;
          border: 1px solid hsl(var(--border));
        }
        .docx-preview td {
          padding: 0.45em 0.75em;
          border: 1px solid hsl(var(--border));
          vertical-align: top;
        }
        .docx-preview tr:nth-child(even) td {
          background: hsl(var(--muted) / 0.4);
        }
        .docx-preview img {
          max-width: 100%;
          height: auto;
          border-radius: calc(var(--radius) - 2px);
          margin: 1em 0;
        }
        .docx-preview a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .docx-preview code {
          font-family: ui-monospace, 'SFMono-Regular', Menlo, monospace;
          font-size: 0.83em;
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 4px);
          padding: 0.1em 0.4em;
        }
        .docx-preview pre {
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          padding: 1em;
          overflow-x: auto;
          margin: 1em 0;
        }
        .docx-preview pre code {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.85em;
        }
        .docx-preview sup { font-size: 0.72em; vertical-align: super; }
        .docx-preview sub { font-size: 0.72em; vertical-align: sub; }
        .docx-preview hr {
          border: none;
          border-top: 1px solid hsl(var(--border));
          margin: 2em 0;
        }
      `}</style>
      <div
        className="docx-preview"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────────

export function DocxViewer() {
  const [paper, setPaper] = useState<ParsedPaper | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setLoading(true)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()

      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          styleMap: [
            "p[style-name='Title'] => h1.doc-title",
            "p[style-name='Subtitle'] => p.doc-subtitle",
            "p[style-name='Author'] => p.doc-author",
            "p[style-name='Abstract'] => blockquote.doc-abstract",
            "r[style-name='Strong'] => strong",
          ],
        },
      )

      const html = result.value
      const text = html.replace(/<[^>]+>/g, ' ')
      const wordCount = text.split(/\s+/).filter(Boolean).length
      const meta = extractMetadata(html, file.name)

      setPaper({
        ...meta,
        html,
        wordCount,
        fileName: file.name,
        fileSize: formatBytes(file.size),
        file,
      })
    } catch (err) {
      setError(
        "Failed to parse the document. Please ensure it's a valid .docx file.",
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDownload = useCallback(() => {
    if (!paper) return
    const url = URL.createObjectURL(paper.file)
    const a = document.createElement('a')
    a.href = url
    a.download = paper.fileName
    a.click()
    URL.revokeObjectURL(url)
  }, [paper])

  const handleReset = useCallback(() => {
    setPaper(null)
    setError(null)
  }, [])

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3 text-muted-foreground">
        <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
        <p className="text-sm">Parsing document…</p>
      </div>
    )
  }

  // ── Upload state ──
  if (!paper) {
    return (
      <div className="max-w-xl mx-auto w-full py-12 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Document Viewer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a Word document to preview and download it
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <DropZone onFile={handleFile} />
      </div>
    )
  }

  // ── Preview state ──
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background border-b">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              className="shrink-0 text-muted-foreground"
            >
              <path
                d="M3 1h6l3 3v10H3V1z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M9 1v3h3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-muted-foreground truncate">
              <span className="text-foreground font-medium">
                {paper.fileName}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="mr-1.5"
              >
                <path
                  d="M2 10v2h10v-2M7 2v7M4.5 6.5L7 9l2.5-2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="mr-1.5"
              >
                <path
                  d="M2 2l10 10M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Remove
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
        {/* Left: metadata card (sticky on desktop) */}
        <div className="lg:sticky lg:top-20">
          <PaperMetaCard paper={paper} />
        </div>

        {/* Right: full document */}
        <div className="border rounded-lg bg-card shadow-sm">
          <div className="flex items-center justify-between px-6 py-3 border-b">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Preview
            </span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
              <span>{paper.wordCount.toLocaleString()} words</span>
              <span>·</span>
              <span>{estimateReadingTime(paper.wordCount)} min read</span>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="px-8 sm:px-12 py-10">
              <DocPreview html={paper.html} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
