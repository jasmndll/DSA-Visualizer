export const DEFAULT_GRAPH = {
  nodes: [
    { id: "A", x: 1, y: 2 },
    { id: "B", x: 2, y: 1 },
    { id: "C", x: 2, y: 3 },
    { id: "D", x: 4, y: 1 },
    { id: "E", x: 4, y: 3 },
    { id: "F", x: 5, y: 2 },
  ],
  edges: [
    { source: "A", target: "B", weight: 4 },
    { source: "A", target: "C", weight: 2 },
    { source: "B", target: "D", weight: 5 },
    { source: "C", target: "B", weight: 1 },
    { source: "C", target: "E", weight: 3 },
    { source: "E", target: "D", weight: -2 },
    { source: "D", target: "F", weight: 3 },
    { source: "E", target: "F", weight: 2 },
  ]
};
