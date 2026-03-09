import { readFileSync, writeFileSync } from 'fs';

const filePath = 'C:/Users/carls/Repos/fsociety/src/data/lessonContent.ts';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// ─── SALT TYPHOON BLOCK ───────────────────────────────────────────────────────
const saltBlock = `  'salt-typhoon-deep-dive': {
    concept: \`
<h2>Salt Typhoon: The Telecom Heist — A Defining Moment in Cyber Espionage</h2>

<h3>Who Is Salt Typhoon?</h3>
<p>
  Salt Typhoon is a Chinese state-sponsored advanced persistent threat (APT) group assessed by
  US intelligence agencies to operate under the direction of China's Ministry of State Security
  (MSS). The group is tracked under multiple names across different threat intelligence vendors —
  <strong>Earth Estries</strong> (Trend Micro), <strong>GhostEmperor</strong> (Kaspersky),
  <strong>FamousSparrow</strong> (ESET), and <strong>UNC2286</strong> (Mandiant) — reflecting
  the fractured landscape of threat intelligence attribution where vendors independently discover
  and name the same actor. The US government standardized on "Salt Typhoon" as part of Microsoft's
  Typhoon naming convention for Chinese state-sponsored actors (Volt Typhoon, Flax Typhoon, etc.).
</p>
<p>
  The group has been active since at least 2019, though some researchers believe its operational
  precursors date to 2017. Salt Typhoon's primary mission is strategic intelligence collection
  targeting telecommunications providers, government institutions, and non-governmental organizations
  across the United States, Southeast Asia, and Europe. What distinguishes Salt Typhoon from other
  Chinese APTs is its extraordinary focus on telecommunications infrastructure — the literal pipes
  through which national communications flow.
</p>

<h3>Attribution to China's Ministry of State Security</h3>
<p>
  The MSS is China's primary civilian intelligence agency, roughly analogous to a combination of
  the CIA and FBI. It manages both foreign intelligence collection and domestic counterintelligence.
  Unlike the People's Liberation Army (PLA) units that run groups like APT40 or APT41, MSS-affiliated
  APTs tend to operate through a system of front companies, contracted hackers, and cutouts that
  provide a degree of plausible deniability.
</p>
<p>
  Attribution confidence in Salt Typhoon's case is assessed as high. US officials, including NSA
  Director General Timothy Haugh and FBI Director Christopher Wray, publicly confirmed Chinese
  state responsibility in late 2024. The technical indicators — custom malware families, C2
  infrastructure overlap with known MSS operations, targeting patterns consistent with MSS
  intelligence requirements, and operational tempo aligned with Beijing business hours — all point
  consistently to MSS direction.
</p>
<blockquote>
  "China's hackers are positioning on American infrastructure in preparation for mayhem." —
  FBI Director Christopher Wray, January 2024
</blockquote>

<h3>The 2023-2024 US Telecom Campaign: What Happened</h3>
<p>
  The full scope of the Salt Typhoon telecom campaign emerged publicly in late 2024, though US
  intelligence agencies had been tracking the intrusions since at least mid-2023. The confirmed
  victims read like a roll call of American telecommunications:
</p>
<ul>
  <li><strong>AT&amp;T</strong> — America's largest telecom provider, serving over 240 million wireless subscribers</li>
  <li><strong>Verizon</strong> — second-largest US carrier, also a major government contractor</li>
  <li><strong>T-Mobile</strong> — confirmed breach, though the company stated customer data was not accessed</li>
  <li><strong>Lumen Technologies</strong> — major backbone provider routing traffic between ISPs</li>
  <li>Additional carriers and ISPs not publicly named as of early 2025</li>
</ul>
<p>
  The campaign's timeline is staggering in its patience. Evidence suggests Salt Typhoon achieved
  initial access to some targets as early as 2022, maintained persistent access through 2023 and
  into 2024, and was not discovered until US intelligence agencies detected the intrusions through
  classified means — not because the telecoms themselves noticed anomalous activity. In some
  networks, the dwell time exceeded 18 months.
</p>

<h3>Why Telecommunications? The Intelligence Logic</h3>
<p>
  To understand why Salt Typhoon targeted telecoms, you need to understand what telecoms actually
  do and what data flows through them. Telecommunications companies are not just phone carriers —
  they are the physical and logical backbone of national communications infrastructure. Everything
  from ordinary phone calls to classified government communications travels over telecom networks.
</p>
<p>
  The strategic intelligence value of compromising a major telecom includes:
</p>
<ul>
  <li>
    <strong>Call Detail Records (CDRs)</strong>: metadata showing who called whom, when, for how
    long, and from what cell tower. CDRs alone can reconstruct the social graphs of political
    figures, intelligence officers, and government officials without accessing call content.
  </li>
  <li>
    <strong>CALEA Lawful Intercept Systems</strong>: perhaps the most sensitive target. The
    Communications Assistance for Law Enforcement Act (1994) requires all US telecoms to maintain
    technical capabilities for court-ordered wiretapping. These systems are essentially pre-built
    wiretapping infrastructure — a perfect counterintelligence target.
  </li>
  <li>
    <strong>Real-time call interception</strong>: with access to telecom switching infrastructure,
    Salt Typhoon could intercept actual call audio and SMS messages in real time.
  </li>
  <li>
    <strong>Counterintelligence value</strong>: by accessing CALEA systems, China could identify
    which Chinese intelligence assets and sources the FBI and other agencies were monitoring —
    allowing them to warn, extract, or reposition those assets.
  </li>
</ul>

<h3>Accessing the FBI's Own Wiretap System</h3>
<p>
  The most alarming aspect of the Salt Typhoon campaign was reported by the Wall Street Journal
  in October 2024: the hackers had accessed systems that telecoms use to comply with law enforcement
  wiretap requests. In practice, this means Salt Typhoon could view the list of individuals under
  active FBI surveillance — the most sensitive counterintelligence secret imaginable.
</p>
<p>
  Consider the implications: if China can see who the FBI is wiretapping, they can identify every
  Chinese intelligence source or agent who is under US surveillance. They can burn those assets before
  arrests, tip off double agents, or identify the methods by which the FBI identified them in the first
  place. This is not just a privacy violation — it is a catastrophic counterintelligence failure.
</p>

<h3>Who Was Targeted: Political and Government Victims</h3>
<p>
  The communications intercepted were not random. Salt Typhoon specifically targeted high-value
  political and governmental figures:
</p>
<ul>
  <li>Staffers on the 2024 presidential campaigns of both major parties</li>
  <li>Senior Senate Intelligence Committee staff</li>
  <li>Cabinet-level officials and their communications</li>
  <li>Officials at the State Department focused on China policy</li>
  <li>FBI agents and intelligence community personnel</li>
</ul>
<p>
  Senator Mark Warner (D-VA), Chair of the Senate Intelligence Committee, described the breach as
  "the worst telecom hack in our nation's history — by far" and stated it was "much worse than
  initially reported." The geopolitical timing is notable: the intrusions occurred during a period
  of intense US-China tension over Taiwan, semiconductor export controls, and South China Sea
  territorial disputes.
</p>

<h3>Timeline and US Government Response</h3>
<p>
  The response unfolded in stages as the full scope became clear:
</p>
<ul>
  <li><strong>Mid-2023</strong>: US intelligence agencies detect Salt Typhoon activity in telecom networks</li>
  <li><strong>Early 2024</strong>: Classified briefings begin for affected telecoms and Congressional leaders</li>
  <li><strong>October 2024</strong>: Wall Street Journal breaks the story publicly; White House confirms</li>
  <li><strong>November 2024</strong>: Senate Intelligence Committee briefed; Warner makes public statements</li>
  <li><strong>December 2024</strong>: CISA and FBI issue joint advisory; CISA recommends Signal for government communications</li>
  <li><strong>January 2025</strong>: AT&amp;T and Verizon announce they have contained the breach</li>
  <li><strong>February 2025</strong>: Senate hearings; telecom executives testify</li>
</ul>
<p>
  In an extraordinary step, the Cybersecurity and Infrastructure Security Agency (CISA) — a US
  government agency — publicly recommended that government officials use end-to-end encrypted
  messaging apps like Signal for sensitive communications. This is remarkable: the US government
  acknowledged that its own telecom infrastructure was so thoroughly compromised that it could not
  be trusted for sensitive national security communications.
</p>

<h3>International Dimensions</h3>
<p>
  The Salt Typhoon campaign was not limited to the United States. Similar telecom compromises
  attributed to the same group or closely related actors were detected in:
</p>
<ul>
  <li>Canada — a Five Eyes partner with deep intelligence-sharing relationships with the US</li>
  <li>United Kingdom — GCHQ investigations into BT and Openreach infrastructure</li>
  <li>Australia — Australian Signals Directorate issued warnings about telecom targeting</li>
  <li>Several Southeast Asian nations with strategic relevance to the Taiwan Strait situation</li>
</ul>
<p>
  The Five Eyes alliance (US, UK, Canada, Australia, New Zealand) issued a joint advisory in
  December 2024 warning of the threat to telecommunications infrastructure globally.
</p>

<h3>Comparison to Historical APT Operations</h3>
<p>
  To contextualize Salt Typhoon's significance, compare it to other landmark cyber operations:
</p>
<ul>
  <li>
    <strong>SolarWinds (2020, APT29/Cozy Bear)</strong>: Russian SVR compromised the SolarWinds
    Orion software supply chain, affecting 18,000 organizations and 9 US federal agencies. Dwell
    time: approximately 9 months. Impact: massive but primarily espionage. Salt Typhoon is comparable
    in scale but targeted more sensitive infrastructure.
  </li>
  <li>
    <strong>OPM Breach (2015, APT40)</strong>: Chinese hackers stole security clearance files for
    21.5 million US government employees and contractors. Catastrophic counterintelligence impact.
    Salt Typhoon's CALEA access is similarly devastating.
  </li>
  <li>
    <strong>HAFNIUM Exchange Exploits (2021)</strong>: Chinese APT exploited zero-days in Microsoft
    Exchange, affecting 250,000+ servers. Salt Typhoon's telecom access is arguably more sensitive
    given the CALEA component.
  </li>
</ul>
<p>
  What makes Salt Typhoon's operation particularly significant is the combination of <em>patience</em>
  (multi-year dwell time), <em>target sensitivity</em> (CALEA lawful intercept systems), and
  <em>operational security</em> (living off the land on network devices that lack EDR visibility).
  This was not a smash-and-grab operation — it was a long-term strategic intelligence collection
  program of the highest order.
</p>

<h3>The Geopolitical Context</h3>
<p>
  It would be a mistake to analyze Salt Typhoon in isolation from the broader US-China relationship.
  The intrusions occurred during a period of sharply deteriorating relations, driven by:
</p>
<ul>
  <li>Increasing US military support and weapons sales to Taiwan</li>
  <li>CHIPS Act restrictions on semiconductor technology export to China</li>
  <li>US efforts to build a coalition against Chinese technology companies (Huawei 5G bans)</li>
  <li>Disputes over South China Sea territorial claims and freedom-of-navigation operations</li>
  <li>Escalating US-China economic competition and technology decoupling</li>
</ul>
<p>
  From Beijing's perspective, comprehensive intelligence collection on US political and government
  communications is a rational strategic response to these pressures. Understanding US negotiating
  positions, identifying intelligence sources and methods, and mapping political networks all have
  obvious strategic value in this context. This is not cyber vandalism — it is sophisticated
  intelligence tradecraft executed through cyber means.
</p>
\`,
    technique: \`
<h2>Salt Typhoon: Technical Kill Chain Reconstruction</h2>

<h3>The Attack Surface: Why Edge Devices?</h3>
<p>
  Before examining the specific exploits, it is essential to understand why Salt Typhoon chose
  network edge devices — specifically Cisco IOS XE routers — as their primary entry point rather
  than the more commonly exploited endpoint (desktop/laptop) attack surface.
</p>
<p>
  Edge network devices occupy an extraordinarily privileged position in any network:
</p>
<ul>
  <li>They process all network traffic flowing in and out of the organization</li>
  <li>They are almost never monitored by Endpoint Detection and Response (EDR) tools</li>
  <li>They run specialized operating systems (IOS XE, Junos, FortiOS) with minimal security logging</li>
  <li>Patch cycles for network devices average 6-18 months, versus weeks for endpoints</li>
  <li>High-trust network position: traffic from a managed router is implicitly trusted by other devices</li>
  <li>In telecom environments, core routers handle the actual voice/data switching — they ARE the target</li>
</ul>
<p>
  By compromising edge routers rather than employee workstations, Salt Typhoon positioned themselves
  in the most sensitive possible location in a telecom network while simultaneously residing in the
  infrastructure that is least monitored. It is the cyber equivalent of hiding inside a bank's own vault.
</p>

<h3>Phase 1: Initial Access — CVE-2023-20198</h3>
<p>
  The primary initial access vector was <strong>CVE-2023-20198</strong>, a critical vulnerability in
  Cisco IOS XE's web UI (WebUI) component. This vulnerability received a CVSS score of 10.0 —
  the maximum possible — reflecting its catastrophic severity.
</p>
<pre><code>CVE-2023-20198 Technical Details:
  Affected:    Cisco IOS XE Software with HTTP/HTTPS Server feature enabled
  CVSS Score:  10.0 (Critical)
  Type:        Authentication bypass leading to privilege escalation
  Impact:      Unauthenticated remote creation of local user with privilege level 15

Attack flow:
  1. Attacker sends crafted HTTP POST request to /webui/logoutconfirm.html
  2. Malformed authentication header bypasses authentication check entirely
  3. IOS XE creates a new local admin account with privilege level 15
  4. Account mimics legitimate Cisco support accounts ("cisco_tac_admin")
  5. No authentication required at any step

Vulnerable versions:
  IOS XE 16.x through 17.9.x with web UI enabled
  Estimated vulnerable devices: 50,000+ globally (Shodan scans, Oct 2023)

Cisco disclosure: October 16, 2023 (Salt Typhoon exploited before disclosure)</code></pre>
<p>
  Cisco released an emergency advisory on October 16, 2023, but by that point Salt Typhoon had
  already been exploiting the vulnerability for weeks. This was a zero-day exploitation period —
  attacks began before any patch was available, making defense essentially impossible for
  targeted organizations during the active zero-day window.
</p>

<h3>Phase 2: Expanding Access — CVE-2023-20273</h3>
<p>
  The initial privilege escalation via CVE-2023-20198 was followed immediately by exploitation of
  a second vulnerability, <strong>CVE-2023-20273</strong>, to execute arbitrary commands on the
  compromised device.
</p>
<pre><code>CVE-2023-20273 Technical Details:
  Affected:    Same IOS XE WebUI as CVE-2023-20198
  CVSS Score:  7.2 (High)
  Type:        Command injection via web UI
  Impact:      Arbitrary OS-level command execution as root equivalent

Attack chain combination:
  CVE-2023-20198 creates admin account (privilege level 15)
  CVE-2023-20273 executes arbitrary commands using that account
  Combined result: Full root-level control over IOS XE device

Verification commands run by attackers:
  show version              -- Firmware version, hardware model
  show running-config       -- Full device configuration
  show ip route             -- Network topology
  show cdp neighbors        -- Adjacent Cisco devices (lateral movement map)</code></pre>

<h3>Phase 3: Persistence — Malicious Lua Web Shell</h3>
<p>
  The signature persistence mechanism discovered on compromised IOS XE devices was a malicious
  Lua-based web shell planted in the device's file system. Lua is a scripting language natively
  supported by IOS XE for legitimate automation purposes — an example of living-off-the-land
  techniques adapted specifically for network device environments.
</p>
<pre><code>IOS XE Web Shell Characteristics:
  Language:    Lua (native IOS XE scripting language)
  Location:    Stored in IOS XE file system, served via WebUI
  Access:      HTTP GET/POST to specific URI path
  Function:    Execute arbitrary IOS XE commands via web requests
  Detection:   Not visible in standard 'show running-config' output
               Not visible in standard process listings

Detection method (Cisco advisory):
  Perform HTTP GET to device IP targeting the known shell URI
  Non-empty response confirms active web shell implant

Shell removal: Requires full device reload in some cases; rootkit variants
               may survive reloads and require factory reset + clean restore</code></pre>

<h3>Phase 4: GhostSpider Backdoor</h3>
<p>
  For persistent, feature-rich access to compromised network infrastructure, Salt Typhoon deployed
  <strong>GhostSpider</strong>, a custom C++ backdoor with a modular plugin architecture. GhostSpider
  was analyzed by Trend Micro researchers and represents a sophisticated piece of malware engineering.
</p>
<pre><code>GhostSpider Technical Profile:
  Language:      C++ (native compiled)
  Architecture:  Modular plugin system — capabilities loaded on demand
  Encryption:    Custom encryption for C2 communications
  C2 protocol:   HTTPS with certificate pinning; blends with legitimate management traffic
  Persistence:   Multiple mechanisms depending on target OS

Plugin capabilities (identified modules):
  Network traffic capture (passive interception of transit data)
  Credential harvesting from device memory
  Configuration exfiltration (routing tables, firewall rules, ACLs)
  Port forwarding and SOCKS proxy functionality
  Lateral movement assistance (network scanning, credential spraying)
  Self-update mechanism (operators can push new plugin versions)

Anti-analysis features:
  Obfuscated strings — plain-text strings XOR-encoded with rotating key
  Anti-debugging checks at startup
  Encrypted configuration stored separately from main binary
  Minimal disk footprint — primary execution in memory only</code></pre>

<h3>Phase 5: Snappybee and Demodex Rootkits</h3>
<p>
  For the deepest levels of persistence — survival across reboots and even firmware updates —
  Salt Typhoon deployed rootkit-level implants on compromised Linux-based telecom servers.
</p>
<pre><code>Demodex Rootkit:
  Type:          Kernel-mode rootkit for Linux
  Target OS:     Linux (kernel versions 2.6 through 5.x)
  Loading:       Deployed as kernel module; may use vulnerable signed driver (BYOVD)
  Persistence:   Survives standard incident response; OS reinstall may not remove
  Capabilities:
    Hides files, processes, and network connections from standard OS tools
    Intercepts system calls to conceal attacker presence from userspace
    Survives firmware updates by infecting bootloader or modifying initrd
  Detection:     Requires kernel integrity tools (rkhunter, AIDE, osquery)
                 or hardware-level memory forensics tools

Snappybee (also known as Deed RAT):
  Type:          Modular RAT with encrypted C2 communication
  Related to:    ShadowPad malware (shared codebase architectural patterns)
  Targeting:     Government and telecom organizations specifically
  Persistence:   DLL sideloading via legitimate signed applications
  C2:            Custom binary protocol encrypted over HTTPS</code></pre>

<h3>Phase 6: Targeting CALEA Infrastructure</h3>
<p>
  The most operationally significant phase of the attack was the targeting of CALEA (Communications
  Assistance for Law Enforcement Act) systems. Understanding this requires understanding what CALEA
  systems actually are and why they represent the crown jewels of any telecom network.
</p>
<p>
  CALEA (enacted 1994) requires US telecommunications carriers to maintain technical capabilities
  that allow law enforcement to intercept communications pursuant to a court order. In practice,
  this means telecoms run special mediation devices that can tap into any circuit and forward the
  content to law enforcement in real time.
</p>
<pre><code>CALEA System Architecture (simplified):

  [Target's phone call] --&gt; [Telecom switching fabric]
                                      |
                              [Mediation Device / IAP]
                                      |
                          [Law enforcement collection point]

Salt Typhoon access vector:
  1. Compromise telecom network via IOS XE routers (Phase 1-3)
  2. Lateral movement to internal network management systems
  3. Access to mediation device management interfaces
  4. Read and query capability on active surveillance orders
  5. In some cases: real-time access to intercepted communications content

Intelligence value of CALEA access:
  The CALEA system contains a list of every phone number, email address, and
  account under active court-authorized surveillance. Accessing this database
  reveals who the FBI, DEA, and NSA are currently monitoring — allowing China
  to warn assets, reposition intelligence operations, and identify US methods.</code></pre>

<h3>Phase 7: C2 Infrastructure and Operational Security</h3>
<pre><code>C2 Infrastructure Design (Multi-Tier):

Tier 1 (proxy layer):  Compromised SOHO routers (TP-Link, Asus, Netgear)
  Used to proxy traffic, making detection and attribution harder
  SOHO routers rarely monitored, easily compromised via known CVEs
  Creates geographic distribution: traffic appears from US residential IPs

Tier 2 (relay layer):  VPS servers in Asian hosting providers
  Changes regularly to avoid IP-based blocking
  Multiple providers used: Alibaba Cloud, Hong Kong-based VPS services

Tier 3 (operational):  Operator infrastructure in China
  Final destination for exfiltrated data
  Commands originate here

Traffic blending:
  C2 traffic mimics legitimate SNMP management traffic patterns
  Uses port 443 (HTTPS) to blend with normal web traffic
  Timing aligned with US business hours to avoid off-hours anomaly detection

Data exfiltration:
  CDRs and intercepted content compressed using gzip
  Encrypted before staging on compromised edge device
  Transferred in small chunks to avoid volumetric anomaly detection
  Staged on compromised SOHO routers before final exfil to China</code></pre>

<h3>SNMP-Based Lateral Movement</h3>
<p>
  Within telecom networks, Salt Typhoon used Simple Network Management Protocol (SNMP) — the
  standard protocol for managing network devices — as a lateral movement and reconnaissance tool.
  SNMP is universally deployed in telecom environments and its traffic is often implicitly trusted
  by security monitoring infrastructure.
</p>
<pre><code>SNMP v2c Reconnaissance:
  Weakness:    SNMP v2c uses community strings (essentially passwords) in cleartext
  Common defaults: "public", "private", "community", "management"

  Scanning for devices with default/weak SNMP community strings:
  onesixtyone -c /usr/share/doc/onesixtyone/dict.txt [network_range]

  Enumerating device configuration via SNMP:
  snmpwalk -v 2c -c public [device_ip]
  Returns: device configuration, connected interfaces, routing tables
  Creates detailed network topology map without touching device CLI

SNMP write access exploitation (if community string has write permission):
  Allows modification of device configuration remotely
  Used to add static routes for traffic redirection toward attacker C2
  Can modify interface configurations, routing tables, and access control lists

Living-off-the-land value: SNMP traffic looks identical to legitimate
network management traffic from commercial NMS platforms like SolarWinds or PRTG</code></pre>
\`,
    defense: \`
<h2>Defending Against Salt Typhoon-Style Telecom Espionage</h2>

<h3>The Fundamental Challenge: Defending Infrastructure That Cannot Go Dark</h3>
<p>
  Defending telecommunications infrastructure presents unique challenges absent from ordinary
  enterprise security. Telecoms operate infrastructure that must maintain
  <strong>five-nines availability</strong> (99.999% uptime — less than 5 minutes of downtime per year).
  You cannot take a core router offline to patch it the way you might patch an employee laptop.
  Every minute of downtime has contractual, regulatory, and reputational consequences. This
  operational constraint has historically served as a justification for delayed patching — a
  justification that Salt Typhoon exploited systematically and successfully.
</p>
<p>
  The Salt Typhoon campaign has forced a reckoning: the cost of deferring patches on network
  devices must be weighed against the now-demonstrated cost of not patching. Deferred patching
  is not free risk management — it is betting that you will not be the next victim of an adversary
  that actively scans for exactly the vulnerable versions you have deployed.
</p>

<h3>Immediate Priority: Network Device Patching</h3>
<p>
  The single most impactful remediation for CVE-2023-20198 class vulnerabilities is also
  the most obvious: aggressive patching of network operating systems with a cadence that matches
  the threat actor's exploitation speed.
</p>
<pre><code>Patching Priority Framework for Network Devices:

CVSS 9.0-10.0 (Critical) AND on CISA KEV:
  Target: Emergency patch within 24 hours
  If patching impossible: Disable affected feature immediately
  Example: 'no ip http server' + 'no ip http secure-server' eliminates
           entire CVE-2023-20198 attack surface without requiring patch

CVSS 9.0-10.0 (Critical) NOT yet on KEV:
  Target: Patch within 48-72 hours
  Compensating control: WAF rules if available for your device type

CVSS 7.0-8.9 (High):
  Target: Patch within 7 days
  Compensating controls acceptable during patch testing window

CVSS 4.0-6.9 (Medium):
  Target: Patch within 30 days
  Standard change management process acceptable

CISA Known Exploited Vulnerabilities (KEV) Catalog:
  Mandatory for federal agencies per BOD 22-01
  Best practice for all: treat KEV entries as emergency patch obligations
  URL: cisa.gov/known-exploited-vulnerabilities-catalog

Quick win: Disable IOS XE WebUI if unused
  no ip http server
  no ip http secure-server
  Eliminates CVE-2023-20198 and CVE-2023-20273 attack surface entirely</code></pre>

<h3>Network Device Hardening Baseline</h3>
<p>
  Beyond patching, network devices must be hardened to minimize the blast radius of any
  compromise. This hardening has historically been neglected because network devices were not
  targeted by commodity threat actors — Salt Typhoon changed that calculus permanently.
</p>
<pre><code>IOS XE Hardening Baseline (DISA STIG + CIS Benchmark):

Management Plane Hardening:
  Restrict management access to dedicated out-of-band management network
  ip access-list standard MGMT_ACL
   permit 10.0.1.0 0.0.0.255  ! Management VLAN only
   deny   any log
  line vty 0 4
   access-class MGMT_ACL in
   transport input ssh
   exec-timeout 10 0

Disable unnecessary services:
  no ip http server        ! Disable HTTP WebUI
  no ip http secure-server ! Disable HTTPS WebUI if not required
  no ip finger
  no service udp-small-servers
  no service tcp-small-servers
  no ip source-route
  no ip proxy-arp

SNMPv3 enforcement (replace v1/v2c):
  no snmp-server community public  ro
  no snmp-server community private rw
  snmp-server group SECURE_GROUP v3 priv
  snmp-server user NMADMIN SECURE_GROUP v3 auth sha [PASS] priv aes 128 [PASS]

Centralized logging:
  logging buffered 64000
  logging trap informational
  logging host 10.x.x.x  ! Central syslog server (SIEM)
  service timestamps log datetime msec

SSH hardening:
  ip ssh version 2
  ip ssh time-out 60
  ip ssh authentication-retries 3
  crypto key generate rsa modulus 4096</code></pre>

<h3>Building Visibility: Monitoring Network Devices</h3>
<p>
  The most dangerous aspect of network device compromises is near-total invisibility within
  standard enterprise security monitoring. Most SIEMs and EDR tools have zero telemetry from
  IOS XE, Junos, or FortiOS internals. Fixing this requires deliberate investment in
  network-specific monitoring infrastructure.
</p>
<pre><code>Network Device Monitoring Stack:

1. Syslog Aggregation (highest priority — most commonly missing):
   All network devices --&gt; Central syslog server --&gt; SIEM ingestion
   Alert on:
     - Privilege level changes (SYS-5-CONFIG_I events)
     - New user account creation (SEC_LOGIN events)
     - Configuration changes outside approved change windows
     - Failed authentication attempts (brute force indicator)
     - New SSH sessions from unexpected source IPs

2. Configuration Change Detection:
   RANCID (Really Awesome New Cisco confIg Differ) -- free, widely deployed
   NetBrain, SolarWinds NCM, Cisco DNA Center -- commercial options
   Process: Snapshot config nightly; diff against previous; alert on changes
   Alert on: ANY configuration change not matching an approved change ticket

3. IOS XE Compromise Check (post-CVE-2023-20198):
   Run daily from monitoring system:
   Check each device for the web shell URI pattern
   Non-empty HTTP response to the logoutconfirm endpoint = compromise indicator
   Any unexpected user in 'show running-config | section username' = investigate

4. NetFlow Analysis:
   Enable NetFlow v9 or IPFIX on all border routers
   Send to flow collector (ntopng, Elastic Stack, Splunk)
   Alert on:
     Large data transfers to external IPs during off-hours
     Connections to known C2 IP ranges (CISA IOC list)
     Unusual SNMP traffic (unexpected source/destination)
     Sustained connections from router IPs to internet IPs</code></pre>

<h3>CALEA System Isolation</h3>
<p>
  Given that Salt Typhoon specifically targeted CALEA lawful intercept infrastructure, protecting
  these systems requires dedicated security architecture beyond general telecom hardening. CALEA
  systems should be treated as critical national security infrastructure with commensurate controls.
</p>
<pre><code>CALEA Security Architecture Requirements:

Physical and logical segmentation:
  CALEA mediation devices on dedicated VLAN with strict firewall ACLs
  No direct connectivity from production network management to CALEA management
  Dedicated out-of-band management network for all CALEA system access
  Physical access controls: dedicated locked rack with access logging

Privileged access management:
  Jump server (bastion host) required for all CALEA system access
  MFA mandatory: FIDO2 hardware token (YubiKey) for all privileged accounts
  Session recording: all privileged sessions recorded and retained minimum 1 year
  No shared accounts: individual named accounts for all operators

Audit logging (immutable):
  Log all: queries to active surveillance orders, configuration changes, login events
  Immutable log transport: forward to WORM storage or off-device aggregator in real-time
  Review cadence: weekly security review of all CALEA access logs by security team

Network monitoring on CALEA segment:
  IDS/IPS sensor on CALEA network segment (out-of-band tap, not inline)
  Alert on: any connection attempt from unexpected source IPs,
            unusual data volume from CALEA systems,
            connections to internet IPs (CALEA systems should not reach internet directly)

Assessment cadence:
  Quarterly penetration testing of CALEA segment isolation controls
  Annual third-party security assessment with CALEA-specific scope</code></pre>

<h3>Zero Trust for Network Management</h3>
<p>
  Traditional network management assumes that anything on the management VLAN is trusted. Salt
  Typhoon demonstrated that this assumption is catastrophically wrong once an attacker gains a
  foothold on any network device. Zero trust principles must be systematically applied to
  network management planes.
</p>
<pre><code>Zero Trust Network Management Principles:

Principle 1: No implicit trust for any network segment
  Management VLAN access requires explicit per-session authentication
  IP-based access control is necessary but not sufficient

Principle 2: Multi-factor authentication mandatory
  SSH key authentication plus TOTP for all network device access
  Hardware security keys (YubiKey FIDO2) for highest-sensitivity core devices
  Privileged Access Management (PAM) platform: CyberArk, BeyondTrust, Teleport

Principle 3: Least privilege
  Separate credentials for read-only vs. read-write vs. system administration
  NOC operators: read-only access by default
  Security team: read-write access for investigation
  Change team: read-write with change-window time restrictions

Principle 4: Session recording and monitoring
  All privileged sessions recorded (keystrokes and screen)
  SIEM alerts on: commands that create users, modify ACLs, disable logging,
                  copy files to external destinations, modify routing tables
  Behavioral baseline: alert on commands outside operator's normal patterns

Principle 5: Continuous validation
  Re-authentication required for configuration changes above defined impact threshold
  Automatic session timeout: 10 minutes of inactivity maximum
  Geo-location checks: alert on sessions from unusual countries</code></pre>

<h3>Threat Hunting for Salt Typhoon IOCs</h3>
<pre><code>Active Threat Hunting Program:

Network device IOC hunting:
  Check for unauthorized local users on all IOS XE devices:
    show running-config | section username
    Investigate: any user account not in your CMDB/change records
  Check for EEM persistence:
    show event manager policy
    Investigate: any applet not matching approved automation scripts
  Check for unusual file system entries:
    show platform software file flash:
    Investigate: Lua scripts, hidden files, recently modified files

Linux server hunting (telecom application servers):
  Kernel module anomalies: compare loaded modules against known-good baseline
  Hidden processes: compare process list from /proc vs ps output
  Network connection anomalies: compare ss -antp output with expected connections
  Log tampering: check for gaps in syslog or cleared log files

Network traffic hunting:
  Outbound HTTPS connections from router management IPs to non-Cisco destinations
  SNMP traffic to destinations outside your NMS servers
  Sustained TCP connections from network device IPs to internet IPs
  Large data volumes from network devices to external IPs

Threat intelligence integration:
  CISA Advisory AA24-038A: Salt Typhoon IOC list (IPs, domains, file hashes)
  Subscribe to sector ISAC (Communications ISAC for telecoms)
  Integrate IOCs into SIEM for automated alerting</code></pre>

<h3>CISA Guidance, Regulatory Response, and Industry Lessons</h3>
<p>
  The Salt Typhoon campaign has accelerated regulatory action and produced concrete government
  guidance for telecommunications operators:
</p>
<ul>
  <li>
    <strong>CISA/NSA Joint Advisory (December 2024)</strong>: "Enhanced Visibility and Hardening
    Guidance for Communications Infrastructure" — provides specific technical controls for telecom
    operators, prioritizing logging, MFA, and CALEA isolation.
  </li>
  <li>
    <strong>FCC Proposed Rulemaking</strong>: The Federal Communications Commission proposed
    mandatory minimum cybersecurity requirements for CALEA infrastructure, including annual
    security assessments and breach reporting requirements.
  </li>
  <li>
    <strong>CISA Signal recommendation</strong>: Government officials advised to use Signal or
    equivalent end-to-end encrypted apps for sensitive communications — an acknowledgment that
    telecom infrastructure cannot currently be trusted for national security communications.
  </li>
  <li>
    <strong>Huawei/ZTE equipment ban context</strong>: Salt Typhoon reinforced the argument
    for completing the "rip and replace" program removing Chinese-manufactured network equipment
    from US carrier networks. The FCC's Secure and Trusted Communications Networks Act received
    renewed urgency and funding requests.
  </li>
</ul>
<p>
  The broader lesson of Salt Typhoon for the security community is that adversaries with nation-state
  resources, years of patience, and clear strategic objectives will eventually find a path into
  even well-defended environments. The goal of defense is not to make intrusion impossible —
  it is to make <em>discovery fast</em>, <em>lateral movement difficult</em>, and
  <em>exfiltration detectable</em> before strategic damage is done. Salt Typhoon succeeded
  in part because those three controls were systematically absent in telecom network device
  environments. The path forward requires treating network devices with the same security
  rigor historically reserved for endpoint and server infrastructure.
</p>
\`,
  },`;

