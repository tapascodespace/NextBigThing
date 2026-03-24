"use client";

import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { DottedSurface } from "./components/DottedSurface";
import { GlowingEffect } from "./components/ui/glowing-effect";

/* ───────── helpers ───────── */
const sans = "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif";

/* ───────── Framer Motion animation variants ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(6px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const smoothTransition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as const,
};

const slowTransition = {
  duration: 1,
  ease: [0.22, 1, 0.36, 1] as const,
};

/* ===================================================================
   BINARY PAYOFF CHART — Section 01 graphic
   =================================================================== */
function BinaryPayoffChart() {
  return (
    <div style={{
      background: "#111",
      borderRadius: 20,
      padding: "2.5rem 3rem 2.25rem",
      width: "100%",
      maxWidth: 420,
      boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" as const, color: "#fff" }}>
          Binary Payoff
        </span>
        <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" as const, color: "#666", background: "#1a1a1a", padding: "4px 10px", borderRadius: 4 }}>
          NVDA 2026 Revenue Beats $150B?
        </span>
      </div>

      {/* SVG Chart */}
      <div style={{ position: "relative", width: "100%", height: 300 }}>
        <svg viewBox="0 0 540 290" style={{ width: "100%", height: "100%" }}>
          {/* P&L label rotated */}
          <text x={14} y={130} fill="#555" fontSize={16} fontFamily={sans} fontWeight={500} textAnchor="middle" transform="rotate(-90, 14, 130)">P&amp;L</text>

          {/* Grid lines */}
          <line x1={80} y1={30} x2={504} y2={30} stroke="#1a1a1a" strokeWidth={1}/>
          <line x1={80} y1={130} x2={504} y2={130} stroke="#1a1a1a" strokeWidth={1}/>
          <line x1={80} y1={230} x2={504} y2={230} stroke="#1a1a1a" strokeWidth={1}/>

          {/* Y-axis labels */}
          <text x={68} y={34} fill="#555" fontSize={16} fontFamily={sans} textAnchor="end">+$0.50</text>
          <text x={68} y={134} fill="#555" fontSize={16} fontFamily={sans} textAnchor="end">$0</text>
          <text x={68} y={234} fill="#555" fontSize={16} fontFamily={sans} textAnchor="end">-$0.50</text>

          {/* Loss zone shading */}
          <rect x={80} y={130} width={141} height={100} fill="#3d1515" opacity={0.3}/>
          {/* Win zone shading */}
          <rect x={221} y={30} width={283} height={100} fill="#1a3d1a" opacity={0.3}/>

          {/* Step function: flat loss → jump at strike → flat win */}
          <line x1={80} y1={230} x2={221} y2={230} stroke="#ef4444" strokeWidth={2.5}/>
          <line x1={221} y1={230} x2={221} y2={30} stroke="#888" strokeWidth={1} strokeDasharray="4,4"/>
          <line x1={221} y1={30} x2={504} y2={30} stroke="#22c55e" strokeWidth={2.5}/>

          {/* Strike label */}
          <text x={221} y={256} fill="#888" fontSize={15} fontFamily={sans} textAnchor="middle">$150B</text>
          <text x={221} y={273} fill="#555" fontSize={14} fontFamily={sans} textAnchor="middle">STRIKE</text>

          {/* X-axis range labels */}
          <text x={80} y={256} fill="#555" fontSize={15} fontFamily={sans} textAnchor="start">$130B</text>
          <text x={504} y={256} fill="#555" fontSize={15} fontFamily={sans} textAnchor="end">$190B</text>

          {/* X-axis base line */}
          <line x1={80} y1={240} x2={504} y2={240} stroke="#333" strokeWidth={1}/>

          {/* X-axis title */}
          <text x={370} y={273} fill="#444" fontSize={13} fontFamily={sans} fontWeight={500} textAnchor="middle">NVIDIA 2026 Revenue</text>

          {/* Trader A marker at $153B */}
          <line x1={243} y1={30} x2={243} y2={48} stroke="#d4a843" strokeWidth={1.5}/>
          <circle cx={243} cy={30} r={5} fill="#d4a843"/>
          <rect x={207} y={51} width={72} height={24} rx={4} fill="#d4a843" opacity={0.15}/>
          <text x={243} y={68} fill="#d4a843" fontSize={15} fontFamily={sans} fontWeight={600} textAnchor="middle">Trader A</text>
          <text x={243} y={84} fill="#d4a843" fontSize={14} fontFamily={sans} textAnchor="middle">$153B</text>

          {/* Trader B marker at $180B */}
          <line x1={433} y1={30} x2={433} y2={48} stroke="#ef4444" strokeWidth={1.5}/>
          <circle cx={433} cy={30} r={5} fill="#ef4444"/>
          <rect x={397} y={51} width={72} height={24} rx={4} fill="#ef4444" opacity={0.15}/>
          <text x={433} y={68} fill="#ef4444" fontSize={15} fontFamily={sans} fontWeight={600} textAnchor="middle">Trader B</text>
          <text x={433} y={84} fill="#ef4444" fontSize={14} fontFamily={sans} textAnchor="middle">$180B</text>

          {/* Same payout bracket */}
          <line x1={243} y1={23} x2={433} y2={23} stroke="#555" strokeWidth={1}/>
          <line x1={243} y1={20} x2={243} y2={26} stroke="#555" strokeWidth={1}/>
          <line x1={433} y1={20} x2={433} y2={26} stroke="#555" strokeWidth={1}/>
          <text x={338} y={17} fill="#666" fontSize={14} fontFamily={sans} fontWeight={500} textAnchor="middle">SAME PAYOUT</text>

          {/* Actual revenue marker at $153.5B */}
          <line x1={246} y1={92} x2={246} y2={108} stroke="#ffffff" strokeWidth={1} strokeDasharray="3,3"/>
          <text x={246} y={122} fill="#fff" fontSize={13} fontFamily={sans} fontWeight={500} textAnchor="middle" opacity={0.6}>Actual: $153.5B</text>
        </svg>
      </div>

      {/* Callout */}
      <div style={{ borderLeft: "3px solid #d4a843", paddingLeft: 16, marginTop: 8 }}>
        <div style={{ fontFamily: sans, color: "#999", fontSize: 13, lineHeight: 1.6 }}>
          <strong style={{ color: "#fff", fontWeight: 600 }}>Trader A: $153B</strong> (nailed it)
        </div>
        <div style={{ fontFamily: sans, color: "#999", fontSize: 13, lineHeight: 1.6 }}>
          <strong style={{ color: "#fff", fontWeight: 600 }}>Trader B: $180B</strong> ($27B off)
        </div>
        <div style={{ fontFamily: sans, color: "#999", fontSize: 13, lineHeight: 1.6, marginTop: 4 }}>
          Both paid exactly <strong style={{ color: "#fff", fontWeight: 600 }}>+$0.50</strong>.
        </div>
        <div style={{ fontFamily: sans, color: "#d4a843", fontSize: 14, fontWeight: 600, marginTop: 8, lineHeight: 1.5 }}>
          Trader A's edge was massive. Trader B's edge was zero. Same reward.
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   LINEAR PAYOFF CHART — Section 02 graphic
   Uses IG/CME-style P&L breakdown: (Settlement - Entry) × Contracts
   =================================================================== */
function LinearPayoffChart() {
  return (
    <div style={{
      background: "#111",
      borderRadius: 20,
      padding: "2.5rem 2.5rem 2rem",
      width: "100%",
      maxWidth: 420,
      boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" as const, color: "#fff" }}>
          Linear Payoff
        </span>
        <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" as const, color: "#666", background: "#1a1a1a", padding: "4px 10px", borderRadius: 4 }}>
          NVDA Q2 2026 Revenue
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 24, marginBottom: "1.25rem", padding: "14px 16px", background: "#1a1a1a", borderRadius: 10 }}>
        {[
          { label: "ENTRY", value: "$150.0B", color: "#fff" },
          { label: "SETTLEMENT", value: "$153.5B", color: "#fff" },
          { label: "CONTRACTS", value: "100", color: "#fff" },
        ].map((stat) => (
          <div key={stat.label} style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
            <span style={{ fontFamily: sans, fontSize: 9, fontWeight: 600, letterSpacing: "1.2px", color: "#555" }}>{stat.label}</span>
            <span style={{ fontFamily: sans, fontSize: 16, fontWeight: 700, color: stat.color }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* P&L formula breakdown — IG/CME style */}
      <div style={{ marginBottom: "1.25rem", padding: "12px 16px", background: "rgba(34, 197, 94, 0.06)", border: "1px solid rgba(34, 197, 94, 0.15)", borderRadius: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" as const }}>
          <span style={{ fontFamily: sans, fontSize: 13, color: "#888" }}>(</span>
          <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: "#fff" }}>$153.5B</span>
          <span style={{ fontFamily: sans, fontSize: 13, color: "#888" }}>-</span>
          <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: "#fff" }}>$150.0B</span>
          <span style={{ fontFamily: sans, fontSize: 13, color: "#888" }}>)</span>
          <span style={{ fontFamily: sans, fontSize: 13, color: "#555" }}>&times;</span>
          <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: "#fff" }}>100</span>
          <span style={{ fontFamily: sans, fontSize: 13, color: "#555" }}>=</span>
          <span style={{ fontFamily: sans, fontSize: 15, fontWeight: 700, color: "#22c55e" }}>+$350</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 4 }}>
          <span style={{ fontFamily: sans, fontSize: 9, color: "#555", letterSpacing: "0.5px" }}>MOVE</span>
          <span style={{ fontFamily: sans, fontSize: 9, color: "#333" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span style={{ fontFamily: sans, fontSize: 9, color: "#555", letterSpacing: "0.5px" }}>CONTRACTS</span>
          <span style={{ fontFamily: sans, fontSize: 9, color: "#333" }}>&nbsp;&nbsp;</span>
          <span style={{ fontFamily: sans, fontSize: 9, color: "#555", letterSpacing: "0.5px" }}>P&amp;L</span>
        </div>
      </div>

      {/* SVG Chart
        X-axis: $140B to $165B (25B range)
        Y-axis: -$1,000 to +$1,000
        100 contracts, $1 per $1B per contract = $100 per $1B
        Chart area: x 80→504 (424px), y 25→225 (200px)
        Entry $150B: x=250, y=125 ($0)
        Settlement $153.5B: x=309, y=125-(350/1000)*100=90
      */}
      <div style={{ position: "relative", width: "100%", height: 260 }}>
        <svg viewBox="0 0 540 260" style={{ width: "100%", height: "100%" }}>
          {/* P&L label rotated */}
          <text x={14} y={125} fill="#555" fontSize={15} fontFamily={sans} fontWeight={500} textAnchor="middle" transform="rotate(-90, 14, 125)">P&amp;L</text>

          {/* Grid lines — $500 intervals */}
          <line x1={80} y1={25} x2={504} y2={25} stroke="#1a1a1a" strokeWidth={1}/>
          <line x1={80} y1={75} x2={504} y2={75} stroke="#1a1a1a" strokeWidth={1}/>
          <line x1={80} y1={125} x2={504} y2={125} stroke="#1a1a1a" strokeWidth={1}/>
          <line x1={80} y1={175} x2={504} y2={175} stroke="#1a1a1a" strokeWidth={1}/>
          <line x1={80} y1={225} x2={504} y2={225} stroke="#1a1a1a" strokeWidth={1}/>

          {/* Y-axis labels */}
          <text x={68} y={29} fill="#555" fontSize={14} fontFamily={sans} textAnchor="end">+$1,000</text>
          <text x={68} y={79} fill="#555" fontSize={14} fontFamily={sans} textAnchor="end">+$500</text>
          <text x={68} y={129} fill="#555" fontSize={14} fontFamily={sans} textAnchor="end">$0</text>
          <text x={68} y={179} fill="#555" fontSize={14} fontFamily={sans} textAnchor="end">-$500</text>
          <text x={68} y={229} fill="#555" fontSize={14} fontFamily={sans} textAnchor="end">-$1,000</text>

          {/* Profit zone shading */}
          <polygon points="250,125 504,125 504,25" fill="#1a3d1a" opacity={0.2}/>
          {/* Loss zone shading */}
          <polygon points="250,125 80,125 80,225" fill="#3d1515" opacity={0.2}/>

          {/* Linear P&L line
            $140B (x=80): P&L = -$1,000 → y=225
            $150B (x=250): P&L = $0 → y=125
            $160B (x=419): P&L = +$1,000 → y=25
            $165B (x=504): P&L = +$1,500 → clipped above
          */}
          {/* Loss segment */}
          <line x1={80} y1={225} x2={250} y2={125} stroke="#ef4444" strokeWidth={2.5}/>
          {/* Profit segment */}
          <line x1={250} y1={125} x2={419} y2={25} stroke="#22c55e" strokeWidth={2.5}/>
          {/* Clipped extension */}
          <line x1={419} y1={25} x2={504} y2={25} stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4,4" opacity={0.4}/>

          {/* Zero line highlight */}
          <line x1={80} y1={125} x2={504} y2={125} stroke="#333" strokeWidth={1.5}/>

          {/* Entry marker at $150B */}
          <circle cx={250} cy={125} r={5} fill="#ffffff" stroke="#111" strokeWidth={2}/>
          <line x1={250} y1={125} x2={250} y2={240} stroke="#ffffff" strokeWidth={1} strokeDasharray="3,3" opacity={0.3}/>
          <text x={250} y={250} fill="#fff" fontSize={14} fontFamily={sans} fontWeight={600} textAnchor="middle" opacity={0.8}>$150B</text>

          {/* Settlement marker at $153.5B
            x = 80 + (13.5/25)*424 = 309
            P&L = +$350 → y = 125 - (350/1000)*100 = 90
          */}
          <line x1={309} y1={90} x2={309} y2={240} stroke="#22c55e" strokeWidth={1} strokeDasharray="3,3" opacity={0.4}/>
          <circle cx={309} cy={90} r={5} fill="#22c55e"/>
          <text x={309} y={250} fill="#22c55e" fontSize={14} fontFamily={sans} fontWeight={600} textAnchor="middle">$153.5B</text>

          {/* Horizontal dashed line from settlement to Y-axis */}
          <line x1={80} y1={90} x2={309} y2={90} stroke="#22c55e" strokeWidth={1} strokeDasharray="4,4" opacity={0.3}/>

          {/* P&L annotation at settlement point */}
          <rect x={315} y={78} width={60} height={24} rx={4} fill="#22c55e" opacity={0.15}/>
          <text x={345} y={95} fill="#22c55e" fontSize={14} fontFamily={sans} fontWeight={700} textAnchor="middle">+$350</text>

          {/* X-axis line */}
          <line x1={80} y1={237} x2={504} y2={237} stroke="#333" strokeWidth={1}/>

          {/* X-axis range labels */}
          <text x={80} y={250} fill="#444" fontSize={13} fontFamily={sans} textAnchor="start">$140B</text>
          <text x={504} y={250} fill="#444" fontSize={13} fontFamily={sans} textAnchor="end">$165B</text>

          {/* X-axis subtitle labels */}
          <text x={250} y={258} fill="#555" fontSize={11} fontFamily={sans} fontWeight={500} textAnchor="middle">ENTRY</text>
          <text x={309} y={258} fill="#555" fontSize={11} fontFamily={sans} fontWeight={500} textAnchor="middle">SETTLEMENT</text>
        </svg>
      </div>
    </div>
  );
}

/* ===================================================================
   PAGE
   =================================================================== */
export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.scrollTo(0, { immediate: true });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div style={{ background: "#080808", minHeight: "100vh", position: "relative" }}>
      <Nav />
      <Ticker />
      <Hero />
      <AboutUs />
      <Features />

      <WhoItsFor />
      <CTA />
      <Footer />
    </div>
  );
}

/* ───────── NAV ───────── */
function Nav() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const audio = new Audio("/bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // Autoplay on first user interaction (browsers block autoplay without interaction)
    const tryPlay = () => {
      audio.play().catch(() => {});
    };
    tryPlay();
    const handleInteraction = () => {
      audio.play().catch(() => {});
      const events = ["click", "scroll", "touchstart", "keydown", "mousemove"];
      events.forEach((e) => window.removeEventListener(e, handleInteraction));
    };
    const events = ["click", "scroll", "touchstart", "keydown", "mousemove"];
    events.forEach((e) => window.addEventListener(e, handleInteraction, { once: true, passive: true }));

    return () => {
      audio.pause();
      events.forEach((e) => window.removeEventListener(e, handleInteraction));
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.25rem 3rem",
        background: "rgba(8,8,8,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        fontFamily: sans,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: "#fff",
            textTransform: "uppercase" as const,
          }}
        >
          REESHAW
        </span>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {["Home", "Contact"].map((l) => (
            <a
              key={l}
              href={l === "Home" ? "#" : "#cta"}
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.7)",
                fontFamily: sans,
                fontWeight: 400,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              {l}
            </a>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <a
          href="#cta"
          style={{
            fontSize: 14,
            fontFamily: sans,
            fontWeight: 500,
            color: "#000",
            background: "#fff",
            borderRadius: 999,
            padding: "0.5rem 1.5rem",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Contact
        </a>

        {/* Music toggle */}
        <button
          onClick={toggleMusic}
          aria-label={playing ? "Pause music" : "Play music"}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 999,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "border-color 0.2s",
            gap: 2,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
        >
          {/* Animated bars */}
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: 2.5,
                height: playing ? `${8 + (i % 2) * 5}px` : "3px",
                background: "#fff",
                borderRadius: 1,
                transition: "height 0.3s ease",
                animation: playing ? `musicBar 0.6s ease-in-out ${i * 0.1}s infinite alternate` : "none",
              }}
            />
          ))}
        </button>
      </div>
    </nav>
  );
}

