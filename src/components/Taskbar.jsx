import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function Taskbar({ openWindows, xp, level }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-sand-100 border-t-2 border-ink flex items-center justify-between px-2 z-50">
      <div className="flex items-center gap-2 h-full py-1">
        <button className="retro-btn h-full px-3 flex items-center gap-2 bg-pink-200 border-2 border-ink shadow-winSm font-display font-bold text-[12px] hover:bg-pink-300">
          <span>❖</span>
          START
        </button>
        
        {/* Open Windows Tabs */}
        <div className="flex items-center gap-1 ml-2">
          {openWindows.map((win, idx) => (
            <div key={idx} className="h-full px-3 flex items-center bg-white border-2 border-ink font-body text-[10px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.1)]">
              {win.toLowerCase()}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 h-full py-1">
        <div className="h-full px-3 flex items-center bg-white border-2 border-ink font-body text-[10px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.1)] gap-2">
          <span>⭐ Lvl {level}</span>
          <span className="text-ink/50">|</span>
          <span>{xp} XP</span>
        </div>
        <div className="h-full px-3 flex items-center bg-white border-2 border-ink font-body text-[10px] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.1)]">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
