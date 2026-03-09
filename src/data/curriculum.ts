import type { Module } from '@/types'

export const MODULES: Module[] = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    level: 0,
    description: 'How networks actually work — the foundation every hacker builds on.',
    aptGroups: [],
    lessons: [
      {
        id: 'l0-01', slug: 'osi-model', title: 'The OSI Model',
        description: 'Why networks are built in layers and how attackers exploit each one.',
        level: 0, xp: 50, estimatedMinutes: 15, mitreIds: [], tags: ['networking', 'beginner'],
      },
      {
        id: 'l0-02', slug: 'tcp-ip', title: 'TCP/IP & the Three-Way Handshake',
        description: 'How computers establish connections — and how attackers abuse SYN floods.',
        level: 0, xp: 50, estimatedMinutes: 20, mitreIds: [], tags: ['networking', 'beginner'],
      },
      {
        id: 'l0-03', slug: 'dns', title: 'DNS — The Internet\'s Phone Book',
        description: 'How domain resolution works and why DNS is a goldmine for attackers.',
        level: 0, xp: 50, estimatedMinutes: 20, mitreIds: ['T1071.004'], tags: ['networking', 'beginner'],
      },
      {
        id: 'l0-04', slug: 'http-https', title: 'HTTP & HTTPS',
        description: 'Request-response basics, headers, and why HTTPS matters.',
        level: 0, xp: 75, estimatedMinutes: 25, mitreIds: [], tags: ['networking', 'web'],
      },
      {
        id: 'l0-05', slug: 'terminal-basics', title: 'Terminal & Command Line Basics',
        description: 'Master the 100 most essential bash commands. Navigate filesystems, manipulate files, search content, manage processes, and use pipes — the foundation of every security tool you will ever run.',
        level: 0, xp: 100, estimatedMinutes: 40, mitreIds: [], tags: ['linux', 'bash', 'beginner', 'fundamentals'],
        scenarioId: 'scenario-06',
      },
    ],
  },
  {
    id: 'recon',
    title: 'Recon & OSINT',
    level: 1,
    description: 'Know your target before you touch a single packet. Intelligence gathering is where every pro attack starts.',
    aptGroups: ['Salt Typhoon', 'APT41'],
    lessons: [
      {
        id: 'l1-01', slug: 'passive-recon', title: 'Passive Reconnaissance',
        description: 'Gather intelligence without ever touching the target — WHOIS, Shodan, LinkedIn, Google Dorks.',
        level: 1, xp: 100, estimatedMinutes: 25, mitreIds: ['T1592', 'T1593'], tags: ['recon', 'osint'],
        scenarioId: 'scenario-00',
      },
      {
        id: 'l1-02', slug: 'active-recon', title: 'Active Recon with Nmap',
        description: 'Port scanning, service fingerprinting, and OS detection. What attackers see when they scan you.',
        level: 1, xp: 150, estimatedMinutes: 30, mitreIds: ['T1046'], tags: ['recon', 'nmap'],
        scenarioId: 'scenario-00',
      },
      {
        id: 'l1-03', slug: 'dns-recon', title: 'DNS Reconnaissance',
        description: 'Zone transfers, subdomain enumeration, reverse lookups — how DNS leaks your infrastructure.',
        level: 1, xp: 100, estimatedMinutes: 20, mitreIds: ['T1018'], tags: ['recon', 'dns'],
        scenarioId: 'scenario-01',
      },
    ],
  },
  {
    id: 'initial-access',
    title: 'Initial Access',
    level: 2,
    description: 'How attackers get in the door. From phishing to edge device exploits — the techniques Salt Typhoon used.',
    aptGroups: ['Salt Typhoon', 'APT28', 'Lazarus'],
    lessons: [
      {
        id: 'l2-01', slug: 'phishing', title: 'Spear Phishing',
        description: 'Crafting targeted lures that bypass security awareness. Used by every major APT.',
        level: 2, xp: 200, estimatedMinutes: 30, mitreIds: ['T1566.001', 'T1566.002'], tags: ['initial-access', 'social'],
      },
      {
        id: 'l2-02', slug: 'edge-devices', title: 'Exploiting Edge Devices',
        description: 'How Salt Typhoon used CVE-2023-20198 to own Cisco routers at US telecoms. Step-by-step breakdown.',
        level: 2, xp: 300, estimatedMinutes: 45, mitreIds: ['T1190', 'T1078'],
        tags: ['initial-access', 'cve', 'salt-typhoon'],
        scenarioId: 'scenario-00',
      },
      {
        id: 'l2-03', slug: 'web-app-attacks', title: 'Web Application Attacks',
        description: 'SQL injection, XSS, CSRF — the OWASP Top 10 in practice.',
        level: 2, xp: 250, estimatedMinutes: 40, mitreIds: ['T1190'], tags: ['initial-access', 'web', 'owasp'],
        scenarioId: 'scenario-02',
      },
    ],
  },
  {
    id: 'persistence',
    title: 'Persistence',
    level: 3,
    description: 'Staying in after getting in. Web shells, rootkits, scheduled tasks — how APTs disappear into infrastructure.',
    aptGroups: ['Salt Typhoon', 'APT41', 'GhostEmperor'],
    lessons: [
      {
        id: 'l3-01', slug: 'web-shells', title: 'Web Shells',
        description: 'How a 10-line PHP file gives attackers permanent server access. Detection and removal.',
        level: 3, xp: 200, estimatedMinutes: 30, mitreIds: ['T1505.003'], tags: ['persistence', 'webshell'],
        scenarioId: 'scenario-03',
      },
      {
        id: 'l3-02', slug: 'scheduled-tasks', title: 'Scheduled Tasks & Cron Jobs',
        description: 'LOL persistence: using built-in OS scheduling to survive reboots and user removal.',
        level: 3, xp: 150, estimatedMinutes: 20, mitreIds: ['T1053'], tags: ['persistence', 'windows', 'linux'],
      },
      {
        id: 'l3-03', slug: 'rootkits', title: 'Rootkits & Kernel Implants',
        description: 'How GhostEmperor (Salt Typhoon) used the Demodex rootkit to achieve kernel-level persistence.',
        level: 3, xp: 400, estimatedMinutes: 60, mitreIds: ['T1014'], tags: ['persistence', 'rootkit', 'salt-typhoon'],
      },
    ],
  },
  {
    id: 'lateral-movement',
    title: 'Lateral Movement',
    level: 4,
    description: 'Moving through the network like a ghost. Pass-the-hash, Kerberoasting, and living off the land.',
    aptGroups: ['Salt Typhoon', 'APT29', 'FIN7'],
    lessons: [
      {
        id: 'l4-01', slug: 'credential-harvesting', title: 'Credential Harvesting',
        description: 'LSASS dumping, Mimikatz, pass-the-hash, and golden ticket attacks.',
        level: 4, xp: 300, estimatedMinutes: 45, mitreIds: ['T1003', 'T1558'], tags: ['lateral', 'credentials'],
        scenarioId: 'scenario-04',
      },
      {
        id: 'l4-02', slug: 'smb-lateral', title: 'SMB & PsExec Lateral Movement',
        description: 'Using Windows admin shares and SMB to execute code on remote systems.',
        level: 4, xp: 250, estimatedMinutes: 35, mitreIds: ['T1021.002'], tags: ['lateral', 'smb', 'windows'],
        scenarioId: 'scenario-04',
      },
    ],
  },
  {
    id: 'exfiltration',
    title: 'Exfiltration',
    level: 5,
    description: 'Getting the data out. Covert channels, DNS tunneling, and how Salt Typhoon stole call records.',
    aptGroups: ['Salt Typhoon', 'APT10'],
    lessons: [
      {
        id: 'l5-01', slug: 'data-staging', title: 'Data Staging & Compression',
        description: 'How attackers collect, compress, and prepare data before sending it out.',
        level: 5, xp: 200, estimatedMinutes: 25, mitreIds: ['T1560'], tags: ['exfil', 'data'],
      },
      {
        id: 'l5-02', slug: 'c2-channels', title: 'C2 Channels & Covert Comms',
        description: 'DNS tunneling, HTTPS beaconing, and how GhostSpider (Salt Typhoon) communicated with C2.',
        level: 5, xp: 350, estimatedMinutes: 50, mitreIds: ['T1071', 'T1573'], tags: ['exfil', 'c2', 'salt-typhoon'],
      },
    ],
  },
  {
    id: 'defense',
    title: 'Defense & Detection',
    level: 6,
    description: 'Build the blue team playbook. SIEM rules, EDR, network segmentation, and incident response.',
    aptGroups: [],
    lessons: [
      {
        id: 'l6-01', slug: 'siem-rules', title: 'Writing SIEM Detection Rules',
        description: 'Sigma rules, Splunk SPL, and Elastic ESQL for detecting the techniques you\'ve learned.',
        level: 6, xp: 300, estimatedMinutes: 40, mitreIds: [], tags: ['defense', 'siem', 'sigma'],
        scenarioId: 'scenario-05',
      },
      {
        id: 'l6-02', slug: 'network-defense', title: 'Network Defense Architecture',
        description: 'Segmentation, zero trust, IDS/IPS placement, and honeypots.',
        level: 6, xp: 300, estimatedMinutes: 45, mitreIds: [], tags: ['defense', 'network', 'architecture'],
      },
      {
        id: 'l6-03', slug: 'incident-response', title: 'Incident Response Playbook',
        description: 'How to detect, contain, eradicate, and recover from a Salt Typhoon-style breach.',
        level: 6, xp: 400, estimatedMinutes: 60, mitreIds: [], tags: ['defense', 'ir', 'playbook'],
        scenarioId: 'scenario-05',
      },
    ],
  },
  {
    id: 'apt-case-studies',
    title: 'APT Case Studies',
    level: 7,
    description: 'Deep dives into nation-state operations. Salt Typhoon, APT41, Lazarus Group — how the pros really operate.',
    aptGroups: ['Salt Typhoon', 'APT41', 'Lazarus Group', 'APT29'],
    lessons: [
      {
        id: 'l7-01', slug: 'salt-typhoon-deep-dive', title: 'Salt Typhoon: The Telecom Heist',
        description: 'Full kill chain reconstruction of Salt Typhoon\'s 2023-2024 US telecom compromise. Every step, every tool.',
        level: 7, xp: 500, estimatedMinutes: 90, mitreIds: ['T1190', 'T1078', 'T1505.003', 'T1014', 'T1071'],
        tags: ['apt', 'salt-typhoon', 'case-study'],
        scenarioId: 'scenario-00',
      },
      {
        id: 'l7-02', slug: 'apt41-profile', title: 'APT41: When Nation-State Meets Cybercrime',
        description: 'The dual-hat hackers who conduct espionage AND financial crime for China.',
        level: 7, xp: 400, estimatedMinutes: 60, mitreIds: [],
        tags: ['apt', 'apt41', 'case-study'],
      },
      {
        id: 'l7-03', slug: 'lazarus-group', title: 'Lazarus Group: North Korea\'s Hackers-for-Hire',
        description: 'From Sony Pictures to $1.5B crypto heists — the most prolific financial cybercriminals.',
        level: 7, xp: 400, estimatedMinutes: 60, mitreIds: [],
        tags: ['apt', 'lazarus', 'dprk', 'case-study'],
      },
    ],
  },
]

export const TOTAL_XP = MODULES.reduce((sum, m) => sum + m.lessons.reduce((s, l) => s + l.xp, 0), 0)