// ─── APT41 BLOCK ─────────────────────────────────────────────────────────────
const apt41Block = `  'apt41-profile': {
    concept: \`
<h2>APT41: The Dual-Hat Threat Actor — Nation-State Espionage Meets Organized Cybercrime</h2>

<h3>Who Is APT41?</h3>
<p>
  APT41 is perhaps the most unusual threat actor in the advanced persistent threat landscape:
  a Chinese state-sponsored hacking group that simultaneously conducts government-directed
  intelligence collection <em>and</em> financially motivated cybercrime for personal profit —
  often using the same tools, infrastructure, and operators. This "dual-hat" behavior is almost
  unique in the nation-state threat actor space, where state actors are generally expected to
  focus exclusively on strategic objectives.
</p>
<p>
  The group is tracked under numerous names reflecting different vendors' independent discoveries:
  <strong>Winnti Group</strong> (early name focused on the gaming industry connection),
  <strong>Barium</strong> (Microsoft), <strong>Double Dragon</strong> (FireEye's reference to the
  dual criminal/espionage mission), <strong>Bronze Atlas</strong> (Secureworks), and
  <strong>Earth Baku</strong> (Trend Micro). The APT41 designation comes from Mandiant (formerly
  FireEye), who published the definitive 2019 report documenting the dual-mission nature of the group.
</p>

<h3>The US Department of Justice Indictment (2020)</h3>
<p>
  In September 2020, the US Department of Justice unsealed indictments against five Chinese nationals
  for their roles in APT41 operations. The indicted individuals were all connected to
  <strong>Chengdu 404 Network Technology Company</strong>, a legitimate-appearing cybersecurity firm
  that served as a front company for APT41 operations. Two Malaysian nationals who assisted with money
  laundering were also charged and subsequently arrested in Malaysia.
</p>
<p>
  The indictments provided an unprecedented level of operational detail about APT41's activities,
  including:
</p>
<ul>
  <li>Evidence of both MSS-directed espionage and personal financial crime by the same operators</li>
  <li>Targeting of over 100 companies across 20+ countries</li>
  <li>Simultaneous use of government C2 infrastructure for personal criminal operations</li>
  <li>Use of personal Gmail accounts for spearphishing — a surprising operational security failure for a sophisticated group</li>
</ul>
<blockquote>
  "The scope and sophistication of the crimes in these cases is unmatched." — Assistant Attorney
  General John C. Demers, DOJ National Security Division, September 2020
</blockquote>

<h3>Active Since 2012: A Long Track Record</h3>
<p>
  APT41 was first identified around 2012, though its operational precursors in the Winnti group
  may trace back further. Over more than a decade of operations, the group has compromised hundreds
  of organizations across at least 20 countries. This extended track record means that APT41's
  tooling, techniques, and procedures (TTPs) are among the most thoroughly documented of any
  Chinese APT, yet the group continues to operate successfully — adapting to increased scrutiny
  by regularly rotating infrastructure and updating malware families.
</p>

<h3>The Espionage Mission: What the MSS Wants</h3>
<p>
  During what researchers call "business hours" (aligned with Chengdu, China timezone,
  approximately 9 AM to 6 PM CST), APT41 operators conduct government-directed espionage.
  The intelligence collection priorities are consistent with known MSS/PLA strategic requirements:
</p>
<ul>
  <li>
    <strong>Healthcare and Pharmaceuticals</strong>: Stealing drug formulations, clinical trial data,
    FDA filing information, and executive communications at pharmaceutical companies. The COVID-19
    pandemic dramatically accelerated this targeting — stealing vaccine research data before competitors
    could publish represented enormous economic and scientific intelligence value for China.
  </li>
  <li>
    <strong>Technology Companies</strong>: Intellectual property theft from semiconductor firms,
    software companies, telecommunications equipment manufacturers. Acquiring technology without
    the R&amp;D cost is a core Chinese industrial policy objective.
  </li>
  <li>
    <strong>Defense Contractors</strong>: Information about military technology, weapons systems,
    government contract specifications, and personnel information for intelligence profiling.
  </li>
  <li>
    <strong>Telecommunications</strong>: Network infrastructure access, communications interception
    capabilities, subscriber data for intelligence targeting.
  </li>
  <li>
    <strong>Government and NGOs</strong>: Political intelligence, foreign policy positions,
    human rights organizations (particularly those focused on Tibet, Xinjiang, Taiwan, and Hong Kong).
  </li>
</ul>

<h3>The Criminal Mission: Off-Hours Operations for Personal Profit</h3>
<p>
  What makes APT41 uniquely fascinating and concerning is what happens after business hours. The
  same operators, using the same infrastructure and sometimes the same malware, conduct financially
  motivated crimes for personal enrichment:
</p>
<ul>
  <li>
    <strong>Video Game Currency and Item Theft</strong>: APT41's earliest documented criminal activity
    involved breaking into video game companies — particularly MMORPGs (massively multiplayer online
    role-playing games) — to steal in-game currency, weapons, and characters with real-world market
    value. The black market for virtual game items is worth billions globally, and APT41 operators
    exploited it for significant personal profit.
  </li>
  <li>
    <strong>Cryptocurrency Exchange Targeting</strong>: Compromising crypto exchanges to steal digital
    assets that can be pseudonymously laundered across multiple wallets and jurisdictions.
  </li>
  <li>
    <strong>Ransomware Deployment</strong>: Evidence suggests APT41 operators deployed ransomware
    against some targets — a financially motivated side activity that also provides the cover story
    of "criminal hackers" for intelligence operations.
  </li>
  <li>
    <strong>Credit Card and Banking Data</strong>: Stealing payment card data from compromised
    companies for resale on dark web carding markets.
  </li>
</ul>
<p>
  The dual-hat model creates an interesting strategic dynamic from the Chinese state's perspective:
  individual operators are incentivized by personal profit, which may actually improve their skill,
  dedication, and operational hours. The state gets highly motivated operators working extended hours —
  because they are also working for themselves.
</p>

<h3>The Chengdu 404 Front Company Model</h3>
<p>
  Chengdu 404 Network Technology Company Limited presents a documented model for how Chinese state
  intelligence services use private sector companies as operational covers. The company appeared
  entirely legitimate: it had a professional website, social media presence, and listed services
  including penetration testing and cybersecurity consulting. In reality, it served as the
  operational base for APT41 activities.
</p>
<p>
  This model — using front companies to employ hackers who conduct both state-directed and personal
  criminal operations — has been documented across multiple Chinese APT groups. It provides the state
  with plausible deniability ("these are private contractors, not government hackers") while giving
  operators legal protection within China. The indicted individuals continued to operate openly in
  China and faced no domestic legal consequences.
</p>

<h3>The ShadowHammer and CCleaner Operations: Supply Chain at Scale</h3>
<p>
  APT41's most technically sophisticated operations involved compromising legitimate software supply
  chains to deliver malware to targeted organizations at massive scale while maintaining surgical
  targeting precision. These operations represent a template for supply chain attacks that has been
  studied, documented, and unfortunately replicated by other threat actors.
</p>
<p>
  <strong>Operation ShadowHammer (ASUS Live Update, 2019)</strong>: APT41 compromised ASUS's software
  update infrastructure, allowing them to push a malicious update to over one million ASUS computers
  globally. The malware contained a hardcoded list of approximately 600 specific MAC addresses — it
  only activated on those specific machines, doing nothing on the other 999,400 infected computers.
  This demonstrated extraordinary operational discipline: using global distribution for surgically
  precise targeting.
</p>
<p>
  <strong>CCleaner Supply Chain (2017)</strong>: APT41 (or closely linked Winnti operators) compromised
  Avast's build infrastructure for the popular CCleaner utility. The malicious version was downloaded
  by 2.27 million users. Again, the second-stage payload only activated on machines belonging to
  specific high-value corporate targets, using domain name filtering to select victims from the
  millions of infected systems.
</p>

<h3>COVID-Era Pharmaceutical Targeting</h3>
<p>
  The COVID-19 pandemic created extraordinary motivation for APT41's healthcare targeting. As
  pharmaceutical companies raced to develop vaccines and therapeutics worth hundreds of billions
  of dollars in market value, APT41 accelerated attacks against those companies and their suppliers.
</p>
<p>
  The intelligence value was multi-dimensional: obtaining vaccine formulations and manufacturing
  processes ahead of public disclosure could provide enormous scientific, economic, and strategic
  advantage. Clinical trial data could inform Chinese state pharmaceutical programs. Regulatory filing
  information revealed competitors' timelines and vulnerabilities.
</p>
<p>
  The FBI and CISA issued a joint advisory in May 2020 warning that China was specifically targeting
  US COVID-19 research organizations, marking one of the rare cases where US government agencies
  publicly warned about an ongoing espionage campaign in near-real-time.
</p>
\`,
    technique: \`
<h2>APT41 Technical Playbook: From Initial Access to Data Exfiltration</h2>

<h3>Initial Access: Multi-Vector Approach</h3>
<p>
  Unlike some APT groups that rely heavily on a single initial access technique, APT41 demonstrates
  remarkable versatility — adapting their initial access method to each target's specific technology
  stack and observed security posture. This adaptability is a hallmark of a mature, well-resourced
  threat actor with deep technical breadth across multiple technology domains.
</p>

<h3>Spearphishing with Weaponized Documents</h3>
<pre><code>APT41 Spearphishing Methodology:

Target identification:
  LinkedIn scraping for target employees (IT, security, executives, finance)
  Industry conference attendee lists and speaker rosters
  Email harvesting from company websites and public OSINT sources
  GitHub profiles revealing technology stack and internal project names

Lure development:
  Industry-relevant content: conference invitations, research papers, job offers
  COVID-era lures: WHO guidance documents, government relief program documents
  Spoofed sender domains registered weeks before campaign launch
  Lure content matched to target's known research interests (LinkedIn-sourced)

Technical weaponization:
  CVE-2017-11882 (Microsoft Equation Editor buffer overflow) -- used through 2020
  CVE-2020-0688 (Microsoft Exchange Server RCE via validation key)
  Macro-based payloads in DOCX/XLSM with social engineering to enable macros
  PDF exploits targeting Adobe Reader (CVE-2021-28550 and similar)

Delivery:
  Direct email attachment
  Link to attacker-controlled file hosting (mimics OneDrive, Google Drive)
  Spear phishing via personal Gmail (documented in 2020 DOJ indictment)

Notable operational security failure: DOJ indictment revealed operators used
personal Gmail accounts for spearphishing -- unusual for nation-state actors --
suggesting confidence in immunity from Chinese law enforcement consequences</code></pre>

<h3>Exploiting Public-Facing Applications</h3>
<p>
  APT41 is one of the most aggressive exploiters of newly disclosed vulnerabilities in public-facing
  enterprise applications. The group has demonstrated a consistent capability to move from
  vulnerability disclosure to active exploitation within days — sometimes within hours of public
  proof-of-concept release.
</p>
<pre><code>Key CVEs Exploited by APT41 (documented by Mandiant, FireEye, CISA):

CVE-2019-3396 (Atlassian Confluence Server):
  CVSS: 9.8 | Type: Server-Side Template Injection
  Impact: Remote code execution without authentication
  Exploitation: Within days of PoC publication

CVE-2020-10189 (Zoho ManageEngine Desktop Central):
  CVSS: 9.8 | Type: Deserialization vulnerability
  Impact: Remote code execution as SYSTEM
  Exploitation: Same day as PoC release -- zero-day response capability

CVE-2019-19781 (Citrix ADC/Gateway):
  CVSS: 9.8 | Type: Path traversal leading to arbitrary code execution
  Impact: Full VPN gateway compromise
  Exploitation: Active beginning January 2020

CVE-2021-44228 (Log4Shell):
  CVSS: 10.0 | Type: JNDI injection in Apache Log4j
  APT41 among first nation-state actors exploiting within 48 hours of disclosure

CVE-2021-26855 (ProxyLogon, Microsoft Exchange):
  CVSS: 9.8 | Type: SSRF leading to authentication bypass
  Exploitation: Same day as patches released (watching for disclosure)

Pattern: APT41 maintains a vulnerability development pipeline targeting enterprise
         applications commonly used by their priority target industries.
         Estimated time from CVE disclosure to APT41 exploitation: 2-7 days on average</code></pre>

<h3>Supply Chain Compromise: The ShadowHammer Methodology</h3>
<pre><code>ASUS ShadowHammer Technical Breakdown (Kaspersky, 2019):

Phase 1: Build server compromise
  Targeted ASUS IT department employees with spearphishing
  Achieved access to ASUS software build infrastructure
  Objective: inject malicious code into the LIVE UPDATE utility build pipeline

Phase 2: Code injection with surgical targeting
  Malicious code inserted into legitimate ASUS Live Update binary
  Binary retained valid ASUS digital signature (signed on compromised build server)
  Payload activated ONLY for specific MAC addresses from a hardcoded list
  Hardcoded list: approximately 600 MAC addresses of high-value targets

Phase 3: Global distribution with surgical targeting
  Malicious update pushed through ASUS's legitimate update mechanism
  Completely bypassed security tools: signed by ASUS, from ASUS servers
  Over 1 million downloads worldwide
  Activation rate: under 0.1% (only the 600 targeted machines)

Phase 4: Second-stage payload delivery
  Targeted machine identified by MAC address match
  Download second-stage payload from C2 server
  Non-targeted machines: no payload, no visible malicious behavior

Detection and disclosure:
  Kaspersky researchers noticed unusual ASUS update behavior in telemetry
  ASUS initially denied breach, later confirmed and notified affected users
  Kaspersky released tool for users to check if their MAC was on the target list
  Disclosed at SAS 2019 security conference</code></pre>

<h3>Custom Malware Arsenal</h3>

<h4>MESSAGETAP: Telecom SMS Interception</h4>
<pre><code>MESSAGETAP Malware Analysis (Mandiant, 2019):

Target environment:
  Linux servers running SMSC (Short Message Service Center) software
  at telecommunications companies processing SMS traffic

Technical function:
  Parses raw network traffic looking for SMPP (Short Message Peer-to-Peer) protocol
  Extracts SMS content and metadata from network packets at line rate
  Filters messages matching pre-configured phone numbers or keywords
  Stores intercepted messages and CDRs to local files for later exfiltration

Configuration files read at startup:
  parm_list.dat:    target phone numbers to intercept
  keyword_parm.dat: keywords to filter messages for (government terms, names)

Output files created:
  sms_content.log:  Full SMS message text for targeted phone numbers
  cdr.log:          Call detail records matching target criteria

Strategic intelligence use:
  Intercept 2FA codes for follow-on account compromise of high-value targets
  Collect SMS communications of government officials and dissidents
  Identify individuals of intelligence interest by keyword matching
  Support human intelligence operations with communications context

MITRE ATT&amp;CK: T1040 (Network Sniffing), T1119 (Automated Collection)</code></pre>

<h4>CROSSWALK: Modular Windows Backdoor</h4>
<pre><code>CROSSWALK Technical Profile (FireEye):

Architecture: Modular backdoor with plugin loading system
Platform:     Windows x86 and x64
Persistence:  DLL sideloading via legitimate applications, Registry Run keys,
              Scheduled Tasks, Windows Service installation

Core capabilities:
  Encrypted C2 communication (custom binary protocol over HTTPS)
  Plugin loading from C2 server (adds capabilities post-compromise)
  File operations: read, write, list directories
  Process execution: create processes, capture output
  Screen capture
  Keylogging module (loaded as plugin)
  Reverse shell and interactive command execution

C2 communication details:
  Beacon-based: polls C2 at configurable interval
  HTTP headers crafted to mimic legitimate browser traffic patterns
  C2 domains registered to appear as CDN or cloud service providers
  Certificate pinning to resist SSL inspection

Anti-analysis features:
  Encrypted strings, obfuscated control flow graphs
  Sandbox/VM detection: CPUID instruction, timing checks, user activity monitoring
  Code segments decrypted at runtime only -- static analysis sees encrypted blobs
  Import Address Table obfuscation</code></pre>

<h4>POISONPLUG/Winnti Backdoor</h4>
<pre><code>Winnti/POISONPLUG Characteristics:
  History:       One of the oldest and most evolved in APT41's arsenal
  First seen:    Approximately 2011-2012 in video game company targeting
  Platform:      Windows (x86 and x64); Linux variant (WINNKIT) for servers
  Architecture:  Kernel rootkit component + user-mode backdoor component

Components:
  Kernel driver: Hides processes, files, registry keys, network connections
                 Intercepts system calls to provide stealth
  User-mode RAT: Provides C2 communication, command execution, file transfer
  C2 protocol:   Custom binary protocol, often over raw TCP or encapsulated in HTTP/S

Persistence mechanisms:
  Kernel driver installed as a Windows service
  Some variants use signed but vulnerable drivers (BYOVD technique)
  Survives reboots and most endpoint security removal attempts

Notable: Multiple Winnti kernel driver variants have been found signed with
         code-signing certificates stolen from legitimate game companies,
         allowing them to bypass driver signing enforcement</code></pre>

<h3>Lateral Movement and Domain Compromise</h3>
<pre><code>APT41 Post-Compromise Lateral Movement Playbook:

1. Credential harvesting:
   LSASS dump via ProcDump or custom tool (avoid Mimikatz signatures)
   secretsdump.py via Impacket against domain controllers
   Kerberoasting: request service tickets for all SPNs, crack offline

2. Lateral movement techniques:
   Pass-the-Hash: use NTLM hashes directly for authentication
   Pass-the-Ticket: use stolen Kerberos TGTs for impersonation
   WMI remote execution: wmiprvse.exe --&gt; cmd.exe --&gt; payload
   PSExec equivalent via Impacket for remote service installation
   RDP with stolen credentials to administrator workstations

3. Domain dominance:
   DCSync: replicate all domain hashes using directory replication rights
   Golden Ticket: forge Kerberos TGTs valid for 10 years using krbtgt hash
   NTDS.dit exfiltration for offline password cracking
   Active Directory object modification for long-term access

Living-off-the-land preference:
   PowerShell (Invoke-Mimikatz, PowerView, BloodHound for AD mapping)
   WMI (wmic.exe, wmiexec)
   certutil.exe for payload download (bypasses many proxy category filters)
   bitsadmin.exe for background transfer persistence
   Rundll32 for reflective DLL injection</code></pre>

<h3>Healthcare Sector Kill Chain: COVID Research Targeting</h3>
<pre><code>Illustrative Timeline: Pharmaceutical Spearphishing Campaign

Day 0 (preparation):
  Identify target: research scientist at pharmaceutical company via LinkedIn
  Craft lure: fake "WHO Special Report on COVID-19 Clinical Trials" document
  Weaponize: embed exploit for known Office vulnerability
  Send from spoofed domain registered to mimic legitimate WHO communications

Day 1 (initial compromise):
  Target opens document on work laptop
  DUSTPAN in-memory loader executes -- no file written to disk
  CROSSWALK backdoor establishes encrypted C2 connection
  Initial beacon: hostname, username, domain, local admin status, process list

Days 2-7 (reconnaissance):
  Active Directory enumeration using PowerView
  Identify: file servers with "research", "clinical", "trial" in paths
  Map: who has access to research data shares
  Lateral movement to research file server via Pass-the-Hash

Days 8-21 (collection):
  Systematic staging of research data to encrypted temp directory
  Target: clinical trial protocols, formulation documents, regulatory filings
  Exfiltration: compress with 7-zip, encrypt, small chunks over HTTPS to C2
  Volume: typically hundreds of gigabytes across a multi-week operation

Day 21+ (persistence and continued collection):
  Additional backdoors installed for redundancy
  Monitor email for upcoming research milestones (targets for focused collection)
  Establish access to collaboration platforms for external researcher communications</code></pre>

<h3>Data Exfiltration Techniques</h3>
<pre><code>APT41 Exfiltration Methods:

DNS Tunneling:
  Encode data as DNS query subdomains (Base64 encoded chunks)
  Example query: [b64_chunk].exfil.c2domain[.]com
  Bypasses firewalls that permit DNS outbound but block HTTP
  Slow (~1KB/s) but highly resistant to detection in noisy DNS environments

HTTPS Exfiltration (most common):
  Data compressed (7-zip or RAR with password) then encrypted before transfer
  Sent in chunks (typically 1-10MB) to avoid size-based anomaly detection
  C2 domains mimic legitimate CDN, cloud provider, or SaaS application domains
  HTTP headers crafted to match legitimate browser patterns

Victim-as-relay:
  Compromised victim's own DMZ servers used as staging relay
  Data path: internal server --&gt; victim DMZ --&gt; C2
  Reduces direct attacker fingerprints in perimeter network logs
  Internal-to-DMZ traffic often has lower inspection fidelity</code></pre>
\`,
    defense: \`
<h2>Defending Against APT41: Supply Chain Security, Patch Velocity, and Threat Detection</h2>

<h3>Understanding the Dual Threat Surface</h3>
<p>
  Defending against APT41 requires acknowledging that you face an adversary with two distinct
  motivations operating simultaneously against the same infrastructure. The espionage mission
  is patient and strategic — operators may spend months performing reconnaissance before taking
  any action that triggers an alert. The criminal mission is more opportunistic — operators may
  quickly deploy ransomware or harvest payment card data if they find an unguarded path to value.
  Effective defenses must address both threat models simultaneously.
</p>
<p>
  The single most important lesson from APT41 operations is that <strong>software supply chain
  security</strong> is as critical as internal security posture. The ShadowHammer and CCleaner
  operations demonstrate that an organization with strong internal controls can still be
  catastrophically compromised through software installed from trusted vendors. This requires
  a fundamental rethinking of trust models that most security programs have not yet completed.
</p>

<h3>Software Supply Chain Security</h3>
<p>
  APT41's supply chain attacks are the most technically challenging to defend against because they
  exploit the fundamental trust relationship between software vendors and their customers — a
  relationship that is necessary for software distribution to function at all.
</p>
<pre><code>Supply Chain Security Framework:

1. Software inventory and monitoring (SBOM):
   Maintain complete Software Bill of Materials for all deployed applications
   Monitor all software update events via endpoint telemetry
   Alert on: software update outside normal business hours or without change ticket
   Alert on: hash change in critical system binaries without corresponding update event

2. Code signing and hash verification:
   Verify digital signatures on all software updates before execution
   Maintain expected certificate thumbprints for critical software packages
   Alert on: certificate changes for previously known software (possible CA compromise)
   Verification workflow: automated check before deployment, human review for anomalies

3. Build server security (for software developers):
   Isolate build servers on dedicated network segment with strict ACL
   MFA required for all build system access (developers, CI/CD pipelines)
   Code signing keys in HSM -- never stored on build server directly
   Reproducible builds: binary output should be deterministic from source
   Comprehensive audit logging of all build server access and build artifacts

4. Canary deployment process:
   Deploy software updates to isolated canary systems first (5% of fleet)
   Monitor canary systems for 24-48 hours before broad deployment
   Hash verification: confirm binary hash matches vendor-published expected value
   Network monitoring: alert on unexpected outbound connections after software updates

5. Vendor security assessment:
   Include build security questions in vendor risk assessment questionnaires
   Ask specifically: How are build servers protected? How are code signing keys stored?
   Review: Does vendor's update mechanism bypass your endpoint security controls?
   Consider: What is this vendor's breach history and incident response track record?</code></pre>

<h3>Vulnerability Management: The Speed Imperative</h3>
<p>
  APT41's exploitation of CVE-2020-10189 (Zoho ManageEngine) on the same day a proof-of-concept
  was released establishes a non-negotiable requirement: critical enterprise application vulnerabilities
  must be patched within hours to days, not the weeks or months that traditional patch management
  cycles assume.
</p>
<pre><code>Vulnerability Management for APT41 Threat Level:

Priority matrix:
  CVSS 9.0+ AND confirmed exploited in wild (CISA KEV):
    Patch within 24 hours OR disable the affected component entirely
    Escalation: emergency change board, all hands on deck

  CVSS 9.0+ (public PoC exists, not yet confirmed exploited):
    Patch within 48-72 hours
    Compensating control: WAF virtual patch rule if patch unavailable

  CVSS 7.0-8.9 (public PoC exists):
    Patch within 7 days
    Compensating controls acceptable during tested patch deployment

  CVSS 4.0-6.9 (no public PoC):
    Patch within 30 days
    Standard change management process acceptable

APT41 high-priority application categories:
  Atlassian Confluence and Jira (server and data center editions)
  Zoho ManageEngine suite (all products -- high-value target)
  Citrix ADC, Citrix Gateway (VPN infrastructure)
  VMware vCenter, ESXi, Workspace ONE (virtualization infrastructure)
  Microsoft Exchange Server (on-premises only -- critical)
  All VPN gateways: Pulse Secure, Fortinet FortiGate, Check Point

WAF virtual patching as compensating control:
  Deploy ModSecurity or cloud WAF with CVE-specific rules
  Purpose: buy time for testing and deploying patches safely
  Limitation: not a permanent solution -- always follow with actual patching
  Resource: OWASP CRS (Core Rule Set) includes many enterprise app exploit patterns</code></pre>

<h3>Email Security: Blocking Spearphishing at the Gateway</h3>
<pre><code>APT41 Spearphishing Countermeasures:

Email gateway controls:
  Attachment sandboxing: Proofpoint TAP, Microsoft Defender for Office 365,
    Mimecast -- all attachments detonated in isolated sandbox before delivery
  URL click-time scanning: links rewritten through proxy; checked at click time
    (defangs day-after-delivery URL activation)
  Attachment blocking: DOCX/XLSM with macros, HTA, VBS, JS blocked by default
    Require explicit user request + security approval to receive blocked file types

Anti-spoofing controls (mandatory):
  DMARC with p=reject: prevents spoofing of your own domain by third parties
  SPF and DKIM: foundational authentication; DMARC requires both
  Monitor: DMARC aggregate reports for spoofing attempts against your domain

Domain monitoring:
  dnstwist tool: detect typosquatted domains of your company
  Monitor for newly registered domains containing your company name
  Alert: unusual domains sending email that resembles your domain

Security awareness training:
  Monthly phishing simulations using APT41-style industry-relevant lures
  Measurement: click rate, credential submission rate, reporting rate
  Positive reinforcement: reward reporting behavior regardless of whether user clicked
  Content: include gaming/video game company lures for gaming industry targets</code></pre>

<h3>Healthcare Organization-Specific Defenses</h3>
<p>
  Given APT41's consistent and intensive targeting of healthcare and pharmaceutical companies,
  organizations in this sector should implement additional controls beyond standard enterprise
  security baselines.
</p>
<pre><code>Healthcare Security Controls for APT41 Threat:

Research network segmentation:
  Dedicated VLAN for research computing, separate from corporate IT
  No direct internet access from research endpoints (all traffic proxied and inspected)
  Research network egress: DLP inspection for large file transfers
  Cross-network data movement: requires explicit approval and logging

Clinical trial data protection:
  Data classification: clinical trial data classified at highest sensitivity tier
  Access control: named individual access, not broad group membership
  Audit logging: log every access to trial data with user, time, file, action
  Encryption: at rest (application-level AES-256) and in transit (TLS 1.3)
  Retention: immutable audit logs retained minimum 7 years (regulatory requirement)

External collaboration security:
  Dedicated secure collaboration portal for external research partners
  Never email raw clinical data -- use portal with access controls and audit logging
  Watermark all shared documents with recipient-specific invisible watermarks
  Data sharing agreements: explicit security requirements for external partners

Research exfiltration detection:
  Alert on: ZIP/RAR/7z creation in research file server directories
  Alert on: transfers exceeding 500MB from research file servers
  Alert on: research file access outside 8am-6pm local time by individual accounts
  Alert on: access to regulatory filing documents (IND, NDA) by non-regulatory staff
  Behavioral baseline: alert on users accessing far more files than their 30-day average</code></pre>

<h3>Detecting APT41's Unique Dual-Hat Behavior</h3>
<p>
  APT41's criminal operations sometimes create detection opportunities that pure espionage actors
  do not generate. Financial crime tends to involve noisier, higher-risk activity — deploying
  ransomware, accessing financial systems, installing cryptocurrency miners — that is more
  likely to trigger alerts.
</p>
<pre><code>Detection Opportunities from Criminal Side Operations:

Ransomware pre-deployment indicators (catch before encryption):
  Shadow copy deletion: Event ID 524, vssadmin or wmic deleting shadow copies
  Backup system access: unusual authentication to backup servers or agents
  Domain controller lateral movement: new authentication to DCs from non-admin workstations
  Large file enumeration: process scanning entire file shares at high speed

Cryptocurrency mining indicators:
  Unusual sustained CPU utilization on servers (above 80% for extended periods)
  Outbound connections to known mining pool IP ranges and domains
  Specific processes: xmrig.exe, minerd variants, custom mining binaries

In-game economy manipulation (gaming companies):
  Unusual API calls to item databases outside normal game server patterns
  Bulk account access from geographic regions inconsistent with normal player base
  Item database write operations outside normal game content updates
  Virtual currency generation rates far exceeding normal player activity

Correlation insight:
  APT41's espionage and criminal operations often share C2 infrastructure
  Detecting criminal activity (louder) may reveal espionage implants (quiet) in same network
  Strategy: use criminal IOC hunting to find the quiet espionage backdoors</code></pre>

<h3>Network Detection for Lateral Movement</h3>
<pre><code>SIEM Detection Rules for APT41 Post-Compromise Activity:

Kerberoasting:
  Windows Event ID 4769 with TicketEncryptionType = 0x17 (RC4 -- weak, legacy)
  Threshold: More than 5 such events from single source within 1 hour
  False positive: Some legacy applications legitimately use RC4 -- baseline first

Pass-the-Hash:
  Windows Event ID 4624 (logon success) with LogonType=3 (network) and
  AuthenticationPackageName=NTLM where Kerberos would be expected
  Source: known workstation; destination: server not in user's normal access list

WMI lateral movement detection:
  Windows Event ID 4688 or Sysmon Event ID 1: wmiprvse.exe spawning cmd.exe or PowerShell
  Sysmon Event ID 20: WmiEventConsumer (persistence via WMI subscription)
  Alert: wmiprvse.exe creating child processes is highly suspicious

DCSync (indicates near-complete domain compromise):
  Windows Event ID 4662: Directory Service object access
  Filter: ObjectType matches domain naming context AND AccessMask includes REPL rights
  Source IP: NOT a domain controller IP address
  Response: Immediate incident declaration -- domain is likely fully compromised</code></pre>

<h3>Incident Response for APT41 Intrusions</h3>
<p>
  Given APT41's sophistication and dual-mission nature, incident response must account for
  possibilities that standard IR playbooks miss.
</p>
<ul>
  <li>
    <strong>Do not assume limited scope</strong>: If you detect ransomware or financial crime,
    recognize it may be an APT41 espionage operation that shifted to criminal activity, or that
    ran both simultaneously. APT41 may have been resident for months before any visible indicator.
  </li>
  <li>
    <strong>Preserve memory forensics</strong>: APT41's in-memory execution techniques (DUSTPAN,
    reflective loading) mean disk forensics alone will miss significant activity. Image memory on
    all implicated systems before any remediation steps.
  </li>
  <li>
    <strong>Engage specialized IR firms</strong>: Mandiant, CrowdStrike Services, and Secureworks
    all have documented APT41 tracking capabilities and malware analysis tooling. General IR firms
    may lack APT41-specific context.
  </li>
  <li>
    <strong>Report to FBI and CISA</strong>: APT41 intrusions should be reported to the FBI Cyber
    Division and CISA. The DOJ has demonstrated willingness to pursue indictments, and the FBI
    maintains operational intelligence on APT41 infrastructure that can assist in scoping.
  </li>
  <li>
    <strong>Assume domain compromise</strong>: If APT41 had persistent access for more than
    a week, assume full domain credential compromise. Recovery requires: rebuild all domain
    controllers, reset all user and service account passwords, revoke and re-issue all Kerberos
    service tickets, and audit all trust relationships.
  </li>
</ul>
\`,
  },`;

