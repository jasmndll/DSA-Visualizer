import { useState, useMemo, useEffect } from "react";
import { useStepEngine } from "../../engine/useStepEngine";
import { generateNQueensSteps, nQueensPseudocode } from "../../algorithms/nQueens";

import Chessboard from "../visualizers/Chessboard";
import PlaybackControls from "../PlaybackControls";

const ALGORITHMS = {
  nqueens: {
    id: "nqueens",
    name: "N-Queens",
    generator: generateNQueensSteps,
    pseudocode: nQueensPseudocode,
  },
};

export default function BacktrackingModule() {
  const [activeAlgo, setActiveAlgo] = useState("nqueens");
  const [nValue, setNValue] = useState(4); // Default to 4x4
  
  const algoConfig = ALGORITHMS[activeAlgo];
  
  const steps = useMemo(() => algoConfig.generator(nValue), [nValue, algoConfig]);
  const engine = useStepEngine(steps, { initialSpeed: 5 });

  const handleApplyN = (e) => {
    let val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 4 && val <= 8) {
      setNValue(val);
    }
  };

  const step = engine.currentStep;

  return (
    <div className="space-y-3">
      {/* Algorithm Selection & Inputs */}
      <div className="flex items-center gap-2 flex-wrap">
        <label className="font-display text-[10px] text-ink/70 uppercase">
          Algorithm:
        </label>
        <select
          value={activeAlgo}
          onChange={(e) => setActiveAlgo(e.target.value)}
          className="font-body text-[11px] px-2 py-1 border-2 border-ink rounded-win bg-white outline-none"
        >
          {Object.values(ALGORITHMS).map((algo) => (
            <option key={algo.id} value={algo.id}>
              {algo.name}
            </option>
          ))}
        </select>

        {activeAlgo === "nqueens" && (
          <div className="flex items-center gap-2 ml-4">
            <label className="font-display text-[10px] text-ink/70 uppercase">
              Board Size (N):
            </label>
            <input
              type="number"
              min="4"
              max="8"
              value={nValue}
              onChange={handleApplyN}
              className="font-body text-[11px] px-2 py-1 border-2 border-ink rounded-win w-16 bg-white"
            />
          </div>
        )}
      </div>

      {/* Visualization */}
      <div className="bg-ink/5 rounded-win border border-ink/20 p-2">
         <Chessboard step={step} />
      </div>

      {/* Playback */}
      <PlaybackControls engine={engine} />

      {/* Trace log */}
      <div
        className="font-body text-[11px] bg-white border-2 border-ink rounded-win
                   p-2 min-h-[36px]"
        aria-live="polite"
      >
        {step?.trace ?? "Press play to begin."}
      </div>

      {/* Pseudocode */}
      <div className="font-body text-[10px] bg-ink/95 text-mint-200 rounded-win p-2 leading-relaxed">
        {algoConfig.pseudocode.map((line, i) => (
          <div
            key={i}
            className={`px-1 rounded-sm ${
              step?.line === i ? "bg-lilac-400/40 text-white" : ""
            }`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
