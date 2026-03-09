import type { Scenario, CommandResult } from '@/types'

// ─── ANSI color helpers ───────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  brightGreen: '\x1b[92m',
  red: '\x1b[31m',
  brightRed: '\x1b[91m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  brightBlue: '\x1b[94m',
  cyan: '\x1b[36m',
  brightCyan: '\x1b[96m',
  gray: '\x1b[90m',
  white: '\x1b[97m',
}

export function cmdHelp(): CommandResult {
  return {
    output: `
${c.bold}${c.brightGreen}Available Commands${c.reset}
${c.gray}──────────────────────────────────────────────────${c.reset}

${c.bold}${c.yellow}Navigation & Info${c.reset}
  ${c.green}help${c.reset}                 Show this help message
  ${c.green}objectives${c.reset}           Show current lab objectives
  ${c.green}hint${c.reset}                 Get a hint for the current objective
  ${c.green}clear${c.reset}               Clear the terminal
  ${c.green}whoami${c.reset}              Show your current identity
  ${c.green}ifconfig${c.reset} / ${c.green}ip addr${c.reset}  Show your network interfaces
  ${c.green}cat <file>${c.reset}          Read a file

${c.bold}${c.yellow}Reconnaissance${c.reset}
  ${c.green}ping <host>${c.reset}          Test connectivity to a host
  ${c.green}nmap <options> <target>${c.reset}  Port and service scanner
  ${c.green}whois <host/domain>${c.reset}  Look up domain registration info
  ${c.green}dig <domain>${c.reset}        DNS lookup
  ${c.green}curl <url>${c.reset}          Make an HTTP request
  ${c.green}searchsploit <term>${c.reset} Search exploit database

${c.bold}${c.yellow}Exploitation (Simulated)${c.reset}
  ${c.green}exploit <CVE> <target>${c.reset}  Simulate exploiting a CVE
  ${c.green}ssh <user>@<host>${c.reset}    Connect to a remote host

${c.bold}${c.yellow}Defense & Analysis${c.reset}
  ${c.green}defend <technique>${c.reset}   Show how to defend against a technique
  ${c.green}mitre <technique-id>${c.reset} Look up a MITRE ATT&CK technique

${c.gray}──────────────────────────────────────────────────${c.reset}
${c.gray}  Tip: Real tools like nmap, curl, and ssh are simulated here.${c.reset}
${c.gray}  All outputs are educational — no real network traffic is generated.${c.reset}
`,
  }
}

export function cmdClear(): CommandResult {
  return { output: '\x1b[2J\x1b[H' }
}

export function cmdWhoami(scenario: Scenario | null): CommandResult {
  const attacker = scenario?.attacker ?? { ip: '127.0.0.1', hostname: 'localhost' }
  return {
    output: `${c.green}root${c.reset}
${c.gray}uid=0(root) gid=0(root) groups=0(root)${c.reset}
${c.gray}hostname: ${c.reset}${c.brightBlue}${attacker.hostname}${c.reset}
${c.gray}ip:       ${c.reset}${c.brightBlue}${attacker.ip}${c.reset}`,
  }
}

export function cmdIfconfig(scenario: Scenario | null): CommandResult {
  const ip = scenario?.attacker.ip ?? '127.0.0.1'
  return {
    output: `${c.brightBlue}eth0${c.reset}: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet ${c.green}${ip}${c.reset}  netmask ${c.gray}255.255.255.0${c.reset}  broadcast ${c.gray}10.0.0.255${c.reset}
        inet6 fe80::a00:27ff:fe3a:b2c1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:3a:b2:c1  txqueuelen 1000  (Ethernet)
        RX packets 1204  bytes 342891
        TX packets 432  bytes 89201

${c.brightBlue}lo${c.reset}: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet ${c.gray}127.0.0.1${c.reset}  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>`,
  }
}

export function cmdPing(args: string[]): CommandResult {
  const target = args[0]
  if (!target) return { output: `${c.red}Usage: ping <host>${c.reset}`, error: true }

  return {
    output: `PING ${target} (${target}) 56(84) bytes of data.
${c.green}64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.342 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.298 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=0.311 ms
64 bytes from ${target}: icmp_seq=4 ttl=64 time=0.287 ms${c.reset}

--- ${target} ping statistics ---
4 packets transmitted, 4 received, ${c.green}0% packet loss${c.reset}, time 3006ms
rtt min/avg/max/mdev = 0.287/0.310/0.342/0.020 ms`,
  }
}

export function cmdCat(args: string[]): CommandResult {
  const file = args[0]
  if (!file) return { output: `${c.red}Usage: cat <file>${c.reset}`, error: true }

  const files: Record<string, string> = {
    '/etc/passwd': `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
attacker:x:1001:1001::/home/attacker:/bin/bash`,

    '/etc/hosts': `127.0.0.1       localhost
10.0.0.1        gateway.acme.local
10.0.0.10       web01.acme.local
10.0.0.20       dc01.acme.local`,

    '/etc/shadow': `${c.red}cat: /etc/shadow: Permission denied${c.reset}
${c.yellow}  [Tip] /etc/shadow stores hashed passwords. It's readable only by root.
  Attackers who gain root can dump these and crack them offline with hashcat/john.${c.reset}`,

    'readme.txt': `${c.green}Welcome to CyberEd Lab 00!${c.reset}

Your goal is to perform reconnaissance on the Acme Corp lab network.
Think like an attacker — but act like a defender learning the attacker's playbook.

Start with: ${c.brightBlue}nmap -sn 10.0.0.0/24${c.reset}`,
  }

  const content = files[file] ?? files[file.replace(/^~\//, '/home/attacker/')]
  if (content) return { output: content }

  return {
    output: `${c.red}cat: ${file}: No such file or directory${c.reset}`,
    error: true,
  }
}

export function cmdObjectives(scenario: Scenario | null): CommandResult {
  if (!scenario) {
    return { output: `${c.gray}No active scenario. Select a lab from the curriculum.${c.reset}` }
  }

  const lines = [`\n${c.bold}${c.yellow}Mission Objectives${c.reset}`, c.gray + '─'.repeat(50) + c.reset]

  scenario.objectives.forEach((obj, i) => {
    const status = obj.completed
      ? `${c.green}[✓]${c.reset}`
      : `${c.gray}[ ]${c.reset}`
    lines.push(`${status} ${i + 1}. ${obj.description}`)
  })

  const completed = scenario.objectives.filter(o => o.completed).length
  const total = scenario.objectives.length
  lines.push('')
  lines.push(`${c.gray}Progress: ${c.reset}${c.brightGreen}${completed}${c.reset}${c.gray}/${total} objectives complete${c.reset}`)

  if (completed === total) {
    lines.push(`\n${c.brightGreen}${c.bold}🎉 Lab Complete! Great work.${c.reset}`)
  }

  return { output: lines.join('\r\n') }
}

export function cmdHint(scenario: Scenario | null): CommandResult {
  if (!scenario) {
    return { output: `${c.gray}No active scenario loaded.${c.reset}` }
  }

  const nextObj = scenario.objectives.find(o => !o.completed)
  if (!nextObj) {
    return { output: `${c.green}All objectives complete! Move to the next lab.${c.reset}` }
  }

  return {
    output: `${c.yellow}💡 Hint for: "${nextObj.description}"${c.reset}\r\n   ${c.gray}${nextObj.hint ?? 'No hint available.'}${c.reset}`,
  }
}
