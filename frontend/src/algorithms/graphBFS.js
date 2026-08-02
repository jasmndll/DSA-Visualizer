export function generateBFSSteps(graph, startNode = "A") {
  const steps = [];
  const visited = new Set();
  const queue = [];
  
  const adj = {};
  graph.nodes.forEach(n => adj[n.id] = []);
  graph.edges.forEach(e => {
    adj[e.source].push(e);
  });
  
  steps.push({
    graph,
    visited: [],
    queue: [],
    currentNode: null,
    checkingEdge: null,
    line: 0,
    trace: `Start BFS from node ${startNode}`
  });

  visited.add(startNode);
  queue.push(startNode);
  
  steps.push({
    graph,
    visited: Array.from(visited),
    queue: [...queue],
    currentNode: null,
    checkingEdge: null,
    line: 1,
    trace: `Mark ${startNode} as visited and enqueue it`
  });

  while (queue.length > 0) {
    const u = queue.shift();
    steps.push({
      graph,
      visited: Array.from(visited),
      queue: [...queue],
      currentNode: u,
      checkingEdge: null,
      line: 3,
      trace: `Dequeue node ${u}`
    });

    for (const edge of adj[u]) {
      const v = edge.target;
      steps.push({
        graph,
        visited: Array.from(visited),
        queue: [...queue],
        currentNode: u,
        checkingEdge: edge,
        line: 4,
        trace: `Check neighbor ${v} of ${u}`
      });

      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
        steps.push({
          graph,
          visited: Array.from(visited),
          queue: [...queue],
          currentNode: u,
          checkingEdge: null,
          line: 5,
          trace: `Mark ${v} as visited and enqueue it`
        });
      } else {
        steps.push({
          graph,
          visited: Array.from(visited),
          queue: [...queue],
          currentNode: u,
          checkingEdge: null,
          line: 6,
          trace: `Neighbor ${v} is already visited`
        });
      }
    }
  }

  steps.push({
    graph,
    visited: Array.from(visited),
    queue: [],
    currentNode: null,
    checkingEdge: null,
    line: 7,
    trace: `BFS complete!`
  });

  return steps;
}

export const bfsPseudocode = [
  "procedure BFS(startNode):",
  "  visited.add(startNode); queue.push(startNode)",
  "  while queue is not empty:",
  "    u = queue.shift()",
  "    for each neighbor v of u:",
  "      if v is not visited:",
  "        visited.add(v); queue.push(v)"
];
