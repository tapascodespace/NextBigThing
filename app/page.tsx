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
          <div style={{
            background: "#111",
            borderRadius: 20,
            padding: "2.5rem",
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", borderBottom: "1px solid #222", paddingBottom: "0.75rem" }}>
              <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#888" }}>MARKET</span>
              <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#888" }}>TYPE</span>
            </div>
            {[
              { market: "Fed Rate Cut?", type: "BINARY", color: "#c0392b" },
              { market: "NVDA Beats?", type: "BINARY", color: "#c0392b" },
              { market: "Election Winner?", type: "BINARY", color: "#c0392b" },
            ].map((row) => (
              <div key={row.market} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #1a1a1a" }}>
                <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 500, color: "#eee" }}>{row.market}</span>
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: row.color }}>{row.type}</span>
              </div>
            ))}
            <p style={{ fontFamily: sans, fontSize: 11, color: "#555", marginTop: "1rem", textAlign: "center" }}>
              One outcome. No precision. No edge.
            </p>
          </div>
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
          <div style={{
            background: "#111",
            borderRadius: 20,
            padding: "2.5rem",
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: "#fff" }}>FED FUNDS RATE</span>
              <span style={{ fontFamily: sans, fontSize: 11, color: "#2aad6e" }}>● LIVE</span>
            </div>
            <div style={{ fontFamily: sans, fontSize: 11, color: "#666", marginBottom: "1rem" }}>Your prediction: 4.42%</div>
            {/* Mini chart */}
            <svg viewBox="0 0 280 80" style={{ width: "100%", height: 80 }}>
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4972a" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#d4972a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,60 Q30,55 60,50 T120,35 T180,30 T240,22 T280,18" fill="none" stroke="#d4972a" strokeWidth="2">
                <animate attributeName="d" dur="4s" repeatCount="indefinite"
                  values="M0,60 Q30,55 60,50 T120,35 T180,30 T240,22 T280,18;M0,58 Q30,50 60,45 T120,38 T180,25 T240,20 T280,22;M0,60 Q30,55 60,50 T120,35 T180,30 T240,22 T280,18" />
              </path>
              <path d="M0,60 Q30,55 60,50 T120,35 T180,30 T240,22 T280,18 L280,80 L0,80 Z" fill="url(#chartFill)">
                <animate attributeName="d" dur="4s" repeatCount="indefinite"
                  values="M0,60 Q30,55 60,50 T120,35 T180,30 T240,22 T280,18 L280,80 L0,80 Z;M0,58 Q30,50 60,45 T120,38 T180,25 T240,20 T280,22 L280,80 L0,80 Z;M0,60 Q30,55 60,50 T120,35 T180,30 T240,22 T280,18 L280,80 L0,80 Z" />
              </path>
              {/* Dot at end */}
              <circle cx="280" cy="18" r="4" fill="#d4972a">
                <animate attributeName="cy" dur="4s" repeatCount="indefinite" values="18;22;18" />
              </circle>
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
              <span style={{ fontFamily: sans, fontSize: 12, color: "#aaa" }}>Precision: <span style={{ color: "#2aad6e", fontWeight: 600 }}>High</span></span>
              <span style={{ fontFamily: sans, fontSize: 12, color: "#aaa" }}>P&L: <span style={{ color: "#2aad6e", fontWeight: 600 }}>+$842</span></span>
            </div>
          </div>
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
    // Single instrument — show merging lines into one
    return (
      <div style={{ background: "#111", borderRadius: 20, padding: "2.5rem", width: "100%", maxWidth: 420, boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
        <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#888", marginBottom: "1.5rem" }}>ORDER BOOK</div>
        {[
          { price: "4.38%", size: "45%", side: "bid" },
          { price: "4.40%", size: "72%", side: "bid" },
          { price: "4.42%", size: "100%", side: "center" },
          { price: "4.44%", size: "65%", side: "ask" },
          { price: "4.46%", size: "35%", side: "ask" },
        ].map((row) => (
          <div key={row.price} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <span style={{ fontFamily: sans, fontSize: 14, color: "#aaa", width: 55 }}>{row.price}</span>
            <div style={{ flex: 1, height: 8, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                width: row.size,
                height: "100%",
                borderRadius: 4,
                background: row.side === "center" ? "#d4972a" : row.side === "bid" ? "#2aad6e" : "#c0392b",
                opacity: row.side === "center" ? 1 : 0.6,
              }} />
            </div>
          </div>
        ))}
        <div style={{ fontFamily: sans, fontSize: 12, color: "#555", textAlign: "center", marginTop: "1.25rem" }}>
          Single deep order book
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
