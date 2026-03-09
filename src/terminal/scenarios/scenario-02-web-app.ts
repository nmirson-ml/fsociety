import type { Scenario } from '@/types'

/**
 * Lab 02 — Web Application Attack: SQL Injection + File Upload
 *
 * Students attack a deliberately vulnerable web application using SQL injection
 * to dump credentials, then exploit a file upload vulnerability to plant a web shell.
 * Core OWASP Top 10 techniques demonstrated.
 */
export const scenario02: Scenario = {
  id: 'scenario-02',
  title: 'Web Application Attack',
  description:
    'Target: ShopVuln — a deliberately vulnerable e-commerce application. ' +
    'Enumerate the app, exploit SQL injection to dump the database, then upload ' +
    'a web shell through the insecure file upload endpoint. Classic OWASP Top 10.',
  difficulty: 'intermediate',
  attacker: {
    ip: '10.0.2.5',
    hostname: 'kali-webapp',
  },
  network: [
    {
      ip: '10.0.2.10',
      hostname: 'webapp.target.local',
      os: 'Ubuntu 20.04 LTS',
      services: [
        { port: 22, protocol: 'tcp', name: 'ssh', version: 'OpenSSH 8.2p1' },
        { port: 80, protocol: 'tcp', name: 'http', version: 'Apache 2.4.41', banner: 'Apache/2.4.41 (Ubuntu)' },
        { port: 3306, protocol: 'tcp', name: 'mysql', version: 'MySQL 8.0.27' },
      ],
      vulnerabilities: [
        {
          cve: 'CWE-89',
          name: 'SQL Injection — Product Search',
          description:
            'The /search endpoint concatenates user input into SQL without parameterization. ' +
            'Attackers can dump the entire database including user credentials.',
          exploitCommand: 'sqlmap -u http://10.0.2.10/search.php?id=1',
          severity: 'critical',
        },
        {
          cve: 'CWE-434',
          name: 'Unrestricted File Upload',
          description:
            'The /upload.php endpoint validates only MIME type (not file content), ' +
            'allowing PHP web shells disguised as images to be uploaded and executed.',
          exploitCommand: 'upload shell.php /upload.php',
          severity: 'critical',
        },
      ],
    },
  ],
  objectives: [
    {
      id: 'obj-nikto',
      description: 'Scan the web application with Nikto to find vulnerabilities',
      hint: 'Try: nikto -h 10.0.2.10',
      completionTrigger: 'nikto',
      completed: false,
    },
    {
      id: 'obj-dirb',
      description: 'Enumerate web directories with dirb to find hidden endpoints',
      hint: 'Try: dirb http://10.0.2.10',
      completionTrigger: 'dirb',
      completed: false,
    },
    {
      id: 'obj-find-upload',
      description: 'Discover the insecure file upload endpoint',
      hint: 'Dirb and Nikto both reveal interesting paths — look for upload-related endpoints',
      completionTrigger: 'nikto|dirb|curl.*upload',
      completed: false,
    },
    {
      id: 'obj-sqli',
      description: 'Exploit SQL injection to identify vulnerable parameters',
      hint: 'Try: sqlmap -u http://10.0.2.10/search.php?id=1',
      completionTrigger: 'sqlmap',
      completed: false,
    },
    {
      id: 'obj-dump-creds',
      description: 'Dump user credentials from the database via SQLi',
      hint: 'sqlmap will automatically dump tables once injection is confirmed',
      completionTrigger: 'sqlmap',
      completed: false,
    },
    {
      id: 'obj-upload-shell',
      description: 'Upload a PHP web shell via the insecure upload endpoint',
      hint: 'Try: upload shell.php /upload.php  (bypasses MIME-only validation)',
      completionTrigger: 'upload.*shell\\.php|upload.*\\.php',
      completed: false,
    },
    {
      id: 'obj-rce',
      description: 'Achieve Remote Code Execution via the uploaded web shell',
      hint: 'After uploading shell.php, the server executes it on request',
      completionTrigger: 'upload.*\\.php',
      completed: false,
    },
  ],
  welcomeMessage: `\x1b[1;33m
╔═══════════════════════════════════════════════════════════╗
║        LAB 02 — Web Application Attack                   ║
╚═══════════════════════════════════════════════════════════╝\x1b[0m

\x1b[33m  Mission: Compromise the ShopVuln web application\x1b[0m
\x1b[90m  You are: \x1b[0m\x1b[32m10.0.2.5 (kali-webapp)\x1b[0m
\x1b[90m  Target:  \x1b[0m\x1b[31mhttp://10.0.2.10 (ShopVuln)\x1b[0m

\x1b[90m  ─────────────────────────────────────────────────────\x1b[0m
\x1b[90m  Mission: Enumerate the app → exploit SQLi → plant web shell
  Real techniques from bug bounty and red team engagements.
  Every attack here pairs with a defense explanation.\x1b[0m

\x1b[90m  Type \x1b[0m\x1b[32mobjectives\x1b[0m\x1b[90m to see your goals | \x1b[0m\x1b[32mhint\x1b[0m\x1b[90m for guidance\x1b[0m

`,
}
