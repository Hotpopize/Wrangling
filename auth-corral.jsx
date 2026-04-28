/* global React */
const { useState: useS2, useEffect: useE2, useMemo: useM2 } = React;

// ---------- Auth Modal ----------
function AuthModal({ open, onClose, onAuth }) {
  const [tab, setTab] = useS2("signin"); // signin | signup | key
  const [email, setEmail] = useS2("");
  const [password, setPassword] = useS2("");
  const [name, setName] = useS2("");
  const [err, setErr] = useS2("");
  const [generatedKey, setGeneratedKey] = useS2("");
  const [recoveryKey, setRecoveryKey] = useS2("");
  const [copied, setCopied] = useS2({ k: false, r: false });

  const hex = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)))
    .map(b => b.toString(16).padStart(2, "0")).join("");

  const doSignin = (e) => {
    e.preventDefault();
    if (!email || !password) { setErr("Email and password required."); return; }
    setErr("");
    onAuth({ email, name: email.split("@")[0], tier: "Wrangler" });
  };

  const doSignup = (e) => {
    e.preventDefault();
    if (!email || !password || !name) { setErr("All fields required."); return; }
    if (password.length < 8) { setErr("Password must be 8+ chars."); return; }
    setErr("");
    // Generate local-first encryption key
    const k = `wrang_${hex(4)}_${hex(8)}_${hex(8)}_${hex(8)}`;
    const r = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(b => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36])
      .join("")
      .match(/.{1,4}/g).join("-");
    setGeneratedKey(k);
    setRecoveryKey(r);
    setTab("key");
  };

  const finishSignup = () => {
    onAuth({ email, name, tier: "Lone Ranger", key: generatedKey });
    setTab("signin");
    setEmail(""); setPassword(""); setName("");
    setGeneratedKey(""); setRecoveryKey("");
  };

  const copy = (which, val) => {
    navigator.clipboard?.writeText(val);
    setCopied(c => ({ ...c, [which]: true }));
    setTimeout(() => setCopied(c => ({ ...c, [which]: false })), 1500);
  };

  return (
    <div className={`modal-veil ${open ? "open" : ""}`} onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>

        {tab !== "key" && (
          <div className="auth-tabs">
            <div className={`auth-tab ${tab === "signin" ? "active" : ""}`} onClick={() => { setTab("signin"); setErr(""); }}>Sign in</div>
            <div className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setErr(""); }}>Create account</div>
          </div>
        )}

        {tab === "signin" && (
          <form onSubmit={doSignin}>
            <div className="auth-h1">Welcome back, wrangler.</div>
            <div className="auth-sub">Sign in to sync your encrypted local backups across devices. Your data stays on your machine.</div>
            <div className="field">
              <label>Email</label>
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ranch.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {err && <div className="field-error">{err}</div>}
            <button type="submit" className="auth-cta">Sign in</button>
            <div className="auth-divider">or continue with</div>
            <div className="sso-row">
              <button className="sso-btn" type="button" onClick={() => onAuth({ email: "passkey@local", name: "Passkey", tier: "Wrangler" })}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M4 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4"/></svg>
                Passkey
              </button>
              <button className="sso-btn" type="button" onClick={() => onAuth({ email: "google@local", name: "Google", tier: "Wrangler" })}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 4v3l2 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                Google
              </button>
            </div>
            <div className="auth-foot">No password? Use a passkey · Forgot key? Use recovery phrase</div>
          </form>
        )}

        {tab === "signup" && (
          <form onSubmit={doSignup}>
            <div className="auth-h1">Saddle up.</div>
            <div className="auth-sub">A local encryption key is generated in your browser — we never see it. You'll back it up in a moment.</div>
            <div className="field">
              <label>Display name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Wrangler" />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ranch.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8+ chars" />
            </div>
            {err && <div className="field-error">{err}</div>}
            <button type="submit" className="auth-cta">Generate my key</button>
            <div className="auth-foot">Free tier · No card required · Upgrade any time</div>
          </form>
        )}

        {tab === "key" && (
          <div>
            <div className="auth-h1">Your local key is ready.</div>
            <div className="auth-sub">This key encrypts your OPFS cache and any opt-in cloud backups. We can't recover it for you — store it somewhere safe.</div>

            <label style={{ display: "block", fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.18em", color: "var(--ink-faint)", textTransform: "uppercase", marginBottom: 6 }}>Encryption key · 256-bit</label>
            <div className="keygen-row">
              {generatedKey}
              <button className={`copy ${copied.k ? "done" : ""}`} onClick={() => copy("k", generatedKey)}>{copied.k ? "Copied" : "Copy"}</button>
            </div>

            <label style={{ display: "block", fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: "0.18em", color: "var(--ink-faint)", textTransform: "uppercase", marginBottom: 6, marginTop: 4 }}>Recovery phrase</label>
            <div className="keygen-row">
              {recoveryKey}
              <button className={`copy ${copied.r ? "done" : ""}`} onClick={() => copy("r", recoveryKey)}>{copied.r ? "Copied" : "Copy"}</button>
            </div>

            <div className="keygen-warn">⚠ Lost keys cannot be reset · Print or save to a password manager</div>

            <button className="auth-cta" onClick={finishSignup}>I've saved my key — continue</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Color Corral ----------
const SAMPLE_FRAMES = [
  { label: "00:04", grad: "linear-gradient(135deg, #f4a261 0%, #e76f51 50%, #2a4858 100%)", palette: ["#f4a261", "#e76f51", "#2a4858", "#264653", "#e9c46a"] },
  { label: "00:11", grad: "linear-gradient(135deg, #ff8a5b 0%, #c44569 50%, #1a1a2e 100%)", palette: ["#ff8a5b", "#c44569", "#1a1a2e", "#f6cd61", "#3d5a80"] },
  { label: "00:19", grad: "linear-gradient(135deg, #ffd166 0%, #ef476f 60%, #073b4c 100%)", palette: ["#ffd166", "#ef476f", "#073b4c", "#06d6a0", "#118ab2"] },
  { label: "00:27", grad: "linear-gradient(135deg, #fcb69f 0%, #ff9a8b 50%, #5d3a3a 100%)", palette: ["#fcb69f", "#ff9a8b", "#5d3a3a", "#ee7752", "#ffd6a5"] },
];

const LUT_PRESETS = [
  { name: "Golden Hour Push",     desc: "Warm-shadow lift · cyan-shadow tint", grad: "linear-gradient(135deg, #f6cd61, #e76f51, #2a4858)", lift: "+18%" },
  { name: "Neon Frontier",         desc: "High-contrast cyan-mint roll-off",    grad: "linear-gradient(135deg, #22d3ee, #7cffb2, #0b192c)", lift: "+22%" },
  { name: "Desert Grade",          desc: "Bleached highlights · ochre mids",     grad: "linear-gradient(135deg, #fcb69f, #c1843e, #3a2e1f)", lift: "+11%" },
  { name: "Cinema Teal",           desc: "Crushed blacks · teal cast",            grad: "linear-gradient(135deg, #1a3a5e, #2a9d8f, #f4a261)", lift: "+15%" },
];

const VIBE_AXES = [
  { name: "URGENT",      key: "urgent",     val: 70 },
  { name: "EDUCATIONAL", key: "edu",        val: 30 },
  { name: "WARM",        key: "warm",       val: 62 },
  { name: "FAST",        key: "fast",       val: 81 },
  { name: "INTIMATE",    key: "intimate",   val: 44 },
  { name: "PLAYFUL",     key: "playful",    val: 38 },
];

function VibeRadar({ vibes }) {
  const w = 220, h = 200, cx = w / 2, cy = h / 2 + 4, r = 70;
  const n = vibes.length;
  const pt = (val, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const d = (val / 100) * r;
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
  };
  const lblPt = (i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * (r + 16), cy + Math.sin(a) * (r + 16)];
  };
  const path = vibes.map((v, i) => { const [x, y] = pt(v.val, i); return `${i === 0 ? "M" : "L"}${x},${y}`; }).join(" ") + " Z";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {[25, 50, 75, 100].map(g => (
        <polygon key={g} points={Array.from({ length: n }, (_, i) => pt(g, i).join(",")).join(" ")} fill="none" stroke="rgba(34,211,238,0.1)" strokeDasharray="2 3" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = pt(100, i);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(34,211,238,0.1)" />;
      })}
      <path d={path} fill="rgba(124,255,178,0.18)" stroke="#7cffb2" strokeWidth="1.6" filter="drop-shadow(0 0 6px #7cffb2)" />
      {vibes.map((v, i) => {
        const [x, y] = pt(v.val, i);
        return <circle key={i} cx={x} cy={y} r="3" fill="#7cffb2" />;
      })}
      {vibes.map((v, i) => {
        const [x, y] = lblPt(i);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontFamily="JetBrains Mono" fill="rgba(138,166,193,0.9)" letterSpacing="0.1em">{v.name}</text>;
      })}
    </svg>
  );
}

function ColorCorral({ open, onClose }) {
  const [activeFrame, setActiveFrame] = useS2(0);
  const [activePreset, setActivePreset] = useS2(1);
  const [strength, setStrength] = useS2(75);
  const [warmth, setWarmth] = useS2(60);
  const [crush, setCrush] = useS2(40);
  const frame = SAMPLE_FRAMES[activeFrame];
  const preset = LUT_PRESETS[activePreset];

  // After-grade overlay computed from preset blend
  const afterFilter = `saturate(${0.9 + strength / 200}) contrast(${1 + crush / 200}) hue-rotate(${(activePreset - 1) * 8}deg)`;

  return (
    <div className={`corral-stage ${open ? "open" : ""}`}>
      <div className="corral-shell">
        <div className="corral-head">
          <div className="corral-title">
            <div className="brand-mark"><BrandMark size={22} /></div>
            <div>
              <div className="eb">Local · WebGPU · Transformers.js</div>
              <h2>Color Corral · LUT Generator</h2>
            </div>
          </div>
          <button className="modal-close" style={{ position: "static" }} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="corral-body">
          {/* Left — frames + preview */}
          <div className="corral-left">
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.16em", color: "var(--ink-faint)", textTransform: "uppercase", marginBottom: 10 }}>Sampled frames · 4 / 32</div>
            <div className="frame-strip">
              {SAMPLE_FRAMES.map((f, i) => (
                <div key={i} className={`frame-thumb ${i === activeFrame ? "active" : ""}`} style={{ background: f.grad }} onClick={() => setActiveFrame(i)}>
                  <div className="label">{f.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.16em", color: "var(--ink-faint)", textTransform: "uppercase", marginBottom: 10 }}>Dominant palette · frame {activeFrame + 1}</div>
            <div className="swatch-row">
              {frame.palette.map((c, i) => (
                <div key={i} className="swatch-cell" style={{ background: c }}>
                  <div className="hex">{c.toUpperCase()}</div>
                </div>
              ))}
            </div>

            <div className="before-after">
              <div className="ba-card">
                <div className="head">Before · raw</div>
                <div className="img" style={{ background: frame.grad }}></div>
              </div>
              <div className="ba-card after">
                <div className="head">After · {preset.name.toLowerCase()}</div>
                <div className="img" style={{ background: `${preset.grad}, ${frame.grad}`, backgroundBlendMode: "soft-light", filter: afterFilter }}></div>
              </div>
            </div>
          </div>

          {/* Right — controls */}
          <div className="corral-right">
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: "0.16em", color: "var(--ink-faint)", textTransform: "uppercase", marginBottom: 10 }}>Suggested LUTs · ranked by past performance</div>
            <div className="preset-list">
              {LUT_PRESETS.map((p, i) => (
                <div key={i} className={`preset ${i === activePreset ? "active" : ""}`} onClick={() => setActivePreset(i)}>
                  <div className="swatch-mini" style={{ background: p.grad }}></div>
                  <div className="name">{p.name}<small>{p.desc}</small></div>
                  <div className="lift">{p.lift}</div>
                </div>
              ))}
            </div>

            <div className="lut-controls">
              <div className="lut-slider">
                <div className="row"><span className="lbl">Strength</span><span className="val">{strength}%</span></div>
                <input type="range" min="0" max="100" value={strength} onChange={(e) => setStrength(+e.target.value)} />
              </div>
              <div className="lut-slider">
                <div className="row"><span className="lbl">Warmth</span><span className="val">{warmth}%</span></div>
                <input type="range" min="0" max="100" value={warmth} onChange={(e) => setWarmth(+e.target.value)} />
              </div>
              <div className="lut-slider">
                <div className="row"><span className="lbl">Shadow Crush</span><span className="val">{crush}%</span></div>
                <input type="range" min="0" max="100" value={crush} onChange={(e) => setCrush(+e.target.value)} />
              </div>
            </div>

            <div className="radar-wrap">
              <div className="radar-head">
                <div className="title">Vibe Check</div>
                <div className="badge">● LIVE · LOCAL ML</div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <VibeRadar vibes={VIBE_AXES} />
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-dim)", lineHeight: 1.5, textAlign: "center", marginTop: 6 }}>
                Reads <span style={{ color: "var(--mint)" }} className="mono">URGENT 70</span> · <span style={{ color: "var(--cyan)" }} className="mono">FAST 81</span>. Matches your top-3 hooks.
              </div>
            </div>
          </div>
        </div>

        <div className="corral-foot">
          <div className="meta">EXPORT · 32×32×32 · .CUBE FORMAT · 14 KB</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-secondary">Apply to clip</button>
            <button className="btn-primary">Download .cube</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AuthModal, ColorCorral });
