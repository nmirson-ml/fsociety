import type { Scenario } from '@/types'

/**
 * Lab 01 — DNS Zone Transfer Attack
 *
 * Students exploit a misconfigured DNS server to perform an AXFR zone transfer,
 * enumerate subdomains, and map the target infrastructure — exactly as real APTs
 * do in the recon phase before any exploitation.
 */
export const scenario01: Scenario = {
  id: 'scenario-01',
  title: 'DNS Zone Transfer Attack',
  description:
    'You are a penetration tester targeting Nexcorp Ltd. Intelligence suggests their ' +
    'nameserver is misconfigured. Your goal: use DNS recon to map their entire ' +
    'infrastructure without sending a single exploit — pure intelligence gathering.',
  difficulty: 'beginner',
  attacker: {
    ip: '10.0.1.5',
    hostname: 'kali-recon',
  },
  network: [
    {
      ip: '10.0.1.1',
      hostname: 'ns1.nexcorp.local',
      os: 'BIND 9.16.1',
      services: [
        { port: 53, protocol: 'tcp', name: 'dns', version: 'ISC BIND 9.16.1', banner: 'BIND 9.16.1' },
        { port: 53, protocol: 'udp', name: 'dns', version: 'ISC BIND 9.16.1' },
      ],
      vulnerabilities: [
        {
          name: 'AXFR Zone Transfer Misconfiguration',
          description:
            'DNS server allows zone transfers from any IP address. The named.conf ' +
            'is missing "allow-transfer" ACLs, allowing any attacker to dump the ' +
            'entire DNS zone — equivalent to handing over the network map.',
          severity: 'high',
        },
      ],
    },
    {
      ip: '10.0.1.10',
      hostname: 'www.nexcorp.local',
      os: 'Ubuntu 22.04 LTS',
      services: [
        { port: 80, protocol: 'tcp', name: 'http', version: 'nginx 1.24.0' },
        { port: 443, protocol: 'tcp', name: 'https', version: 'nginx 1.24.0' },
      ],
      vulnerabilities: [],
    },
    {
      ip: '10.0.1.20',
      hostname: 'mail.nexcorp.local',
      os: 'Ubuntu 22.04 LTS',
      services: [
        { port: 25, protocol: 'tcp', name: 'smtp', version: 'Postfix 3.7' },
        { port: 143, protocol: 'tcp', name: 'imap', version: 'Dovecot 2.3' },
      ],
      vulnerabilities: [],
    },
    {
      ip: '10.0.1.80',
      hostname: 'backup.nexcorp.local',
      os: 'CentOS 7 (EOL)',
      services: [
        { port: 22, protocol: 'tcp', name: 'ssh', version: 'OpenSSH 7.4' },
        { port: 8080, protocol: 'tcp', name: 'http', version: 'Apache 2.4.6 (EOL)' },
      ],
      vulnerabilities: [
        {
          name: 'End-of-Life CentOS 7',
          description: 'This system runs CentOS 7 which reached end-of-life June 2024. No security patches are available.',
          severity: 'critical',
        },
      ],
    },
  ],
  objectives: [
    {
      id: 'obj-nmap-dns',
      description: 'Discover the DNS server on the network',
      hint: 'Try: nmap -sV 10.0.1.1  — look for port 53',
      completionTrigger: 'nmap.*10\\.0\\.1\\.1',
      completed: false,
    },
    {
      id: 'obj-dig-normal',
      description: 'Perform a normal DNS lookup for nexcorp.local',
      hint: 'Try: dig nexcorp.local @10.0.1.1',
      completionTrigger: 'dig.*nexcorp',
      completed: false,
    },
    {
      id: 'obj-axfr',
      description: 'Attempt a DNS zone transfer (AXFR) against ns1.nexcorp.local',
      hint: 'Try: dig AXFR nexcorp.local @10.0.1.1',
      completionTrigger: 'dig.*AXFR|dig.*axfr',
      completed: false,
    },
    {
      id: 'obj-discover-subdomains',
      description: 'Identify at least 3 subdomains from the zone transfer',
      hint: 'The zone transfer output lists all DNS records — read them carefully',
      completionTrigger: 'dig.*AXFR|dig.*axfr',
      completed: false,
    },
    {
      id: 'obj-subdomain-enum',
      description: 'Use subfinder for passive subdomain enumeration',
      hint: 'Try: subfinder -d nexcorp.local',
      completionTrigger: 'subfinder',
      completed: false,
    },
    {
      id: 'obj-dns-brute',
      description: 'Run Gobuster DNS brute-force to find hidden subdomains',
      hint: 'Try: gobuster dns -d nexcorp.local',
      completionTrigger: 'gobuster',
      completed: false,
    },
    {
      id: 'obj-identify-target',
      description: 'Identify the backup server (high-value EOL system) in the DNS records',
      hint: 'Look for "backup" in the zone transfer output — EOL systems are prime targets',
      completionTrigger: 'dig.*AXFR|dig.*axfr|nmap.*10\\.0\\.1\\.80',
      completed: false,
    },
  ],
  welcomeMessage: `\x1b[1;36m
╔═══════════════════════════════════════════════════════════╗
║          LAB 01 — DNS Zone Transfer Attack               ║
╚═══════════════════════════════════════════════════════════╝\x1b[0m

\x1b[33m  Mission: Map Nexcorp's infrastructure via DNS recon\x1b[0m
\x1b[90m  You are: \x1b[0m\x1b[32m10.0.1.5 (kali-recon)\x1b[0m
\x1b[90m  Target:  \x1b[0m\x1b[31mnexcorp.local\x1b[0m

\x1b[90m  ─────────────────────────────────────────────────────\x1b[0m
\x1b[90m  Intel: The nameserver at 10.0.1.1 may be misconfigured.
  A successful AXFR zone transfer reveals the ENTIRE network map.
  This is how attackers learn about targets before a single exploit.\x1b[0m

\x1b[90m  Type \x1b[0m\x1b[32mobjectives\x1b[0m\x1b[90m to see your goals | \x1b[0m\x1b[32mhint\x1b[0m\x1b[90m for guidance\x1b[0m

`,
}
