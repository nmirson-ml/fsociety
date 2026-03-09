import { Link } from 'react-router-dom'
import { Shield, Terminal, Zap, BookOpen, Target, AlertTriangle, ChevronRight, Globe } from 'lucide-react'
import { useProgress } from '@/store/progress'
import { MODULES } from '@/data/curriculum'
import { LEVEL_LABELS, LEVEL_COLORS } from '@/types'

const APT_GROUPS = [
  { name: 'Salt Typhoon', origin: 'China', targets: 'US Telecoms', severity: 'critical' },
  { name: 'APT41', origin: 'China', targets: 'Multi-sector', severity: 'critical' },
  { name: 'Lazarus Group', origin: 'DPRK', targets: 'Finance & Crypto', severity: 'high' },
  { name: 'APT29 (Cozy Bear)', origin: 'Russia', targets: 'Government', severity: 'high' },
]

export function Home() {
  const { completedLessons, totalXP, currentLevel } = useProgress()
  const nextModule = MODULES.find(m => m.lessons.some(l => !completedLessons.includes(l.id)))

  return (
    <div className="min-h-full p-6 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#3fb950] rounded-full animate-pulse" />
          <span className="text-xs font-mono text-[#3fb950] uppercase tracking-widest">
            Live Learning Environment
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white font-mono mb-3">
          Learn to <span className="text-[#f85149]">Hack</span>.<br />
          Learn to <span className="text-[#3fb950]">Defend</span>.
        </h1>
        <p className="text-[#8b949e] text-lg max-w-2xl">
          Master cybersecurity from first principles to nation-state techniques.
          Hands-on labs, real APT analysis, and professional-grade tooling — all in your browser.
        </p>

        <div className="flex gap-4 mt-6">
          <Link
            to="/curriculum"
            className="flex items-center gap-2 bg-[#3fb950] text-[#0d1117] font-mono font-semibold px-5 py-2.5 rounded hover:bg-[#56d364] transition-colors text-sm"
          >
            <BookOpen size={16} />
            Start Learning
          </Link>
          <Link
            to="/lab"
            className="flex items-center gap-2 border border-[#30363d] text-[#8b949e] hover:text-white hover:border-[#58a6ff] font-mono px-5 py-2.5 rounded transition-colors text-sm"
          >
            <Terminal size={16} />
            Open Lab Terminal
          </Link>
        </div>
      </div>

      {/* Progress card (if any progress) */}
      {completedLessons.length > 0 && (
        <div className="card p-4 mb-6 border-[#3fb950]/30 bg-[#0d1f0f]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#3fb950] font-mono text-sm font-semibold">Continue Learning</p>
              {nextModule && (
                <p className="text-[#c9d1d9] text-sm mt-0.5">
                  Next: <span className="text-white font-semibold">{nextModule.title}</span>
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[#3fb950] font-mono font-bold text-lg">{totalXP} XP</p>
              <p className="text-[#8b949e] text-xs font-mono">Level {currentLevel} — {LEVEL_LABELS[currentLevel]}</p>
            </div>
          </div>
          {nextModule && (
            <Link
              to={`/module/${nextModule.id}`}
              className="mt-3 flex items-center gap-1 text-[#3fb950] text-xs font-mono hover:underline"
            >
              Continue <ChevronRight size={12} />
            </Link>
          )}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: BookOpen, label: 'Lessons', value: `${MODULES.reduce((s, m) => s + m.lessons.length, 0)}`, color: 'text-[#58a6ff]' },
          { icon: Terminal, label: 'Labs', value: '8', color: 'text-[#3fb950]' },
          { icon: Target, label: 'APT Groups Studied', value: '4', color: 'text-[#f85149]' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
            <p className="text-[#8b949e] text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Curriculum overview */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white font-mono mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-[#58a6ff]" />
          Curriculum — 8 Levels
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {MODULES.map(module => {
            const done = module.lessons.filter(l => completedLessons.includes(l.id)).length
            const levelColor = LEVEL_COLORS[module.level]
            return (
              <Link
                key={module.id}
                to={`/module/${module.id}`}
                className="card p-4 hover:border-[#58a6ff]/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`badge-level ${levelColor}`}>
                    Level {module.level}
                  </span>
                  {module.aptGroups && module.aptGroups.length > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle size={10} className="text-[#f85149]" />
                      <span className="text-[10px] text-[#f85149] font-mono">Real APT</span>
                    </div>
                  )}
                </div>
                <h3 className="text-white font-semibold text-sm group-hover:text-[#58a6ff] transition-colors">
                  {module.title}
                </h3>
                <p className="text-[#8b949e] text-xs mt-1 line-clamp-2">{module.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[#484f58] text-xs font-mono">{module.lessons.length} lessons</span>
                  {done > 0 && (
                    <span className="text-[#3fb950] text-xs font-mono">{done}/{module.lessons.length} done</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* APT Threat Intel */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white font-mono mb-4 flex items-center gap-2">
          <Globe size={16} className="text-[#f85149]" />
          Active Threat Groups — What We Study
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {APT_GROUPS.map(apt => (
            <div key={apt.name} className="card p-4 border-[#f85149]/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-semibold text-sm font-mono">{apt.name}</p>
                  <p className="text-[#8b949e] text-xs mt-0.5">Origin: {apt.origin}</p>
                  <p className="text-[#8b949e] text-xs">Targets: {apt.targets}</p>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  apt.severity === 'critical'
                    ? 'border-[#f85149] text-[#f85149] bg-[#f85149]/10'
                    : 'border-[#d29922] text-[#d29922] bg-[#d29922]/10'
                }`}>
                  {apt.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-white font-mono mb-4 flex items-center gap-2">
          <Zap size={16} className="text-[#d29922]" />
          How Each Lesson Works
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Understand the Concept', desc: 'Plain-language explanation with real-world analogy. No assumed knowledge.', color: 'text-[#58a6ff]' },
            { step: '02', title: 'See How Pros Do It', desc: 'Real APT technique with MITRE ATT&CK mapping and actual tool output.', color: 'text-[#d29922]' },
            { step: '03', title: 'Hands-On Terminal Lab', desc: 'Practice in a safe simulated environment. No real networks — just learning.', color: 'text-[#3fb950]' },
          ].map(({ step, title, desc, color }) => (
            <div key={step}>
              <p className={`text-3xl font-bold font-mono ${color} mb-2`}>{step}</p>
              <p className="text-white font-semibold text-sm mb-1">{title}</p>
              <p className="text-[#8b949e] text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="mt-8 flex items-start gap-2 text-[#484f58] text-xs font-mono">
        <Shield size={12} className="flex-shrink-0 mt-0.5" />
        <p>
          CyberEd is an educational platform. All techniques taught here are for understanding and defense.
          Always obtain proper authorization before testing any system. Unauthorized access is illegal.
        </p>
      </div>
    </div>
  )
}
