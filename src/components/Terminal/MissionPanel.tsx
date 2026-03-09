import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Target, Terminal } from 'lucide-react'
import type { Scenario } from '@/types'

interface MissionPanelProps {
  scenario: Scenario
  completedObjectiveIds: string[]
  /** compact mode — used inside LessonPage alongside the terminal */
  compact?: boolean
  /** Called when user clicks a command chip — parent injects it into the terminal */
  onInjectCommand?: (cmd: string) => void
}

/** Extract the runnable command from a hint like "Try: nmap -sV 10.0.0.1 — description" */
function extractCommand(hint?: string): string | null {
  if (!hint?.startsWith('Try:')) return null
  let raw = hint.slice(4).trim()
  // Remove trailing explanation after em-dash
  raw = raw.replace(/\s+[—–]\s+.+$/, '').trim()
  // If multiple commands like "cmd1 or cmd2", take the first
  raw = raw.split(/\s+or\s+/)[0].trim()
  return raw || null
}

export function MissionPanel({
  scenario,
  completedObjectiveIds,
  compact = false,
  onInjectCommand,
}: MissionPanelProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastCountRef = useRef(completedObjectiveIds.length)

  const total     = scenario.objectives.length
  const completed = completedObjectiveIds.length
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0
  const allDone   = completed >= total

  const completedObjs  = scenario.objectives.filter(o => completedObjectiveIds.includes(o.id))
  const incompleteObjs = scenario.objectives.filter(o => !completedObjectiveIds.includes(o.id))
  const currentObj     = incompleteObjs[0] ?? null
  const upcomingObjs   = incompleteObjs.slice(1)
  const currentCmd     = extractCommand(currentObj?.hint)

  // Auto-show full hint after 90s of no progress; reset on any progress
  useEffect(() => {
    if (completedObjectiveIds.length !== lastCountRef.current) {
      lastCountRef.current = completedObjectiveIds.length
      setHintVisible(false)
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    }
    if (!currentObj || allDone) return
    const t = setTimeout(() => setHintVisible(true), 90_000)
    hintTimerRef.current = t
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedObjectiveIds.length])

  const width = compact ? 'w-64' : 'w-72'

  return (
    <div className={`${width} flex-shrink-0 border-r border-[#30363d] bg-[#0d1117] flex flex-col overflow-hidden`}>

      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 px-4 py-3 border-b border-[#30363d] hover:bg-[#161b22] transition-colors w-full text-left"
      >
        <Target size={13} className="text-[#3fb950] flex-shrink-0" />
        <span className="text-xs font-bold text-white font-mono flex-1 truncate">{scenario.title}</span>
        <span className="text-xs text-[#8b949e] font-mono mr-1">{completed}/{total}</span>
        {collapsed
          ? <ChevronDown size={12} className="text-[#8b949e]" />
          : <ChevronUp size={12} className="text-[#8b949e]" />
        }
      </button>

      {!collapsed && (
        <>
          {/* Progress bar */}
          <div className="px-4 py-2 border-b border-[#30363d]">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-[#30363d] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    allDone ? 'bg-[#3fb950]' : 'bg-[#58a6ff]'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] text-[#8b949e] font-mono w-8 text-right">{pct}%</span>
            </div>
          </div>

          {/* ── Current task — always visible, always shows command ── */}
          {!allDone && currentObj && (
            <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22]/60">
              <p className="text-[9px] text-[#58a6ff] font-mono uppercase tracking-wider mb-1.5">
                Task {completedObjs.length + 1} of {total}
              </p>
              <p className="text-[11px] text-white font-mono leading-snug mb-2">
                {currentObj.description}
              </p>

              {/* Runnable command chip */}
              {currentCmd && (
                <button
                  onClick={() => onInjectCommand?.(currentCmd)}
                  title="Click to paste this command into the terminal"
                  className="w-full flex items-center gap-1.5 bg-[#0d1117] border border-[#3fb950]/30 hover:border-[#3fb950] rounded px-2.5 py-1.5 text-[10px] font-mono text-[#3fb950] transition-colors group"
                >
                  <Terminal size={9} className="flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{currentCmd}</span>
                  <span className="text-[#484f58] group-hover:text-[#8b949e] text-[8px] flex-shrink-0">
                    ↵ run
                  </span>
                </button>
              )}

              {/* Extra hint text (shown after 90s or when hint has no command) */}
              {(hintVisible || !currentCmd) && currentObj.hint && (
                <p className="mt-2 text-[9px] text-[#d29922] font-mono leading-snug">
                  💡 {currentObj.hint}
                </p>
              )}
              {!hintVisible && currentCmd && (
                <button
                  onClick={() => setHintVisible(true)}
                  className="mt-1.5 text-[9px] text-[#484f58] hover:text-[#d29922] font-mono transition-colors"
                >
                  Show more hint
                </button>
              )}
            </div>
          )}

          {/* ── All done banner ── */}
          {allDone && (
            <div className="px-4 py-3 bg-[#3fb950]/5 border-b border-[#3fb950]/20">
              <p className="text-xs text-[#3fb950] font-mono font-bold">🎉 Lab Complete!</p>
              <p className="text-[10px] text-[#8b949e] mt-0.5">
                Mark the lesson complete to earn XP.
              </p>
            </div>
          )}

          {/* ── Objectives list ── */}
          <div className="flex-1 overflow-y-auto">

            {/* Completed — greyed + strikethrough */}
            {completedObjs.map((obj, i) => (
              <div
                key={obj.id}
                className="px-4 py-2 border-b border-[#30363d]/40 opacity-40"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={11} className="text-[#3fb950] flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] font-mono text-[#3fb950] line-through decoration-[#3fb950]/40 leading-snug">
                    {i + 1}. {obj.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Current (repeated in list) — highlighted blue */}
            {currentObj && (
              <div className="px-4 py-2 border-b border-[#30363d]/40 bg-[#58a6ff]/5">
                <div className="flex items-start gap-2">
                  <Circle size={11} className="text-[#58a6ff] flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] font-mono text-[#58a6ff] leading-snug">
                    {completedObjs.length + 1}. {currentObj.description}
                  </p>
                </div>
              </div>
            )}

            {/* Upcoming — dimmed */}
            {upcomingObjs.map((obj, i) => (
              <div
                key={obj.id}
                className="px-4 py-2 border-b border-[#30363d]/40 last:border-0 opacity-25"
              >
                <div className="flex items-start gap-2">
                  <Circle size={11} className="text-[#484f58] flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] font-mono text-[#8b949e] leading-snug">
                    {completedObjs.length + 2 + i}. {obj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
