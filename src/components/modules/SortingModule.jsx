import { useState, useMemo, useEffect } from "react";
import { useStepEngine } from "../../engine/useStepEngine";
import {
  generateBubbleSortSteps,
  bubbleSortPseudocode,
  randomArray,
} from "../../algorithms/bubbleSort";
import {
  generateInsertionSortSteps,
  insertionSortPseudocode,
} from "../../algorithms/insertionSort";
import {
  generateMergeSortSteps,
  mergeSortPseudocode,
} from "../../algorithms/mergeSort";
import {
  generateQuickSortSteps,
  quickSortPseudocode,
} from "../../algorithms/quickSort";
import {
  generateHeapSortSteps,
  heapSortPseudocode,
} from "../../algorithms/heapSort";
import {
  generateCountingSortSteps,
  countingSortPseudocode,
} from "../../algorithms/countingSort";

import ArrayBars from "../visualizers/ArrayBars";
import PlaybackControls from "../PlaybackControls";

const ALGORITHMS = {
  bubble: {
    id: "bubble",
    name: "Bubble Sort",
    generator: generateBubbleSortSteps,
    pseudocode: bubbleSortPseudocode,
  },
  insertion: {
    id: "insertion",
    name: "Insertion Sort",
    generator: generateInsertionSortSteps,
    pseudocode: insertionSortPseudocode,
  },
  merge: {
    id: "merge",
    name: "Merge Sort",
    generator: generateMergeSortSteps,
    pseudocode: mergeSortPseudocode,
  },
  quick: {
    id: "quick",
    name: "Quick Sort",
    generator: generateQuickSortSteps,
    pseudocode: quickSortPseudocode,
  },
  heap: {
    id: "heap",
    name: "Heap Sort",
    generator: generateHeapSortSteps,
    pseudocode: heapSortPseudocode,
  },
  counting: {
    id: "counting",
    name: "Counting Sort",
    generator: generateCountingSortSteps,
    pseudocode: countingSortPseudocode,
  },
};

export default function SortingModule() {
  const [activeAlgo, setActiveAlgo] = useState("bubble");
  const [array, setArray] = useState(() => randomArray(8));
  const [customInput, setCustomInput] = useState("");
  
  const algoConfig = ALGORITHMS[activeAlgo];
  
  const steps = useMemo(() => algoConfig.generator(array), [array, algoConfig]);
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
      {/* Algorithm Selection */}
      <div className="flex items-center gap-2">
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
      </div>

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
