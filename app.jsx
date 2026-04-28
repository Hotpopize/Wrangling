/* global React, BrandMark, VelocityChart, VelocityArrow, QRCode, Sparkline */
const { useState, useEffect, useRef, useCallback } = React;

const STAGES = [
  { id: 0, label: "Frontier", time: "0:00" },
  { id: 1, label: "Lasso",    time: "0:05" },
  { id: 2, label: "Reveal",   time: "0:06" },
  { id: 3, label: "Strategy", time: "0:15" },
  { id: 4, label: "Staging",  time: "0:30" },
  { id: 5, label: "Handoff",  time: "0:60" },
];

const HOOKS = [
  { name: "Tutorial · Step-through", desc: "How-to with on-screen captions", lift: "+22%" },
  { name: "POV · First Frame Hook",  desc: "Direct-address opener under 2s",  lift: "+17%" },
  { name: "Reveal · Pattern Break",  desc: "Visual twist between 3–5s",        lift: "+14%" },
];

const KPIS = [
  { label: "Engagement Velocity", value: "8.4k/hr", delta: "▲ 12.3%", spark: [30, 42, 38, 51, 47, 64, 78] },
  { label: "Audience Retention",  value: "63.2%",   delta: "▲ 4.1%",  spark: [40, 42, 48, 51, 56, 60, 63] },
  { label: "Avg. Watch Time",     value: "21.7s",   delta: "▲ 8.0%",  spark: [12, 14, 18, 17, 19, 20, 22] },
  { label: "Hook Rate",           value: "71.4%",   delta: "▼ 1.2%", spark: [76, 74, 75, 73, 72, 70, 71], down: true },
];

const NEW_IDEAS = [
  { tag: "TUTORIAL", title: "3-step preset stack for golden-hour shots", meta: "0:32 · Vert" },
  { tag: "TUTORIAL", title: "Locking white balance without an app",       meta: "0:48 · Vert" },
  { tag: "TUTORIAL", title: "Layering b-roll on a single take",           meta: "0:41 · Vert" },
];

const SCRIPT = [
  { num: "Hook · 0:00", text: "Stop scrolling — your colour grade is leaking 22% of your retention. Here's the fix in three frames.", beat: false },
  { num: "Beat · 0:08", text: "Frame 1 — drop your raw clip into Wrang. Locally cached, zero latency.", beat: true },
  { num: "Beat · 0:18", text: "Frame 2 — pull the dominant palette and stack the suggested LUT.", beat: true },
  { num: "Beat · 0:26", text: "Frame 3 — preview against your top hooks. If the radar reads urgent, ship it.", beat: true },
  { num: "CTA · 0:30", text: "Save this for your next post. Comment LUT and I'll send the file.", beat: false },
];

