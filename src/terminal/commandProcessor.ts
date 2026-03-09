import type { Scenario, CommandResult } from '@/types'
import {
  cmdHelp, cmdClear, cmdWhoami, cmdIfconfig, cmdPing,
  cmdCat, cmdObjectives, cmdHint,
} from './commands/basic'
import {
  cmdNmap, cmdWhois, cmdDig, cmdSearchsploit, cmdCurl,
} from './commands/recon'
import {
  cmdExploit, cmdDefend, cmdMitre,
} from './commands/exploit'
import {
  cmdDigAxfr, cmdSubfinder, cmdGobusterDns,
  cmdSqlmap, cmdNikto, cmdDirb, cmdUpload,
  cmdFind, cmdGrep, cmdNetstat, cmdCrontab, cmdRemoveShell,
  cmdMimikatz, cmdCrackMapExec, cmdPassTheHash, cmdNetUser,
  cmdAnalyzeLogs, cmdTimeline, cmdWriteRule, cmdIsolate,
} from './commands/advanced'

// ─── Objective trigger checker ─────────────────────────────────────────────────

/**
 * Checks whether a command satisfies any incomplete objectives.
 * Mutates `result.objectivesCompleted` — does NOT mutate the scenario itself.
 * The scenario passed in should already be the runtime clone from getScenario().
 */
export function checkObjectiveTriggers(
  raw: string,
  result: CommandResult,
  scenario: Scenario,
  cmd: string,
  args: string[],
): void {
  scenario.objectives.forEach(obj => {
    if (obj.completed) return

    let triggered = false

    if (obj.semanticCheck) {
      triggered = obj.semanticCheck(cmd, args, scenario)
    } else {
      const regex = new RegExp(obj.completionTrigger, 'i')
      triggered = regex.test(raw)
    }

    if (triggered) {
      // Do NOT set obj.completed here — the Terminal component handles that
      // by calling markObjectiveDone on the store
      if (!result.objectivesCompleted) result.objectivesCompleted = []
      if (!result.objectivesCompleted.includes(obj.id)) {
        result.objectivesCompleted.push(obj.id)
      }
    }
  })
}

// ─── SSH simulation ────────────────────────────────────────────────────────────

function cmdSsh(args: string[], scenario: Scenario | null): CommandResult {
  const target = args.find(a => a.includes('@'))
  if (!target) return { output: '\x1b[31mUsage: ssh user@host\x1b[0m', error: true }

  const [, host] = target.split('@')
  const found = scenario?.network.find(h => h.ip === host || h.hostname === host)

  if (!found || !found.services.find(s => s.name === 'ssh')) {
    return {
      output: `\x1b[31mssh: connect to host ${host} port 22: Connection refused\x1b[0m`,
      error: true,
    }
  }

  return {
    output: `ssh: connect to host ${host} port 22
\x1b[33mWarning: Permanently added '${host}' (ED25519) to the list of known hosts.\x1b[0m
\x1b[31mPermission denied (publickey,password).\x1b[0m

\x1b[90m💡 To SSH into this host in a real scenario you would need:
   • Valid credentials (password or private key)
   • Or exploit a vulnerability to gain a shell first
   • Salt Typhoon used CVE-2023-20198 to create admin accounts, then SSH'd in\x1b[0m`,
  }
}

// ─── Main processor ────────────────────────────────────────────────────────────

