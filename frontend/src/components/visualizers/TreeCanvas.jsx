import { motion } from "framer-motion";

// Compute layout positions for each node using a recursive approach
function computeLayout(node, depth = 0, counter = { val: 0 }) {
  if (!node) return {};
  const left = computeLayout(node.left, depth + 1, counter);
  const x = counter.val++;
  const right = computeLayout(node.right, depth + 1, counter);
  return { ...left, [node.val]: { x, y: depth }, ...right };
}

function collectEdges(node, positions) {
  if (!node) return [];
  const edges = [];
  if (node.left) {
    edges.push({ from: node.val, to: node.left.val });
    edges.push(...collectEdges(node.left, positions));
  }
  if (node.right) {
    edges.push({ from: node.val, to: node.right.val });
    edges.push(...collectEdges(node.right, positions));
  }
  return edges;
}

function collectNodes(node, list = []) {
  if (!node) return list;
  collectNodes(node.left, list);
  list.push(node);
  collectNodes(node.right, list);
  return list;
}

const NODE_RADIUS = 20;
const H_GAP = 46;
const V_GAP = 56;

export default function TreeCanvas({ step, isRB = false }) {
  if (!step || !step.tree) {
    return (
      <div className="bg-ink/95 rounded-win border-2 border-ink min-h-[200px] flex items-center justify-center">
        <span className="text-white/40 font-body text-xs">No tree data</span>
      </div>
    );
  }

  const tree = step.tree;
  const highlighted = step.highlighted || [];
  const visitOrder = step.visitOrder || [];

  const positions = computeLayout(tree);
  const nodes = collectNodes(tree);
  const edges = collectEdges(tree, positions);

  const xs = Object.values(positions).map((p) => p.x);
  const ys = Object.values(positions).map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  const svgWidth = Math.max((maxX - minX + 1) * H_GAP + NODE_RADIUS * 2, 260);
  const svgHeight = (maxY + 1) * V_GAP + NODE_RADIUS * 2 + 10;
  const offsetX = NODE_RADIUS + 4;

  function cx(nodeVal) {
    return (positions[nodeVal].x - minX) * H_GAP + offsetX;
  }
  function cy(nodeVal) {
    return positions[nodeVal].y * V_GAP + NODE_RADIUS + 8;
  }

  return (
    <div className="bg-ink/95 rounded-win border-2 border-ink overflow-auto">
      <svg
        width={svgWidth}
        height={svgHeight}
        className="block mx-auto"
      >
        {/* Edges */}
        {edges.map((e, i) => (
          <line
            key={i}
            x1={cx(e.from)}
            y1={cy(e.from)}
            x2={cx(e.to)}
            y2={cy(e.to)}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={2}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => {
          const isHighlighted = highlighted.includes(node.val);
          const isVisited = visitOrder.includes(node.val);

          let fill = "#e9e5d4"; // default sand
          if (isRB) {
            fill = node.color === "RED" ? "#f87171" : "#374151"; // red or dark gray
          } else if (isHighlighted) {
            fill = "#a78bfa"; // lilac
          } else if (isVisited) {
            fill = "#6ee7b7"; // mint
          }

          const textColor = isRB && node.color === "BLACK" ? "#fff" : "#1a1a1a";

          return (
            <g key={node.val}>
              <circle
                cx={cx(node.val)}
                cy={cy(node.val)}
                r={NODE_RADIUS}
                fill={fill}
                stroke={isHighlighted ? "#7c3aed" : "#1a1a1a"}
                strokeWidth={isHighlighted ? 3 : 2}
              />
              <text
                x={cx(node.val)}
                y={cy(node.val) + 5}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill={textColor}
                fontFamily="monospace"
              >
                {node.val}
              </text>
              {isRB && (
                <text
                  x={cx(node.val)}
                  y={cy(node.val) + NODE_RADIUS + 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill={node.color === "RED" ? "#f87171" : "#9ca3af"}
                  fontFamily="monospace"
                >
                  {node.color}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Visit order ribbon */}
      {visitOrder.length > 0 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {visitOrder.map((v, i) => (
            <span
              key={i}
              className="font-display text-[10px] px-1.5 py-0.5 bg-mint-200 border border-ink rounded-sm"
            >
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
