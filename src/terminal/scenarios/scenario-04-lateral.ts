import type { Scenario } from '@/types'

/**
 * Lab 04 — Credential Dump → Pass-the-Hash → Domain Controller
 *
 * Students compromise an initial host, dump LSASS credentials with Mimikatz,
 * then use pass-the-hash to authenticate as a Domain Admin and access the DC.
 * Mirrors exactly what Salt Typhoon and other APTs do after initial access.
 */
export const scenario04: Scenario = {
  id: 'scenario-04',
  title: 'Pass-the-Hash to Domain Controller',
  description:
    'You\'ve compromised a Windows workstation inside Acme Corp\'s network. ' +
    'Dump credentials from memory, harvest NTLM hashes, then use pass-the-hash ' +
    'to authenticate as a Domain Admin and reach the Domain Controller. ' +
    'No password cracking required.',
  difficulty: 'advanced',
  attacker: {
    ip: '10.0.4.5',
    hostname: 'kali-lateral',
  },
  network: [
    {
      ip: '10.0.4.10',
      hostname: 'ws01.acme.corp',
      os: 'Windows 10 Enterprise (compromised)',
      services: [
        { port: 135, protocol: 'tcp', name: 'msrpc', version: 'Microsoft RPC' },
        { port: 139, protocol: 'tcp', name: 'netbios-ssn', version: 'NetBIOS' },
        { port: 445, protocol: 'tcp', name: 'smb', version: 'SMBv3' },
      ],
      vulnerabilities: [
        {
          name: 'LSASS Credential Exposure',
          description:
            'No LSA Protection enabled. Mimikatz can read plaintext credentials ' +
            'and NTLM hashes directly from LSASS process memory.',
          severity: 'critical',
        },
      ],
    },
    {
      ip: '10.0.4.20',
      hostname: 'dc01.acme.corp',
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
    {
      ip: '10.0.4.30',
      hostname: 'fileserver.acme.corp',
      os: 'Windows Server 2016',
      services: [
        { port: 445, protocol: 'tcp', name: 'smb', version: 'SMBv3' },
      ],
      vulnerabilities: [],
    },
  ],
  objectives: [
    {
      id: 'obj-nmap-internal',
      description: 'Scan the internal network to identify Windows hosts',
      hint: 'Try: nmap -sV 10.0.4.0/24  or  nmap -sn 10.0.4.0/24',
      completionTrigger: 'nmap.*10\\.0\\.4',
      completed: false,
    },
    {
      id: 'obj-dump-lsass',
      description: 'Dump credentials from LSASS memory using Mimikatz',
      hint: 'Try: mimikatz sekurlsa::logonpasswords',
      completionTrigger: 'mimikatz',
      completed: false,
    },
    {
      id: 'obj-get-hash',
      description: 'Extract the NTLM hash of a Domain Admin account',
      hint: 'Mimikatz output shows NTLM hashes next to each account — jsmith is a Domain Admin',
      completionTrigger: 'mimikatz',
      completed: false,
    },
    {
      id: 'obj-pth',
      description: 'Use pass-the-hash to authenticate as the Domain Admin',
      hint: 'Try: crackmapexec smb 10.0.4.20 -u jsmith -H 8846f7eaee8fb117ad06bdd830b7586c',
      completionTrigger: 'crackmapexec|pass-the-hash|pth',
      completed: false,
    },
    {
      id: 'obj-dc-access',
      description: 'Achieve remote execution on the Domain Controller',
      hint: 'CrackMapExec with -H flag and the Domain Admin hash should give you DC access',
      completionTrigger: 'crackmapexec.*-H|pass-the-hash',
      semanticCheck: (cmd, args) => {
        return (cmd === 'crackmapexec' || cmd === 'cme') && args.includes('-H')
      },
      completed: false,
    },
    {
      id: 'obj-enum-domain',
      description: 'Enumerate Domain Admins to find attacker-created backdoor accounts',
      hint: 'Try: net user /domain  or  net group "Domain Admins" /domain',
      completionTrigger: 'net.*domain|net.*Domain',
      completed: false,
    },
    {
      id: 'obj-domain-admin',
      description: 'Confirm full Domain Admin access',
      hint: 'Pass-the-hash against the DC should give you SYSTEM level access',
      completionTrigger: 'pass-the-hash|crackmapexec.*-H',
      completed: false,
    },
  ],
  welcomeMessage: `\x1b[1;31m
╔═══════════════════════════════════════════════════════════╗
║      LAB 04 — Pass-the-Hash Lateral Movement             ║
╚═══════════════════════════════════════════════════════════╝\x1b[0m

\x1b[33m  Mission: Reach the Domain Controller via credential harvesting\x1b[0m
\x1b[90m  You are: \x1b[0m\x1b[32m10.0.4.5 (kali-lateral)\x1b[0m
\x1b[90m  Foothold: \x1b[0m\x1b[31m10.0.4.10 (ws01 — already compromised)\x1b[0m
\x1b[90m  Target:   \x1b[0m\x1b[31m10.0.4.20 (dc01 — Domain Controller)\x1b[0m

\x1b[90m  ─────────────────────────────────────────────────────\x1b[0m
\x1b[90m  Scenario: You have a shell on ws01. No password cracking needed —
  the NTLM hash IS the credential. Dump, harvest, pivot.
  This is the exact technique used in the SolarWinds breach.\x1b[0m

\x1b[90m  Type \x1b[0m\x1b[32mobjectives\x1b[0m\x1b[90m to see your goals | \x1b[0m\x1b[32mhint\x1b[0m\x1b[90m for guidance\x1b[0m

`,
}