export function processCommand(input: string, scenario: Scenario | null): CommandResult {
  const trimmed = input.trim()
  if (!trimmed) return { output: '' }

  const parts = trimmed.split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1)

  let result: CommandResult

  switch (cmd) {
    case 'help':
      result = cmdHelp()
      break

    case 'clear':
      result = cmdClear()
      break

    case 'whoami':
      result = cmdWhoami(scenario)
      break

    case 'ifconfig':
    case 'ip':
      result = cmdIfconfig(scenario)
      break

    case 'ping':
      result = cmdPing(args)
      break

    case 'cat':
      result = cmdCat(args)
      break

    case 'objectives':
    case 'obj':
      result = cmdObjectives(scenario)
      break

    case 'hint':
      result = cmdHint(scenario)
      break

    case 'nmap':
      result = cmdNmap(args, scenario)
      break

    case 'whois':
      result = cmdWhois(args)
      break

    case 'dig':
      // Route AXFR to advanced handler
      if (args.includes('AXFR') || args.includes('axfr')) {
        result = cmdDigAxfr(args, scenario)
      } else {
        result = cmdDig(args)
      }
      break

    case 'searchsploit':
      result = cmdSearchsploit(args)
      break

    case 'curl':
    case 'wget':
      result = cmdCurl(args)
      break

    case 'exploit':
      result = cmdExploit(args, scenario)
      break

    case 'ssh':
      result = cmdSsh(args, scenario)
      break

    case 'defend':
      result = cmdDefend(args)
      break

    case 'mitre':
      result = cmdMitre(args)
      break

    // ─── Advanced recon (scenario 01) ──────────────────────────────────────────
    case 'subfinder':
      result = cmdSubfinder(args, scenario)
      break

    case 'gobuster':
      result = cmdGobusterDns(args, scenario)
      break

    // ─── Web app attacks (scenario 02) ─────────────────────────────────────────
    case 'sqlmap':
      result = cmdSqlmap(args, scenario)
      break

    case 'nikto':
      result = cmdNikto(args, scenario)
      break

    case 'dirb':
      result = cmdDirb(args, scenario)
      break

    case 'upload':
      result = cmdUpload(args, scenario)
      break

    // ─── Persistence hunting (scenario 03) ─────────────────────────────────────
    case 'find':
      result = cmdFind(args, scenario)
      break

    case 'grep':
      result = cmdGrep(args, scenario)
      break

    case 'netstat':
      result = cmdNetstat(args, scenario)
      break

    case 'crontab':
      result = cmdCrontab(args, scenario)
      break

    case 'remove-shell':
      result = cmdRemoveShell(args, scenario)
      break

    // ─── Lateral movement (scenario 04) ────────────────────────────────────────
    case 'mimikatz':
      result = cmdMimikatz(args, scenario)
      break

    case 'crackmapexec':
    case 'cme':
      result = cmdCrackMapExec(args, scenario)
      break

    case 'pass-the-hash':
    case 'pth':
      result = cmdPassTheHash(args, scenario)
      break

    case 'net':
      result = cmdNetUser(args, scenario)
      break

    // ─── SOC analysis (scenario 05) ────────────────────────────────────────────
    case 'analyze-logs':
      result = cmdAnalyzeLogs(args, scenario)
      break

    case 'timeline':
      result = cmdTimeline(args, scenario)
      break

    case 'write-rule':
      result = cmdWriteRule(args, scenario)
      break

    case 'isolate':
      result = cmdIsolate(args, scenario)
      break

    // ─── Shell builtins ────────────────────────────────────────────────────────
    case 'ls':
    case 'dir':
      result = {
        output: `\x1b[34mdrwxr-xr-x\x1b[0m  tools/\n\x1b[34mdrwxr-xr-x\x1b[0m  notes/\n-rw-r--r--  readme.txt\n-rw-r--r--  targets.txt`,
      }
      break

    case 'id':
      result = { output: `\x1b[32muid=0(root) gid=0(root) groups=0(root)\x1b[0m` }
      break

    case 'history':
      result = { output: `\x1b[90m  1  nmap -sn 10.0.0.0/24\n  2  nmap -sV 10.0.0.1\n  3  searchsploit cisco ios xe\x1b[0m` }
      break

    case 'sudo':
      result = { output: `\x1b[32mYou are already root.\x1b[0m` }
      break

    case 'pwd':
      result = { output: `/home/attacker` }
      break

    case 'echo':
      result = { output: args.join(' ') }
      break

    default:
      result = {
        output: `\x1b[31mbash: ${cmd}: command not found\x1b[0m\n\x1b[90mType 'help' for available commands.\x1b[0m`,
        error: true,
      }
  }

  // Check if any objectives were triggered by this raw command
  if (scenario) {
    checkObjectiveTriggers(trimmed, result, scenario, cmd, args)
  }

  return result
}
