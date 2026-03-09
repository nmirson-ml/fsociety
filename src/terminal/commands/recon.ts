import type { Scenario, CommandResult, Host } from '@/types'

const c = {
  reset: '\x1b[0m', bold: '\x1b[1m', green: '\x1b[32m', brightGreen: '\x1b[92m',
  red: '\x1b[31m', yellow: '\x1b[33m', blue: '\x1b[34m', brightBlue: '\x1b[94m',
  cyan: '\x1b[36m', brightCyan: '\x1b[96m', gray: '\x1b[90m', white: '\x1b[97m',
}

function formatNmapService(host: Host): string[] {
  const lines: string[] = []
  lines.push(`${c.brightGreen}Nmap scan report for ${host.hostname ?? host.ip} (${host.ip})${c.reset}`)
  lines.push(`${c.green}Host is up (0.0012s latency).${c.reset}`)
  lines.push('')
  lines.push(`${c.gray}PORT      STATE  SERVICE         VERSION${c.reset}`)

  host.services.forEach(svc => {
    const port = `${svc.port}/${svc.protocol}`.padEnd(9)
    const name = svc.name.padEnd(15)
    const version = svc.version ?? ''
    lines.push(`${c.brightBlue}${port}${c.reset} ${c.green}open${c.reset}  ${name} ${c.gray}${version}${c.reset}`)
  })

  if (host.vulnerabilities && host.vulnerabilities.length > 0) {
    lines.push('')
    host.vulnerabilities.forEach(vuln => {
      const sev = vuln.severity === 'critical' ? c.red
        : vuln.severity === 'high' ? `\x1b[91m`
        : c.yellow
      lines.push(`${sev}[!] VULN: ${vuln.cve ?? vuln.name} — ${vuln.severity.toUpperCase()}${c.reset}`)
      lines.push(`${c.gray}    ${vuln.description.slice(0, 80)}...${c.reset}`)
    })
  }
  return lines
}

export function cmdNmap(rawArgs: string[], scenario: Scenario | null): CommandResult {
  if (!scenario) return { output: `${c.red}No active scenario.${c.reset}`, error: true }

  const args = rawArgs.join(' ')
  const isSn = args.includes('-sn')       // ping sweep
  const isSV = args.includes('-sV')       // service version
  const isScript = args.includes('--script')
  const isVuln = args.includes('vuln')

  // Extract target
  const targetMatch = args.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\/\d+)?)/)
  const target = targetMatch ? targetMatch[1] : null

  if (!target) return {
    output: `${c.red}Error: No target specified.\n${c.gray}Usage: nmap [options] <target>${c.reset}`,
    error: true,
  }

  const lines: string[] = []
  lines.push(``)
  lines.push(`${c.bold}Starting Nmap 7.94 (https://nmap.org) at ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC${c.reset}`)

  // ─── Ping Sweep ────────────────────────────────────────────────────────────
  if (isSn) {
    lines.push(`${c.gray}Nmap scan report — ping sweep of ${target}${c.reset}`)
    lines.push('')

    // Show all hosts in network as discovered
    lines.push(`${c.green}Host is up (0.0021s latency).${c.reset}`)
    lines.push(`${c.gray}  IP: ${scenario.attacker.ip} (you — kali-attacker)${c.reset}`)
    lines.push('')

    scenario.network.forEach(host => {
      lines.push(`${c.brightGreen}Host is up (0.${Math.floor(Math.random() * 9) + 1}ms latency).${c.reset}`)
      lines.push(`${c.gray}  IP: ${host.ip}${host.hostname ? ` (${host.hostname})` : ''}${c.reset}`)
    })

    lines.push('')
    lines.push(`${c.green}Nmap done: 256 IP addresses (${scenario.network.length + 1} hosts up) scanned in 3.42 seconds${c.reset}`)
    lines.push('')
    lines.push(`${c.yellow}💡 Educational Note:${c.reset} ${c.gray}A ping sweep (${c.reset}${c.brightBlue}-sn${c.reset}${c.gray}) sends ICMP echo requests to`)
    lines.push(`   discover live hosts. Defenders detect this with IDS rules watching`)
    lines.push(`   for ICMP floods from a single source. Salt Typhoon used ping sweeps`)
    lines.push(`   to map telecom internal networks before targeted exploitation.${c.reset}`)

    return { output: lines.join('\r\n'), objectivesCompleted: ['obj-ping-sweep'] }
  }

  // ─── Single host scan ──────────────────────────────────────────────────────
  const host = scenario.network.find(h => h.ip === target || h.hostname === target)
  if (!host) {
    lines.push(`${c.red}Nmap scan report for ${target}${c.reset}`)
    lines.push(`${c.red}Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn${c.reset}`)
    lines.push(`${c.gray}Nmap done: 1 IP address (0 hosts up) scanned in 2.03 seconds${c.reset}`)
    return { output: lines.join('\r\n') }
  }

  formatNmapService(host).forEach(l => lines.push(l))

  if (isSV || isScript || isVuln) {
    lines.push('')
    lines.push(`${c.gray}Service detection performed. Please report any incorrect results.${c.reset}`)
  }

  lines.push(`\n${c.green}Nmap done: 1 IP address (1 host up) scanned in 4.67 seconds${c.reset}`)

  // Educational annotation
  lines.push('')
  lines.push(`${c.yellow}💡 What you see:${c.reset}`)
  lines.push(`${c.gray}   Open ports reveal the attack surface. Each open service is a potential`)
  lines.push(`   entry point. Attackers enumerate versions to match against known CVEs.`)
  lines.push(`   \x1b[96mDefense:\x1b[0m\x1b[90m Minimize open ports. Use firewall rules. Monitor for nmap fingerprints.${c.reset}`)

  const completed: string[] = []
  if (target === '10.0.0.1' || host.hostname?.includes('gateway')) completed.push('obj-port-scan')

  return { output: lines.join('\r\n'), objectivesCompleted: completed }
}