/* ───────── TICKER ───────── */
const tickerItems = [
  { label: "Fed Rate Dec 15", value: "4.42%", positive: true },
  { label: "NVDA Q2 Revenue", value: "$31.2B", positive: true },
  { label: "Arsenal Goal Diff", value: "+2.1", positive: true },
  { label: "UK GDP Q3", value: "0.31%", positive: true },
  { label: "Man City Goals/Game", value: "1.8", positive: false },
  { label: "AAPL EPS Q1", value: "$2.41", positive: true },
  { label: "IPOs 2026", value: "187", positive: true },
  { label: "BTC Dec 31", value: "$94,200", positive: true },
  { label: "ECB Rate Mar", value: "2.75%", positive: false },
];

function Ticker() {
  return (
    <div
      style={{
        marginTop: 65,
        borderBottom: "1px solid #1e1e1e",
        overflow: "hidden",
        whiteSpace: "nowrap" as const,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          animation: "ticker 30s linear infinite",
        }}
      >
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "0.85rem 2rem",
              borderRight: "1px solid #1e1e1e",
              fontFamily: sans,
              fontSize: 14,
            }}
          >
            <span style={{ color: "#444" }}>{item.label}</span>
            <span style={{ color: item.positive ? "#2aad6e" : "#c0392b" }}>
              {item.value}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────── UNICORN STUDIO EMBED ───────── */
