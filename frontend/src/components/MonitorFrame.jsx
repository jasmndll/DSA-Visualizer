import { Terminal, MessageSquare, TrendingUp, User, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClock } from "../hooks/useClock";
import { MODERN_TOOLBAR_BTN_CLASSES } from "../utils/design-tokens";

const TOOLS = [
  { id: "editor", label: "Code Editor", icon: Terminal },
  { id: "chatbot", label: "Ask Chatbot", icon: MessageSquare },
  { id: "progress", label: "My Progress", icon: TrendingUp },
  { id: "account", label: "Account", icon: User },
];

export default function MonitorFrame({ children, onOpenTool }) {
  const time = useClock(1000);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#4C5B6B] px-6 pt-6 pb-20">
      {/* ── TOP TOOLBAR ── */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: branding */}
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-2xl text-white tracking-widest flex items-center">
            DSA <span className="text-[#E5E9EC] mx-2 text-xl">•</span> VISUALIZER
          </span>
          <span className="font-display text-xs text-white/50 uppercase tracking-widest mt-1">
            v2.0
          </span>
        </div>

        {/* Center: Tools quick-launch */}
        <div className="flex items-center gap-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  if (tool.id === "chatbot") {
                    navigate("/chat");
                  } else if (tool.id === "editor") {
                    navigate("/editor");
                  } else {
                    onOpenTool && onOpenTool(tool.id);
                  }
                }}
                className={MODERN_TOOLBAR_BTN_CLASSES}
                title={tool.label}
              >
                <Icon size={16} strokeWidth={2} />
                <span className="font-display text-sm font-medium">
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: clock pill */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5E9EC] shadow-sm border border-[#3E4C5A]">
          <span className="font-body text-sm font-medium text-slate-800 tabular-nums">
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
          <Activity size={18} strokeWidth={2.5} className="text-green-500" />
        </div>
      </div>

      {/* ── INNER SCREEN AREA ── */}
      <div className="relative flex-1 bg-[#F6F6F2] rounded-2xl overflow-hidden shadow-xl border border-gray-200/50">
        {/* Line-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(#E3E3DC 1px, transparent 1px), linear-gradient(90deg, #E3E3DC 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 w-full h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
