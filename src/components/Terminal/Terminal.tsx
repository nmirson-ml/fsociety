import { useEffect, useRef, useCallback } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'
import type { Scenario } from '@/types'
import { processCommand } from '@/terminal/commandProcessor'
import { useProgress } from '@/store/progress'

interface TerminalProps {
  scenario?: Scenario | null
  welcomeMessage?: string
  className?: string
  /** Called each time an objective is completed — parent can update UI */
  onObjectiveComplete?: (objId: string) => void
  /** When this changes, inject the command into the terminal input buffer */
  pendingCommand?: { cmd: string; id: number } | null
}

/** Extract the runnable command from a hint like "Try: nmap -sV 10.0.0.1 — description" */
function extractCommand(hint?: string): string | null {
  if (!hint?.startsWith('Try:')) return null
  let raw = hint.slice(4).trim()
  raw = raw.replace(/\s+[—–]\s+.+$/, '').trim()
  raw = raw.split(/\s+or\s+/)[0].trim()
  return raw || null
}

const THEME = {
  background: '#0d1117',
  foreground: '#c9d1d9',
  cursor: '#3fb950',
  cursorAccent: '#0d1117',
  selectionBackground: '#264f78',
  black: '#0d1117',
  red: '#f85149',
  green: '#3fb950',
  yellow: '#d29922',
  blue: '#58a6ff',
  magenta: '#bc8cff',
  cyan: '#39d353',
  white: '#c9d1d9',
  brightBlack: '#484f58',
  brightRed: '#f85149',
  brightGreen: '#56d364',
  brightYellow: '#e3b341',
  brightBlue: '#79c0ff',
  brightMagenta: '#d2a8ff',
  brightCyan: '#56d364',
  brightWhite: '#f0f6fc',
}

