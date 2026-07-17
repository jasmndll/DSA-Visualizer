import { useState, useMemo } from "react";
import { useStepEngine } from "../../engine/useStepEngine";
import { generateDFSSteps, dfsPseudocode } from "../../algorithms/graphDFS";
import { generateBFSSteps, bfsPseudocode } from "../../algorithms/graphBFS";
import { generateBellmanFordSteps, bellmanFordPseudocode } from "../../algorithms/bellmanFord";
import { generateFloydWarshallSteps, floydWarshallPseudocode } from "../../algorithms/floydWarshall";
import { DEFAULT_GRAPH } from "../../algorithms/graphData";
import GraphCanvas from "../visualizers/GraphCanvas";
import PlaybackControls from "../PlaybackControls";

const ALGORITHMS = {
  dfs: {
    id: "dfs",
    name: "Depth First Search",
    generator: generateDFSSteps,
    pseudocode: dfsPseudocode,
  },
  bfs: {
    id: "bfs",
    name: "Breadth First Search",
    generator: generateBFSSteps,
    pseudocode: bfsPseudocode,
  },
  bellmanFord: {
    id: "bellmanFord",
    name: "Bellman-Ford",
    generator: generateBellmanFordSteps,
    pseudocode: bellmanFordPseudocode,
  },
  floydWarshall: {
    id: "floydWarshall",
    name: "Floyd-Warshall",
    generator: generateFloydWarshallSteps,
    pseudocode: floydWarshallPseudocode,
  }
};

export default function GraphModule() {
  const [activeAlgo, setActiveAlgo] = useState("dfs");
  const [startNode, setStartNode] = useState("A");

  const algoConfig = ALGORITHMS[activeAlgo];

  const steps = useMemo(() => {
    if (activeAlgo === "floydWarshall") {
      return algoConfig.generator(DEFAULT_GRAPH);
    }
    return algoConfig.generator(DEFAULT_GRAPH, startNode);
  }, [activeAlgo, startNode, algoConfig]);

  const engine = useStepEngine(steps, { initialSpeed: 4 });
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
        
        {activeAlgo !== "floydWarshall" && (
          <>
            <label className="font-display text-[10px] text-ink/70 uppercase ml-2">
              Start Node:
            </label>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="font-body text-[11px] px-2 py-1 border-2 border-ink rounded-win bg-white outline-none"
            >
              {DEFAULT_GRAPH.nodes.map(n => (
                <option key={n.id} value={n.id}>{n.id}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Visualization */}
      <GraphCanvas step={step} />

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
      <div className="font-body text-[10px] bg-ink/95 text-mint-200 rounded-win p-2 leading-relaxed max-h-[160px] overflow-auto">
        {algoConfig.pseudocode.map((line, i) => (
          <div
            key={i}
            className={`px-1 rounded-sm whitespace-pre font-monospace ${
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
