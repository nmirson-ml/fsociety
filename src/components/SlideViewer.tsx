import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  title: string
  html: string
}

function splitIntoSlides(html: string): Slide[] {
  // Split on h2 tag boundaries
  const parts = html.split(/(?=<h2[^>]*>)/i).filter(p => p.trim())
  if (parts.length === 0) return [{ title: '', html }]

  return parts.map(part => {
    const match = part.match(/<h2[^>]*>(.*?)<\/h2>/i)
    const title = match ? match[1].replace(/<[^>]+>/g, '') : ''
    return { title, html: part }
  })
}

function ContentRenderer({ html }: { html: string }) {
  return (
    <div
      className="
        lesson-content
        prose prose-invert prose-base max-w-none
        prose-headings:font-mono
        prose-h2:text-xl prose-h2:text-white prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-[#30363d] prose-h2:pb-2
        prose-h3:text-base prose-h3:text-[#58a6ff] prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-[#c9d1d9] prose-p:leading-7
        prose-ul:text-[#c9d1d9] prose-li:text-[#c9d1d9] prose-li:leading-7
        prose-ol:text-[#c9d1d9]
        prose-strong:text-white prose-strong:font-semibold
        prose-em:text-[#d29922] prose-em:not-italic
        prose-a:text-[#58a6ff] prose-a:no-underline hover:prose-a:underline
        prose-blockquote:border-l-[#d29922] prose-blockquote:bg-[#d29922]/5 prose-blockquote:rounded-r prose-blockquote:py-1 prose-blockquote:not-italic
        prose-blockquote:text-[#d29922]
        prose-code:text-[#3fb950] prose-code:bg-[#0d1f0f] prose-code:border prose-code:border-[#3fb950]/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-[0.8em] prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#30363d] prose-pre:rounded-lg prose-pre:text-sm
        prose-pre:shadow-lg
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

interface SlideViewerProps {
  html: string
  currentTab: string
}

export function SlideViewer({ html, currentTab }: SlideViewerProps) {
  const [slides, setSlides] = useState<Slide[]>([])
  const [index, setIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Re-parse slides when html changes
  useEffect(() => {
    setSlides(splitIntoSlides(html))
    setIndex(0)
  }, [html])

  // Reset to slide 0 when tab changes
  useEffect(() => {
    setIndex(0)
  }, [currentTab])

  // Scroll to top on slide change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [index])

  const goTo = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(i, slides.length - 1)))
  }, [slides.length])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Only handle when not focused on an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight') goTo(index + 1)
      if (e.key === 'ArrowLeft') goTo(index - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, goTo])

  if (slides.length === 0) return null

  const total = slides.length
  const current = slides[index]

  // Progress dots — compress if >12 slides
  const MAX_DOTS = 12
  const showDots = total <= MAX_DOTS
    ? slides.map((_, i) => i)
    : (() => {
        // Always show first, last, current, and neighbors
        const set = new Set<number>([0, total - 1, index])
        if (index > 0) set.add(index - 1)
        if (index < total - 1) set.add(index + 1)
        // Fill up to MAX_DOTS
        let i = 0
        while (set.size < MAX_DOTS && i < total) { set.add(i++); }
        return Array.from(set).sort((a, b) => a - b)
      })()

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-[#30363d] bg-[#0d1117] flex-shrink-0">
        <span className="text-[10px] text-[#484f58] font-mono">
          Slide {index + 1} / {total}
        </span>
        <div className="flex items-center gap-1">
          {showDots.map((dotIdx, pos) => {
            const isGap = pos > 0 && showDots[pos - 1] !== dotIdx - 1
            return (
              <span key={dotIdx} className="flex items-center gap-1">
                {isGap && <span className="text-[#484f58] text-[8px]">…</span>}
                <button
                  onClick={() => goTo(dotIdx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    dotIdx === index
                      ? 'bg-[#58a6ff] w-3'
                      : 'bg-[#30363d] hover:bg-[#8b949e]'
                  }`}
                  title={slides[dotIdx].title || `Slide ${dotIdx + 1}`}
                />
              </span>
            )
          })}
        </div>
        <span className="text-[10px] text-[#484f58] font-mono invisible">pad</span>
      </div>

      {/* Slide content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <ContentRenderer html={current.html} />
        </div>
      </div>

      {/* Nav bar */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-[#30363d] bg-[#0d1117] flex-shrink-0">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-mono transition-all ${
            index === 0
              ? 'text-[#484f58] cursor-not-allowed'
              : 'text-[#8b949e] hover:text-white hover:bg-[#161b22] border border-[#30363d]'
          }`}
        >
          <ChevronLeft size={13} />
          Prev
        </button>

        <span className="text-[11px] text-[#8b949e] font-mono">
          {index + 1} of {total}
        </span>

        <button
          onClick={() => goTo(index + 1)}
          disabled={index === total - 1}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-mono transition-all ${
            index === total - 1
              ? 'text-[#484f58] cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          Next
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
