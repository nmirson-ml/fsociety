import { useState, useCallback } from 'react'
import { Terminal } from '@/components/Terminal/Terminal'
import { MissionPanel } from '@/components/Terminal/MissionPanel'
import { getScenario, getAllScenarios } from '@/terminal/scenarios/index'
import type { Scenario } from '@/types'
import { BookOpen, HelpCircle, ChevronDown, Target } from 'lucide-react'

function buildScenarioList(): { label: string; id: string }[] {
  const all = getAllScenarios()
  return [
    { label: 'Free Shell (no scenario)', id: 'free' },
    ...all.map(s => ({ label: `${s.id.replace('scenario-0', 'Lab ')} — ${s.title}`, id: s.id })),
  ]
}

const SCENARIO_LIST = buildScenarioList()

export function Lab() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('free')
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [showCheatsheet, setShowCheatsheet] = useState(false)
  const [showMission, setShowMission] = useState(true)
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([])

  const handleScenarioChange = useCallback((id: string) => {
    setActiveScenarioId(id)
    setCompletedObjectives([])
    if (id === 'free') {
      setScenario(null)
    } else {
      setScenario(getScenario(id))
    }
  }, [])

  const handleObjectiveComplete = useCallback((objId: string) => {
    setCompletedObjectives(prev => prev.includes(objId) ? prev : [...prev, objId])
  }, [])

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-[#30363d] bg-[#0d1117]">
        <h1 className="text-sm font-bold text-white font-mono">Free Lab Terminal</h1>

        {/* Scenario selector */}
        <div className="flex items-center gap-2 ml-4">
          <span className="text-xs text-[#8b949e] font-mono">Scenario:</span>
          <div className="relative">
            <select
              className="bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-xs font-mono rounded px-3 py-1.5 pr-7 appearance-none focus:outline-none focus:border-[#58a6ff]"
              value={activeScenarioId}
              onChange={e => handleScenarioChange(e.target.value)}
            >
              {SCENARIO_LIST.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2 text-[#8b949e] pointer-events-none" />
          </div>
        </div>

        {/* Mission toggle */}
        {scenario && (
          <button
            onClick={() => setShowMission(!showMission)}
            className={`flex items-center gap-1.5 text-xs font-mono transition-colors border px-3 py-1.5 rounded ${
              showMission
                ? 'text-[#3fb950] border-[#3fb950]/30 bg-[#3fb950]/5'
                : 'text-[#8b949e] border-[#30363d] hover:text-white hover:border-[#8b949e]'
            }`}
          >
            <Target size={12} />
            Mission
          </button>
        )}

        {/* Cheat sheet toggle */}
        <button
          onClick={() => setShowCheatsheet(!showCheatsheet)}
          className="ml-auto flex items-center gap-1.5 text-xs text-[#8b949e] hover:text-white font-mono transition-colors border border-[#30363d] hover:border-[#8b949e] px-3 py-1.5 rounded"
        >
          <HelpCircle size={12} />
          Command Reference
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">

        {/* Mission panel */}
        {scenario && showMission && (
          <MissionPanel
            scenario={scenario}
            completedObjectiveIds={completedObjectives}
          />
        )}

        {/* Terminal — takes most space */}
        <div className="flex-1 p-4">
          <Terminal
            key={activeScenarioId}
            scenario={scenario}
            className="h-full"
            onObjectiveComplete={handleObjectiveComplete}
          />
        </div>

        {/* Cheat sheet panel */}
        {showCheatsheet && (
          <div className="w-72 border-l border-[#30363d] bg-[#0d1117] overflow-y-auto p-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={14} className="text-[#58a6ff]" />
              <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                Command Reference
              </h2>
            </div>

            {[
              {
                category: 'Recon',
                commands: [
                  { cmd: 'nmap -sn 10.0.0.0/24', desc: 'Ping sweep' },
                  { cmd: 'nmap -sV 10.0.0.1', desc: 'Service scan' },
                  { cmd: 'whois 10.0.0.1', desc: 'WHOIS lookup' },
                  { cmd: 'dig AXFR target.local @ns1', desc: 'Zone transfer' },
                  { cmd: 'subfinder -d target.local', desc: 'Passive subdomains' },
                  { cmd: 'gobuster dns -d target.local', desc: 'DNS brute force' },
                  { cmd: 'searchsploit cisco ios xe', desc: 'Find exploits' },
                ],
              },
              {
                category: 'Web App',
                commands: [
                  { cmd: 'nikto -h 10.0.2.10', desc: 'Web vuln scan' },
                  { cmd: 'dirb http://10.0.2.10', desc: 'Dir enumeration' },
                  { cmd: 'sqlmap -u http://...?id=1', desc: 'SQL injection' },
                  { cmd: 'upload shell.php /upload.php', desc: 'Web shell upload' },
                ],
              },
              {
                category: 'Persistence Hunt',
                commands: [
                  { cmd: 'find /var/www -name "*.php" -mtime -1', desc: 'Recent PHP files' },
                  { cmd: 'grep -r "eval(base64" /var/www', desc: 'Find obfuscated shells' },
                  { cmd: 'netstat -an', desc: 'Active connections' },
                  { cmd: 'crontab -l', desc: 'List cron jobs' },
                  { cmd: 'remove-shell <path>', desc: 'Remove web shell' },
                ],
              },
              {
                category: 'Lateral Movement',
                commands: [
                  { cmd: 'mimikatz sekurlsa::logonpasswords', desc: 'Dump credentials' },
                  { cmd: 'crackmapexec smb <ip> -u user -H <hash>', desc: 'Pass-the-hash' },
                  { cmd: 'pass-the-hash <user> <hash>', desc: 'PtH shortcut' },
                  { cmd: 'net user /domain', desc: 'List domain users' },
                ],
              },
              {
                category: 'SOC / Defense',
                commands: [
                  { cmd: 'analyze-logs', desc: 'Review SIEM logs' },
                  { cmd: 'timeline', desc: 'Attack timeline + MITRE' },
                  { cmd: 'write-rule brute-force', desc: 'Write Sigma rule' },
                  { cmd: 'isolate 10.0.5.30', desc: 'Quarantine host' },
                  { cmd: 'defend nmap', desc: 'Anti-scan defenses' },
                ],
              },
              {
                category: 'Info',
                commands: [
                  { cmd: 'objectives', desc: 'Show lab goals' },
                  { cmd: 'hint', desc: 'Get a hint' },
                  { cmd: 'mitre T1190', desc: 'ATT&CK technique' },
                  { cmd: 'whoami', desc: 'Your identity' },
                  { cmd: 'help', desc: 'All commands' },
                ],
              },
            ].map(({ category, commands }) => (
              <div key={category} className="mb-5">
                <p className="text-[10px] text-[#484f58] uppercase tracking-widest font-mono mb-2">
                  {category}
                </p>
                <div className="space-y-1">
                  {commands.map(({ cmd, desc }) => (
                    <div key={cmd}>
                      <code className="text-[11px] text-[#3fb950] font-mono block">{cmd}</code>
                      <p className="text-[10px] text-[#484f58] ml-1">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
