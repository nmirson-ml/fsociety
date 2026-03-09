import type { Scenario } from '@/types'

/**
 * Lab 05 — SOC Analyst: Detect, Analyze, Contain
 *
 * Students act as a SOC analyst. Analyze real-looking SIEM logs from an active breach,
 * reconstruct the attack timeline using MITRE ATT&CK, write a Sigma detection rule,
 * and isolate the compromised host. Teaches blue team skills.
 */
export const scenario05: Scenario = {
  id: 'scenario-05',
  title: 'SOC Analyst: Active Breach Response',
  description:
    'You\'re on SOC duty at DefenseCorp. An alert fires at 2AM — unusual outbound ' +
    'traffic pattern. Analyze the logs, reconstruct the attack timeline, write a ' +
    'detection rule so this never happens again, then isolate the compromised host.',
  difficulty: 'intermediate',
  attacker: {
    ip: '10.0.5.100',
    hostname: 'soc-analyst-1',
  },
  network: [
    {
      ip: '10.0.5.20',
      hostname: 'employee-ws01.defensecorp.local',
      os: 'Ubuntu 22.04 LTS (compromised)',
      services: [
        { port: 22, protocol: 'tcp', name: 'ssh', version: 'OpenSSH 8.9p1' },
        { port: 445, protocol: 'tcp', name: 'smb', version: 'Samba 4.15' },
      ],
      vulnerabilities: [
        {
          name: 'Brute-Forced SSH',
          description: 'SSH brute forced at 01:47 — 8 attempts, then success. Weak admin password.',
          severity: 'high',
        },
      ],
    },
    {
      ip: '10.0.5.30',
      hostname: 'fileserver.defensecorp.local',
      os: 'Windows Server 2019 (laterally compromised)',
      services: [
        { port: 445, protocol: 'tcp', name: 'smb', version: 'SMBv3' },
        { port: 3389, protocol: 'tcp', name: 'rdp', version: 'Microsoft Terminal Services' },
      ],
      vulnerabilities: [
        {
          name: 'NTLM Relay / Pass-the-Hash',
          description: 'Attacker used credentials from ws01 to pivot to fileserver via WMI.',
          severity: 'critical',
        },
      ],
    },
    {
      ip: '45.33.32.156',
      hostname: 'c2.attacker.onion',
      os: 'Unknown (external)',
      services: [
        { port: 443, protocol: 'tcp', name: 'https', version: 'Nginx (Tor exit node)' },
      ],
      vulnerabilities: [],
    },
  ],
  objectives: [
    {
      id: 'obj-analyze-logs',
      description: 'Analyze SIEM logs to understand the scope of the incident',
      hint: 'Try: analyze-logs  — review the centralized log stream',
      completionTrigger: 'analyze-logs',
      completed: false,
    },
    {
      id: 'obj-timeline',
      description: 'Reconstruct the attack timeline with MITRE ATT&CK mapping',
      hint: 'Try: timeline  — builds a chronological attack story from the logs',
      completionTrigger: 'timeline',
      completed: false,
    },
    {
      id: 'obj-write-rule',
      description: 'Write a Sigma detection rule for the brute-force pattern',
      hint: 'Try: write-rule brute-force  — creates a reusable SIEM detection rule',
      completionTrigger: 'write-rule',
      completed: false,
    },
    {
      id: 'obj-isolate',
      description: 'Isolate the compromised fileserver from the network',
      hint: 'Try: isolate 10.0.5.30  — network-level quarantine',
      completionTrigger: 'isolate',
      completed: false,
    },
  ],
  welcomeMessage: `\x1b[1;34m
╔═══════════════════════════════════════════════════════════╗
║      LAB 05 — SOC Analyst: Active Breach Response        ║
╚═══════════════════════════════════════════════════════════╝\x1b[0m

\x1b[31m  ⚠  SIEM ALERT — ACTIVE INCIDENT  ⚠\x1b[0m
\x1b[90m  Alert: Unusual outbound traffic (1.2GB → 45.33.32.156:443)${'\x1b[0m'}
\x1b[90m  Time: 2024-03-12 02:03 UTC\x1b[0m

\x1b[33m  Your role: SOC Analyst (Tier 2)\x1b[0m
\x1b[90m  Station: \x1b[0m\x1b[32m10.0.5.100 (soc-analyst-1)\x1b[0m
\x1b[90m  Priority: \x1b[0m\x1b[31mSEVERITY 1 — All hands\x1b[0m

\x1b[90m  ─────────────────────────────────────────────────────\x1b[0m
\x1b[90m  Analyze the logs. Map the attack. Write the detection rule.
  Then contain the threat before more data walks out the door.
  This is a real SOC workflow from start to finish.\x1b[0m

\x1b[90m  Type \x1b[0m\x1b[32mobjectives\x1b[0m\x1b[90m to see your goals | \x1b[0m\x1b[32mhint\x1b[0m\x1b[90m for guidance\x1b[0m

`,
}
