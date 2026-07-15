import { motion } from "framer-motion";

export default function Chessboard({ step }) {
  if (!step || !step.customData) return null;

  const { board, N, activeRow, activeCol } = step.customData;

  const cells = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const isBlack = (r + c) % 2 === 1;
      const hasQueen = board[r] === c;
      const isActive = r === activeRow && c === activeCol;

      let bgColor = isBlack ? "bg-ink/80" : "bg-white";
      if (isActive) {
        bgColor = "bg-mint-300"; // highlighted
      } else if (hasQueen && isActive) {
        bgColor = "bg-pink-300"; // placing
      }

      cells.push(
        <div
          key={`${r}-${c}`}
          className={`w-10 h-10 border border-ink/20 flex items-center justify-center ${bgColor}`}
        >
          {hasQueen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl drop-shadow-md"
            >
              ♛
            </motion.div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div 
        className="grid border-2 border-ink shadow-win"
        style={{ gridTemplateColumns: `repeat(${N}, 40px)` }}
      >
        {cells}
      </div>
    </div>
  );
}
