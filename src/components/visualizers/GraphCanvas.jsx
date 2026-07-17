import React from 'react';

const NODE_RADIUS = 18;
const H_SCALE = 80;
const V_SCALE = 60;
const OFFSET_X = 40;
const OFFSET_Y = 40;

export default function GraphCanvas({ step }) {
  if (!step || !step.graph) {
    return (
      <div className="bg-ink/95 rounded-win border-2 border-ink min-h-[200px] flex items-center justify-center">
        <span className="text-white/40 font-body text-xs">No graph data</span>
      </div>
    );
  }

  const { graph, visited = [], queue = [], currentNode, checkingEdge, distances = null, dist = null, iNode, jNode, kNode } = step;

  const xs = graph.nodes.map(n => n.x);
  const ys = graph.nodes.map(n => n.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  
  // Dynamic sizing based on nodes
  const svgWidth = Math.max((maxX - minX) * H_SCALE + OFFSET_X * 2 + 40, 320);
  const svgHeight = maxY * V_SCALE + OFFSET_Y * 2;

  const cx = (x) => (x - minX) * H_SCALE + OFFSET_X;
  const cy = (y) => y * V_SCALE + OFFSET_Y;

  return (
    <div className="bg-ink/95 rounded-win border-2 border-ink overflow-auto p-4 flex flex-col md:flex-row gap-4 items-center justify-center min-h-[220px]">
      {/* SVG Canvas */}
      <svg width={svgWidth} height={svgHeight} className="flex-shrink-0 mx-auto">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="24" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#fdfcf8" opacity="0.4" />
          </marker>
          <marker id="arrowhead-checking" markerWidth="8" markerHeight="6" refX="24" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#f87171" />
          </marker>
        </defs>

        {/* Edges */}
        {graph.edges.map((e, i) => {
          const s = graph.nodes.find(n => n.id === e.source);
          const t = graph.nodes.find(n => n.id === e.target);
          const isChecking = checkingEdge && checkingEdge.source === e.source && checkingEdge.target === e.target;
          const stroke = isChecking ? "#f87171" : "rgba(253,252,248,0.4)";
          const strokeWidth = isChecking ? 3 : 2;
          const marker = isChecking ? "url(#arrowhead-checking)" : "url(#arrowhead)";
          
          return (
            <g key={i}>
              <line 
                x1={cx(s.x)} y1={cy(s.y)} 
                x2={cx(t.x)} y2={cy(t.y)} 
                stroke={stroke} strokeWidth={strokeWidth} 
                markerEnd={marker}
              />
              <text 
                x={(cx(s.x) + cx(t.x)) / 2} 
                y={(cy(s.y) + cy(t.y)) / 2 - 8}
                fill={isChecking ? "#f87171" : "#a3a3a3"}
                fontSize="12"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {e.weight}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {graph.nodes.map(n => {
          const isVisited = visited.includes(n.id);
          const isCurrent = currentNode === n.id;
          const isK = kNode === n.id;
          const isI = iNode === n.id;
          const isJ = jNode === n.id;
          const inQueue = queue.includes(n.id);
          
          let fill = "#e9e5d4"; // default sand
          if (isCurrent) fill = "#fcd34d"; // yellow for current
          else if (isK) fill = "#a78bfa"; // purple for k (Floyd Warshall)
          else if (isI) fill = "#60a5fa"; // blue for i
          else if (isJ) fill = "#f472b6"; // pink for j
          else if (inQueue) fill = "#93c5fd"; // light blue for queued
          else if (isVisited) fill = "#6ee7b7"; // mint for visited

          return (
            <g key={n.id}>
              <circle cx={cx(n.x)} cy={cy(n.y)} r={NODE_RADIUS} fill={fill} stroke="#1a1a1a" strokeWidth={2} />
              <text x={cx(n.x)} y={cy(n.y) + 4} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1a1a1a" fontFamily="monospace">
                {n.id}
              </text>
              {distances && distances[n.id] !== undefined && (
                <text x={cx(n.x)} y={cy(n.y) + NODE_RADIUS + 12} textAnchor="middle" fontSize="10" fill="#a78bfa" fontFamily="monospace" fontWeight="bold">
                  {distances[n.id] === Infinity ? "∞" : distances[n.id]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floyd-Warshall Matrix overlay or side table */}
      {dist && (
        <div className="flex-shrink-0 text-white font-monospace text-[10px] mt-4 md:mt-0 bg-ink rounded-win p-2 border border-white/20">
          <div className="mb-2 text-mint-200">Distance Matrix</div>
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="p-1 border border-white/20 text-white/50"></th>
                {graph.nodes.map(n => (
                  <th key={n.id} className="p-1 border border-white/20">{n.id}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {graph.nodes.map(u => (
                <tr key={u.id}>
                  <th className="p-1 border border-white/20 font-bold">{u.id}</th>
                  {graph.nodes.map(v => {
                    const val = dist[u.id][v.id];
                    const isCell = (iNode === u.id && jNode === v.id);
                    return (
                      <td key={v.id} className={`p-1 border border-white/20 text-center w-8 ${isCell ? 'bg-pink-500/50' : ''}`}>
                        {val === Infinity ? "∞" : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