export function Terminal({
  scenario = null,
  welcomeMessage,
  className = '',
  onObjectiveComplete,
  pendingCommand,
}: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const bufferRef = useRef<string>('')
  const historyRef = useRef<string[]>([])
  const histIdxRef = useRef<number>(-1)
  // Runtime clone — scenario is structuredClone'd before being passed in (from getScenario)
  // We track completed objectives here via the store, never by mutating the static definition
  const scenarioRef = useRef<Scenario | null>(scenario)

  const { markObjectiveDone, getScenarioProgress } = useProgress()

  // Keep scenario ref up to date when prop changes
  useEffect(() => {
    scenarioRef.current = scenario
    // Re-initialise objective completed flags from the store
    if (scenario) {
      const { completed } = getScenarioProgress(scenario.id)
      scenario.objectives.forEach(obj => {
        obj.completed = completed.includes(obj.id)
      })
    }
  }, [scenario, getScenarioProgress])

  // Inject a command from an external source (e.g. MissionPanel click)
  useEffect(() => {
    if (!pendingCommand || !termRef.current) return
    const term = termRef.current
    // Erase whatever is currently typed
    term.write('\b \b'.repeat(bufferRef.current.length))
    bufferRef.current = pendingCommand.cmd
    term.write(pendingCommand.cmd)
    term.focus()
  }, [pendingCommand])

  const writePrompt = useCallback((term: XTerm) => {
    term.write('\r\n\x1b[32m┌──(\x1b[1;32mroot\u3299kali\x1b[0;32m)-[\x1b[1;34m~\x1b[0;32m]\x1b[0m\r\n\x1b[32m└─\x1b[1;32m# \x1b[0m')
  }, [])

  const handleCommand = useCallback((term: XTerm, raw: string) => {
    const input = raw.trim()
    if (!input) {
      writePrompt(term)
      return
    }

    // Save to history
    historyRef.current.unshift(input)
    if (historyRef.current.length > 100) historyRef.current.pop()
    histIdxRef.current = -1

    // Clear screen shortcut
    if (input === 'clear') {
      term.write('\x1b[2J\x1b[H')
      writePrompt(term)
      return
    }

    term.writeln('')
    const result = processCommand(input, scenarioRef.current)

    // Write output line by line
    if (result.output) {
      const lines = result.output.split('\n')
      lines.forEach((line, i) => {
        if (i < lines.length - 1) {
          term.writeln(line)
        } else if (line) {
          term.writeln(line)
        }
      })
    }

    // Handle objective completion — persist to store, update runtime clone
    if (result.objectivesCompleted && scenarioRef.current) {
      const sc = scenarioRef.current
      result.objectivesCompleted.forEach(objId => {
        markObjectiveDone(sc.id, objId)
        const obj = sc.objectives.find(o => o.id === objId)
        if (obj) obj.completed = true

        term.writeln('')
        term.writeln(`\x1b[1m\x1b[92m✓ Objective complete: ${obj?.description ?? objId}\x1b[0m`)
        onObjectiveComplete?.(objId)
      })

      // Show next task guidance
      const nextObj = sc.objectives.find(o => !o.completed)
      if (nextObj) {
        const nextCmd = extractCommand(nextObj.hint)
        term.writeln(`\x1b[90m  ─────────────────────────────────────\x1b[0m`)
        term.writeln(`\x1b[33m  ➤ Next: ${nextObj.description}\x1b[0m`)
        if (nextCmd) {
          term.writeln(`\x1b[32m  $ ${nextCmd}\x1b[0m`)
        } else if (nextObj.hint) {
          term.writeln(`\x1b[90m  💡 ${nextObj.hint}\x1b[0m`)
        }
        term.writeln(`\x1b[90m  ─────────────────────────────────────\x1b[0m`)
      } else {
        term.writeln('')
        term.writeln(`\x1b[1m\x1b[92m  🎉 All objectives complete! Mark this lesson done to earn XP.\x1b[0m`)
      }
    }

    writePrompt(term)
  }, [writePrompt, markObjectiveDone, onObjectiveComplete])

  useEffect(() => {
    if (!containerRef.current) return

    // Initialise objective completed flags from store on mount
    if (scenario) {
      const { completed } = getScenarioProgress(scenario.id)
      scenario.objectives.forEach(obj => {
        obj.completed = completed.includes(obj.id)
      })
    }

    const term = new XTerm({
      theme: THEME,
      fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
      fontSize: 13,
      lineHeight: 1.4,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 2000,
      convertEol: true,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(containerRef.current)

    setTimeout(() => fitAddon.fit(), 0)

    termRef.current = term
    fitAddonRef.current = fitAddon

    // Welcome / scenario message
    if (scenario?.welcomeMessage) {
      term.write(scenario.welcomeMessage)
    } else if (welcomeMessage) {
      term.writeln(welcomeMessage)
    } else {
      term.writeln('\x1b[1;32mCyberEd Terminal\x1b[0m \x1b[90m— Type \x1b[0m\x1b[32mhelp\x1b[0m\x1b[90m to get started\x1b[0m')
    }

    writePrompt(term)

    // Keyboard input handler
    term.onKey(({ key, domEvent }) => {
      const ev = domEvent
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey

      if (ev.key === 'Enter') {
        handleCommand(term, bufferRef.current)
        bufferRef.current = ''
        return
      }

      if (ev.key === 'Backspace') {
        if (bufferRef.current.length > 0) {
          bufferRef.current = bufferRef.current.slice(0, -1)
          term.write('\b \b')
        }
        return
      }

      if (ev.key === 'ArrowUp') {
        const idx = histIdxRef.current + 1
        if (idx < historyRef.current.length) {
          histIdxRef.current = idx
          const prev = historyRef.current[idx]
          term.write('\b \b'.repeat(bufferRef.current.length))
          bufferRef.current = prev
          term.write(prev)
        }
        return
      }

      if (ev.key === 'ArrowDown') {
        const idx = histIdxRef.current - 1
        term.write('\b \b'.repeat(bufferRef.current.length))
        if (idx >= 0) {
          histIdxRef.current = idx
          const next = historyRef.current[idx]
          bufferRef.current = next
          term.write(next)
        } else {
          histIdxRef.current = -1
          bufferRef.current = ''
        }
        return
      }

      if (ev.ctrlKey && ev.key === 'c') {
        term.writeln('^C')
        bufferRef.current = ''
        writePrompt(term)
        return
      }

      if (ev.ctrlKey && ev.key === 'l') {
        term.write('\x1b[2J\x1b[H')
        writePrompt(term)
        return
      }

      if (printable && key) {
        bufferRef.current += key
        term.write(key)
      }
    })

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      try { fitAddon.fit() } catch {}
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      term.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only mount once

  return (
    <div
      className={`bg-[#0d1117] rounded-lg overflow-hidden border border-[#30363d] ${className}`}
    >
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="w-3 h-3 rounded-full bg-[#f85149]" />
        <div className="w-3 h-3 rounded-full bg-[#d29922]" />
        <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
        <span className="ml-2 text-xs text-[#c9d1d9] font-mono">
          <span className="text-[#3fb950]">┌──(</span>
          <span className="text-[#3fb950] font-bold">root㉿kali</span>
          <span className="text-[#3fb950]">)-[</span>
          <span className="text-[#58a6ff] font-bold">~</span>
          <span className="text-[#3fb950]">]</span>
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-[#484f58]">
            bash
          </span>
          <span className="text-xs text-[#484f58] font-mono">
            {scenario ? scenario.title : 'Interactive Terminal'}
          </span>
        </div>
      </div>

      {/* xterm container */}
      <div ref={containerRef} className="h-full w-full" style={{ minHeight: '300px' }} />
    </div>
  )
}
