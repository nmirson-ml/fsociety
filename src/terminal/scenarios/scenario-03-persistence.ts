import type { Scenario } from '@/types'

/**
 * Lab 03 — Persistence Hunting (Defensive — you are the sysadmin)
 *
 * Role reversal: you are the defender. A breach has been detected.
 * Find and remove the attacker's web shells and persistence mechanisms
 * before they can do more damage. Teaches forensic IR techniques.
 */
export const scenario03: Scenario = {
  id: 'scenario-03',
  title: 'Hunt the Web Shells',
  description:
    'DEFENSIVE MISSION: You are a sysadmin. Your SIEM fired an alert — unusual ' +
    'outbound traffic from your web server. Investigate, find the attacker\'s ' +
    'web shells and persistence mechanisms, then clean up. The clock is ticking.',
  difficulty: 'intermediate',
  attacker: {
    ip: '10.0.3.200',
    hostname: 'analyst-workstation',
  },
  network: [
    {
      ip: '10.0.3.10',
      hostname: 'webserver01.internal',
      os: 'Ubuntu 20.04 LTS (compromised)',
      services: [
        { port: 22, protocol: 'tcp', name: 'ssh', version: 'OpenSSH 8.2p1' },
        { port: 80, protocol: 'tcp', name: 'http', version: 'Apache 2.4.41' },
        { port: 4444, protocol: 'tcp', name: 'unknown', version: 'SUSPICIOUS — reverse shell listener' },
      ],
      vulnerabilities: [
        {
          name: 'Active Web Shells',
          description: 'Attacker planted 3 PHP web shells in /var/www/html/uploads/ and /var/www/html/admin/',
          severity: 'critical',
        },
        {
          name: 'Malicious Cron Jobs',
          description: 'Attacker added cron entries to re-deploy shells and beacon to C2 every minute.',
          severity: 'critical',
        },
      ],
    },
  ],
  objectives: [
    {
      id: 'obj-netstat',
      description: 'Check active network connections for suspicious outbound traffic',
      hint: 'Try: netstat -an  — look for unexpected ports and foreign addresses',
      completionTrigger: 'netstat',
      completed: false,
    },
    {
      id: 'obj-find-shells',
      description: 'Find recently modified PHP files in the web root',
      hint: 'Try: find /var/www -name "*.php" -mtime -1  (files modified in last 24h)',
      completionTrigger: 'find.*\\.php|find.*mtime',
      completed: false,
    },
    {
      id: 'obj-grep-shells',
      description: 'Search for obfuscated PHP code (eval/base64) in web files',
      hint: 'Try: grep -r "eval(base64" /var/www  — common web shell fingerprint',
      completionTrigger: 'grep.*eval|grep.*base64',
      completed: false,
    },
    {
      id: 'obj-crontab',
      description: 'Check the crontab for malicious scheduled tasks',
      hint: 'Try: crontab -l  — look for entries that curl/wget external URLs',
      completionTrigger: 'crontab',
      completed: false,
    },
    {
      id: 'obj-find-persistence',
      description: 'Identify the cron-based C2 beacon mechanism',
      hint: 'The crontab output reveals the attacker\'s persistence — read it carefully',
      completionTrigger: 'crontab',
      completed: false,
    },
    {
      id: 'obj-remove-shell',
      description: 'Remove the primary web shell from uploads directory',
      hint: 'Try: remove-shell /var/www/html/uploads/img_20240312.php',
      completionTrigger: 'remove-shell.*img_20240312|remove-shell.*uploads',
      completed: false,
    },
  ],
  welcomeMessage: `\x1b[1;33m
╔═══════════════════════════════════════════════════════════╗
║        LAB 03 — Hunt the Web Shells (DEFENSIVE)          ║
╚═══════════════════════════════════════════════════════════╝\x1b[0m

\x1b[31m  ⚠  BREACH DETECTED  ⚠\x1b[0m
\x1b[90m  SIEM Alert: Unusual outbound traffic from webserver01 (10.0.3.10)\x1b[0m
\x1b[90m  Time of alert: 2024-03-12 02:05 UTC\x1b[0m

\x1b[33m  Your role: Sysadmin / Incident Responder\x1b[0m
\x1b[90m  Your station: \x1b[0m\x1b[32m10.0.3.200 (analyst-workstation)\x1b[0m
\x1b[90m  Compromised: \x1b[0m\x1b[31m10.0.3.10 (webserver01)\x1b[0m

\x1b[90m  ─────────────────────────────────────────────────────\x1b[0m
\x1b[90m  Find and neutralize the attacker's persistence.
  Every command you run will reveal more of the attack.
  This is real IR — no magic "clean" button.\x1b[0m

\x1b[90m  Type \x1b[0m\x1b[32mobjectives\x1b[0m\x1b[90m to see your goals | \x1b[0m\x1b[32mhint\x1b[0m\x1b[90m for guidance\x1b[0m

`,
}
