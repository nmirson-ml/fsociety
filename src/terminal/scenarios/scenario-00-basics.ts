import type { Scenario } from '@/types'

/**
 * Lab 00 — Basics: Your First Recon
 *
 * Goal: Students learn to discover a network, identify hosts,
 * and enumerate services — the very first steps any attacker takes.
 * Mirrors Salt Typhoon's initial reconnaissance against telecom targets.
 */
export const scenario00: Scenario = {
  id: 'scenario-00',
  title: 'Your First Recon',
  description:
    'You are a security researcher authorized to test Acme Corp\'s internal lab network. ' +
    'Discover what\'s on the network, identify open services, and understand what an attacker would see.',
  difficulty: 'beginner',
  attacker: {
    ip: '10.0.0.5',
    hostname: 'kali-attacker',
  },
  network: [
    {
      ip: '10.0.0.1',
      hostname: 'gateway.acme.local',
      os: 'Cisco IOS XE 17.3.1',
      services: [
        { port: 22, protocol: 'tcp', name: 'ssh', version: 'OpenSSH 8.4', banner: 'SSH-2.0-OpenSSH_8.4' },
        { port: 80, protocol: 'tcp', name: 'http', version: 'nginx 1.18', banner: 'nginx/1.18.0' },
        { port: 443, protocol: 'tcp', name: 'https', version: 'nginx 1.18' },
      ],
      vulnerabilities: [
        {
          cve: 'CVE-2023-20198',
          name: 'Cisco IOS XE Privilege Escalation',
          description:
            'A vulnerability in the web UI of Cisco IOS XE Software allows a remote unauthenticated ' +
            'attacker to create an account with privilege level 15 access. Salt Typhoon exploited ' +
            'this exact CVE to gain initial access to telecom routers.',
          exploitCommand: 'exploit CVE-2023-20198 10.0.0.1',
          severity: 'critical',
        },
      ],
    },
    {
      ip: '10.0.0.10',
      hostname: 'web01.acme.local',
      os: 'Ubuntu 20.04 LTS',
      services: [
        { port: 22, protocol: 'tcp', name: 'ssh', version: 'OpenSSH 8.2p1', banner: 'SSH-2.0-OpenSSH_8.2p1' },
        { port: 80, protocol: 'tcp', name: 'http', version: 'Apache 2.4.41', banner: 'Apache/2.4.41 (Ubuntu)' },
        { port: 3306, protocol: 'tcp', name: 'mysql', version: 'MySQL 8.0.27' },
      ],
      vulnerabilities: [],
    },
    {
      ip: '10.0.0.20',
      hostname: 'dc01.acme.local',
      os: 'Windows Server 2019',
      services: [
        { port: 53, protocol: 'tcp', name: 'dns', version: 'Microsoft DNS' },
        { port: 88, protocol: 'tcp', name: 'kerberos', version: 'Microsoft Kerberos' },
        { port: 389, protocol: 'tcp', name: 'ldap', version: 'Microsoft LDAP' },
        { port: 445, protocol: 'tcp', name: 'smb', version: 'SMBv3' },
        { port: 3389, protocol: 'tcp', name: 'rdp', version: 'Microsoft Terminal Services' },
      ],
      vulnerabilities: [],
    },
  ],
  objectives: [
    {
      id: 'obj-ping-sweep',
      description: 'Discover live hosts on the 10.0.0.0/24 network',
      hint: 'Try: nmap -sn 10.0.0.0/24',
      completionTrigger: 'nmap.*-sn.*10\.0\.0',
      completed: false,
    },
    {
      id: 'obj-port-scan',
      description: 'Identify open ports and services on the gateway (10.0.0.1)',
      hint: 'Try: nmap -sV 10.0.0.1',
      completionTrigger: 'nmap.*10\.0\.0\.1',
      completed: false,
    },
    {
      id: 'obj-identify-vuln',
      description: 'Identify the CVE affecting the gateway router',
      hint: 'Try: whois 10.0.0.1 or searchsploit Cisco IOS XE',
      completionTrigger: 'searchsploit|vuln.*10\.0\.0\.1|nmap.*--script.*vuln.*10\.0\.0\.1',
      completed: false,
    },
  ],
  welcomeMessage: `\x1b[1;32m
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ ███████╗██████╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔══██╗
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝█████╗  ██║  ██║
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗██╔══╝  ██║  ██║
╚██████╗   ██║   ██████╔╝███████╗██║  ██║███████╗██████╔╝
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═════╝
\x1b[0m
\x1b[1;34m  Interactive Cybersecurity Lab Environment\x1b[0m
\x1b[90m  ─────────────────────────────────────────\x1b[0m

\x1b[33m  Lab 00: Your First Recon\x1b[0m
\x1b[90m  You are: \x1b[0m\x1b[32m10.0.0.5 (kali-attacker)\x1b[0m
\x1b[90m  Target:  \x1b[0m\x1b[31m10.0.0.0/24 (Acme Corp Lab)\x1b[0m

\x1b[90m  Type \x1b[0m\x1b[32mhelp\x1b[0m\x1b[90m for available commands\x1b[0m
\x1b[90m  Type \x1b[0m\x1b[32mobjectives\x1b[0m\x1b[90m to see your mission goals\x1b[0m

`,
}
