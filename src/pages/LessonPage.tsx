import { useParams, Link } from 'react-router-dom'
import { useState, useCallback } from 'react'
import {
  ArrowLeft, ChevronRight, Terminal, Shield, Target,
  Zap, CheckCircle, Maximize2, X, Network,
} from 'lucide-react'
import { Terminal as TerminalComponent } from '@/components/Terminal/Terminal'
import { MissionPanel } from '@/components/Terminal/MissionPanel'
import { SlideViewer } from '@/components/SlideViewer'
import { MODULES } from '@/data/curriculum'
import { useProgress } from '@/store/progress'
import type { Lesson, Scenario } from '@/types'
import { LESSON_CONTENT } from '@/data/lessonContent'
import { LESSON_IMAGES, TAB_IMAGES } from '@/data/lessonImages'
import { getScenario } from '@/terminal/scenarios/index'

/** Extract runnable command from hint text like "Try: nmap -sV 10.0.0.1 — note" */
function extractCommand(hint?: string): string | null {
  if (!hint?.startsWith('Try:')) return null
  let raw = hint.slice(4).trim()
  raw = raw.replace(/\s+[—–]\s+.+$/, '').trim()
  raw = raw.split(/\s+or\s+/)[0].trim()
  return raw || null
}

type Tab = 'concept' | 'technique' | 'lab' | 'defense'

const TABS: { id: Tab; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'concept',   label: 'Concept',        icon: <Target size={13} />,   color: 'text-[#58a6ff]' },
  { id: 'technique', label: 'How Pros Do It',  icon: <Terminal size={13} />, color: 'text-[#f85149]' },
  { id: 'lab',       label: 'Lab',             icon: <Terminal size={13} />, color: 'text-[#3fb950]' },
  { id: 'defense',   label: 'Defense',         icon: <Shield size={13} />,   color: 'text-[#d29922]' },
]

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
      >
        <X size={24} />
      </button>
      <img
        src={src}
        alt="Diagram"
        className="max-w-full max-h-full rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}

// ─── Hero image ───────────────────────────────────────────────────────────────
function LessonHeroImage({ slug, tab }: { slug: string; tab: Tab }) {
  const [lightbox, setLightbox] = useState(false)

  const tabOverride = TAB_IMAGES[slug]?.[tab as 'concept' | 'technique' | 'defense']
  const src = tabOverride ?? LESSON_IMAGES[slug]
  if (!src || tab === 'lab') return null

  return (
    <>
      <div
        className="relative rounded-lg overflow-hidden border border-[#30363d] mb-8 cursor-zoom-in group"
        onClick={() => setLightbox(true)}
      >
        <img src={src} alt="Lesson diagram" className="w-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-end p-3">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded px-2 py-1 flex items-center gap-1 text-xs text-white font-mono">
            <Maximize2 size={11} /> Click to expand
          </div>
        </div>
      </div>
      {lightbox && <Lightbox src={src} onClose={() => setLightbox(false)} />}
    </>
  )
}

// ─── Placeholder when content not yet written ─────────────────────────────────
function PlaceholderContent({ tab }: { tab: Tab }) {
  const msgs: Record<Tab, { emoji: string; title: string; tip: string }> = {
    concept:   { emoji: '📖', title: 'Concept Overview', tip: 'Deep-dive lesson content is being written. Switch tabs to explore the lab!' },
    technique: { emoji: '🎯', title: 'APT Technique Breakdown', tip: 'Real-world attack patterns from nation-state groups — content coming soon.' },
    lab:       { emoji: '💻', title: 'Hands-On Lab', tip: 'Open the lab terminal and type help to start exploring.' },
    defense:   { emoji: '🔒', title: 'Defense & Detection', tip: 'In the terminal try: defend phishing | defend nmap | defend persistence' },
  }
  const m = msgs[tab]
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h2 className="text-lg font-bold text-white font-mono mb-2">{m.emoji} {m.title}</h2>
        <p className="text-[#8b949e] text-sm">{m.tip}</p>
      </div>
    </div>
  )
}

