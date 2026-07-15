export default function PlaybackControls({ engine }) {
  return (
    <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
      <div className="flex items-center gap-1.5">
        <CtrlBtn onClick={engine.prev} disabled={!engine.canPrev} label="prev">
          ◀◀
        </CtrlBtn>
        <CtrlBtn
          onClick={engine.isPlaying ? engine.pause : engine.play}
          label={engine.isPlaying ? "pause" : "play"}
          primary
        >
          {engine.isPlaying ? "❚❚" : "▶"}
        </CtrlBtn>
        <CtrlBtn onClick={engine.next} disabled={!engine.canNext} label="next">
          ▶▶
        </CtrlBtn>
        <CtrlBtn onClick={engine.reset} label="reset">
          ↺
        </CtrlBtn>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="font-body text-[10px] text-ink/60">slow</span>
        <input
          type="range"
          min="1"
          max="10"
          value={engine.speed}
          onChange={(e) => engine.setSpeed(Number(e.target.value))}
          className="w-20 accent-pink-400"
        />
        <span className="font-body text-[10px] text-ink/60">fast</span>
      </div>

      <span className="font-display text-[10px] px-2 py-1 bg-mint-100 border border-ink rounded-win">
        {engine.progressLabel}
      </span>
    </div>
  );
}

function CtrlBtn({ children, onClick, disabled, label, primary }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`retro-btn w-8 h-8 flex items-center justify-center text-xs
                  border-2 border-ink rounded-win shadow-winSm
                  disabled:opacity-30 disabled:cursor-not-allowed
                  ${primary ? "bg-pink-200 hover:bg-pink-300" : "bg-paper hover:bg-white"}`}
    >
      {children}
    </button>
  );
}