function Topbar({ stage, setStage, user, onAuthClick, onSignOut }) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark"><BrandMark /></div>
        <div className="brand-name">wrang<span className="accent">.</span></div>
        <div className="brand-tag">Local · No Backend</div>
      </div>
      <div className="timeline-wrap">
        <div className="timeline-clock">{STAGES[stage].time}</div>
        <div className="timeline-track">
          <div className="timeline-fill" style={{ width: `${(stage / (STAGES.length - 1)) * 100}%` }}></div>
          {STAGES.map((s, i) => (
            <div
              key={s.id}
              className={`timeline-step ${i === stage ? "active" : ""} ${i < stage ? "past" : ""}`}
              style={{ left: `${(i / (STAGES.length - 1)) * 100}%` }}
              onClick={() => setStage(i)}
              title={s.label}
            >
              <div className="timeline-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="topbar-actions">
        <button className="btn-ghost" onClick={() => setStage(0)}>↺ Restart</button>
        <button className="btn-ghost" onClick={() => setStage(Math.min(STAGES.length - 1, stage + 1))}>Next →</button>
        {user ? (
          <div className="user-chip" onClick={onSignOut} title="Sign out">
            <div className="avatar">{(user.name || "U")[0].toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{user.name}</div>
              <div className="tier">{user.tier}</div>
            </div>
          </div>
        ) : (
          <button className="btn-ghost" onClick={onAuthClick} style={{ color: "var(--cyan)", borderColor: "var(--rule-strong)" }}>Sign in</button>
        )}
      </div>
    </div>
  );
}

const HOW_STEPS = [
  { step: "01 · Drop",    title: "Drag in your export",     text: "Pull TikTok or Instagram CSV / JSON straight from your downloads. Nothing uploads — Wrang parses inside a Web Worker on your machine.", icon: "drop" },
  { step: "02 · Wrangle", title: "Get instant insight",      text: "50,000-row exports parse in under 200ms. See engagement velocity, retention curves, and your top-performing hooks in one glance.", icon: "chart" },
  { step: "03 · Stage",   title: "Cache video locally",      text: "Drop raw clips into the Staging Pen. They cache to OPFS so you can scrub, preview, and toggle safe-zones with zero latency.", icon: "stack" },
  { step: "04 · Ride",    title: "Hand off to your phone",   text: "Generate a peer-to-peer QR. Scan, pull the file natively, post from the platform's own app for the friendliest algorithm signal.", icon: "qr" },
];

const PROOF_STATS = [
  { num: "12,400+", lbl: "Creators on the trail" },
  { num: "2.3 PB",  lbl: "Cached locally · last 30d" },
  { num: "0",       lbl: "Bytes ever sent to a server" },
  { num: "187ms",   lbl: "Median parse · 50k rows" },
];

const TESTIMONIALS = [
  { quote: "We dropped Wrang into our agency stack and killed three SaaS subs in a week. The Rodeo Board moved faster than anything cloud-hosted we've used.", name: "Maren Holzer", role: "Founder · Halftone Studio", initial: "M" },
  { quote: "The fact that nothing leaves the browser is a legal-team dream. We onboarded six brand clients without a single DPA review.", name: "Ezekiel Vance",  role: "Strategy Lead · Northwind Co.", initial: "E" },
  { quote: "Vibe Check + Color Corral feel like cheat codes. I script tighter, I grade faster, and my retention is up 31% this quarter.", name: "Priya Solanki",   role: "Creator · 480k followers", initial: "P" },
];

const PARTNERS = ["LONESTAR", "HALFTONE", "NORTHWIND", "SADDLEUP", "MERIDIAN", "WAYPOINT"];

const TIERS = [
  {
    name: "Lone Ranger", handle: "Free", price: "0", per: "forever",
    cta: "Start riding", featured: false,
    features: [
      "Basic CSV / JSON parsing",
      "Calendar view · single workspace",
      "Image preloading",
      "Manual copy / paste publishing",
    ],
    foot: "No card · no email required",
  },
  {
    name: "Wrangler", handle: "Pro", price: "18", per: "/ month",
    cta: "Start free trial", featured: true, badge: "MOST POPULAR",
    features: [
      "Full OPFS video caching · up to 200 GB",
      "Weekly AI strategy generation",
      "Kanban board + Calendar grid",
      "QR Code Mobile Sync",
      "Color Corral & Vibe Check (beta)",
    ],
    foot: "Billed annually · or $24 monthly",
  },
  {
    name: "Rancher", handle: "Agency", price: "64", per: "/ seat",
    cta: "Start team trial", featured: false,
    features: [
      "Multiple isolated client workspaces",
      "Custom AI brand voices",
      "White-labeled PDF exports",
      "Opt-in encrypted local-to-cloud backups",
      "Priority support · onboarding call",
    ],
    foot: "Min. 3 seats · billed annually",
  },
  {
    name: "Syndicate", handle: "Enterprise", price: "—", per: "custom",
    cta: "Talk to sales", featured: false,
    features: [
      "Peer-to-peer sync via WebRTC + CRDTs",
      "Bring-Your-Own-Key for any LLM",
      "Total UI white-labeling",
      "SSO · SOC 2 audit reports",
      "Dedicated solutions architect",
    ],
    foot: "Custom contract · annual",
  },
];

function HowIcon({ kind }) {
  if (kind === "drop") return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3v10M7 9l4 4 4-4M3 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (kind === "chart") return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 18h16M5 14l4-5 4 3 5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (kind === "stack") return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="4" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><path d="M6 16h10M7 19h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
  if (kind === "qr") return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.6"/><rect x="13" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="13" width="6" height="6" stroke="currentColor" strokeWidth="1.6"/><path d="M13 13h2v2h-2zM17 13h2v2h-2zM13 17h2v2h-2zM17 17h2v2h-2z" fill="currentColor"/></svg>;
  return null;
}

function FrontierStage({ active, onDrop }) {
  const [hover, setHover] = useState(false);
  const [lasso, setLasso] = useState(false);
  const ref = useRef(null);
  const scrollRef = useRef(null);

  const trigger = () => {
    setLasso(true);
    setTimeout(() => onDrop(), 700);
  };
  const onDragOver = (e) => { e.preventDefault(); setHover(true); };
  const onDragLeave = () => setHover(false);
  const onDropEv = (e) => { e.preventDefault(); setHover(false); trigger(); };

  // reset scroll when stage activates
  useEffect(() => {
    if (active && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [active]);

  const scrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: scrollRef.current.clientHeight - 60, behavior: "smooth" });
    }
  };

  return (
    <div className={`stage-inner ${active ? "active" : ""}`}>
      <div className="frontier-scroll" ref={scrollRef} data-screen-label="01 Frontier">

        {/* Hero */}
        <div className="frontier" data-screen-label="01a Hero">
          <div className="frontier-hero">
            <div className="frontier-eyebrow">The Neon Frontier · 00:00</div>
            <h1 className="frontier-h1">
              <span className="glow">Corral your data.</span><br/>
              <span className="strike">No APIs.</span> <span className="glow">No waiting.</span>
            </h1>
            <p className="frontier-sub">Drop a TikTok or Instagram analytics export. Wrangling happens locally — your CSV never leaves the browser.</p>
          </div>

          <div
            ref={ref}
            className={`dropzone ${hover ? "hover" : ""} ${lasso ? "lasso" : ""}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDropEv}
            onClick={trigger}
          >
            <div className="dropzone-corner tl"></div>
            <div className="dropzone-corner tr"></div>
            <div className="dropzone-corner bl"></div>
            <div className="dropzone-corner br"></div>
            <div className="dropzone-content">
              <div className="dropzone-icon">
                <div className="dropzone-icon-ring"></div>
                <div className="dropzone-icon-ring b"></div>
              </div>
              <div className="dropzone-title">Drop your analytics export</div>
              <div className="dropzone-sub">.CSV  ·  .JSON  ·  .ZIP up to 2 GB</div>
              <div className="dropzone-hint">— or click to browse —</div>
            </div>
          </div>

          <div className="frontier-foot">
            <span><span className="dot"></span>OPFS ready · 14.2 GB free</span>
            <span><span className="dot"></span>Web Worker · idle</span>
            <span><span className="dot"></span>WebGPU · detected</span>
          </div>

          <div className="scroll-cue" onClick={scrollDown} style={{ cursor: "pointer", pointerEvents: "auto" }}>
            <span>Scroll · Learn how it rides</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v9M3 7l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        {/* How it works */}
        <section className="section" data-screen-label="01b How">
          <div className="section-eyebrow">How it rides</div>
          <h2 className="section-h2">Four steps from raw export to <span className="accent">native post.</span></h2>
          <p className="section-sub">No accounts, no rate limits, no waiting on cloud parsers. The browser is the backend — your machine does the work.</p>
          <div className="how-grid">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="how-card">
                <div className="step">{s.step}</div>
                <div className="icon"><HowIcon kind={s.icon} /></div>
                <div className="title">{s.title}</div>
                <div className="text">{s.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section className="section" data-screen-label="01c Proof">
          <div className="section-eyebrow">Trusted on the trail</div>
          <h2 className="section-h2">Wranglers, ranchers, and one-person shops <span className="accent">ride with us.</span></h2>

          <div className="proof-strip">
            {PROOF_STATS.map((p, i) => (
              <div key={i} className="proof-stat">
                <div className="num mono">{p.num}</div>
                <div className="lbl">{p.lbl}</div>
              </div>
            ))}
          </div>

          <div className="testimonial-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial">
                <div className="quote">{t.quote}</div>
                <div className="who">
                  <div className="avatar">{t.initial}</div>
                  <div className="meta">
                    <div className="name">{t.name}</div>
                    <div className="role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="logo-bar">
            {PARTNERS.map(p => (
              <div key={p} className="logo-mark">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/></svg>
                {p}
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="section" data-screen-label="01d Pricing">
          <div className="section-eyebrow">Saddle up</div>
          <h2 className="section-h2">Free until you outgrow it. <span className="accent">Honest pricing</span> after.</h2>
          <p className="section-sub">Because compute lives on your machine, hosting you costs us nothing. The free tier is permanent — paid tiers unlock the AI brains and team features.</p>

          <div className="pricing-grid">
            {TIERS.map((t, i) => (
              <div key={i} className={`tier ${t.featured ? "featured" : ""}`}>
                {t.badge && <div className="tier-badge">{t.badge}</div>}
                <div className="tier-name">{t.name}</div>
                <div className="tier-handle">{t.handle}</div>
                <div className="tier-price">
                  {t.price !== "—" && <span className="currency">$</span>}
                  <span className="num">{t.price}</span>
                  <span className="per">{t.per}</span>
                </div>
                <div className="tier-billing">{t.foot}</div>
                <button className="tier-cta">{t.cta}</button>
                <ul className="tier-features">
                  {t.features.map((f, j) => (
                    <li key={j}>
                      <svg className="ck" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="payment-strip">
            <span className="lbl">We accept</span>
            <span className="pay-chip">VISA</span>
            <span className="pay-chip">MASTERCARD</span>
            <span className="pay-chip">AMEX</span>
            <span className="pay-chip">APPLE PAY</span>
            <span className="pay-chip">GOOGLE PAY</span>
            <span className="pay-chip">STRIPE</span>
            <span className="pay-chip" style={{ color: "var(--mint)", borderColor: "rgba(124,255,178,0.3)" }}>BTC · ETH</span>
          </div>
        </section>

        {/* Final CTA */}
        <section data-screen-label="01e CTA">
          <div className="cta-band">
            <h3>Ready to <span className="accent">ride the frontier?</span></h3>
            <p>Drop a CSV in the next sixty seconds. By the end of this minute you'll have a strategy, a cached preview, and a QR ready for your phone.</p>
            <button className="btn-primary" onClick={() => { scrollRef.current.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12V2M3 6l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to the drop zone
            </button>
          </div>
          <div className="frontier-footer">
            <span>© 2026 WRANG · LOCAL-FIRST CONTENT WORKSTATION</span>
            <span>SAN ANTONIO · BERLIN · OSLO</span>
            <span>STATUS · ALL SYSTEMS LOCAL</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function LassoStage({ active }) {
  // file flying into center, then arrow strike
  return (
    <div className={`stage-inner ${active ? "active" : ""}`}>
      <div className="frontier" style={{ pointerEvents: "none" }}>
        <div className="frontier-hero" style={{ opacity: 0.45 }}>
          <div className="frontier-eyebrow">Lassoing · 00:05</div>
          <h1 className="frontier-h1">
            <span className="glow">Parsed in</span> <span className="strike">milliseconds.</span>
          </h1>
        </div>

        <div className={`dropzone lasso`} style={{ pointerEvents: "none" }}>
          <div className="dropzone-corner tl"></div>
          <div className="dropzone-corner tr"></div>
          <div className="dropzone-corner bl"></div>
          <div className="dropzone-corner br"></div>
          <div className="dropzone-content" style={{ opacity: 0.4 }}>
            <div className="dropzone-title">Engaging Web Worker…</div>
          </div>

          {active && (
            <>
              <div className="lasso-file" style={{ left: "50%", top: "50%", animation: "fade-in 0.3s ease-out both" }}>
                <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
                  <path d="M4 2h16l8 8v26a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="#22d3ee" strokeWidth="1.5" fill="rgba(34,211,238,0.08)"/>
                  <path d="M20 2v8h8" stroke="#22d3ee" strokeWidth="1.5"/>
                  <text x="16" y="26" textAnchor="middle" fill="#22d3ee" fontSize="6" fontFamily="JetBrains Mono">CSV</text>
                </svg>
                <div>tiktok_export.csv</div>
                <div style={{ color: "#7cffb2" }}>50,247 ROWS</div>
              </div>
              <div className="velocity-arrow" style={{ left: "calc(50% - 110px)", top: "50%", transform: "translateY(-50%)", animation: "fade-in 0.4s 0.2s ease-out both" }}>
                <VelocityArrow />
              </div>
            </>
          )}
        </div>

        <div className="frontier-foot">
          <span style={{ color: "#7cffb2" }}><span className="dot"></span>WORKER · 50,247 rows · 142ms</span>
          <span><span className="dot"></span>OPFS · staged</span>
          <span><span className="dot"></span>Privacy · 100% local</span>
        </div>
      </div>
    </div>
  );
}

function RodeoStage({ active, onPromptStrategy, drawerOpen }) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (active) {
      const t = setTimeout(() => setShowToast(true), 700);
      const t2 = setTimeout(() => setShowToast(false), 5500);
      return () => { clearTimeout(t); clearTimeout(t2); };
    } else {
      setShowToast(false);
    }
  }, [active]);

  return (
    <div className={`stage-inner ${active ? "active" : ""}`}>
      <div className="rodeo">
        {/* Left — Wrangler */}
        <div className="panel slide-up">
          <div className="panel-header">
            <div className="panel-title"><span className="num">01</span> Data Wrangler</div>
            <div className="panel-meta">LOCAL</div>
          </div>
          <div className="panel-body">
            <div className="wrangler-card">
              <div className="filename">tiktok_export_2026-04.csv</div>
              <div className="filesize">4.8 MB · 50,247 ROWS · PARSED 142MS</div>
            </div>
            <div className="wrangler-stat"><span className="k">Posts</span><span className="v">1,284</span></div>
            <div className="wrangler-stat"><span className="k">Window</span><span className="v">90 d</span></div>
            <div className="wrangler-stat"><span className="k">Avg. Reach</span><span className="v up">14.2k</span></div>
            <div className="wrangler-stat"><span className="k">Top Format</span><span className="v">Tutorial</span></div>
            <div className="wrangler-stat"><span className="k">Storage</span><span className="v">OPFS</span></div>
            <div style={{ marginTop: 14 }}>
              <span className="privacy-pill">100% On-Device</span>
            </div>
          </div>
        </div>

        {/* Center — Analyzer */}
        <div className="analyzer">
          <div className="kpi-row slide-up" style={{ animationDelay: "0.1s" }}>
            {KPIS.map((k, i) => (
              <div key={i} className="kpi">
                <div className="label">{k.label}</div>
                <div className="value">{k.value}</div>
                <div className={`delta ${k.down ? "down" : ""}`}>{k.delta}</div>
                <div className="spark"><Sparkline points={k.spark} color={k.down ? "#fb7185" : "#7cffb2"} /></div>
              </div>
            ))}
          </div>

          <div className="chart-wrap slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="chart-head">
              <div className="title">Engagement Velocity × Retention · last 7 days</div>
              <div className="legend">
                <span><span className="swatch" style={{ background: "#22d3ee" }}></span>Velocity</span>
                <span><span className="swatch" style={{ background: "#7cffb2" }}></span>Retention</span>
              </div>
            </div>
            <VelocityChart />
          </div>

          <div className="panel slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="panel-header">
              <div className="panel-title"><span className="num">02</span> Top-Performing Hooks · last 30 d</div>
              <div className="panel-meta">3 / 47</div>
            </div>
            <div className="panel-body">
              <div className="hooks-list">
                {HOOKS.map((h, i) => (
                  <div key={i} className="hook">
                    <div className="rank">0{i + 1}</div>
                    <div className="name">{h.name}<span className="desc">{h.desc}</span></div>
                    <div className="lift">{h.lift}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — Strategy CTA */}
        <div className="panel slide-up" style={{ animationDelay: "0.15s" }}>
          <div className="panel-header">
            <div className="panel-title"><span className="num">03</span> Next Move</div>
            <div className="panel-meta">AI · IDLE</div>
          </div>
          <div className="panel-body">
            <div style={{ fontSize: 13, color: "var(--ink-dim)", lineHeight: 1.55, marginBottom: 16 }}>
              Wrang has analysed <span style={{ color: "var(--cyan)" }} className="mono">50,247</span> rows. Tutorial formats are your strongest signal this month.
            </div>
            <button className="ai-prompt-cta" onClick={onPromptStrategy}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3 3l2 2M11 11l2 2M3 13l2-2M11 5l2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="8" r="2.5" fill="currentColor"/>
              </svg>
              Generate Next Week's Strategy
            </button>
            <div style={{ marginTop: 14, fontFamily: "JetBrains Mono", fontSize: 10, color: "var(--ink-faint)", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.6 }}>
              Local metadata anonymised · routed to your BYOK LLM · zero PII transmitted
            </div>
          </div>
        </div>

        {/* Toast */}
        <div className={`toast ${showToast ? "show" : ""}`}>
          <div className="check">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="text">
            Data wrangled locally.
            <small>Your privacy is secured · 0 bytes uploaded</small>
          </div>
        </div>
      </div>

      <AIDrawer open={drawerOpen} />
    </div>
  );
}

function AIDrawer({ open }) {
  const [checked, setChecked] = useState([true, true, true]);
  const toggle = (i) => setChecked(c => c.map((v, j) => j === i ? !v : v));
  return (
    <div className={`drawer ${open ? "open" : ""}`}>
      <div className="drawer-head">
        <div className="drawer-eyebrow">AI Strategist · 0:15</div>
        <div className="drawer-title">I noticed something on your tape.</div>
        <div className="drawer-sub">Tutorial formats gave you a <span style={{ color: "var(--mint)" }} className="mono">+22%</span> bump in retention last month. Want me to script three more for next week?</div>
      </div>
      <div className="drawer-body">
        <div className="ai-bubble">
          Top-3 best-performing hooks pulled from your local data. Each will be drafted in your tone — no scraping, no upload. Confirm the ones you want me to expand:
        </div>
        <div className="checklist">
          {HOOKS.map((h, i) => (
            <div key={i} className={`check-item ${checked[i] ? "checked" : ""}`} onClick={() => toggle(i)}>
              <div className="box">
                {checked[i] && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#0b192c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div className="label">
                {h.name}
                <small>{h.desc} · {h.lift} retention</small>
              </div>
            </div>
          ))}
        </div>
        <div className="ai-bubble" style={{ borderColor: "rgba(124,255,178,0.3)", background: "rgba(124,255,178,0.05)" }}>
          <div style={{ fontSize: 12, color: "var(--mint)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }} className="mono">PAYLOAD PREVIEW · 1.4 KB</div>
          aggregated.metrics → format=tutorial, retention_p50=64, hook_lift=+22, week_window=4 · zero PII
        </div>
      </div>
      <div className="drawer-foot">
        <button className="btn-secondary">Adjust prompt</button>
        <button className="btn-primary">Yes — script 3 more</button>
      </div>
    </div>
  );
}

function StagingStage({ active, onOpenCorral }) {
  const [selected, setSelected] = useState(0);
  const [safezones, setSafezones] = useState({ caption: true, action: true, side: false });
  const [videoLoaded, setVideoLoaded] = useState(true);

  return (
    <div className={`stage-inner ${active ? "active" : ""}`}>
      <div className="staging">
        {/* Left — kanban Ideation column */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><span className="num">04</span> Rodeo Board</div>
            <div className="panel-meta">SPRING · APR</div>
          </div>
          <div className="kanban">
            <div className="kanban-col-head">
              <div className="name">Ideation</div>
              <div className="count">3 NEW</div>
            </div>
            {NEW_IDEAS.map((idea, i) => (
              <div
                key={i}
                className={`idea-card new ${selected === i ? "selected" : ""}`}
                style={{ animationDelay: `${i * 0.12}s` }}
                onClick={() => setSelected(i)}
              >
                <div className="tag">{idea.tag}</div>
                <div className="title">{idea.title}</div>
                <div className="meta">
                  <span>{idea.meta}</span>
                  <span style={{ color: "var(--mint)" }}>AI · 0.{i + 1}s</span>
                </div>
              </div>
            ))}
            <div className="kanban-col-head" style={{ marginTop: 10 }}>
              <div className="name">In Staging</div>
              <div className="count">1</div>
            </div>
            <div className="idea-card" style={{ opacity: 0.7 }}>
              <div className="tag" style={{ color: "var(--cyan)", background: "rgba(34,211,238,0.1)" }}>POV</div>
              <div className="title">Lens-flare hack for direct-to-camera</div>
              <div className="meta"><span>0:24 · Vert</span><span>READY</span></div>
            </div>
          </div>
        </div>

        {/* Center — vertical preview */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><span className="num">05</span> Staging Pen · Preview</div>
            <div className="panel-meta">OPFS · CACHED</div>
          </div>
          <div className="preview-stage">
            <div className="preview-frame">
              {!videoLoaded && (
                <div className="preview-placeholder">
                  <div>
                    <div className="big">▶</div>
                    <div>9 : 16 · 60s</div>
                    <div style={{ marginTop: 14, opacity: 0.5 }}>drop raw clip to cache</div>
                  </div>
                </div>
              )}
              {videoLoaded && (
                <div className="preview-placeholder" style={{ alignItems: "flex-end", justifyContent: "center", paddingBottom: 24 }}>
                  <div>
                    <div className="big">▶</div>
                    <div style={{ color: "var(--mint)" }}>your_raw_take_03.mp4</div>
                    <div style={{ marginTop: 6, opacity: 0.6 }}>00:32 · 184 MB · cached locally</div>
                  </div>
                </div>
              )}

              {/* Safe-zones (abstracted, original framing — not platform UI) */}
              <div className={`safezone safezone-top ${safezones.caption ? "show" : ""}`}>
                <div className="safezone-label">CAPTION SAFE</div>
              </div>
              <div className={`safezone safezone-bottom ${safezones.action ? "show" : ""}`}>
                <div className="safezone-label">ACTION BAR · KEEP CLEAR</div>
              </div>
              <div className={`safezone safezone-right ${safezones.side ? "show" : ""}`}>
                <div className="safezone-label">UI</div>
              </div>
            </div>

            <div className="preview-controls">
              <div className={`preview-toggle ${safezones.caption ? "on" : ""}`} onClick={() => setSafezones(s => ({ ...s, caption: !s.caption }))}>
                <div className="switch"></div>Caption
              </div>
              <div className={`preview-toggle ${safezones.action ? "on" : ""}`} onClick={() => setSafezones(s => ({ ...s, action: !s.action }))}>
                <div className="switch"></div>Action
              </div>
              <div className={`preview-toggle ${safezones.side ? "on" : ""}`} onClick={() => setSafezones(s => ({ ...s, side: !s.side }))}>
                <div className="switch"></div>Side rail
              </div>
            </div>

            <div className="video-drop" onClick={() => setVideoLoaded(true)}>
              <div className="label">+ Drop new raw clip</div>
              <div className="hint">Cached to OPFS · plays instantly</div>
            </div>

            <button className="corral-trigger" onClick={onOpenCorral}>
              <span className="swatch"></span>
              Open Color Corral
            </button>
          </div>
        </div>

        {/* Right — script & publish */}
        <div className="panel script-panel">
          <div className="panel-header">
            <div className="panel-title"><span className="num">06</span> AI-Drafted Script</div>
            <div className="panel-meta">EDIT · 5 BEATS</div>
          </div>
          <div className="script-body">
            {SCRIPT.map((s, i) => (
              <div key={i} className={`script-section ${s.beat ? "beat" : ""}`}>
                <div className="num">{s.num}</div>
                <div className="text">{s.text}</div>
              </div>
            ))}
          </div>
          <div className="caption-box">
            <div className="label">Caption · 158 / 2200</div>
            <div className="caption">3 frames to fix your colour grade ↓ save this for golden-hour week. #presetstack #colorcorral</div>
            <button className="publish-btn">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Ready to Ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HandoffStage({ active }) {
  return (
    <div className={`stage-inner ${active ? "active" : ""}`}>
      <div className="handoff">
        <div className="handoff-pad slide-up">
          <div className="handoff-left">
            <div className="handoff-eyebrow"><span className="pulse"></span>Local Beam · Awaiting scan</div>
            <h2 className="handoff-h2">
              Scan with your phone.<br/>
              <span className="accent">Post natively.</span>
            </h2>
            <p className="handoff-sub">
              Your video and AI caption are bundled into a peer-to-peer payload — no cloud relay. Scan to pull the file straight to your handset and post from your native app.
            </p>

            <div className="handoff-meta">
              <div className="row"><span className="k">Payload</span><span className="v mono">your_raw_take_03.mp4 · 184 MB</span></div>
              <div className="row"><span className="k">Caption</span><span className="v mono">158 chars · 4 hashtags</span></div>
              <div className="row"><span className="k">Channel</span><span className="v mono">WebRTC · LAN-direct</span></div>
              <div className="row"><span className="k">Expires</span><span className="v mono">04:58</span></div>
            </div>

            <div className="handoff-actions">
              <button className="btn-primary" style={{ flex: "0 0 auto", padding: "10px 18px" }}>Copy magic link</button>
              <button className="btn-secondary">Email to client</button>
            </div>
          </div>

          <div className="handoff-right">
            <QRCode />
            <div className="qr-caption">wrang.local · payload-7f3a · 1m</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [stage, setStage] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [corralOpen, setCorralOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wrang_user")) || null; } catch { return null; }
  });

  useEffect(() => {
    if (stage === 1) {
      const t = setTimeout(() => setStage(2), 1100);
      return () => clearTimeout(t);
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== 2 && stage !== 3) setDrawerOpen(false);
    if (stage === 3) setDrawerOpen(true);
  }, [stage]);

  const onDropFile = () => setStage(1);
  const onPromptStrategy = () => { setDrawerOpen(true); setStage(3); };

  const onAuth = (u) => {
    setUser(u);
    try { localStorage.setItem("wrang_user", JSON.stringify(u)); } catch {}
    setAuthOpen(false);
  };
  const onSignOut = () => {
    setUser(null);
    try { localStorage.removeItem("wrang_user"); } catch {}
  };

  return (
    <div className="app">
      <Topbar stage={stage} setStage={setStage} user={user} onAuthClick={() => setAuthOpen(true)} onSignOut={onSignOut} />
      <div className="stage" data-screen-label={`0${stage + 1} ${STAGES[stage].label}`}>
        <FrontierStage active={stage === 0} onDrop={onDropFile} />
        <LassoStage active={stage === 1} />
        <RodeoStage active={stage === 2 || stage === 3} onPromptStrategy={onPromptStrategy} drawerOpen={drawerOpen && stage === 3} />
        <StagingStage active={stage === 4} onOpenCorral={() => setCorralOpen(true)} />
        <HandoffStage active={stage === 5} />
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuth={onAuth} />
      <ColorCorral open={corralOpen} onClose={() => setCorralOpen(false)} />

      {stage === 4 && (
        <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-faint)", zIndex: 30, pointerEvents: "none" }}>
          Click "Ready to Ride" or press →
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