// ─── LAZARUS BLOCK ────────────────────────────────────────────────────────────
const lazarusBlock = `  'lazarus-group': {
    concept: \`
<h2>Lazarus Group: North Korea's Hackers-for-Hire and the World's Most Prolific Cyber Thieves</h2>

<h3>Who Is Lazarus Group?</h3>
<p>
  Lazarus Group is North Korea's primary state-sponsored cyber operation, operating under the
  <strong>Reconnaissance General Bureau (RGB)</strong> — the DPRK's primary foreign intelligence
  service. Lazarus is unique among nation-state threat actors in a fundamental way: their primary
  mission is not espionage but <strong>revenue generation</strong>. The group steals money —
  initially from banks, increasingly from cryptocurrency — to fund the Kim Jong-un regime's
  weapons programs in defiance of comprehensive international sanctions.
</p>
<p>
  The group operates under numerous names depending on the analytical context:
  <strong>HIDDEN COBRA</strong> (US government designation), <strong>Zinc</strong> (Microsoft),
  <strong>Nickel Academy</strong> (CrowdStrike), and <strong>APT38</strong> (Mandiant's designation
  for the financially focused sub-group). Lazarus has several operational sub-units with
  specialized focuses:
</p>
<ul>
  <li><strong>APT38 / BlueNoroff</strong>: pure financial crime — SWIFT banking attacks, cryptocurrency exchange targeting, DeFi protocol exploitation</li>
  <li><strong>Andariel</strong>: focuses on South Korean military, government, and financial targets; also operates ransomware campaigns against domestic South Korean organizations</li>
  <li><strong>Lazarus proper</strong>: espionage, destructive attacks (wipers), and strategic coordination of the broader group's operations</li>
</ul>
<p>
  Active since at least 2009 (when Operation Troy targeted South Korean military networks),
  Lazarus has evolved from a relatively unsophisticated team conducting website defacement and
  DDoS attacks into the world's most prolific financial cybercriminal organization. The UN Panel
  of Experts on North Korea estimates Lazarus has stolen over <strong>$3 billion in cryptocurrency
  between 2017 and 2024</strong>, with the proceeds used to fund ballistic missile and nuclear
  weapons programs that threaten regional and global stability.
</p>

<h3>The DPRK's Unique Strategic Calculus</h3>
<p>
  To understand Lazarus Group, you must understand North Korea's economic and geopolitical
  situation. The DPRK is one of the most heavily sanctioned countries in history. UN Security
  Council resolutions ban it from international banking, restrict its exports, and limit its
  access to hard currency. The regime requires hard currency (US dollars, euros, renminbi) to:
</p>
<ul>
  <li>Fund ballistic missile development — each test launch costs millions in materials, fuel, and engineering</li>
  <li>Procure luxury goods for the elite that maintain Kim Jong-un's inner circle loyalty</li>
  <li>Purchase dual-use technology and components for weapons programs through front companies</li>
  <li>Fund intelligence operations and overseas agents</li>
  <li>Pay North Korean IT workers operating abroad under the IT worker scheme</li>
</ul>
<p>
  Cryptocurrency is the ideal sanctions evasion tool: it is pseudonymous, transfers instantly
  across borders with no bank intermediary that can freeze or block the transaction, and can be
  laundered through mixers and DeFi protocols to obscure its origin. Lazarus Group's
  cryptocurrency theft operations are not mere opportunism — they are a deliberate, state-directed
  strategic program to generate regime revenue, overseen at the highest levels of DPRK government.
</p>
<blockquote>
  "North Korea has become a criminal state that uses cybercrime as an instrument of national
  power." — US Deputy National Security Advisor Anne Neuberger, 2022
</blockquote>

<h3>The $1.5 Billion Bybit Hack: The Largest Crypto Theft in History</h3>
<p>
  In February 2025, Lazarus Group executed what became the largest cryptocurrency theft in history:
  stealing approximately $1.5 billion from <strong>Bybit</strong>, one of the world's largest
  cryptocurrency exchanges, serving over 60 million registered users. The attack's sophistication
  represents the current state of Lazarus's technical capabilities.
</p>
<p>
  Bybit used <strong>Safe{Wallet}</strong> (formerly Gnosis Safe), a multi-signature smart contract
  wallet platform, to manage its Ethereum cold wallets. Multi-signature wallets require multiple
  authorized signers to approve each transaction — a security control specifically designed to
  prevent single-point-of-compromise from draining a wallet.
</p>
<p>
  Lazarus defeated this control not by attacking the smart contract directly, but by compromising
  the Safe{Wallet} developer infrastructure and injecting malicious JavaScript into the signing
  web interface. When Bybit's authorized signers reviewed and approved what appeared to be a
  routine internal transfer, the malicious JavaScript silently replaced the transaction's destination
  addresses with Lazarus-controlled wallets. The signers authenticated a transaction they genuinely
  believed was legitimate; they were actually signing over $1.5 billion in customer funds.
</p>
<p>
  This is a supply chain attack against the security tool itself — attacking the very mechanism
  designed to prevent the theft. It represents a profound evolution in Lazarus's capabilities
  and an industry-wide lesson that multi-signature security can be defeated through the software
  supply chain of the signing interface.
</p>

<h3>The Sony Pictures Hack (2014): Demonstrating Destructive Capability</h3>
<p>
  Sony Pictures Entertainment's 2014 hack established Lazarus as a threat actor willing and
  capable of conducting destructive cyberattacks against civilian corporate targets in retaliation
  for perceived political provocations. Sony's production of "The Interview" — a comedy film
  depicting the assassination of Kim Jong-un — crossed a red line. North Korea demanded Sony
  cancel the film; Sony refused.
</p>
<p>
  The attack timeline was methodical and patient:
</p>
<ul>
  <li>Initial access achieved via spearphishing months before the destructive phase</li>
  <li>Two months of quiet lateral movement, data collection, and implant deployment followed</li>
  <li>100 terabytes of data exfiltrated: employee Social Security numbers, salary data, unreleased films, embarrassing executive emails</li>
  <li>On November 24, 2014, the <strong>DESTOVER wiper</strong> was deployed, destroying the Master Boot Record of approximately 70% of Sony's computers</li>
  <li>Thousands of Sony employees had computers rendered permanently unbootable; the company operated on paper for weeks</li>
</ul>
<p>
  Estimated damages exceeded $35 million. Unreleased films were distributed for free online.
  Embarrassing executive emails exposed salary inequity, disparaging comments about actors, and
  internal politics. The Obama administration publicly attributed the attack to North Korea —
  the first US government public attribution of a destructive cyberattack to a nation-state.
</p>

<h3>The Bangladesh Bank Heist (2016): $81 Million Stolen via SWIFT</h3>
<p>
  The Bangladesh Bank heist remains one of the most audacious financial crimes in history — and it
  was conducted entirely through cyberspace. Lazarus Group spent months inside Bangladesh Bank's
  network, studying the SWIFT interbank messaging system used to transfer funds between the world's
  central banks and correspondent banks.
</p>
<p>
  On the night of February 4-5, 2016 — timed precisely to exploit the holiday weekend in Bangladesh
  while the New York Federal Reserve was open for business — Lazarus sent 35 fraudulent SWIFT
  transfer messages requesting that nearly $1 billion be transferred from Bangladesh's account at
  the NY Fed to pre-established accounts in the Philippines and Sri Lanka. The Federal Reserve
  processed 5 transactions totaling $101 million before a correspondent bank in the routing chain
  flagged a suspicious detail: the recipient name "Shalika Fandation" contained a misspelling
  ("Fandation" instead of "Foundation").
</p>
<p>
  $20 million was recovered due to this error. $81 million reached accounts in the Philippines,
  was converted to Philippine pesos, and was laundered through casinos — which were at the time
  exempt from the Philippines' anti-money-laundering framework. The funds were never recovered.
</p>

<h3>WannaCry (2017): Global Ransomware Outbreak</h3>
<p>
  In May 2017, the WannaCry ransomware outbreak infected an estimated 200,000 to 300,000 computers
  across 150 countries in approximately 72 hours, causing damages estimated between $4 billion and
  $8 billion globally. The attack used <strong>EternalBlue</strong>, an exploit developed by the
  NSA that was leaked by the Shadow Brokers hacking group in April 2017 — less than a month before
  WannaCry's deployment.
</p>
<p>
  WannaCry's victims included the UK's National Health Service (NHS), which was forced to cancel
  approximately 19,000 appointments and divert ambulances; Deutsche Bahn; Telefonica; Renault
  and Nissan manufacturing operations; and shipping giant Maersk. The attack caused significant
  collateral damage far beyond any intended targets, demonstrating the inherent risk of deploying
  worm-capable ransomware.
</p>
<p>
  Security researcher Marcus Hutchins discovered a kill switch domain embedded in WannaCry's code.
  By registering this domain for under $11, he stopped the global spread — an accidental killswitch
  that was likely an anti-sandbox mechanism (sandboxes answer all domains) rather than a deliberate
  safety feature.
</p>

<h3>Cryptocurrency Theft: The Primary Revenue Engine</h3>
<p>
  Since 2017, cryptocurrency theft has displaced SWIFT banking fraud as Lazarus Group's primary
  financial operation. The scale is extraordinary and consistently growing:
</p>
<ul>
  <li><strong>Ronin Network / Axie Infinity (March 2022)</strong>: $625 million — previous record</li>
  <li><strong>Harmony Horizon Bridge (June 2022)</strong>: $100 million</li>
  <li><strong>Atomic Wallet (June 2023)</strong>: $100 million from individual user wallets</li>
  <li><strong>WazirX Exchange (July 2024)</strong>: $234 million — another Safe{Wallet} compromise</li>
  <li><strong>Bybit (February 2025)</strong>: $1.5 billion — largest in history</li>
</ul>
<p>
  The UN Panel of Experts documented 58 suspected Lazarus-affiliated cryptocurrency heists between
  2017 and 2023, totaling an estimated $3 billion. These funds are believed to finance approximately
  40% of North Korea's weapons of mass destruction programs, according to US government assessments.
</p>

<h3>The IT Worker Infiltration Scheme</h3>
<p>
  One of Lazarus's most creative long-running operations is the <strong>IT worker scheme</strong>:
  North Korean nationals — potentially thousands of them — pose as freelance software developers
  and IT contractors seeking remote employment at companies primarily in the United States and Europe.
  Using stolen or fabricated identities, VPN services to appear geographically located in non-sanctioned
  countries, and sometimes paying complicit individuals to appear on video calls, these workers have
  been placed at hundreds of companies across multiple industries.
</p>
<p>
  The scheme generates hard currency through legitimate-appearing salaries forwarded to North Korea,
  and creates insider access opportunities for more targeted operations. The Department of Justice
  has issued multiple warnings and prosecuted numerous individuals facilitating the scheme within
  the United States.
</p>
\`,
    technique: \`
<h2>Lazarus Group Technical Operations: Tools, Techniques, and Major Campaigns</h2>

<h3>Operation Dream Job: LinkedIn-Based Spearphishing</h3>
<p>
  One of Lazarus Group's most effective and persistent campaigns is <strong>Operation Dream Job</strong>
  (also documented as "Operation In(ter)ception" by ESET). The operation uses fake job offers
  delivered via LinkedIn to target employees at cryptocurrency companies, defense contractors, and
  aerospace firms. The technique exploits the professional trust inherent in LinkedIn — a "recruiter"
  from a recognizable tech company reaching out feels categorically different from a random phishing
  email, bypassing the social engineering resistance that security training typically builds.
</p>
<pre><code>Dream Job Attack Flow:

Phase 1: Target identification and profile development
  Identify high-value employees at crypto exchanges, DeFi protocols, defense contractors
  Selection criteria: system administrators, developers with privileged access, finance staff
  Sources: LinkedIn, company websites, conference speaker lists, GitHub profiles
  Goal: identify individuals whose access, once compromised, provides maximum value

Phase 2: Initial LinkedIn contact
  Create convincing fake LinkedIn profile: senior recruiter at known tech company
  Choose companies with active hiring: Google, Coinbase, Kraken, Lockheed Martin
  Connection request with tailored backstory aligned to target's career interests
  Initial message: "We're hiring for a senior role matching your background exactly..."
  Build rapport over days or weeks before attempting payload delivery

Phase 3: Payload delivery
  "Technical assessment" -- fake coding challenge or skills evaluation exercise
  PDF or document with job description containing embedded exploit
  Trojanized collaboration tools: fake Zoom installer, fake Teams plugin
  Common lure: salary negotiation spreadsheet with macro payload

Phase 4: Post-compromise objectives
  Install RAT (BLINDINGCAN, COPPERHEDGE, or newer custom malware)
  Initial beacon: system info, running processes, network configuration, installed software
  Focus: crypto wallet software, exchange admin panels, privileged access credentials
  Secondary: access to employee payroll for IT worker scheme identity theft</code></pre>

<h3>The Bybit Hack (2025): Nested Supply Chain Attack</h3>
<p>
  The Bybit hack represents the current apex of Lazarus Group's technical sophistication.
  Understanding it requires understanding the multi-signature wallet security model and exactly
  how Lazarus engineered a path through it using a supply chain attack.
</p>
<pre><code>Bybit Attack Methodology (February 2025):

Background: Safe{Wallet} multi-signature architecture
  Multi-sig wallets require M-of-N authorized signers to approve each transaction
  Bybit's cold wallet: required 3 authorized signers for fund movements
  Signing process: signers review transaction details in Safe web UI,
                   then confirm by signing with their hardware wallets

Attack vector: Compromising Safe{Wallet} developer infrastructure
  1. Lazarus targeted a Safe{Wallet} developer's individual workstation
  2. Obtained AWS S3 credentials or deployment pipeline access
  3. Injected malicious JavaScript into Safe{Wallet}'s AWS S3-hosted front-end assets
  4. Malicious JS activated ONLY for Bybit's specific wallet address (surgical targeting)

Malicious JavaScript behavior:
  Intercepted transaction signing requests in the browser
  Replaced legitimate destination address with Lazarus-controlled wallet address
  Modified displayed transaction details to show original (legitimate) destination
  Three independent Bybit signers each saw: "Transfer ETH to [correct Bybit treasury address]"
  Actual on-chain transaction: "Transfer ALL ETH to [Lazarus wallet]"

Execution of the theft:
  Three Bybit signers independently reviewed transaction details
  All three confirmed details looked correct
  All three signed the transaction with their hardware wallets
  $1.5 billion transferred in seconds to Lazarus-controlled wallets
  Bybit's cold wallet empty before alarm triggered

Post-theft laundering (within hours):
  Immediate distribution to hundreds of newly created wallets (structuring)
  Conversion from ETH to BTC via THORChain decentralized bridge
  Multiple DEX swaps to break traceability chains
  Blockchain analysts (Elliptic, Chainalysis) tracked but could not prevent movement
  Estimated recovery: near zero</code></pre>

<h3>WannaCry Technical Deep Dive</h3>
<pre><code>WannaCry Ransomware Technical Analysis (May 2017):

Propagation mechanism: EternalBlue (CVE-2017-0144)
  Target: Windows SMBv1 (Server Message Block version 1 protocol)
  Vulnerability: Buffer overflow in SMBv1 transaction processing
  Exploit origin: NSA EQUATION GROUP, leaked by Shadow Brokers April 2017
  CVSS score: 9.3 (Critical)
  Patch: MS17-010 released March 14, 2017 (6 weeks before outbreak)

WannaCry infection sequence:
  1. Scan for port 445 (SMB) on local /16 subnet AND random internet IPs simultaneously
  2. Send crafted SMBv1 negotiation packet triggering EternalBlue buffer overflow
  3. EternalBlue achieves code execution in kernel context
  4. DoublePulsar kernel-mode backdoor installed via EternalBlue
  5. DoublePulsar used to inject WannaCry DLL into LSASS process memory
  6. WannaCry enumerates and encrypts files with AES-128-CBC
  7. Each file's AES key encrypted with attacker's RSA-2048 public key
  8. Ransom note: $300 USD in Bitcoin (72h deadline), $600 after deadline
  9. Scan for new targets and repeat propagation

Kill switch (accidental safety mechanism):
  WannaCry queries specific domain at startup:
  iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com
  If domain resolves to any IP: malware exits without encrypting
  If domain returns NXDOMAIN (unregistered): malware proceeds normally
  Purpose: likely anti-sandbox check (sandboxes respond to all domains)
  Effect: unregistered domain = global spread; registered domain = stop
  Marcus Hutchins registered domain for $10.69 USD -- stopped global spread within hours

Microsoft patch status:
  MS17-010 available for Windows Vista through Server 2016: 6 weeks before outbreak
  ~70% of infected systems were unpatched Windows 7 (end-of-support timeline pressure)
  Windows XP received emergency out-of-band patch post-outbreak (rare exception)

NHS impact:
  80 of 236 NHS trusts in England affected
  19,000 appointments and operations cancelled
  Ambulances diverted from emergency departments
  Total UK NHS cost: approximately 92 million GBP in damages and remediation</code></pre>

<h3>SWIFT Banking Attack Methodology (Bangladesh Bank, 2016)</h3>
<pre><code>Bangladesh Bank Heist Technical Reconstruction:

Initial compromise (November 2015 - January 2016):
  Spearphishing targeting Bangladesh Bank IT staff
  Likely vector: malicious PDF or Office document exploiting known CVE
  Result: RAT installed on SWIFT terminal operator workstations
  Duration of access before attack: approximately 3 months

SWIFT system reconnaissance:
  Study legitimate SWIFT MT 103 (credit transfer) message format and validation rules
  Study MT 202 COV (cover payment) format for interbank transfers
  Identify Bangladesh Bank's SWIFT BIC code and correspondent relationships
  Map transfer processing schedules: when does NY Fed process incoming requests?
  Research: Bangladesh Bank holiday (Friday-Saturday) vs. NY Fed business hours (Monday)

Malware deployed on SWIFT terminal systems:
  EVTDIAG.exe: modifies SWIFT database tables to delete fraudulent outgoing message records
              -- reconciliation checks compare database to SWIFT network; modified DB hides fraud
  MSOUTC.exe: intercepts incoming SWIFT confirmation messages and modifies amounts shown
              -- operators checking confirmations see falsified amounts
  Printer interception tool: modifies printed confirmation reports
              -- physical paper audit trail shows falsified information

Attack execution (night of February 4-5, 2016):
  Bangladesh is in Fri-Sat weekend; NY Fed is open Monday (Feb 4 US time is still Feb 5 BD time)
  35 SWIFT MT 103/MT 202 messages sent, requesting $951 million total
  Beneficiary accounts: pre-opened at Rizal Commercial Banking Corp (RCBC), Manila Philippines
  NY Fed processed 5 transactions before flagging unusual volume: $101 million sent

Partial interception:
  $20M to Sri Lanka blocked: "Fandation" misspelling triggered manual review
  $81M to Philippines: processed and transferred to RCBC accounts

Philippine laundering:
  $81M withdrawn as Philippine Peso cash
  Funds converted to casino chips at Manila casinos
  Casinos cashed out, converted to cash
  Funds disappeared into Chinese-run gambling underground economy

Anti-forensics during attack:
  EVTDIAG deleted fraudulent SWIFT database records in real-time
  System event logs modified
  Bangladesh Bank's printer physically disconnected to prevent confirmation printing
  Network monitoring disabled on SWIFT segment</code></pre>

<h3>AppleJeus: macOS Cryptocurrency Malware (TraderTraitor Campaign)</h3>
<pre><code>AppleJeus Campaign Analysis (CISA AA21-048A + updates):

Target: macOS and Windows users at cryptocurrency companies and exchanges
Vector: Trojanized cryptocurrency trading applications

Infrastructure development:
  Lazarus creates convincing fake cryptocurrency trading or investment company
  Professional website, complete social media presence (Twitter/X, LinkedIn, GitHub)
  Published whitepaper and trading algorithm documentation
  "Free" trading application available for download on official company website
  Some variants: legitimate-looking mobile app also published

macOS-specific delivery and execution:
  Application distributed as signed DMG installer
  Early variants: self-signed or stolen certificate
  Later variants: valid Apple Developer certificate (obtained fraudulently)
  Notarized versions: passed Apple's automated notarization checks initially

Malware behavior (two-stage):
  Stage 1 (loader): Legitimate-appearing app that performs genuine trading functions
  Stage 1 check: Is this a cryptocurrency-relevant machine?
    Looks for: wallet software, exchange applications, large cryptocurrency holdings
    If not relevant: app operates normally, no malicious action (avoids detection)
  Stage 2 (if target confirmed): Downloads Manuscrypt or FALLCHILL RAT

macOS-specific capabilities exploited:
  Keychain access: steal all saved passwords and private certificates
  Keylogging: capture all keystrokes including wallet seed phrases
  Screenshot capture at intervals and on-demand
  Wallet file exfiltration: Electrum, Exodus, MetaMask browser extension storage
  Clipboard monitoring: detect and replace copied cryptocurrency addresses

Identified fake companies (documented):
  Celas Trade Pro, JMT Trading, Union Crypto, Kupay Wallet, CoinGoTrade
  All had professional-quality websites, active social media, some with community forums</code></pre>

<h3>BLINDINGCAN RAT: Advanced Backdoor</h3>
<pre><code>BLINDINGCAN Technical Profile (CISA Advisory AA20-239A):

Also known as: AIRDRY, ZetaNile
Primary targets: Defense contractors, government agencies, aerospace companies
Attribution: US CISA and FBI joint advisory attributed to Lazarus Group / DPRK

Architecture: Modular Windows backdoor with DLL sideloading persistence
Persistence: Sideloaded via legitimate signed Windows executables (LOLBin technique)

Documented command capabilities (25+ commands):
  File system: upload, download, delete, rename, change file attributes and timestamps
  Process: create new process, terminate process, list all running processes
  Registry: read, write, delete registry keys and values
  System info: hostname, username, OS version, network adapters, running processes, drives
  Screen capture: on-demand and scheduled screenshot delivery to C2
  Drive enumeration: list all drives including network shares
  Interactive shell: reverse shell with full command execution
  Self-management: update binary, self-destruct, modify beacon interval

C2 communication:
  Protocol: HTTP or HTTPS with custom RC4 encrypted payload
  Traffic camouflage: User-Agent strings match real browser versions
  Host headers: mimic legitimate CDN or cloud provider domains
  Beacon interval: randomized within operator-configured range

Anti-analysis:
  String obfuscation: XOR encoding with rotating key
  Code section encryption: decrypted only at runtime
  Anti-debugging: IsDebuggerPresent, timing checks, process environment analysis
  VM/sandbox detection: CPUID flags, hardware fingerprinting</code></pre>

<h3>3CX Supply Chain Attack (2023): Nested Compromise</h3>
<p>
  The 3CX attack demonstrated a new level of supply chain sophistication: a supply chain attack
  triggered by a previous supply chain attack. This "nested supply chain" represents the
  frontier of Lazarus Group capability as of 2023.
</p>
<pre><code>3CX Nested Supply Chain Attack (March 2023):

Step 1: Upstream supply chain compromise (X_TRADER software)
  Trading Technologies' X_TRADER software trojanized by Lazarus
  X_TRADER: used by professional commodity futures traders
  Trojanized installer distributed via Trading Technologies website
  A 3CX developer installed X_TRADER on their personal machine used for work

Step 2: 3CX development environment compromise
  Through the compromised developer's workstation, Lazarus accessed 3CX's build system
  ICONIC malware injected into 3CX Desktop App source or build artifacts
  Both Windows and macOS installers compromised
  3CX's legitimate code signing certificate used -- application appeared authentic

Step 3: Global deployment via auto-update
  3CX Desktop App: 600,000+ organizations, approximately 10 million users
  Auto-update mechanism deployed malicious version to all users globally
  No user interaction required beyond accepting automatic update

Step 4: Selective second-stage activation
  ICONIC malware: light beacon-only behavior initially
  Sends: system info, running processes, installed software to C2
  Lazarus reviews beacons and selectively delivers DAVESHELL/POOLRAT second stage
  Only deployed to confirmed cryptocurrency company targets (small fraction of 10M)
  Majority of infected systems: never received second stage, remained dormant

Discovery:
  CrowdStrike identified malicious behavior: March 29, 2023
  Mandiant traced root cause to X_TRADER: April 20, 2023
  Lesson: supply chains can be chained through multiple vendors</code></pre>

<h3>Cryptocurrency Laundering Pipeline</h3>
<pre><code>Lazarus Post-Theft Laundering Methodology:

Immediate (first 15-60 minutes post-theft):
  Distribute stolen funds across 100-500+ newly created wallets (structuring)
  Break large amounts into smaller chunks to reduce per-transaction visibility
  First-hop atomic swaps or DEX trades to obscure direct theft connection

Short-term (hours to days):
  Cross-chain bridges: convert ETH to BTC via THORChain, Ren Protocol, others
  DEX swaps: multiple token-to-token exchanges to create complex transaction graphs
  Tornado Cash (ETH mixer, OFAC sanctioned August 2022): pooled ETH mixed with others
  Bitcoin mixers: ChipMixer (seized FBI/Europol March 2023), others

Medium-term (weeks to months):
  OTC cryptocurrency brokers in East Asia (lax KYC environments)
  Peer-to-peer exchange platforms with minimal identity verification
  Conversion to Monero (privacy coin): breaks blockchain traceability entirely
  Nested exchanges: using unregistered exchanges inside legitimate ones

Long-term outcome:
  Funds reach DPRK state financial system as hard currency equivalent
  Estimated proportion recovered historically: less than 5% of total stolen

Blockchain analytics effectiveness:
  Chainalysis Reactor, Elliptic Lens, TRM Labs: can track most of the laundering path
  Effective intervention: alerting exchanges receiving tainted funds for account freezing
  Limitation: once in effective mixing protocol or converted to Monero, trail goes cold
  Bybit case: analysts tracked majority of funds but intervention impossible at scale</code></pre>
\`,
    defense: \`
<h2>Defending Against Lazarus Group: Crypto Security, Supply Chain Integrity, and Financial Controls</h2>

<h3>Understanding the Lazarus Threat Model</h3>
<p>
  Defending against Lazarus Group requires a fundamentally different threat model than most
  enterprise security programs assume. Lazarus is not primarily interested in your data —
  they want your <em>money</em>. For cryptocurrency exchanges, custodians, and DeFi protocols,
  this means the threat is potentially existential: a successful Lazarus attack can result in
  total loss of customer funds, regulatory action, and company failure. Bybit survived the
  $1.5 billion theft because it had sufficient reserve capital and a large user base to absorb
  the loss; many smaller organizations would not.
</p>
<p>
  Additionally, Lazarus Group demonstrates extreme patience, creativity, and willingness to
  attack the security controls themselves. The Bybit attack specifically targeted the multi-signature
  wallet interface — the exact mechanism designed to prevent unauthorized transfers. Defenders
  must continuously question whether their security controls might themselves be attack vectors,
  not just whether their controls are correctly implemented.
</p>

<h3>Cryptocurrency Exchange and Custodian Security</h3>
<pre><code>Cold Wallet Security Architecture for Cryptocurrency Custodians:

1. Hardware Security Modules (HSMs) for key management:
   Private keys must NEVER exist in software or on networked computers
   HSM options: Thales Luna, Utimaco SecurityServer, nCipher nShield
   Minimum standard: FIPS 140-2 Level 3 certified
   Key ceremony: generation witnessed by multiple authorized parties, video recorded
   Backup: keys backed up to separate HSM in physically separate location

2. Multi-signature wallet architecture:
   M-of-N signatures required (minimum 3-of-5 for significant holdings)
   Signers: geographically distributed on separate devices and networks
   Hardware wallets: Ledger or Trezor -- display actual transaction on hardware screen
   CRITICAL BYBIT LESSON: hardware wallet screen shows REAL transaction data
     The hardware wallet screen cannot be spoofed by malicious JavaScript
     Software UI can be compromised; hardware screen cannot

3. Transaction verification process (mandatory before signing):
   Each signer independently decodes the transaction using tools separate from the signing UI:
     a. Obtain raw transaction hash from the smart contract directly (not from UI)
     b. Decode transaction calldata using local ethers.js or web3.py tool
     c. Verify: recipient address character by character (not visual scan)
     d. Verify: amount, token type, and gas parameters match expectations
     e. Cross-reference with the source request (internal ticket, channel message)
     f. Only after independent verification: sign using hardware wallet
   This process would have prevented the Bybit hack -- the hardware screens would have
   shown the ACTUAL destination addresses, not the spoofed UI display

4. Signing workstation isolation:
   Dedicated signing computers: used exclusively for transaction signing
   No email, no web browsing, no other applications on signing machines
   Air-gapped or minimally connected to internet
   Operating system: hardened Linux with minimal attack surface
   Full disk encryption, physical security controls</code></pre>

<h3>The Bybit Lesson: Securing the Signing Interface</h3>
<p>
  The Bybit attack revealed a critical blind spot in the industry's multi-signature security model:
  the implicit assumption that the web interface displaying transaction details for signer review
  is trustworthy. This assumption is wrong, and defenses must now explicitly address the integrity
  of the signing UI itself.
</p>
<pre><code>Safe{Wallet} and Multi-Sig UI Integrity Controls:

1. Subresource Integrity (SRI) enforcement in web application:
   All loaded JavaScript files should have cryptographic integrity checks:
   &lt;script src="https://app.safe.global/static/js/main.chunk.js"
           integrity="sha384-[EXPECTED_HASH]"
           crossorigin="anonymous"&gt;&lt;/script&gt;
   Browser refuses to execute any script whose hash does not match
   SRI would have blocked the Bybit JavaScript injection at the browser level

2. Content Security Policy (CSP):
   Restrict which scripts may execute in the signing application:
   Content-Security-Policy: script-src 'self' 'sha256-[hash1]' 'sha256-[hash2]';
                            object-src 'none'; base-uri 'none';
   Block all inline scripts and unexpected external script sources

3. Independent transaction verification (separate from web UI):
   Implement local command-line verification tool for all signers:
   -- Example: local Node.js script using ethers.js to decode transactions
   const provider = new ethers.JsonRpcProvider(RPC_URL);
   const tx = await provider.getTransaction(txHash);
   const iface = new ethers.Interface(SAFE_ABI);
   const decoded = iface.parseTransaction({ data: tx.data });
   console.log("To:", decoded.args.to);
   console.log("Value:", ethers.formatEther(decoded.args.value));
   This uses a completely separate code path from the web UI -- immune to JS injection

4. Developer workstation security (Safe{Wallet} root cause):
   Company-managed devices only for developers working on wallet signing code
   AWS and cloud credentials: temporary STS tokens only, never stored long-term
   Code signing infrastructure: HSM-protected signing keys, never on developer machines
   Deployment pipeline: require two-person approval for any front-end asset deployment
   Monitor: alert on any changes to JavaScript assets served to signing UI</code></pre>

<h3>SWIFT Security: Financial Institution Controls</h3>
<p>
  SWIFT developed its Customer Security Programme (CSP) directly in response to the Bangladesh
  Bank heist and the wave of similar attacks that followed. Compliance with CSP mandatory controls
  is required for all SWIFT network participants, and the Bangladesh Bank lessons should inform
  any organization processing large-value interbank transfers.
</p>
<pre><code>SWIFT Customer Security Programme (CSP) Essential Controls:

1. Restrict internet access for SWIFT systems:
   SWIFT terminals on dedicated, isolated network segment
   No general internet browsing or email from SWIFT-connected systems
   All SWIFT traffic inspected at dedicated firewall

2. Separate SWIFT environment from general corporate IT:
   Dedicated VLAN with strict ACL permitting only necessary SWIFT protocols
   Physical isolation recommended for highest-value environments
   SWIFT Alliance Access: no shared infrastructure with general business systems

3. Mandatory MFA for all SWIFT operator access:
   Hardware token required (TOTP or FIDO2)
   No password-only authentication permitted
   Privileged access management for SWIFT administrator accounts

4. Real-time transaction anomaly detection:
   Monitor for: unusual transaction volume, off-hours activity,
                unusual beneficiary countries or institutions,
                transactions exceeding normal operational parameters
   Automated holds on: any transaction exceeding predefined threshold without dual approval
   Time-delayed execution: 30-minute delay on large transfers, allowing review

5. Physical confirmation controls (Bangladesh Bank lesson):
   SWIFT transaction confirmations: printed AND verified by independent operator immediately
   Printer: never disconnected or disabled during banking hours
   Reconciliation: outgoing SWIFT messages reconciled against database every 15 minutes
   Alert immediately: any reconciliation gap or missing confirmation

6. Incident response for SWIFT fraud:
   Know the SWIFT transaction recall procedure before an incident occurs
   Contact NY Fed, JP Morgan, or relevant correspondent immediately
   First 60 minutes is the window for potential transaction blocking</code></pre>

<h3>Defending Against Operation Dream Job: LinkedIn Spearphishing</h3>
<pre><code>Countermeasures for LinkedIn-Based Social Engineering:

Technical controls (endpoint):
  Sandbox all downloaded files before allowing execution
  Application allowlisting: only approved software may execute
  Block execution of files downloaded to default download locations for 24 hours
  Script blocking: PowerShell, VBScript, JavaScript execution requires explicit approval
  Alert on: new executable downloaded and run within 60 minutes on same machine

Email and communication monitoring:
  Monitor for internal messages referencing specific job offer documents
  Track: file downloads from LinkedIn CDN followed by execution events
  Alert on: communications referencing salary negotiation files, coding assessments

User awareness training (targeted at highest-risk roles):
  Educate: legitimate technology company recruiters do not send executable coding tests
  Educate: recruiters from major companies should be verifiable via that company's LinkedIn
  Red flags: urgency pressure, request for software installation as part of assessment,
             any "exclusive download link" from recruiter
  Process: verify any external recruiter independently via company's official website

Privileged user special controls:
  System administrators, finance team, key holders: highest-risk personnel
  Additional controls: EDR behavioral analytics, enhanced network monitoring
  Policy: privileged users do not conduct personal job searches on work devices
  Separation: work device policy prohibits personal social media during work hours</code></pre>

<h3>North Korean IT Worker Vetting Program</h3>
<p>
  The IT worker scheme requires specific verification procedures for any organization that
  hires remote workers, particularly in software development. Standard HR background checks
  are insufficient — North Korean workers have invested significant resources in creating
  convincing false identities.
</p>
<pre><code>IT Worker Verification Controls (FBI Guidance):

Identity verification:
  Government-issued ID verification via third-party service: Persona, Jumio, Onfido
  Video interview: conducted live on verified video platform, not pre-recorded
  Real-time verification: confirm candidate's face matches ID documents during video
  Reference verification: call references using independently found phone numbers
    (not numbers provided by the candidate)

Technical verification:
  Live coding interview with screen share (observe their development environment)
  Review GitHub commit history: genuine developers have consistent multi-year history
  Ask about region-specific items: tax filing processes, banking details for your country
  Technical questions about local employment law: North Korean workers often struggle here

Red flags per FBI and CISA guidance:
  Reluctance to appear on video or persistent excuses for camera unavailability
  Physical address matches known IT worker "laptop farm" locations (US addresses used as mail drops)
  Request to use personal computing equipment instead of company-issued hardware
  Request to redirect paycheck to multiple accounts or partial crypto payment
  Work hours inconsistent with stated time zone (works at 2am local time)
  Unusual access requests beyond defined job scope

Ongoing monitoring for placed contractors:
  Behavioral analytics on all remote contractor access patterns
  Alert on: access outside stated working hours, accessing systems outside job scope,
            unusual data downloads or transfers, use of VPN that obscures true location
  Quarterly re-verification: periodic identity confirmation check for all remote workers</code></pre>

<h3>DeFi Protocol Security</h3>
<pre><code>Securing Decentralized Finance Protocols Against Lazarus:

Smart contract security lifecycle:
  Multiple independent audits before mainnet deployment (minimum 2-3 from different firms)
  Formal verification for critical financial logic: Certora Prover, K Framework, Halmos
  Bug bounty: competitive program ($1M+ for critical -- Lazarus is your threat model)
  Time-locks: 24-48 hour delay on all governance changes before execution
  Upgrade patterns: avoid proxies if possible; if required, maximum delay + multisig

Operational key management:
  Admin keys in multi-sig Safe wallet with the verification process described above
  Emergency pause capability: can halt protocol within minutes if suspicious activity
  Timelock on large admin actions: even with valid multi-sig, 24h delay before execution
  Key rotation: regular rotation of signing keys, immediate rotation after any suspected compromise

Runtime monitoring and circuit breakers:
  Real-time on-chain monitoring: Forta Network, OpenZeppelin Defender, Chainalysis KYT
  Circuit breakers: automatic protocol pause if outflow exceeds X% of TVL in Y minutes
  Alert on: large single withdrawals, unusual token flow patterns, rapid sequential drains
  Bridge monitoring: cross-chain bridges are highest-value targets -- monitor constantly

Bridge-specific controls (Ronin/Axie lesson):
  Minimize TVL locked in bridges -- bridge only what is operationally necessary
  Distributed validator set: require minimum 5-of-9 validator signatures
  Validators: geographically distributed, organizationally independent
  Key storage: each validator's key in HSM or hardware wallet -- never software
  Monitoring: alert on any change to validator set or signing threshold</code></pre>

<h3>Incident Response for Cryptocurrency Theft</h3>
<pre><code>Responding to a Lazarus-Style Cryptocurrency Theft:

Immediate response (first 15 minutes -- critical window):
  Activate emergency halt on all outgoing transactions (circuit breaker)
  Preserve complete list of blockchain transaction IDs and wallet addresses
  Contact blockchain analytics firms immediately:
    Chainalysis: +1-855-CHAIN-07
    Elliptic: emergency@elliptic.co
    TRM Labs: trmimmediateresponse@trmlabs.com
  Speed matters: analytics firms can alert exchanges receiving tainted funds
    Exchanges may freeze deposits from specific addresses if alerted within minutes

Within first hour:
  Contact FBI Cyber Division: 1-800-CALL-FBI or submit via ic3.gov
    FBI has operational blockchain intelligence and exchange relationships
  Contact CISA: 888-282-0870
  Issue public statement if customer exchange: customers must be notified promptly
  Legal counsel: advise on disclosure obligations, OFAC compliance, liability

Blockchain coordination:
  Share attacking wallet addresses with all major exchanges immediately
  Request: KYT (Know Your Transaction) alerts from all analytics providers
  Monitor: mixing pool outputs, bridge activities, DEX trades from theft wallets
  Track on public dashboards: Etherscan, blockchain.info for public attribution

Regulatory and OFAC compliance:
  OFAC reporting: if you receive Lazarus-tainted funds, report and freeze immediately
  Safe harbor: organizations that unknowingly receive tainted funds and promptly report
               to OFAC may qualify for no-action treatment
  Do not interact further with tainted wallets: potential sanctions violation

Recovery expectations and lessons:
  Historical crypto theft recovery rate: under 5% of stolen value
  Best recovery outcomes: rapid exchange notification leading to account freezes
  FBI successes: Bitfinex recovery ($3.6B in 2022), Colonial Pipeline partial recovery
  Post-incident: complete security review, implement controls identified as gaps
  Disclosure: coordinate timing of public disclosure with law enforcement</code></pre>

<h3>OFAC Sanctions Compliance for Cryptocurrency Businesses</h3>
<p>
  Lazarus Group is designated as a Specially Designated National (SDN) by the US Treasury
  Office of Foreign Assets Control (OFAC). This designation has direct legal obligations for
  all cryptocurrency businesses operating in or with US persons:
</p>
<ul>
  <li>
    <strong>Transaction screening requirement</strong>: All cryptocurrency businesses must screen
    transactions against OFAC's SDN list and associated wallet addresses. Blockchain analytics
    integration (Chainalysis, Elliptic, TRM Labs) is the practical implementation of this requirement.
  </li>
  <li>
    <strong>Tornado Cash precedent (August 2022)</strong>: OFAC sanctioned Tornado Cash for its role
    in laundering Lazarus Group proceeds. This created compliance obligations for any protocol that
    interacts with Tornado Cash contracts — demonstrating that sanctions can apply to smart contracts,
    not just persons.
  </li>
  <li>
    <strong>DeFi protocol obligations</strong>: OFAC's enforcement guidance suggests that DeFi
    protocols with any US nexus must implement sanctions screening, even if fully decentralized
    in technical architecture.
  </li>
  <li>
    <strong>Prompt disclosure protection</strong>: Organizations that unknowingly receive Lazarus-tainted
    funds and promptly report to OFAC and law enforcement can seek enforcement discretion. Prompt
    reporting is essential — do not wait to understand the full scope before notifying authorities.
  </li>
</ul>
<p>
  The Lazarus Group threat illustrates a fundamental truth about state-sponsored cybercrime: when
  a nation-state makes financial cybercrime a strategic priority and protects its operators from
  any legal consequence, the scale and sophistication of attacks will continuously grow. No single
  organization can defend perfectly against a state actor with essentially unlimited patience and
  the full resources of a national intelligence service. The response must be collective — through
  international law enforcement cooperation, industry-wide threat intelligence sharing, regulatory
  standards for security practices, and diplomatic pressure on North Korea's enablers. Individual
  organizations must implement the strongest feasible controls while building the detection, response,
  and recovery capabilities to survive the attacks that prevention alone will not stop.
</p>
\`,
  },`;

