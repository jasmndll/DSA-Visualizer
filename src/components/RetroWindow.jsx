export default function RetroWindow({ title, accent, className = "", onClose, children }) {
  // Map accent to background color
  const accentColors = {
    sand: "bg-sand-200",
    mint: "bg-mint-200",
    blue: "bg-blue-300",
    lilac: "bg-lilac-400",
    pink: "bg-pink-300"
  };

  const headerBg = accentColors[accent] || "bg-ink";
  const headerText = accent === "ink" ? "text-white" : "text-ink";

  return (
    <div className={`flex flex-col bg-paper border-2 border-ink rounded-win shadow-winSm ${className}`}>
      {/* Window Title Bar */}
      <div className={`flex items-center justify-between px-2 py-1 border-b-2 border-ink ${headerBg} ${headerText}`}>
        <div className="font-display text-[12px] font-bold tracking-wide">
          {title}
        </div>
        <button
          onClick={onClose}
          className="retro-btn w-5 h-5 flex items-center justify-center bg-paper border-2 border-ink shadow-winSm text-[10px] font-bold hover:bg-white"
          aria-label="Close"
        >
          X
        </button>
      </div>
      {/* Window Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
