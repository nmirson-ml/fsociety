import { useParams, Link } from 'react-router-dom'
import { ChevronRight, Clock, Zap, CheckCircle, Terminal, ArrowLeft, AlertTriangle } from 'lucide-react'
import { MODULES } from '@/data/curriculum'
import { useProgress } from '@/store/progress'
import { LEVEL_LABELS, LEVEL_COLORS } from '@/types'

export function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const { completedLessons } = useProgress()

  const module = MODULES.find(m => m.id === moduleId)
  if (!module) return (
    <div className="p-6 text-[#8b949e] font-mono">Module not found.</div>
  )

  const doneCount = module.lessons.filter(l => completedLessons.includes(l.id)).length
  const levelColor = LEVEL_COLORS[module.level]

  return (
    <div className="min-h-full p-6 max-w-4xl mx-auto">
      {/* Back */}
      <Link to="/curriculum" className="flex items-center gap-1 text-[#8b949e] hover:text-white text-xs font-mono mb-6 transition-colors">
        <ArrowLeft size={12} />
        Back to Curriculum
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className={`badge-level ${levelColor} text-sm px-3 py-1`}>
            Level {module.level} — {LEVEL_LABELS[module.level]}
          </span>
          {module.aptGroups && module.aptGroups.length > 0 && (
            <div className="flex items-center gap-1 text-[#f85149]">
              <AlertTriangle size={12} />
              <span className="text-xs font-mono">Real APT techniques studied</span>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white font-mono mb-2">{module.title}</h1>
        <p className="text-[#8b949e] text-base">{module.description}</p>

        {module.aptGroups && module.aptGroups.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {module.aptGroups.map(apt => (
              <span key={apt} className="text-xs font-mono px-2.5 py-1 bg-[#f85149]/10 border border-[#f85149]/30 text-[#f85149] rounded">
                {apt}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Progress */}
      {doneCount > 0 && (
        <div className="card p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#8b949e] font-mono">Progress</span>
            <span className="text-[#3fb950] font-mono">{doneCount}/{module.lessons.length}</span>
          </div>
          <div className="w-full bg-[#30363d] rounded-full h-2">
            <div
              className="bg-[#3fb950] h-2 rounded-full transition-all"
              style={{ width: `${(doneCount / module.lessons.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Lessons */}
      <div className="space-y-3">
        {module.lessons.map((lesson, idx) => {
          const isDone = completedLessons.includes(lesson.id)

          return (
            <Link
              key={lesson.id}
              to={`/lesson/${lesson.slug}`}
              className="card p-5 flex items-start justify-between group hover:border-[#58a6ff]/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isDone
                    ? 'border-[#3fb950] bg-[#3fb950]/10'
                    : 'border-[#30363d] bg-[#161b22]'
                }`}>
                  {isDone
                    ? <CheckCircle size={14} className="text-[#3fb950]" />
                    : <span className="text-xs text-[#484f58] font-mono">{idx + 1}</span>
                  }
                </div>

                <div>
                  <h3 className="text-white font-semibold font-mono group-hover:text-[#58a6ff] transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-[#8b949e] text-sm mt-1">{lesson.description}</p>

                  <div className="flex items-center flex-wrap gap-3 mt-3">
                    {lesson.mitreIds.map(id => (
                      <span key={id} className="mitre-badge">{id}</span>
                    ))}
                    {lesson.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] font-mono text-[#484f58] bg-[#161b22] border border-[#30363d] px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-[#484f58] text-xs font-mono justify-end">
                    <Clock size={11} />
                    <span>{lesson.estimatedMinutes}m</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#d29922] text-xs font-mono justify-end mt-1">
                    <Zap size={11} />
                    <span>{lesson.xp} XP</span>
                  </div>
                  {lesson.scenarioId && (
                    <div className="flex items-center gap-1 text-[#3fb950] text-[10px] font-mono justify-end mt-1">
                      <Terminal size={10} />
                      <span>Lab</span>
                    </div>
                  )}
                </div>
                <ChevronRight size={16} className="text-[#484f58] group-hover:text-[#58a6ff] transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
