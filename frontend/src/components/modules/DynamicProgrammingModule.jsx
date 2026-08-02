import { useState, useMemo } from "react";
import { useStepEngine } from "../../engine/useStepEngine";
import { generateKnapsackSteps, knapsackPseudocode } from "../../algorithms/knapsack";

import DPTable from "../visualizers/DPTable";
import PlaybackControls from "../PlaybackControls";

const ALGORITHMS = {
  knapsack: {
    id: "knapsack",
    name: "0/1 Knapsack",
    generator: generateKnapsackSteps,
    pseudocode: knapsackPseudocode,
  },
};

const DEFAULT_ITEMS = [
  { weight: 1, value: 1 },
  { weight: 3, value: 4 },
  { weight: 4, value: 5 },
  { weight: 5, value: 7 }
];
const DEFAULT_CAPACITY = 7;

export default function DynamicProgrammingModule() {
  const [activeAlgo, setActiveAlgo] = useState("knapsack");
  
  // Using fixed inputs for now
  const items = DEFAULT_ITEMS;
  const capacity = DEFAULT_CAPACITY;
  
  const algoConfig = ALGORITHMS[activeAlgo];
  
  const steps = useMemo(() => algoConfig.generator(items, capacity), [items, capacity, algoConfig]);
  const engine = useStepEngine(steps, { initialSpeed: 3 });

  const step = engine.currentStep;

  return (
    <div className="space-y-3">
      {/* Algorithm Selection */}
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
        
        {activeAlgo === "knapsack" && (
          <div className="ml-4 font-body text-[10px] text-ink/60 bg-white border border-ink/20 px-2 py-1 rounded">
            Capacity: {capacity} | Items: {items.length}
          </div>
        )}
      </div>

      {/* Visualization */}
      <div className="bg-ink/5 rounded-win border border-ink/20 p-2 overflow-x-auto">
        <DPTable step={step} items={items} />
      </div>

      {/* Playback */}
      <PlaybackControls engine={engine} />

      {/* Trace log */}
      <div
        className="font-body text-[11px] bg-white border-2 border-ink rounded-win p-2 min-h-[36px]"
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
              step?.line === (i + 1) ? "bg-lilac-400/40 text-white" : ""
            }`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
