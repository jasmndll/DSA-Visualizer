import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LinearModule({ type = "array" }) {
  const [items, setItems] = useState([15, 42, 8, 23]);
  const [inputValue, setInputValue] = useState("");
  const [highlighted, setHighlighted] = useState(null);

  const handleAddBack = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setItems([...items, val]);
    setInputValue("");
  };

  const handleAddFront = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setItems([val, ...items]);
    setInputValue("");
  };

  const handleRemoveBack = () => {
    if (items.length === 0) return;
    setItems(items.slice(0, -1));
  };

  const handleRemoveFront = () => {
    if (items.length === 0) return;
    setItems(items.slice(1));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="value"
          className="font-body text-[11px] px-2 py-1 border-2 border-ink rounded-win w-20 bg-white"
        />
        
        {type === "deque" ? (
          <>
            <button
              onClick={handleAddFront}
              className="retro-btn font-display text-[10px] px-2 py-1 bg-mint-200 border-2 border-ink rounded-win shadow-winSm hover:bg-mint-300"
            >
              Push Front
            </button>
            <button
              onClick={handleAddBack}
              className="retro-btn font-display text-[10px] px-2 py-1 bg-mint-200 border-2 border-ink rounded-win shadow-winSm hover:bg-mint-300"
            >
              Push Back
            </button>
            <button
              onClick={handleRemoveFront}
              className="retro-btn font-display text-[10px] px-2 py-1 bg-pink-200 border-2 border-ink rounded-win shadow-winSm hover:bg-pink-300"
            >
              Pop Front
            </button>
            <button
              onClick={handleRemoveBack}
              className="retro-btn font-display text-[10px] px-2 py-1 bg-pink-200 border-2 border-ink rounded-win shadow-winSm hover:bg-pink-300"
            >
              Pop Back
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleAddBack}
              className="retro-btn font-display text-[10px] px-2 py-1 bg-mint-200 border-2 border-ink rounded-win shadow-winSm hover:bg-mint-300"
            >
              {type === "stack" ? "Push" : type === "queue" ? "Enqueue" : "Insert"}
            </button>
            <button
              onClick={type === "queue" ? handleRemoveFront : handleRemoveBack}
              className="retro-btn font-display text-[10px] px-2 py-1 bg-pink-200 border-2 border-ink rounded-win shadow-winSm hover:bg-pink-300"
            >
              {type === "stack" ? "Pop" : type === "queue" ? "Dequeue" : "Delete"}
            </button>
          </>
        )}
      </div>

      <div className="bg-ink/95 rounded-win p-4 border-2 border-ink min-h-[120px] flex items-center justify-center">
        <div className={`flex gap-2 ${type === 'stack' ? 'flex-col-reverse' : 'flex-row'}`}>
          <AnimatePresence>
            {items.map((val, idx) => (
              <motion.div
                key={`${idx}-${val}`}
                initial={{ opacity: 0, scale: 0.8, y: type === 'stack' ? -20 : 0, x: type === 'queue' || type === 'deque' ? -20 : 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                layout
                className="w-10 h-10 bg-sand-100 border-2 border-ink flex items-center justify-center font-display text-sm font-bold shadow-winSm relative"
              >
                {val}
                <div className="absolute -bottom-4 text-[8px] text-white/50 font-body">
                  {idx}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <span className="text-white/40 font-body text-xs">Empty {type}</span>
          )}
        </div>
      </div>
    </div>
  );
}
