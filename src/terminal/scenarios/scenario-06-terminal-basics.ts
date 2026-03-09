import type { Scenario } from '@/types'

/**
 * Lab 06 — Terminal & Command Line Basics
 *
 * Goal: Students practice core bash commands in a safe environment.
 * Covers navigation, file ops, text search, piping, and basic networking commands.
 */
export const scenario06: Scenario = {
  id: 'scenario-06',
  title: 'Terminal Basics: Your Linux Toolkit',
  description:
    'You have SSH access to a Linux practice box. Work through the objectives to build ' +
    'muscle memory with the bash commands every security professional uses daily. ' +
    'Every command you learn here is a tool you\'ll use in every future lab.',
  difficulty: 'beginner',
  attacker: {
    ip: '10.0.0.5',
    hostname: 'kali-attacker',
  },
  network: [
    {
      ip: '10.0.0.10',
      hostname: 'practice.local',
      os: 'Ubuntu 22.04 LTS',
      services: [
        { port: 22, protocol: 'tcp', name: 'ssh', version: 'OpenSSH 8.9', banner: 'SSH-2.0-OpenSSH_8.9' },
        { port: 80, protocol: 'tcp', name: 'http', version: 'Apache 2.4.52', banner: 'Apache/2.4.52 (Ubuntu)' },
      ],
      vulnerabilities: [],
    },
  ],
  objectives: [
    {
      id: 'obj-pwd',
      description: 'Print your current working directory',
      hint: 'Try: pwd',
      completionTrigger: '^pwd$',
      completed: false,
    },
    {
      id: 'obj-ls-la',
      description: 'List files including hidden files and permissions',
      hint: 'Try: ls -la',
      completionTrigger: 'ls\\s+-[la]{1,2}a?',
      completed: false,
    },
    {
      id: 'obj-mkdir',
      description: 'Create a directory called "practice" in /tmp',
      hint: 'Try: mkdir /tmp/practice',
      completionTrigger: 'mkdir.*/tmp/practice',
      completed: false,
    },
    {
      id: 'obj-echo-redirect',
      description: 'Write "hello world" into a file using echo and redirection',
      hint: 'Try: echo "hello world" > /tmp/practice/hello.txt',
      completionTrigger: 'echo.*>.*\\.txt',
      completed: false,
    },
    {
      id: 'obj-cat',
      description: 'Read the file you just created with cat',
      hint: 'Try: cat /tmp/practice/hello.txt',
      completionTrigger: 'cat\\s+.*\\.txt',
      completed: false,
    },
    {
      id: 'obj-grep',
      description: 'Search for the word "root" in /etc/passwd',
      hint: 'Try: grep "root" /etc/passwd',
      completionTrigger: 'grep.*root.*/etc/passwd',
      completed: false,
    },
    {
      id: 'obj-pipe',
      description: 'Use a pipe to filter process list — find the bash process',
      hint: 'Try: ps aux | grep bash',
      completionTrigger: 'ps\\s+aux\\s*\\|\\s*grep',
      completed: false,
    },
    {
      id: 'obj-curl',
      description: 'Fetch HTTP headers from the practice web server',
      hint: 'Try: curl -I http://10.0.0.10',
      completionTrigger: 'curl\\s+-I\\s+http',
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

\x1b[33m  Lab 06: Terminal Basics\x1b[0m
\x1b[90m  You are: \x1b[0m\x1b[32m10.0.0.5 (kali-attacker)\x1b[0m
\x1b[90m  Target:  \x1b[0m\x1b[34m10.0.0.10 (practice.local)\x1b[0m

\x1b[90m  Type \x1b[0m\x1b[32mhelp\x1b[0m\x1b[90m for available commands\x1b[0m
\x1b[90m  Type \x1b[0m\x1b[32mobjectives\x1b[0m\x1b[90m to see your mission goals\x1b[0m

`,
}