export function cmdWhois(args: string[]): CommandResult {
  const target = args[0]
  if (!target) return { output: `\x1b[31mUsage: whois <domain|ip>\x1b[0m`, error: true }

  return {
    output: `
${c.gray}# ARIN WHOIS Data${c.reset}
${c.bold}Domain/IP:${c.reset}     ${target}
${c.bold}Registrar:${c.reset}     Acme Corp Internal
${c.bold}Created:${c.reset}       2019-04-12
${c.bold}Expires:${c.reset}       2029-04-12
${c.bold}Name Servers:${c.reset}  10.0.0.20 (dc01.acme.local)
${c.bold}Status:${c.reset}        ACTIVE
${c.bold}Org:${c.reset}           Acme Corporation (ACME-1)
${c.bold}Address:${c.reset}       123 Corp Ave, San Francisco, CA 94102

${c.yellow}💡 OSINT Note:${c.reset} ${c.gray}Whois data leaks org names, admin contacts, and DNS servers.
   Attackers use this to build a target profile before the first packet is sent.
   Public WHOIS is free intelligence. Defenders should minimize exposure in registrar records.${c.reset}`,
  }
}

export function cmdDig(args: string[]): CommandResult {
  const domain = args.find(a => !a.startsWith('-')) ?? 'example.com'
  const type = args.includes('MX') ? 'MX' : args.includes('NS') ? 'NS' : 'A'

  const responses: Record<string, string> = {
    A: `${c.gray};; ANSWER SECTION:${c.reset}
${domain}.    300  IN  A  10.0.0.10
${domain}.    300  IN  A  10.0.0.11`,
    MX: `${c.gray};; ANSWER SECTION:${c.reset}
${domain}.    300  IN  MX  10 mail.${domain}.`,
    NS: `${c.gray};; ANSWER SECTION:${c.reset}
${domain}.    86400  IN  NS  dc01.acme.local.`,
  }

  return {
    output: `
${c.bold}; <<>> DiG 9.18.1 <<>> ${args.join(' ')}${c.reset}
;; global options: +cmd

;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 31337

${responses[type] ?? responses['A']}

;; Query time: 1 msec
;; SERVER: 10.0.0.20#53(dc01.acme.local) (UDP)

${c.yellow}💡 DNS Recon Note:${c.reset} ${c.gray}DNS records expose internal infrastructure.
   Zone transfers (dig AXFR) can dump ALL DNS records if misconfigured.
   This is how attackers map entire internal networks from a single DNS query.
   \x1b[96mDefense:\x1b[0m\x1b[90m Restrict zone transfers to authorized servers only (ACLs).${c.reset}`,
  }
}