// ── Find line boundaries ──────────────────────────────────────────────────────
function findBlock(linesArr, startKeyword, startFrom = 0) {
  let start = -1;
  for (let i = startFrom; i < linesArr.length; i++) {
    if (linesArr[i].includes(startKeyword)) { start = i; break; }
  }
  if (start === -1) throw new Error('Start not found: ' + startKeyword);
  let end = -1;
  for (let i = start + 5; i < linesArr.length; i++) {
    if (linesArr[i].trim() === '},') { end = i + 1; break; }
  }
  if (end === -1) throw new Error('End not found for: ' + startKeyword);
  return { start, end };
}

// ── Perform replacements ──────────────────────────────────────────────────────
let working = lines;

// Replace lazarus first (highest line number, so won't affect lower positions)
const laz = findBlock(working, "'lazarus-group'");
console.log('Lazarus block:', laz.start, '-', laz.end);
working = [
  ...working.slice(0, laz.start),
  ...lazarusBlock.split('\n'),
  ...working.slice(laz.end)
];

// Recalculate apt41 position in new array
const apt41 = findBlock(working, "'apt41-profile'");
console.log('APT41 block:', apt41.start, '-', apt41.end);
working = [
  ...working.slice(0, apt41.start),
  ...apt41Block.split('\n'),
  ...working.slice(apt41.end)
];

// Recalculate salt-typhoon position
const salt = findBlock(working, "'salt-typhoon-deep-dive'");
console.log('Salt Typhoon block:', salt.start, '-', salt.end);
working = [
  ...working.slice(0, salt.start),
  ...saltBlock.split('\n'),
  ...working.slice(salt.end)
];

const final = working.join('\n');
writeFileSync(filePath, final, 'utf8');
console.log('Success! Written', final.length, 'chars,', working.length, 'lines');
