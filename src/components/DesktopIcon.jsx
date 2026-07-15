export default function DesktopIcon({ label, glyph, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group w-20 text-center"
    >
      <div className="w-12 h-12 bg-ink/10 border-2 border-transparent group-hover:border-ink rounded-lg flex items-center justify-center text-2xl shadow-sm transition-all group-active:scale-95 group-active:bg-ink/20">
        {glyph}
      </div>
      <span className="font-display text-[11px] text-ink/90 font-medium leading-tight px-1 group-hover:bg-ink group-hover:text-white rounded-sm">
        {label}
      </span>
    </button>
  );
}
