export default function GraphModule() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button className="retro-btn font-display text-[10px] px-2 py-1 bg-blue-300 border-2 border-ink rounded-win shadow-winSm hover:bg-blue-400">
          Run Dijkstra
        </button>
      </div>
      <div className="bg-ink/95 rounded-win p-4 border-2 border-ink min-h-[160px] flex items-center justify-center relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{overflow: 'visible'}}>
           <line x1="20%" y1="30%" x2="50%" y2="70%" stroke="#FDFCF8" strokeWidth="2" opacity="0.3" />
           <line x1="50%" y1="70%" x2="80%" y2="30%" stroke="#FDFCF8" strokeWidth="2" opacity="0.3" />
           <line x1="20%" y1="30%" x2="80%" y2="30%" stroke="#FDFCF8" strokeWidth="2" opacity="0.3" />
        </svg>
        <div className="absolute top-[30%] left-[20%] w-10 h-10 -ml-5 -mt-5 bg-blue-300 border-2 border-ink rounded-full flex items-center justify-center font-display font-bold shadow-winSm">A</div>
        <div className="absolute top-[70%] left-[50%] w-10 h-10 -ml-5 -mt-5 bg-blue-300 border-2 border-ink rounded-full flex items-center justify-center font-display font-bold shadow-winSm">B</div>
        <div className="absolute top-[30%] left-[80%] w-10 h-10 -ml-5 -mt-5 bg-blue-300 border-2 border-ink rounded-full flex items-center justify-center font-display font-bold shadow-winSm">C</div>
      </div>
    </div>
  );
}