function UnicornEmbed() {
  useEffect(() => {
    const embedScript = document.createElement("script");
    embedScript.type = "text/javascript";
    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `;
    document.head.appendChild(embedScript);

    const style = document.createElement("style");
    style.textContent = `
      [data-us-project] { position: relative !important; overflow: hidden !important; }
      [data-us-project] canvas { clip-path: inset(0 0 10% 0) !important; }
      [data-us-project] * { pointer-events: none !important; }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important; visibility: hidden !important; opacity: 0 !important;
        position: absolute !important; left: -9999px !important;
      }
    `;
    document.head.appendChild(style);

    const hideBranding = () => {
      const el = document.querySelector("[data-us-project]");
      if (el) {
        el.querySelectorAll("*").forEach((child) => {
          const t = (child.textContent || "").toLowerCase();
          if (t.includes("made with") || t.includes("unicorn")) child.remove();
        });
      }
    };
    hideBranding();
    const interval = setInterval(hideBranding, 100);
    setTimeout(hideBranding, 1000);
    setTimeout(hideBranding, 3000);

    return () => {
      clearInterval(interval);
      embedScript.remove();
      style.remove();
    };
  }, []);

  return (
    <div
      data-us-project="whwOGlfJ5Rz2rHaEUgHl"
      style={{ width: "100%", height: "100%", minHeight: "100vh" }}
    />
  );
}

/* ───────── HERO ───────── */
function Hero() {
  const words = useMemo(
    () => ["interest rates", "earnings", "elections", "GDP", "goal margins", "anything"],
    []
  );
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2200);
    return () => clearTimeout(id);
  }, [wordIndex, words]);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* Dotted particle surface — full background */}
      <DottedSurface />

      {/* Text content — centered */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          padding: "6rem 3rem 12rem",
        }}
        className="hero-text"
      >
        <h1
          style={{
            fontFamily: sans,
            fontWeight: 800,
            fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)",
            lineHeight: 1.15,
            color: "#fff",
            letterSpacing: "-0.03em",
            maxWidth: 1000,
            animation: "fadeUp 0.7s ease both",
            animationDelay: "0.15s",
          }}
        >
          Trade{" "}
          <span
            style={{
              position: "relative",
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
              height: "1.18em",
              transition: "width 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* Hidden measurer — determines width */}
            <span
              style={{
                visibility: "hidden",
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              {words[wordIndex]}
            </span>
            {/* Animated word */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={words[wordIndex]}
                initial={{ y: 60, opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -60, opacity: 0, filter: "blur(6px)" }}
                transition={{ type: "spring", stiffness: 80, damping: 18 }}
                style={{
                  position: "absolute",
                  left: 0,
                  color: "#d4972a",
                  whiteSpace: "nowrap",
                }}
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <br />
          with precision.
        </h1>

        {/* CTA button */}
        <a
          href="#cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginTop: "2rem",
            fontFamily: sans,
            fontSize: 14,
            fontWeight: 500,
            color: "#000",
            background: "#f0ede8",
            borderRadius: 999,
            padding: "0.65rem 1rem 0.65rem 1.5rem",
            transition: "opacity 0.2s",
            animation: "fadeUp 0.7s ease both",
            animationDelay: "0.45s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Join the waitlist
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#000",
              color: "#fff",
              fontSize: 14,
            }}
          >
            &rsaquo;
          </span>
        </a>
      </div>
    </section>
  );
}

/* ───────── ABOUT US (forum.market style) ───────── */
function AboutUs() {
  return (
    <>
      {/* ── Block 01: The Problem ── */}
      <section style={{ background: "#fff", color: "#000" }}>
      <div
        className="about-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
          padding: "7rem 4rem",
        }}
      >
        <motion.div
          variants={slideFromLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={smoothTransition}
        >
          <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", color: "#d4972a" }}>
            /// 01 THE PROBLEM
          </span>
          <h2 style={{ fontFamily: sans, fontSize: "clamp(2rem, 3.2vw, 2.8rem)", fontWeight: 800, lineHeight: 1.15, textTransform: "uppercase" as const, marginTop: "0.75rem", marginBottom: "1.25rem" }}>
            WHY BINARY<br />ISN&apos;T ENOUGH
          </h2>
          <p style={{ fontFamily: sans, fontSize: 17, lineHeight: 1.7, color: "#555", marginBottom: "1.5rem" }}>
              Will inflation exceed 3%? Will NVIDIA beat earnings? Every prediction market asks yes or no. Nobody asks by how much.
          </p>
          <div style={{ borderLeft: "3px solid #d4972a", paddingLeft: "1rem" }}>
            <p style={{ fontFamily: sans, fontSize: 17, fontWeight: 600, lineHeight: 1.5, color: "#111" }}>
              NVIDIA reports $150B in revenue. One trader predicted $151B. Another said $160B. Binary markets paid them both $1. 
              A $9.0B difference in their forecasts. Zero difference in their reward.
            </p>
          </div>
        </motion.div>

        {/* Right — dark card graphic */}
        <motion.div
          variants={scaleUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...smoothTransition, delay: 0.2 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <BinaryPayoffChart />
        </motion.div>
      </div>
      </section>

      {/* ── Block 02: The Solution ── */}
      <section style={{ background: "#f5f5f5", color: "#000" }}>
      <div
        className="about-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
          padding: "7rem 4rem",
        }}
      >
        {/* Left — animated chart card */}
        <motion.div
          variants={scaleUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={smoothTransition}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <LinearPayoffChart />
        </motion.div>

        {/* Right — text */}
        <motion.div
          variants={slideFromRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...smoothTransition, delay: 0.15 }}
        >
          <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", color: "#d4972a" }}>
            /// 02 THE SOLUTION
          </span>
          <h2 style={{ fontFamily: sans, fontSize: "clamp(2rem, 3.2vw, 2.8rem)", fontWeight: 800, lineHeight: 1.15, textTransform: "uppercase" as const, marginTop: "0.75rem", marginBottom: "1.25rem" }}>
            INTRODUCING<br />LINEAR MARKETS
          </h2>
          <p style={{ fontFamily: sans, fontSize: 17, lineHeight: 1.7, color: "#555", marginBottom: "1.25rem" }}>
            Trade numbers, not yes/no. If you think it'll end up higher than the market price, you buy. If lower, you sell. 
            The further it moves in your favour, the more you make.
          </p>
          <div style={{ borderLeft: "3px solid #d4972a", paddingLeft: "1rem" }}>
            <p style={{ fontFamily: sans, fontSize: 17, lineHeight: 1.5, color: "#111", fontWeight: 600 }}>
              Earnings, GDP, goal margins, vote margins — any outcome that has a number has a market.
            </p>
          </div>
        </motion.div>
      </div>
      </section>
    </>
  );
}


/* ───────── FEATURES (forum.market style) ───────── */
const featureBlocks = [
  {
    num: "03",
    label: "SINGLE INSTRUMENT",
    title: "ONE MARKET PER METRIC,\nNOT TWENTY-FIVE",
    desc: "On a binary platform, covering NVIDIA's full revenue range means dozens of separate contracts. Each fragmenting liquidity further. \nReeshaw replaces them with one market on the actual figure. One order book. All the liquidity in one place.",
    highlight: "Deeper liquidity. Tighter spreads. One position.",
    side: "left" as const,
  },
  {
    num: "04",
    label: "HOW IT PAYS",
    title: "THE NUMBER IS YOUR PAYOFF",
    desc: "The market prices NVIDIA Q2 revenue at $31.2B. You think $31.8B, so you buy. \nRevenue prints $31.6B. Every dollar above your entry, you profit.",
    highlight: "Right by a little, make a little. Right by a lot, make a lot. \nNo asymmetry. Your edge is your reward.",
    side: "right" as const,
  },
  {
    num: "05",
    label: "THE SIGNAL",
    title: "A LIVE ESTIMATE,\nNOT JUST AN EXCHANGE",
    desc: "Every open position reflects a participant's view on the number. \nTogether, they form a live consensus estimate. The market price is the crowd's collective forecast.",
    highlight: "Earnings estimates and sports forecasts that update in real time. \nPriced by conviction, independent of sell-side consensus.",
    side: "left" as const,
  },
];

function FeatureBlock({ block, index }: { block: typeof featureBlocks[0]; index: number }) {
  const textVariant = block.side === "left" ? slideFromLeft : slideFromRight;
  const visualVariant = block.side === "left" ? slideFromRight : slideFromLeft;
  // Alternating: 03=white, 04=grey, 05=white (continues from AboutUs: 01=white, 02=grey)
  const bg = index % 2 === 0 ? "#fff" : "#f5f5f5";

  return (
    <section style={{ background: bg, color: "#000" }}>
      <div
        className="about-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
          padding: "7rem 4rem",
          direction: block.side === "right" ? "rtl" : "ltr",
        }}
      >
        {/* Text side */}
        <motion.div
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={smoothTransition}
          style={{ direction: "ltr" }}
        >
          <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", color: "#d4972a" }}>
            /// {block.num} {block.label}
          </span>
          <h2 style={{
            fontFamily: sans,
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#111",
            marginTop: "0.75rem",
            marginBottom: "1.25rem",
            whiteSpace: "pre-line",
          }}>
            {block.title}
          </h2>
          <p style={{ fontFamily: sans, fontSize: 16, lineHeight: 1.7, color: "#555", marginBottom: "1.25rem" }}>
            {block.desc}
          </p>
          <div style={{ borderLeft: "3px solid #d4972a", paddingLeft: "1rem" }}>
            <p style={{ fontFamily: sans, fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: "#111" }}>
              {block.highlight}
            </p>
          </div>
        </motion.div>

        {/* Visual side */}
        <motion.div
          variants={visualVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ ...smoothTransition, delay: 0.15 }}
          style={{ direction: "ltr", display: "flex", justifyContent: "center" }}
        >
          <FeatureVisual index={index} />
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <>
      {featureBlocks.map((block, i) => (
        <FeatureBlock key={block.num} block={block} index={i} />
      ))}
    </>
  );
}

/* ───────── Feature Visuals ───────── */
function FeatureVisual({ index }: { index: number }) {
  if (index === 0) {
    // Single instrument — 20+ binary contracts (left) → 1 linear market (right)
    const binaryContracts = [
      { strike: ">$130B?", yes: ".96", no: ".04" },
      { strike: ">$135B?", yes: ".91", no: ".09" },
      { strike: ">$140B?", yes: ".85", no: ".15" },
      { strike: ">$142B?", yes: ".80", no: ".20" },
      { strike: ">$145B?", yes: ".73", no: ".27" },
      { strike: ">$147B?", yes: ".67", no: ".33" },
      { strike: ">$148B?", yes: ".63", no: ".37" },
      { strike: ">$150B?", yes: ".57", no: ".43" },
      { strike: ">$152B?", yes: ".50", no: ".50" },
      { strike: ">$155B?", yes: ".40", no: ".60" },
      { strike: ">$157B?", yes: ".33", no: ".67" },
      { strike: ">$160B?", yes: ".25", no: ".75" },
      { strike: ">$162B?", yes: ".19", no: ".81" },
      { strike: ">$165B?", yes: ".14", no: ".86" },
      { strike: ">$170B?", yes: ".08", no: ".92" },
      { strike: ">$175B?", yes: ".04", no: ".96" },
      { strike: ">$178B?", yes: ".02", no: ".98" },
      { strike: ">$180B?", yes: ".01", no: ".99" },
      { strike: ">$185B?", yes: ".01", no: ".99" },
      { strike: ">$190B?", yes: ".00", no: "1.0" },
    ];
    return (
      <div style={{
        background: "#111",
        borderRadius: 20,
        padding: "1.5rem",
        width: "100%",
        maxWidth: 500,
        boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "1rem",
      }}>
        {/* ── LEFT: Binary contracts ── */}
        <div style={{ flex: "0 0 auto", width: 185 }}>
          <div style={{
            fontFamily: sans, fontSize: 9, fontWeight: 700,
            letterSpacing: "0.1em", color: "#c0392b",
            textTransform: "uppercase", marginBottom: 8,
            textAlign: "center",
          }}>
            20+ Binary Markets
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 4,
            marginBottom: 6,
          }}>
            {binaryContracts.map((c) => (
              <div key={c.strike} style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 5,
                padding: "4px 3px",
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily: sans, fontSize: 7, fontWeight: 600,
                  color: "#777", marginBottom: 2, whiteSpace: "nowrap",
                }}>
                  {c.strike}
                </div>
                <div style={{ display: "flex", gap: 2 }}>
                  <span style={{
                    fontFamily: sans, fontSize: 6, fontWeight: 600,
                    color: "#2aad6e", background: "rgba(42,173,110,0.1)",
                    borderRadius: 2, padding: "1px 2px", flex: 1,
                  }}>
                    Y{c.yes}
                  </span>
                  <span style={{
                    fontFamily: sans, fontSize: 6, fontWeight: 600,
                    color: "#c0392b", background: "rgba(192,57,43,0.1)",
                    borderRadius: 2, padding: "1px 2px", flex: 1,
                  }}>
                    N{c.no}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            fontFamily: sans, fontSize: 8, color: "#444",
            textAlign: "center", lineHeight: 1.4,
          }}>
            <span style={{ color: "#c0392b", fontWeight: 600 }}>20 markets</span>
            {" · 20+ bid/asks · fragmented liquidity"}
          </div>
        </div>

        {/* ── CENTRE: Arrow pointing right ── */}
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center" }}>
          <svg viewBox="0 0 54 40" fill="none" style={{ width: 54, height: 40 }}>
            {/* Lines converging from left toward the glow point */}
            <line x1="0" y1="4"  x2="20" y2="20" stroke="#444" strokeWidth="0.7" opacity="0.5" />
            <line x1="0" y1="12" x2="20" y2="20" stroke="#444" strokeWidth="0.7" opacity="0.6" />
            <line x1="0" y1="20" x2="20" y2="20" stroke="#444" strokeWidth="0.7" opacity="0.6" />
            <line x1="0" y1="28" x2="20" y2="20" stroke="#444" strokeWidth="0.7" opacity="0.6" />
            <line x1="0" y1="36" x2="20" y2="20" stroke="#444" strokeWidth="0.7" opacity="0.5" />
            {/* Convergence glow */}
            <circle cx="20" cy="20" r="3" fill="#d4972a" opacity="0.8" />
            <circle cx="20" cy="20" r="6" fill="#d4972a" opacity="0.12" />
            {/* Arrow shaft pointing right */}
            <line x1="24" y1="20" x2="46" y2="20" stroke="#d4972a" strokeWidth="1.5" />
            {/* Arrowhead pointing right */}
            <path d="M39 13 L48 20 L39 27"
              stroke="#d4972a" strokeWidth="1.5" fill="none"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* ── RIGHT: Linear market ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: sans, fontSize: 9, fontWeight: 700,
            letterSpacing: "0.1em", color: "#2aad6e",
            textTransform: "uppercase", marginBottom: 8,
            textAlign: "center",
          }}>
            1 Linear Market
          </div>
          <div style={{
            background: "linear-gradient(135deg, #0d1a0f 0%, #111 100%)",
            border: "1px solid rgba(42,173,110,0.2)",
            borderRadius: 10,
            padding: "12px",
          }}>
            {/* Header */}
            <div style={{
              textAlign: "center", marginBottom: 10,
            }}>
              <span style={{
                fontFamily: sans, fontSize: 11, fontWeight: 700, color: "#fff",
              }}>
                NVDA 2026 Revenue
              </span>
            </div>
            {/* Bid / Ask */}
            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
              <div style={{
                flex: 1, textAlign: "center", padding: "7px 0", borderRadius: 7,
                background: "rgba(42,173,110,0.08)",
                border: "1px solid rgba(42,173,110,0.2)",
              }}>
                <div style={{
                  fontFamily: sans, fontSize: 8, fontWeight: 600,
                  letterSpacing: "0.06em", color: "#2aad6e", opacity: 0.7, marginBottom: 2,
                }}>BID</div>
                <div style={{
                  fontFamily: sans, fontSize: 15, fontWeight: 800,
                  color: "#2aad6e", letterSpacing: "-0.02em",
                }}>$151.2B</div>
              </div>
              <div style={{
                flex: 1, textAlign: "center", padding: "7px 0", borderRadius: 7,
                background: "rgba(192,57,43,0.08)",
                border: "1px solid rgba(192,57,43,0.2)",
              }}>
                <div style={{
                  fontFamily: sans, fontSize: 8, fontWeight: 600,
                  letterSpacing: "0.06em", color: "#c0392b", opacity: 0.7, marginBottom: 2,
                }}>ASK</div>
                <div style={{
                  fontFamily: sans, fontSize: 15, fontWeight: 800,
                  color: "#c0392b", letterSpacing: "-0.02em",
                }}>$151.8B</div>
              </div>
            </div>
            {/* Spread */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
              <span style={{
                fontFamily: sans, fontSize: 8, fontWeight: 600,
                color: "#d4972a", letterSpacing: "0.04em", whiteSpace: "nowrap",
              }}>
                all liquidity here
              </span>
              <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    // Precision payoff — target graphic
    return (
      <div style={{ background: "#111", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 420, boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
        <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#888", marginBottom: "1.25rem" }}>PAYOFF CURVE</div>
        <svg viewBox="0 0 260 120" style={{ width: "100%", height: 160 }}>
          {/* Bell curve */}
          <path d="M0,110 Q30,108 60,100 Q90,80 130,20 Q170,80 200,100 Q230,108 260,110" fill="none" stroke="#d4972a" strokeWidth="2" />
          <path d="M0,110 Q30,108 60,100 Q90,80 130,20 Q170,80 200,100 Q230,108 260,110 L260,120 L0,120 Z" fill="#d4972a" fillOpacity="0.08" />
          {/* Center line */}
          <line x1="130" y1="15" x2="130" y2="120" stroke="#d4972a" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
          {/* Arrow pointing to peak */}
          <circle cx="130" cy="20" r="4" fill="#d4972a" />
          <text x="140" y="16" fill="#2aad6e" fontSize="9" fontFamily="Inter, sans-serif">MAX PAYOUT</text>
          <text x="10" y="105" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">Less precise</text>
          <text x="200" y="105" fill="#555" fontSize="8" fontFamily="Inter, sans-serif">Less precise</text>
        </svg>
        <div style={{ fontFamily: sans, fontSize: 12, color: "#555", textAlign: "center", marginTop: "0.75rem" }}>
          Closer to outcome = higher payout
        </div>
      </div>
    );
  }

  // Data product — live distribution
  return (
    <div style={{ background: "#111", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 420, boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#888" }}>LIVE DISTRIBUTION</span>
        <span style={{ fontFamily: sans, fontSize: 12, color: "#2aad6e" }}>● STREAMING</span>
      </div>
      <svg viewBox="0 0 260 80" style={{ width: "100%", height: 110 }}>
        {/* Animated bars */}
        {Array.from({ length: 20 }).map((_, i) => {
          const h = Math.exp(-Math.pow((i - 10) / 4, 2)) * 65 + 5;
          return (
            <rect key={i} x={i * 13 + 1} y={80 - h} width={10} height={h} rx={2}
              fill={i >= 8 && i <= 12 ? "#d4972a" : "#333"} opacity={i >= 8 && i <= 12 ? 0.9 : 0.4}>
              <animate attributeName="height" dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite"
                values={`${h};${h * 0.85};${h}`} />
              <animate attributeName="y" dur={`${1.5 + i * 0.1}s`} repeatCount="indefinite"
                values={`${80 - h};${80 - h * 0.85};${80 - h}`} />
            </rect>
          );
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: sans, fontSize: 11, color: "#555", marginTop: "0.5rem" }}>
        <span>4.20%</span>
        <span style={{ color: "#d4972a", fontWeight: 600 }}>Consensus: 4.42%</span>
        <span>4.60%</span>
      </div>
    </div>
  );
}




/* ───────── WHO IT'S FOR ───────── */
const personas = [
  {
    icon: "⚽",
    title: "Sports Bettors",
    subtitle: "& Sharps",
    body: "You already think in magnitudes: goal differences, total points, vote margins. Reeshaw gives you one clean instrument with a transparent, proportional payoff. \nWin by one, make a little. Win by four, make four times as much.",
    tag: "DRAFTKINGS · FANDUEL · PRIZEPICKS",
  },
  {
    icon: "📈",
    title: "Fundamental",
    subtitle: "Hedge Funds",
    body: "You have a precise earnings estimate. The market has a price. Reeshaw is where that gap becomes a trade. \nExpress the full magnitude of your conviction on earnings, GDP, and rate decisions. Not just the direction.",
    tag: "MONETIZE YOUR RESEARCH",
  },
  {
    icon: "🔮",
    title: "Polymarket",
    subtitle: "& Kalshi Users",
    body: "You know prediction markets work. You've traded the elections, the rate decisions, the earnings calls. \nYou've also felt the frustration of compressing a precise view into yes or no. This is what comes after binary.",
    tag: "NEXT GENERATION",
  },
  {
    icon: "🧮",
    title: "Investment Banks",
    subtitle: "& Equity Research",
    body: "Sell-side consensus is 15-25 analysts anchored to guidance. Reeshaw's market price is built by a broader set of participants with real capital at stake. \nA more accurate number for your models, your comps, and your materials. Priced by conviction, not sell-side anchoring.",
    tag: "BETTER CONSENSUS",
  },
];

function PersonaCard({ icon, title, subtitle, body, tag }: typeof personas[0]) {
  return (
    <div className="relative" style={{ borderRadius: 20, padding: 3 }}>
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />
      <div
        style={{
          position: "relative",
          background: "#0a0a0a",
          border: "1px solid #1e1e1e",
          borderRadius: 16,
          padding: "2.5rem 2rem",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: "1.5rem" }}>{icon}</div>

        <h3 style={{ fontFamily: sans, fontWeight: 700, fontSize: "1.5rem", color: "#fff", lineHeight: 1.2 }}>
          {title}
        </h3>
        <span style={{ fontFamily: sans, fontWeight: 400, fontSize: "1.5rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.2, display: "block", marginBottom: "1.25rem" }}>
          {subtitle}
        </span>

        <p style={{ fontFamily: sans, fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "auto" }}>
          {body}
        </p>

        <span style={{
          fontFamily: sans,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: "#777",
          borderTop: "1px solid #1e1e1e",
          paddingTop: "1rem",
          marginTop: "1.5rem",
          display: "block",
        }}>
          {tag}
        </span>
      </div>
    </div>
  );
}

function WhoItsFor() {
  return (
    <section
      style={{ padding: "8rem 4rem", maxWidth: 1200, margin: "0 auto" }}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={slowTransition}
        style={{ textAlign: "center", marginBottom: "5rem" }}
      >
        <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", color: "#d4972a" }}>
          /// WHO IT&apos;S FOR
        </span>
        <h2 style={{
          fontFamily: sans,
          fontWeight: 800,
          fontSize: "clamp(2rem, 4vw, 3.2rem)",
          color: "#fff",
          marginTop: "0.75rem",
          letterSpacing: "-0.02em",
        }}>
          Built for anyone who has felt<br />
          the ceiling of <span style={{ color: "#2aad6e" }}>yes</span>/<span style={{ color: "#c0392b" }}>no</span>.
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1.5rem",
        }}
        className="persona-grid"
      >
        {personas.map((p) => (
          <motion.div key={p.title} variants={fadeUp} transition={smoothTransition}>
            <PersonaCard {...p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ───────── CTA ───────── */
function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={slowTransition}
      id="cta"
      style={{
        padding: "10rem 2rem",
        textAlign: "center",
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          fontFamily: sans,
          fontWeight: 800,
          fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
          color: "#fff",
          marginBottom: "2.5rem",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
        }}
      >
        The future of prediction markets
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 0,
          justifyContent: "center",
          maxWidth: 540,
          margin: "0 auto",
        }}
      >
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: 1,
            background: "transparent",
            border: "1px solid #333",
            borderRight: "none",
            borderRadius: "999px 0 0 999px",
            padding: "1rem 1.5rem",
            fontFamily: sans,
            fontSize: 15,
            color: "#f0ede8",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            fontFamily: sans,
            fontSize: 14,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            fontWeight: 600,
            color: submitted ? "#000" : "#fff",
            background: submitted ? "#d4972a" : "#d4972a",
            border: "1px solid #d4972a",
            borderRadius: "0 999px 999px 0",
            padding: "1rem 2rem",
            cursor: "pointer",
            transition: "all 0.2s",
            whiteSpace: "nowrap" as const,
          }}
          onMouseEnter={(e) => { if (!submitted) e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {submitted ? "YOU'RE IN" : loading ? "SAVING..." : "JOIN WAITLIST"}
        </button>
      </form>
      {error && (
        <p style={{ color: "#e74c3c", fontSize: 13, marginTop: "0.75rem", fontFamily: sans }}>
          {error}
        </p>
      )}
    </motion.section>
  );
}

/* ───────── FOOTER ───────── */
function Footer() {
  return (
    <motion.footer
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={smoothTransition}
      style={{
        borderTop: "1px solid #e0e0e0",
        padding: "3rem 4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: sans,
        background: "#fff",
      }}
    >
      <span
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#111",
          letterSpacing: "0.15em",
        }}
      >
        REESHAW
      </span>
      <span style={{ fontSize: 15, color: "#555" }}>reeshaw.ai</span>
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "#d4972a",
          letterSpacing: "0.1em",
        }}
      >
        TRADE THE MAGNITUDE
      </span>
    </motion.footer>
  );
}
