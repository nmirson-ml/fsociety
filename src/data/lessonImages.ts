/** Maps lesson slugs to their hero image paths (served from /public/assets/images/) */
export const LESSON_IMAGES: Record<string, string> = {
  // Level 0 — Fundamentals
  'osi-model':              '/assets/images/osi-model.png',
  'tcp-ip':                 '/assets/images/tcp-handshake.png',
  'dns':                    '/assets/images/dns-resolution.png',
  'http-https':             '/assets/images/http-https.png',

  // Level 1 — Recon
  'passive-recon':          '/assets/images/osint-mindmap.png',
  'active-recon':           '/assets/images/nmap-scan.png',
  'dns-recon':              '/assets/images/dns-resolution.png',

  // Level 2 — Initial Access
  'phishing':               '/assets/images/phishing-flow.png',
  'edge-devices':           '/assets/images/salt-typhoon-killchain.png',
  'web-app-attacks':        '/assets/images/sqli-comparison.png',

  // Level 3 — Persistence
  'web-shells':             '/assets/images/web-shell.png',
  'scheduled-tasks':        '/assets/images/scheduled-task-persist.png',
  'rootkits':               '/assets/images/salt-typhoon-killchain.png',

  // Level 4 — Lateral Movement
  'credential-harvesting':  '/assets/images/lsass-memory.png',
  'smb-lateral':            '/assets/images/lateral-movement.png',

  // Level 5 — Exfiltration
  'data-staging':           '/assets/images/c2-beaconing.png',
  'c2-channels':            '/assets/images/dns-tunnel-steps.png',

  // Level 6 — Defense
  'siem-rules':             '/assets/images/defense-in-depth.png',
  'network-defense':        '/assets/images/firewall-decision.png',
  'incident-response':      '/assets/images/defense-in-depth.png',

  // Level 7 — APT Case Studies
  'salt-typhoon-deep-dive': '/assets/images/salt-typhoon-killchain.png',
  'apt41-profile':          '/assets/images/salt-typhoon-killchain.png',
  'lazarus-group':          '/assets/images/salt-typhoon-killchain.png',
}

/** Per-tab image overrides: some tabs have different visuals from the hero */
export const TAB_IMAGES: Record<string, Partial<Record<'concept'|'technique'|'defense', string>>> = {
  // Fundamentals
  'tcp-ip': {
    concept:   '/assets/images/packet-anatomy.png',
    technique: '/assets/images/arp-spoofing-steps.png',
  },
  'dns': {
    concept:   '/assets/images/dns-resolution.png',
    technique: '/assets/images/dns-tunnel-steps.png',
  },
  'http-https': {
    concept:   '/assets/images/hash-vs-encrypt.png',
    defense:   '/assets/images/cookie-flags.png',
  },

  // Recon
  'passive-recon': {
    technique: '/assets/images/osint-mindmap.png',
  },
  'active-recon': {
    concept:   '/assets/images/ports-explained.png',
    technique: '/assets/images/nmap-scan.png',
  },
  'dns-recon': {
    technique: '/assets/images/dns-tunnel-steps.png',
  },

  // Initial Access
  'edge-devices': {
    concept:   '/assets/images/nmap-scan.png',
    technique: '/assets/images/salt-typhoon-killchain.png',
  },
  'web-app-attacks': {
    concept:   '/assets/images/sqli-comparison.png',
    technique: '/assets/images/xss-comparison.png',
    defense:   '/assets/images/sqli-comparison.png',
  },
  'phishing': {
    technique: '/assets/images/phishing-flow.png',
  },

  // Persistence
  'web-shells': {
    concept:   '/assets/images/webshell-lifecycle.png',
    technique: '/assets/images/web-shell.png',
  },
  'scheduled-tasks': {
    technique: '/assets/images/scheduled-task-persist.png',
  },

  // Lateral Movement
  'credential-harvesting': {
    concept:   '/assets/images/lsass-memory.png',
    technique: '/assets/images/pass-the-hash-steps.png',
    defense:   '/assets/images/kerberos-flow.png',
  },
  'smb-lateral': {
    technique: '/assets/images/pass-the-hash-steps.png',
  },

  // Exfiltration
  'c2-channels': {
    concept:   '/assets/images/c2-beaconing.png',
    technique: '/assets/images/dns-tunnel-steps.png',
  },

  // Defense
  'network-defense': {
    concept:   '/assets/images/firewall-decision.png',
  },
}
