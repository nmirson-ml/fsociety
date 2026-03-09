import { Link } from 'react-router-dom'
import { Lock, CheckCircle, ChevronRight, Clock, Zap, AlertTriangle } from 'lucide-react'
import { MODULES } from '@/data/curriculum'
import { useProgress } from '@/store/progress'
import { LEVEL_LABELS, LEVEL_COLORS } from '@/types'

export function Curriculum() {
  const { completedLessons, currentLevel } = useProgress()

  return (
    <div className="min-h-full p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-mono mb-2">Curriculum</h1>
        <p className="text-[#8b949e] text-sm">
          8 levels — from network basics to APT case studies. Each module builds on the last.
          Unlock higher levels by completing earlier ones.
        </p>
      </div>

      <div className="space-y-6">
        {MODULES.map(module => {
          const isUnlocked = module.level <= currentLevel + 1
          const doneCount = module.lessons.filter(l => completedLessons.includes(l.id)).length
          const allDone = doneCount === module.lessons.length
          const levelColor = LEVEL_COLORS[module.level]

          return (
            <div
              key={module.id}
              className={`card overflow-hidden ${!isUnlocked ? 'opacity-50' : ''}`}
            >
              {/* Module header */}
              <div className="p-5 border-b border-[#30363d]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`badge-level ${levelColor} text-sm px-3 py-1`}>
                      Level {module.level}
                    </span>
                    <div>
                      <h2 className="text-white font-bold font-mono">
                        {module.title}
                        <span className="text-[#8b949e] text-xs font-normal ml-2">
                          — {LEVEL_LABELS[module.level]}
                        </span>
                      </h2>
                      <p className="text-[#8b949e] text-sm mt-0.5">{module.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!isUnlocked && <Lock size={14} className="text-[#484f58]" />}
                    {allDone && <CheckCircle size={14} className="text-[#3fb950]" />}
                    {module.aptGroups && module.aptGroups.length > 0 && (
                      <div className="flex items-center gap-1 text-[#f85149]">
                        <AlertTriangle size={12} />
                        <span className="text-xs font-mono">APT</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* APT groups */}
                {module.aptGroups && module.aptGroups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {module.aptGroups.map(apt => (
                      <span
                        key={apt}
                        className="text-[10px] font-mono px-2 py-0.5 bg-[#f85149]/10 border border-[#f85149]/30 text-[#f85149] rounded"
                      >
                        {apt}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress bar */}
                {doneCount > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-[#8b949e] font-mono mb-1">
                      <span>{doneCount}/{module.lessons.length} complete</span>
                      <span>{Math.round((doneCount / module.lessons.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-[#30363d] rounded-full h-1">
                      <div
                        className="bg-[#3fb950] h-1 rounded-full transition-all"
                        style={{ width: `${(doneCount / module.lessons.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Lessons list */}
              <div className="divide-y divide-[#30363d]">
                {module.lessons.map(lesson => {
                  const isDone = completedLessons.includes(lesson.id)

                  return (
                    <Link
                      key={lesson.id}
                      to={isUnlocked ? `/lesson/${lesson.slug}` : '#'}
                      className={`flex items-center justify-between px-5 py-3.5 group transition-colors ${
                        isUnlocked
                          ? 'hover:bg-[#161b22]'
                          : 'cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isDone
                            ? 'border-[#3fb950] bg-[#3fb950]/10'
                            : 'border-[#30363d]'
                        }`}>
                          {isDone && <CheckCircle size={12} className="text-[#3fb950]" />}
                        </div>
                        <div>
                          <p className={`text-sm font-mono ${
                            isDone ? 'text-[#8b949e] line-through' : 'text-[#c9d1d9] group-hover:text-white'
                          }`}>
                            {lesson.title}
                          </p>
                          <p className="text-[#484f58] text-xs mt-0.5">{lesson.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {/* MITRE tags */}
                        {lesson.mitreIds.slice(0, 2).map(id => (
                          <span key={id} className="mitre-badge hidden md:block">{id}</span>
                        ))}

                        <div className="flex items-center gap-3 text-[#484f58] text-xs font-mono">
                          <div className="flex items-center gap-1">
                            <Clock size={11} />
                            <span>{lesson.estimatedMinutes}m</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap size={11} />
                            <span>{lesson.xp} XP</span>
                          </div>
                        </div>

                        {lesson.scenarioId && (
                          <span className="text-[10px] font-mono border border-[#3fb950]/40 text-[#3fb950] px-1.5 py-0.5 rounded">
                            Lab
                          </span>
                        )}

                        <ChevronRight size={14} className="text-[#484f58] group-hover:text-[#8b949e]" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
