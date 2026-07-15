export default function TreeModule() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button className="retro-btn font-display text-[10px] px-2 py-1 bg-mint-200 border-2 border-ink rounded-win shadow-winSm hover:bg-mint-300">
          Insert
        </button>
      </div>
      <div className="bg-ink/95 rounded-win p-4 border-2 border-ink min-h-[160px] flex items-center justify-center relative">
        <div className="flex flex-col items-center">
          {/* Simple static tree visualization */}
          <div className="w-10 h-10 bg-mint-200 border-2 border-ink rounded-full flex items-center justify-center font-display font-bold shadow-winSm z-10">50</div>
          <div className="flex w-32 justify-between mt-4 relative">
             <svg className="absolute -top-6 left-0 w-full h-8 -z-0 pointer-events-none" style={{overflow: 'visible'}}>
                <line x1="50%" y1="0" x2="10%" y2="100%" stroke="#FDFCF8" strokeWidth="2" opacity="0.3" />
                <line x1="50%" y1="0" x2="90%" y2="100%" stroke="#FDFCF8" strokeWidth="2" opacity="0.3" />
             </svg>
             <div className="w-10 h-10 bg-mint-200 border-2 border-ink rounded-full flex items-center justify-center font-display font-bold shadow-winSm z-10">25</div>
             <div className="w-10 h-10 bg-mint-200 border-2 border-ink rounded-full flex items-center justify-center font-display font-bold shadow-winSm z-10">75</div>
          </div>
        </div>
      </div>
    </div>
  );
}
