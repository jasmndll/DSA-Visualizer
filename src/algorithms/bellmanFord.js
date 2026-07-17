export function generateBellmanFordSteps(graph, startNode = "A") {
  const steps = [];
  const V = graph.nodes.length;
  
  const distances = {};
  graph.nodes.forEach(n => distances[n.id] = Infinity);
  distances[startNode] = 0;
  
  steps.push({
    graph,
    distances: { ...distances },
    checkingEdge: null,
    currentNode: null,
    line: 0,
    trace: `Initialize distances: 0 for ${startNode}, Infinity for others.`
  });

  for (let i = 1; i < V; i++) {
    steps.push({
      graph,
      distances: { ...distances },
      checkingEdge: null,
      currentNode: null,
      line: 1,
      trace: `--- Iteration ${i} of ${V - 1} ---`
    });

    for (const edge of graph.edges) {
      const u = edge.source;
      const v = edge.target;
      const weight = edge.weight;

      steps.push({
        graph,
        distances: { ...distances },
        checkingEdge: edge,
        currentNode: u,
        line: 2,
        trace: `Checking edge ${u} -> ${v} (weight ${weight})`
      });

      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
        
        steps.push({
          graph,
          distances: { ...distances },
          checkingEdge: edge,
          currentNode: v,
          line: 3,
          trace: `Relaxed! New distance for ${v} is ${distances[v]}`
        });
      }
    }
  }

  steps.push({
    graph,
    distances: { ...distances },
    checkingEdge: null,
    currentNode: null,
    line: 4,
    trace: `Checking for negative weight cycles...`
  });

  let hasNegativeCycle = false;
  for (const edge of graph.edges) {
    const u = edge.source;
    const v = edge.target;
    const weight = edge.weight;
    
    steps.push({
      graph,
      distances: { ...distances },
      checkingEdge: edge,
      currentNode: u,
      line: 5,
      trace: `Checking edge ${u} -> ${v} for cycle`
    });

    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      hasNegativeCycle = true;
      steps.push({
        graph,
        distances: { ...distances },
        checkingEdge: edge,
        currentNode: null,
        line: 6,
        trace: `Negative cycle detected! ${u} -> ${v} can still be relaxed.`
      });
      break;
    }
  }

  if (!hasNegativeCycle) {
    steps.push({
      graph,
      distances: { ...distances },
      checkingEdge: null,
      currentNode: null,
      line: 7,
      trace: `Bellman-Ford complete! No negative cycles found.`
    });
  }

  return steps;
}

export const bellmanFordPseudocode = [
  "procedure BellmanFord(graph, start):",
  "  for each node v: dist[v] = Infinity; dist[start] = 0",
  "  repeat |V|-1 times:",
  "    for each edge (u, v) with weight w:",
  "      if dist[u] + w < dist[v]:",
  "        dist[v] = dist[u] + w",
  "  for each edge (u, v) with weight w:",
  "    if dist[u] + w < dist[v]:",
  "      return Error 'Negative cycle'",
  "end procedure"
];
