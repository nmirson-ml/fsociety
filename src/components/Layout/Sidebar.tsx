import { NavLink } from 'react-router-dom'
import { Shield, Terminal, BookOpen, Home, Target, ChevronRight } from 'lucide-react'
import { MODULES } from '@/data/curriculum'
import { useProgress } from '@/store/progress'
import { LEVEL_LABELS, LEVEL_COLORS } from '@/types'

export function Sidebar() {
  const { completedLessons, totalXP, currentLevel } = useProgress()

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0d1117] border-r border-[#30363d] flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0d1117] border border-[#3fb950] rounded flex items-center justify-center">
            <span className="text-[#3fb950] font-mono text-xs font-bold">&gt;_</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-wide">CyberEd</p>
            <p className="text-[#8b949e] text-xs font-mono">Learn to Hack. Learn to Defend.</p>
          </div>
        </div>
      </div>

      {/* XP / Level bar */}
      <div className="px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[#8b949e] font-mono">Level {currentLevel}</span>
          <span className="text-xs text-[#3fb950] font-mono">{totalXP} XP</span>
        </div>
        <div className="w-full bg-[#30363d] rounded-full h-1.5">
          <div
            className="bg-[#3fb950] h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalXP % 500) / 5, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-[#8b949e] mt-1 font-mono">
          {LEVEL_LABELS[currentLevel]}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="px-3 mb-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded text-sm font-mono transition-colors ${
                isActive
                  ? 'bg-[#161b22] text-[#3fb950] border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]'
              }`
            }
          >
            <Home size={14} />
            Home
          </NavLink>

          <NavLink
            to="/curriculum"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded text-sm font-mono transition-colors ${
                isActive
                  ? 'bg-[#161b22] text-[#3fb950] border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]'
              }`
            }
          >
            <BookOpen size={14} />
            Curriculum
          </NavLink>

          <NavLink
            to="/lab"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded text-sm font-mono transition-colors ${
                isActive
                  ? 'bg-[#161b22] text-[#3fb950] border border-[#30363d]'
                  : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]'
              }`
            }
          >
            <Terminal size={14} />
            Free Lab
          </NavLink>
        </div>

        {/* Modules list */}
        <div className="mt-2 px-3">
          <p className="text-[10px] text-[#484f58] uppercase tracking-widest font-mono px-3 mb-2">
            Modules
          </p>
          {MODULES.map(module => {
            const moduleCompleted = module.lessons.filter(l => completedLessons.includes(l.id)).length
            const isUnlocked = module.level <= currentLevel + 1
            const levelColor = LEVEL_COLORS[module.level]

            return (
              <div key={module.id} className="mb-1">
                <NavLink
                  to={`/module/${module.id}`}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-colors ${
                      !isUnlocked
                        ? 'text-[#484f58] cursor-not-allowed opacity-50'
                        : isActive
                        ? 'bg-[#161b22] text-white border border-[#30363d]'
                        : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`badge-level ${levelColor} flex-shrink-0`}>
                      L{module.level}
                    </span>
                    <span className="truncate">{module.title}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {moduleCompleted > 0 && (
                      <span className="text-[#3fb950] text-[10px]">
                        {moduleCompleted}/{module.lessons.length}
                      </span>
                    )}
                    <ChevronRight size={10} className="text-[#484f58]" />
                  </div>
                </NavLink>
              </div>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#30363d] bg-[#0d1117]">
        <div className="flex items-center gap-2 text-[#8b949e]">
          <Shield size={12} />
          <span className="text-[10px] font-mono">For educational purposes only</span>
        </div>
        <div className="flex items-center gap-2 text-[#484f58] mt-1">
          <Target size={12} />
          <span className="text-[10px] font-mono">{completedLessons.length} lessons complete</span>
        </div>
      </div>
    </aside>
  )
}