export function cmdSearchsploit(args: string[]): CommandResult {
  const query = args.join(' ').toLowerCase()

  const results: Record<string, { title: string; path: string; cve?: string }[]> = {
    'cisco ios xe': [
      { title: 'Cisco IOS XE 17.x - Privilege Escalation (CVE-2023-20198)', path: 'exploits/hardware/webapps/51785.py', cve: 'CVE-2023-20198' },
      { title: 'Cisco IOS XE - Web UI Remote Code Execution (CVE-2023-20273)', path: 'exploits/hardware/webapps/51786.py', cve: 'CVE-2023-20273' },
      { title: 'Cisco IOS XE - Unauthenticated Account Creation', path: 'exploits/hardware/webapps/51787.py' },
    ],
    'apache': [
      { title: 'Apache 2.4.41 - Reverse Proxy SSRF', path: 'exploits/multiple/webapps/48648.txt' },
      { title: 'Apache 2.4.x - mod_proxy SSRF', path: 'exploits/linux/webapps/50512.py' },
    ],
    'mysql': [
      { title: 'MySQL 8.0 - Remote Privilege Escalation (Authenticated)', path: 'exploits/linux/local/51276.py' },
    ],
  }

  let match: { title: string; path: string; cve?: string }[] = []
  for (const [key, val] of Object.entries(results)) {
    if (query.includes(key) || key.includes(query)) {
      match = val
      break
    }
  }

  if (!match.length) {
    return { output: `${c.gray}No results for "${args.join(' ')}". Try: searchsploit cisco ios xe${c.reset}` }
  }

  const lines = [
    '',
    `${c.bold}${c.brightBlue}Exploit-DB Search Results — "${args.join(' ')}"${c.reset}`,
    c.gray + '─'.repeat(70) + c.reset,
  ]

  match.forEach(r => {
    const cve = r.cve ? ` ${c.yellow}[${r.cve}]${c.reset}` : ''
    lines.push(`${c.red}[!]${c.reset} ${c.white}${r.title}${c.reset}${cve}`)
    lines.push(`    ${c.gray}Path: ${r.path}${c.reset}`)
  })

  lines.push('')
  lines.push(`${c.yellow}💡 Exploit-DB:${c.reset} ${c.gray}Real tool at exploit-db.com. Lists public exploit code for known CVEs.`)
  lines.push(`   Attackers check here to find ready-made exploits for discovered service versions.`)
  lines.push(`   \x1b[96mDefense:\x1b[0m\x1b[90m Monitor Exploit-DB for your software stack. Patch before exploits go public.${c.reset}`)

  return { output: lines.join('\r\n'), objectivesCompleted: ['obj-identify-vuln'] }
}

export function cmdCurl(args: string[]): CommandResult {
  const url = args.find(a => !a.startsWith('-')) ?? ''
  const isHead = args.includes('-I') || args.includes('--head')

  if (!url) return { output: `${c.red}Usage: curl [options] <url>${c.reset}`, error: true }

  if (isHead) {
    return {
      output: `HTTP/1.1 200 OK
Server: Apache/2.4.41 (Ubuntu)
Content-Type: text/html; charset=UTF-8
X-Powered-By: PHP/7.4.3
Set-Cookie: PHPSESSID=abc123; path=/; HttpOnly
X-Frame-Options: SAMEORIGIN
Date: ${new Date().toUTCString()}

${c.yellow}💡 Headers reveal:${c.reset} ${c.gray}Server version (Apache 2.4.41), backend language (PHP 7.4.3).
   Both are fingerprints attackers use to find matching CVEs.
   \x1b[96mDefense:\x1b[0m\x1b[90m Use "ServerTokens Prod" in Apache to hide version strings.${c.reset}`,
    }
  }

  return {
    output: `<!DOCTYPE html>
<html>
<head><title>Acme Corp Internal Portal</title></head>
<body>
  <h1>Welcome to Acme Corp</h1>
  <!-- TODO: remove debug endpoint /admin/debug before prod -->
  <p>Login: <a href="/login">Click here</a></p>
</body>
</html>

${c.yellow}💡 Interesting:${c.reset} ${c.gray}HTML comments often contain sensitive information.
   The comment above reveals a /admin/debug endpoint — a common mistake.
   Attackers grep page sources for passwords, endpoints, and credentials.
   \x1b[96mDefense:\x1b[0m\x1b[90m Never put internal paths, credentials, or TODOs in HTML.${c.reset}`,
  }
}