// ─── Lab Briefing Card ────────────────────────────────────────────────────────
function LabBriefingCard({
  scenario,
  lesson,
  onStart,
}: {
  scenario: Scenario | null
  lesson: Lesson
  onStart: () => void
}) {
  if (scenario) {
    const diffColor =
      scenario.difficulty === 'beginner'     ? 'bg-[#3fb950]/10 text-[#3fb950] border-[#3fb950]/20' :
      scenario.difficulty === 'intermediate' ? 'bg-[#d29922]/10 text-[#d29922] border-[#d29922]/20' :
                                               'bg-[#f85149]/10 text-[#f85149] border-[#f85149]/20'

    const diffBorderColor =
      scenario.difficulty === 'beginner'     ? 'border-[#3fb950]/30' :
      scenario.difficulty === 'intermediate' ? 'border-[#d29922]/30' :
                                               'border-[#f85149]/30'

    // Extract skill keywords from objective hints (first word after "Try: ")
    const skills = Array.from(new Set(
      scenario.objectives
        .map(o => o.hint?.match(/Try:\s*([\w-]+)/)?.[1])
        .filter(Boolean) as string[]
    ))

    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">

          {/* Header */}
          <div className={`border ${diffBorderColor} rounded-xl overflow-hidden bg-[#0d1117]`}>

            {/* Title bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-[#58a6ff]" />
                <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">Mission Briefing</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${diffColor}`}>
                {scenario.difficulty}
              </span>
            </div>

            <div className="p-5 space-y-5">

              {/* Title */}
              <div>
                <h2 className="text-lg font-bold text-white font-mono mb-1">{scenario.title}</h2>
              </div>

              {/* Role */}
              <div>
                <p className="text-[10px] font-mono text-[#58a6ff] uppercase tracking-widest mb-2">Your Role</p>
                <p className="text-sm text-[#c9d1d9] leading-relaxed">{scenario.description}</p>
              </div>

              {/* What you will do */}
              <div>
                <p className="text-[10px] font-mono text-[#58a6ff] uppercase tracking-widest mb-2">What You Will Do</p>
                <div className="space-y-2">
                  {scenario.objectives.map((obj, i) => (
                    <div key={obj.id} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[9px] text-[#8b949e] font-mono mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm text-[#c9d1d9]">{obj.description}</p>
                        {extractCommand(obj.hint) && (
                          <code className="text-[10px] text-[#3fb950] font-mono bg-[#0d1f0f] border border-[#3fb950]/20 px-2 py-0.5 rounded mt-1 inline-block">
                            $ {extractCommand(obj.hint)}
                          </code>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target environment */}
              {scenario.network.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-[#58a6ff] uppercase tracking-widest mb-2">Target Environment</p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.network.map(host => (
                      <div
                        key={host.ip}
                        className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2"
                      >
                        <Network size={11} className="text-[#484f58] flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-white font-mono">{host.hostname}</p>
                          <p className="text-[9px] text-[#484f58] font-mono">{host.ip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills practiced */}
              {skills.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-[#58a6ff] uppercase tracking-widest mb-2">Skills Practiced</p>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(skill => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-[#c9d1d9]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hint */}
              <p className="text-[10px] text-[#484f58] font-mono text-center">
                The mission panel will always show your current task and the exact command to run.
              </p>

              {/* CTA */}
              <button
                onClick={onStart}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm"
              >
                <Terminal size={14} />
                Launch Terminal →
              </button>

            </div>
          </div>
        </div>
      </div>
    )
  }

  // No scenario — sandbox mode
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-lg w-full">
        <h2 className="text-xl font-bold text-white font-mono mb-2">🔬 Sandbox Terminal</h2>
        <p className="text-[#8b949e] text-sm mb-6 leading-relaxed">
          Explore <strong className="text-white">{lesson.title}</strong> concepts hands-on.
          No objectives — just an interactive terminal to experiment with.
        </p>

        <div className="border border-[#30363d] rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
            <p className="text-[10px] text-[#8b949e] font-mono uppercase tracking-wider">Suggested Commands</p>
          </div>
          <div className="px-4 py-3 space-y-2">
            {['help', 'nmap -sV 10.0.0.1', 'mitre T1190', 'defend nmap', 'defend phishing'].map(cmd => (
              <code key={cmd} className="block text-[11px] text-[#3fb950] font-mono">
                $ {cmd}
              </code>
            ))}
          </div>
        </div>

        <button
          onClick={onStart}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm"
        >
          <Terminal size={14} />
          Open Terminal
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function LessonPage() {
  const { slug } = useParams<{ slug: string }>()
  const { completedLessons, completeLesson } = useProgress()
  const [activeTab, setActiveTab] = useState<Tab>('concept')
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([])
  const [labStarted, setLabStarted] = useState(false)
  const [pendingCommand, setPendingCommand] = useState<{ cmd: string; id: number } | null>(null)

  const handleObjectiveComplete = useCallback((objId: string) => {
    setCompletedObjectives(prev => prev.includes(objId) ? prev : [...prev, objId])
  }, [])

  const handleInjectCommand = useCallback((cmd: string) => {
    setPendingCommand(prev => ({ cmd, id: (prev?.id ?? 0) + 1 }))
  }, [])

  let lesson: Lesson | undefined
  let moduleId: string | undefined
  for (const m of MODULES) {
    const found = m.lessons.find(l => l.slug === slug)
    if (found) { lesson = found; moduleId = m.id; break }
  }

  if (!lesson || !slug) return (
    <div className="p-6 text-[#8b949e] font-mono">Lesson not found.</div>
  )

  const isDone   = completedLessons.includes(lesson.id)
  const content  = LESSON_CONTENT[slug]
  const scenario: Scenario | null = lesson.scenarioId ? getScenario(lesson.scenarioId) : null

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#30363d] bg-[#0d1117] flex-shrink-0 flex-wrap">
        <Link
          to={`/module/${moduleId}`}
          className="flex items-center gap-1 text-[#8b949e] hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft size={12} />
          Back
        </Link>
        <ChevronRight size={12} className="text-[#484f58]" />
        <span className="text-xs font-mono text-white truncate max-w-xs">{lesson.title}</span>

        <div className="flex gap-1.5 ml-2">
          {lesson.mitreIds.slice(0, 3).map(id => (
            <span key={id} className="mitre-badge">{id}</span>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1 text-[#d29922] text-xs font-mono">
            <Zap size={11} />{lesson.xp} XP
          </div>
          {isDone ? (
            <div className="flex items-center gap-1 text-[#3fb950] text-xs font-mono">
              <CheckCircle size={14} />Completed
            </div>
          ) : (
            <button
              onClick={() => completeLesson(lesson!.id, lesson!.xp)}
              className="btn-primary text-xs px-3 py-1.5"
            >
              Mark Complete
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 px-6 py-2 border-b border-[#30363d] bg-[#0d1117] flex-shrink-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-mono transition-all ${
              activeTab === tab.id
                ? `bg-[#161b22] border border-[#30363d] ${tab.color}`
                : 'text-[#8b949e] hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'lab' ? (
          <div className="h-full flex overflow-hidden">
            {!labStarted ? (
              <LabBriefingCard
                scenario={scenario}
                lesson={lesson}
                onStart={() => setLabStarted(true)}
              />
            ) : (
              <>
                {scenario && (
                  <MissionPanel
                    scenario={scenario}
                    completedObjectiveIds={completedObjectives}
                    compact
                    onInjectCommand={handleInjectCommand}
                  />
                )}
                <div className="flex-1 p-4">
                  <TerminalComponent
                    key={scenario?.id ?? 'free'}
                    scenario={scenario}
                    className="h-full"
                    onObjectiveComplete={handleObjectiveComplete}
                    pendingCommand={pendingCommand}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Hero image + title — always visible above slideshow */}
            <div className="max-w-3xl mx-auto w-full px-6 pt-6 flex-shrink-0">
              <LessonHeroImage slug={slug} tab={activeTab} />
              <h1 className="text-2xl font-bold text-white font-mono mb-1">{lesson.title}</h1>
              <p className="text-[#8b949e] mb-4 text-sm leading-relaxed">{lesson.description}</p>
            </div>

            {/* Slideshow or placeholder */}
            <div className="flex-1 overflow-hidden">
              {content?.[activeTab as keyof typeof content] ? (
                <SlideViewer
                  html={content[activeTab as keyof typeof content] as string}
                  currentTab={activeTab}
                />
              ) : (
                <div className="h-full overflow-y-auto">
                  <div className="max-w-3xl mx-auto px-6 pb-8">
                    <PlaceholderContent tab={activeTab} />
                    {scenario && (
                      <div className="mt-10 flex items-center justify-between border border-[#3fb950]/20 bg-[#3fb950]/5 rounded-lg p-4">
                        <div>
                          <p className="text-[#3fb950] text-sm font-mono font-semibold">Ready to practice?</p>
                          <p className="text-[#8b949e] text-xs mt-0.5">
                            Click the <span className="text-[#3fb950]">Lab</span> tab to use the interactive terminal.
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab('lab')}
                          className="flex items-center gap-2 bg-[#3fb950]/10 border border-[#3fb950]/30 hover:bg-[#3fb950]/20 text-[#3fb950] font-mono text-xs px-4 py-2 rounded transition-colors"
                        >
                          <Terminal size={13} />
                          Open Lab
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
