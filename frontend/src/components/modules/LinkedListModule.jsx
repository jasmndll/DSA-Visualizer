import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeftRight } from "lucide-react";

export default function LinkedListModule({ type = "singly" }) {
  const [nodes, setNodes] = useState([10, 20, 30]);
  const [inputValue, setInputValue] = useState("");

  const handleInsertTail = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setNodes([...nodes, val]);
    setInputValue("");
  };

  const handleInsertHead = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    setNodes([val, ...nodes]);
    setInputValue("");
  };

  const handleDeleteTail = () => {
    if (nodes.length === 0) return;
    setNodes(nodes.slice(0, -1));
  };

  const handleDeleteHead = () => {
    if (nodes.length === 0) return;
    setNodes(nodes.slice(1));
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
        <button
          onClick={handleInsertHead}
          className="retro-btn font-display text-[10px] px-2 py-1 bg-mint-200 border-2 border-ink rounded-win shadow-winSm hover:bg-mint-300"
        >
          Insert Head
        </button>
        <button
          onClick={handleInsertTail}
          className="retro-btn font-display text-[10px] px-2 py-1 bg-mint-200 border-2 border-ink rounded-win shadow-winSm hover:bg-mint-300"
        >
          Insert Tail
        </button>
        <button
          onClick={handleDeleteHead}
          className="retro-btn font-display text-[10px] px-2 py-1 bg-pink-200 border-2 border-ink rounded-win shadow-winSm hover:bg-pink-300"
        >
          Delete Head
        </button>
        <button
          onClick={handleDeleteTail}
          className="retro-btn font-display text-[10px] px-2 py-1 bg-pink-200 border-2 border-ink rounded-win shadow-winSm hover:bg-pink-300"
        >
          Delete Tail
        </button>
      </div>

      <div className="bg-ink/95 rounded-win p-4 border-2 border-ink min-h-[120px] flex items-center overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max px-2">
          {type === "doubly" && nodes.length > 0 && (
             <div className="mr-2 flex items-center gap-1 text-white/50 text-xs font-body">
               null <ArrowLeftRight size={16} />
             </div>
          )}
          <AnimatePresence>
            {nodes.map((val, idx) => (
              <motion.div
                key={`${idx}-${val}`}
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                layout
                className="flex items-center"
              >
                {/* Node Box */}
                <div className="w-12 h-10 bg-lilac-400 border-2 border-ink flex items-center justify-center font-display text-sm font-bold shadow-winSm relative">
                  {val}
                  {idx === 0 && <span className="absolute -bottom-4 text-[8px] text-white/50 font-body">head</span>}
                  {idx === nodes.length - 1 && idx !== 0 && <span className="absolute -bottom-4 text-[8px] text-white/50 font-body">tail</span>}
                </div>
                
                {/* Next Pointer Arrow (except last node) */}
                {idx < nodes.length - 1 && (
                  <div className="w-8 flex justify-center text-white/50">
                    {type === "doubly" ? <ArrowLeftRight size={16} /> : <ArrowRight size={16} />}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {nodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-2 flex items-center gap-1 text-white/50 text-xs font-body"
            >
              {type === "doubly" ? <ArrowLeftRight size={16} /> : <ArrowRight size={16} />} null
            </motion.div>
          )}
          {nodes.length === 0 && (
            <span className="text-white/40 font-body text-xs">Empty {type === "doubly" ? "Doubly " : ""}Linked List</span>
          )}
        </div>
      </div>
    </div>
  );
}
