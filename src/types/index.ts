// ─── Curriculum ───────────────────────────────────────────────────────────────

export type SkillLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export const LEVEL_LABELS: Record<SkillLevel, string> = {
  0: 'Fundamentals',
  1: 'Recon & OSINT',
  2: 'Initial Access',
  3: 'Persistence',
  4: 'Lateral Movement',
  5: 'Exfiltration',
  6: 'Defense & Detection',
  7: 'APT Case Studies',
}

export const LEVEL_COLORS: Record<SkillLevel, string> = {
  0: 'border-blue-400 text-blue-400',
  1: 'border-cyan-400 text-cyan-400',
  2: 'border-yellow-400 text-yellow-400',
  3: 'border-orange-400 text-orange-400',
  4: 'border-red-400 text-red-400',
  5: 'border-rose-400 text-rose-400',
  6: 'border-green-400 text-green-400',
  7: 'border-purple-400 text-purple-400',
}

export interface MitreTag {
  id: string         // e.g. "T1190"
  name: string       // e.g. "Exploit Public-Facing Application"
  tactic: string     // e.g. "Initial Access"
  url?: string
}

export interface Lesson {
  id: string
  slug: string
  title: string
  description: string
  level: SkillLevel
  xp: number
  estimatedMinutes: number
  mitreIds: string[]
  scenarioId?: string
  tags: string[]
}

export interface Module {
  id: string
  title: string
  level: SkillLevel
  description: string
  lessons: Lesson[]
  aptGroups?: string[]  // associated real-world groups
}

// ─── Terminal / Scenarios ──────────────────────────────────────────────────────

export interface Host {
  ip: string
  hostname?: string
  os: string
  services: Service[]
  vulnerabilities?: Vulnerability[]
}

export interface Service {
  port: number
  protocol: 'tcp' | 'udp'
  name: string
  version?: string
  banner?: string
}

export interface Vulnerability {
  cve?: string
  name: string
  description: string
  exploitCommand?: string  // the command that triggers this vuln in the sim
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface ScenarioObjective {
  id: string
  description: string
  hint?: string
  completionTrigger: string  // regex pattern matched against raw command string
  /** Optional semantic check — if provided, overrides regex for objective completion */
  semanticCheck?: (cmd: string, args: string[], scenario: Scenario) => boolean
  completed: boolean
}

export interface Scenario {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  network: Host[]
  attacker: { ip: string; hostname: string }
  objectives: ScenarioObjective[]
  welcomeMessage: string
}

export interface CommandResult {
  output: string
  error?: boolean
  objectivesCompleted?: string[]  // IDs of objectives completed by this command
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface UserProgress {
  completedLessons: string[]
  completedObjectives: Record<string, string[]>  // scenarioId -> objective IDs
  totalXP: number
  currentLevel: SkillLevel
  streakDays: number
  lastActiveDate: string
}
