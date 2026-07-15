import { useState, useMemo } from "react";
import { useStepEngine } from "../../engine/useStepEngine";
import {
  generateBubbleSortSteps,
  bubbleSortPseudocode,
  randomArray,
} from "../../algorithms/bubbleSort";
import ArrayBars from "../visualizers/ArrayBars";
import PlaybackControls from "../PlaybackControls";

export default function BubbleSortModule() {
  const [array, setArray] = useState(() => randomArray(8));
  const [customInput, setCustomInput] = useState("");
  const steps = useMemo(() => generateBubbleSortSteps(array), [array]);
  const engine = useStepEngine(steps, { initialSpeed: 5 });

  const handleRandomize = () => setArray(randomArray(8));

  const handleLoadCustom = () => {
    const parsed = customInput
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x) && x > 0 && x <= 100);
    if (parsed.length > 0) setArray(parsed.slice(0, 12));
  };

  const step = engine.currentStep;

  return (
    <div className="space-y-3">
      {/* Input controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleRandomize}
          className="retro-btn font-display text-[10px] px-2 py-1 bg-sand-100
                     border-2 border-ink rounded-win shadow-winSm hover:bg-sand-200"
        >
          🔀 randomize
        </button>
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="e.g. 35, 12, 67, 8"
          className="font-body text-[11px] px-2 py-1 border-2 border-ink
                     rounded-win w-32 bg-white"
        />
        <button
          onClick={handleLoadCustom}
          className="retro-btn font-display text-[10px] px-2 py-1 bg-pink-200
                     border-2 border-ink rounded-win shadow-winSm hover:bg-pink-300"
        >
          load
        </button>
      </div>

      {/* Visualization */}
      <ArrayBars step={step} />

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
        {bubbleSortPseudocode.map((line, i) => (
          <div
            key={i}
            className={`px-1 rounded-sm ${
              step?.line === i + 1 ? "bg-lilac-400/40 text-white" : ""
            }`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
