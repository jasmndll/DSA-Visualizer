import { useState, useMemo } from "react";
import { useStepEngine } from "../../engine/useStepEngine";
import {
  generateLevelOrderSteps, levelOrderPseudocode,
  generateInorderSteps, inorderPseudocode,
  generatePreorderSteps, preorderPseudocode,
  generatePostorderSteps, postorderPseudocode,
} from "../../algorithms/bst";

import TreeCanvas from "../visualizers/TreeCanvas";
import PlaybackControls from "../PlaybackControls";

const DEFAULT_VALUES = [50, 30, 70, 20, 40, 60, 80];

const ALGORITHMS = {
  levelorder: {
    id: "levelorder",
    name: "Level Order (BFS)",
    generator: generateLevelOrderSteps,
    pseudocode: levelOrderPseudocode,
    isRB: false,
  },
  inorder: {
    id: "inorder",
    name: "Inorder DFS",
    generator: generateInorderSteps,
    pseudocode: inorderPseudocode,
    isRB: false,
  },
  preorder: {
    id: "preorder",
    name: "Preorder DFS",
    generator: generatePreorderSteps,
    pseudocode: preorderPseudocode,
    isRB: false,
  },
  postorder: {
    id: "postorder",
    name: "Postorder DFS",
    generator: generatePostorderSteps,
    pseudocode: postorderPseudocode,
    isRB: false,
  },
};

export default function TreeModule() {
  const [activeAlgo, setActiveAlgo] = useState("levelorder");
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [customInput, setCustomInput] = useState("");

  const algoConfig = ALGORITHMS[activeAlgo];
  const steps = useMemo(() => algoConfig.generator(values), [values, algoConfig]);
  const engine = useStepEngine(steps, { initialSpeed: 4 });

  const handleLoadCustom = () => {
    const parsed = customInput
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));
    const unique = [...new Set(parsed)].slice(0, 12);
    if (unique.length > 0) setValues(unique);
  };

  const handleReset = () => setValues(DEFAULT_VALUES);

  const step = engine.currentStep;

  return (
    <div className="space-y-3">
      {/* Algorithm Selection */}
      <div className="flex items-center gap-2 flex-wrap">
        <label className="font-display text-[10px] text-ink/70 uppercase">Traversal:</label>
        <select
          value={activeAlgo}
          onChange={(e) => setActiveAlgo(e.target.value)}
          className="font-body text-[11px] px-2 py-1 border-2 border-ink rounded-win bg-white outline-none"
        >
          {Object.values(ALGORITHMS).map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Custom input */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="e.g. 50,30,70,20"
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
      <TreeCanvas step={step} isRB={algoConfig.isRB} />

      {/* Playback */}
      <PlaybackControls engine={engine} />

      {/* Trace */}
      <div className="font-body text-[11px] bg-white border-2 border-ink rounded-win p-2 min-h-[36px]" aria-live="polite">
        {step?.trace ?? "Press play to begin."}
      </div>

      {/* Pseudocode */}
      <div className="font-body text-[10px] bg-ink/95 text-mint-200 rounded-win p-2 leading-relaxed">
        {algoConfig.pseudocode.map((line, i) => (
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
