import { useState, useEffect } from "react";
import { format } from "date-fns";

const TOOLS = [
  { id: "editor", label: "Code Editor", glyph: "💻" },
  { id: "chatbot", label: "Ask Chatbot", glyph: "💬" },
  { id: "progress", label: "My Progress", glyph: "📈" },
];

export default function MonitorFrame({ children, onOpenTool }) {
  const [time, setTime] = useState(new Date());
  const [scanline, setScanline] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Subtle scanline flicker
  useEffect(() => {
    const tick = setInterval(() => setScanline((s) => (s + 1) % 2), 4000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div
      className="relative flex flex-col"
      style={{
        minHeight: "100vh",
        background: "#c8b89a",
        padding: "18px 18px 18px 18px",
        boxSizing: "border-box",
      }}
    >
      {/* ── OUTER BEZEL ── */}
      <div
        className="relative flex flex-col flex-1 overflow-hidden"
        style={{
          border: "6px solid #8b7355",
          borderRadius: "14px",
          boxShadow:
            "inset 0 0 0 3px #a08060, 0 0 0 1px #c8b89a, 4px 4px 0 #6b5535, 8px 8px 0 rgba(0,0,0,0.15)",
          background: "#fdfcf8",
          overflow: "hidden",
        }}
      >
        {/* Inner highlight ring */}
        <div
          className="absolute inset-0 pointer-events-none z-50 rounded-[8px]"
          style={{
            boxShadow:
              "inset 2px 2px 0 rgba(255,255,255,0.6), inset -2px -2px 0 rgba(0,0,0,0.12)",
            borderRadius: "8px",
          }}
        />

        {/* Line-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none z-40 rounded-[8px]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,23,20,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,23,20,0.06) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Soft inner shadow vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-40 rounded-[8px]"
          style={{
            boxShadow: "inset 0 0 30px rgba(139,115,85,0.12)",
          }}
        />

        {/* ── TOP TOOLBAR (Tools + Clock) ── */}
        <div
          className="relative z-30 flex items-center justify-between px-3 py-1.5 shrink-0"
          style={{
            borderBottom: "2px solid #1a1714",
            background:
              "linear-gradient(to bottom, #e8dcc8 0%, #d4c4a8 100%)",
          }}
        >
          {/* Left: branding */}
          <div className="flex items-center gap-3">
            <span
              className="font-display font-bold text-[13px] tracking-widest"
              style={{ color: "#1a1714", letterSpacing: "0.15em" }}
            >
              ◈ DSA<span style={{ color: "#7c3aed" }}>·</span>VISUALIZER
            </span>
            <span
              className="font-body text-[9px] uppercase tracking-widest opacity-50"
              style={{ color: "#1a1714" }}
            >
              v2.0
            </span>
          </div>

          {/* Center: Tools quick-launch */}
          <div className="flex items-center gap-2">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onOpenTool(tool.id)}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-sm transition-all duration-150"
                style={{
                  background: "rgba(255,255,255,0.5)",
                  border: "2px solid #1a1714",
                  color: "#1a1714",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d8b4fe";
                  e.currentTarget.style.borderColor = "#1a1714";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.5)";
                  e.currentTarget.style.borderColor = "#1a1714";
                }}
                title={tool.label}
              >
                <span className="text-[13px]">{tool.glyph}</span>
                <span className="font-display text-[10px] tracking-wide font-bold">
                  {tool.label}
                </span>
              </button>
            ))}
          </div>

          {/* Right: clock + power LED */}
          <div className="flex items-center gap-3">
            <span
              className="font-body text-[11px] tabular-nums"
              style={{ color: "#1a1714", fontFamily: "monospace", fontWeight: "bold" }}
            >
              {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            {/* Power LED */}
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: "#22ff44",
                boxShadow: "0 0 6px #22ff44, 0 0 12px rgba(34,255,68,0.4)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* ── SCREEN AREA ── */}
        <div className="relative z-10 flex-1 overflow-auto" style={{ background: "transparent" }}>
          {children}
        </div>

        {/* ── BOTTOM STATUS BAR ── */}
        <div
          className="relative z-30 flex items-center justify-between px-3 py-1 shrink-0"
          style={{
            borderTop: "2px solid #1a1714",
            background: "linear-gradient(to top, #e8dcc8 0%, #d4c4a8 100%)",
          }}
        >
          <span className="font-body text-[9px] opacity-60" style={{ color: "#1a1714" }}>
            DISPLAY DRIVER OK
          </span>
          <span className="font-body text-[9px] opacity-60" style={{ color: "#1a1714" }}>
            1024×768 · 60Hz · RETRO-VGA
          </span>
        </div>
      </div>

      {/* ── MONITOR BASE / STAND ── */}
      <div className="flex justify-center mt-3 shrink-0">
        <div
          style={{
            width: "180px",
            height: "14px",
            background: "linear-gradient(to bottom, #a08060, #8b7050)",
            borderRadius: "0 0 8px 8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        />
      </div>
      <div className="flex justify-center shrink-0">
        <div
          style={{
            width: "300px",
            height: "8px",
            background: "linear-gradient(to bottom, #8b7050, #c8b89a)",
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Pulsing LED keyframe */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
