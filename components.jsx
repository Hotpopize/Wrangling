/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ---------- SVG primitives ----------
function BrandMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="bm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#7cffb2" />
        </linearGradient>
      </defs>
      <path d="M4 26 L10 8 L14 22 L16 14 L18 22 L22 8 L28 26" stroke="url(#bm-g)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
      <circle cx="16" cy="4" r="2" fill="#22d3ee"/>
    </svg>
  );
}

function Sparkline({ points = [], color = "#22d3ee", w = 60, h = 18 }) {
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * h;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="spark">
      <path d={path} stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Isometric / 3D-ish engagement velocity chart
function VelocityChart({ playing }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const velocity = [42, 58, 51, 73, 68, 92, 84];
  const retention = [38, 51, 47, 64, 60, 79, 74];
  const w = 720, h = 280, pad = 40;
  const max = 100;
  const xs = i => pad + (i * (w - pad * 2)) / (days.length - 1);
  const ys = v => h - pad - (v / max) * (h - pad - 20);

  const linePath = (arr) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${xs(i)},${ys(v)}`).join(" ");
  const areaPath = (arr) => `${linePath(arr)} L${xs(arr.length - 1)},${h - pad} L${pad},${h - pad} Z`;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="vel-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ret-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7cffb2" stopOpacity="0.3" />
          <stop offset="1" stopColor="#7cffb2" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* grid */}
      {[0, 25, 50, 75, 100].map(g => (
        <g key={g}>
          <line x1={pad} x2={w - pad} y1={ys(g)} y2={ys(g)} stroke="rgba(34,211,238,0.08)" strokeDasharray="2 4" />
          <text x={pad - 8} y={ys(g) + 3} textAnchor="end" fill="rgba(80,107,135,0.8)" fontSize="9" fontFamily="JetBrains Mono">{g}</text>
        </g>
      ))}
      {/* axis */}
      {days.map((d, i) => (
        <text key={d} x={xs(i)} y={h - 16} textAnchor="middle" fill="rgba(138,166,193,0.7)" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="0.1em">{d.toUpperCase()}</text>
      ))}
      {/* areas */}
      <path d={areaPath(velocity)} fill="url(#vel-area)" />
      <path d={areaPath(retention)} fill="url(#ret-area)" />
      {/* lines */}
      <path d={linePath(retention)} stroke="#7cffb2" strokeWidth="1.5" fill="none" strokeOpacity="0.8" />
      <path d={linePath(velocity)} stroke="#22d3ee" strokeWidth="2" fill="none" filter="drop-shadow(0 0 6px #22d3ee)" />
      {/* points */}
      {velocity.map((v, i) => (
        <g key={i}>
          <circle cx={xs(i)} cy={ys(v)} r="4" fill="#0b192c" stroke="#22d3ee" strokeWidth="1.5" />
          {i === 5 && (
            <g>
              <circle cx={xs(i)} cy={ys(v)} r="8" fill="none" stroke="#22d3ee" strokeOpacity="0.4">
                <animate attributeName="r" from="4" to="14" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" from="0.6" to="0" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <text x={xs(i)} y={ys(v) - 14} textAnchor="middle" fill="#22d3ee" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">PEAK · 92</text>
            </g>
          )}
        </g>
      ))}
      {/* axis line */}
      <line x1={pad} x2={w - pad} y1={h - pad} y2={h - pad} stroke="rgba(34,211,238,0.3)" />
    </svg>
  );
}

// Velocity arrow svg (for stage 2 strike)
function VelocityArrow() {
  return (
    <svg width="220" height="40" viewBox="0 0 220 40" fill="none">
      <defs>
        <linearGradient id="va-g" x1="0" x2="1">
          <stop offset="0" stopColor="#7cffb2" stopOpacity="0" />
          <stop offset="0.6" stopColor="#7cffb2" />
          <stop offset="1" stopColor="#7cffb2" />
        </linearGradient>
      </defs>
      <path d="M0 20 L200 20" stroke="url(#va-g)" strokeWidth="3" strokeLinecap="round" />
      <path d="M195 10 L215 20 L195 30" stroke="#7cffb2" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// QR code generator (decorative, original layout)
function QRCode() {
  const size = 21;
  const cells = useMemo(() => {
    // deterministic pattern
    const seed = 0xabc123;
    let s = seed;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => rnd() > 0.5));
    // Clear corners for finder marks
    const clear = (r, c) => {
      for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
        if (grid[r + i] && grid[r + i][c + j] !== undefined) grid[r + i][c + j] = false;
      }
    };
    clear(0, 0); clear(0, 14); clear(14, 0);
    return grid;
  }, []);
  return (
    <div className="qr-frame">
      <div className="qr-grid">
        {cells.flatMap((row, r) => row.map((on, c) => {
          // accent some cells cyan
          const isCyan = on && ((r * c + r + c) % 11 === 0);
          return <div key={`${r}-${c}`} className={`qr-cell ${on ? (isCyan ? "cyan" : "on") : ""}`} />;
        }))}
      </div>
      <div className="qr-mark tl"></div>
      <div className="qr-mark tr"></div>
      <div className="qr-mark bl"></div>
    </div>
  );
}

Object.assign(window, { BrandMark, Sparkline, VelocityChart, VelocityArrow, QRCode });
