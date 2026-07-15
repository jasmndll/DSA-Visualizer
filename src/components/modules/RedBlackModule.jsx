import { useState, useMemo } from "react";
import { useStepEngine } from "../../engine/useStepEngine";
import { generateRedBlackSteps, redBlackPseudocode } from "../../algorithms/redBlackTree";

import TreeCanvas from "../visualizers/TreeCanvas";
import PlaybackControls from "../PlaybackControls";

const DEFAULT_VALUES = [10, 20, 30, 15, 25, 5, 1];

export default function RedBlackModule() {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [customInput, setCustomInput] = useState("");

  const steps = useMemo(() => generateRedBlackSteps(values), [values]);
  const engine = useStepEngine(steps, { initialSpeed: 4 });

  const handleLoadCustom = () => {
    const parsed = customInput
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));
    const unique = [...new Set(parsed)].slice(0, 10);
    if (unique.length > 0) setValues(unique);
  };

  const handleReset = () => setValues(DEFAULT_VALUES);

  const step = engine.currentStep;

  return (
    <div className="space-y-3">
      {/* Header legend */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-red-400 border border-ink" />
          <span className="font-body text-[10px] text-ink/70">RED node</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gray-700 border border-ink" />
          <span className="font-body text-[10px] text-ink/70">BLACK node</span>
        </div>
      </div>

      {/* Custom input */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="e.g. 10,20,30,15"
          className="font-body text-[11px] px-2 py-1 border-2 border-ink rounded-win w-40 bg-white"
        />
        <button
          onClick={handleLoadCustom}
          className="retro-btn font-display text-[10px] px-2 py-1 bg-pink-200 border-2 border-ink rounded-win shadow-winSm hover:bg-pink-300"
        >
          Load
        </button>
        <button
          onClick={handleReset}
          className="retro-btn font-display text-[10px] px-2 py-1 bg-sand-100 border-2 border-ink rounded-win shadow-winSm hover:bg-sand-200"
        >
          Reset
        </button>
      </div>

      {/* Tree Visualization */}
      <TreeCanvas step={step} isRB={true} />

      {/* Playback */}
      <PlaybackControls engine={engine} />

      {/* Trace */}
      <div
        className="font-body text-[11px] bg-white border-2 border-ink rounded-win p-2 min-h-[36px]"
        aria-live="polite"
      >
        {step?.trace ?? "Press play to begin."}
      </div>

      {/* Pseudocode */}
      <div className="font-body text-[10px] bg-ink/95 text-mint-200 rounded-win p-2 leading-relaxed">
        {redBlackPseudocode.map((line, i) => (
          <div
            key={i}
            className={`px-1 rounded-sm ${step?.line === i ? "bg-lilac-400/40 text-white" : ""}`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
