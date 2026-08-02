import { MODERN_START_BTN_CLASSES, MODERN_TAB_CLASSES } from "../utils/design-tokens";

export default function Taskbar({ openWindows, xp, level }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#F6F6F2] border-t border-gray-200 flex items-center justify-between px-6 z-50">
      {/* Left: Open Windows Tabs */}
      <div className="flex items-center gap-2 h-full py-2 w-1/3">
        {openWindows.map((win, idx) => (
          <button key={idx} className={MODERN_TAB_CLASSES}>
            {win}
          </button>
        ))}
      </div>

      {/* Center: START button */}
      <div className="flex items-center justify-center w-1/3">
        <button className={MODERN_START_BTN_CLASSES}>
          START
        </button>
      </div>

      {/* Right: XP Widget */}
      <div className="flex items-center justify-end h-full py-2 w-1/3 gap-3">
        <div className="px-4 py-1.5 flex items-center bg-[#FCF5E3] border border-[#F0E0B0] text-slate-800 font-display text-xs font-semibold shadow-sm rounded-full gap-2">
          <span className="text-yellow-500 text-sm">⭐</span> 
          <span>Lvl {level}</span>
          <span className="text-yellow-600/30">|</span>
          <span>{xp} XP</span>
        </div>
      </div>
    </div>
  );
}
