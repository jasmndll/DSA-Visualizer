export function generateFloydWarshallSteps(graph) {
  const steps = [];
  const V = graph.nodes.length;
  
  const dist = {};
  graph.nodes.forEach(u => {
    dist[u.id] = {};
    graph.nodes.forEach(v => {
      dist[u.id][v.id] = (u.id === v.id) ? 0 : Infinity;
    });
  });

  graph.edges.forEach(edge => {
    dist[edge.source][edge.target] = edge.weight;
  });

  const copyDist = () => {
    const newDist = {};
    Object.keys(dist).forEach(u => {
      newDist[u] = { ...dist[u] };
    });
    return newDist;
  };

  steps.push({
    graph,
    dist: copyDist(),
    kNode: null,
    iNode: null,
    jNode: null,
    line: 0,
    trace: "Initialize distance matrix with edge weights"
  });

  for (let k = 0; k < V; k++) {
    const kId = graph.nodes[k].id;
    
    steps.push({
      graph,
      dist: copyDist(),
      kNode: kId,
      iNode: null,
      jNode: null,
      line: 1,
      trace: `Consider ${kId} as an intermediate node`
    });

    for (let i = 0; i < V; i++) {
      const iId = graph.nodes[i].id;
      
      for (let j = 0; j < V; j++) {
        const jId = graph.nodes[j].id;
        
        steps.push({
          graph,
          dist: copyDist(),
          kNode: kId,
          iNode: iId,
          jNode: jId,
          line: 2,
          trace: `Check path ${iId} -> ${kId} -> ${jId}`
        });

        if (dist[iId][kId] !== Infinity && dist[kId][jId] !== Infinity) {
          if (dist[iId][jId] > dist[iId][kId] + dist[kId][jId]) {
            dist[iId][jId] = dist[iId][kId] + dist[kId][jId];
            
            steps.push({
              graph,
              dist: copyDist(),
              kNode: kId,
              iNode: iId,
              jNode: jId,
              line: 3,
              trace: `Updated shortest path ${iId} -> ${jId} to ${dist[iId][jId]}`
            });
          }
        }
      }
    }
  }

  steps.push({
    graph,
    dist: copyDist(),
    kNode: null,
    iNode: null,
    jNode: null,
    line: 4,
    trace: "Floyd-Warshall complete!"
  });

  return steps;
}

export const floydWarshallPseudocode = [
  "procedure FloydWarshall(graph):",
  "  Initialize dist matrix with edge weights",
  "  for k from 1 to |V|:",
  "    for i from 1 to |V|:",
  "      for j from 1 to |V|:",
  "        if dist[i][j] > dist[i][k] + dist[k][j]:",
  "          dist[i][j] = dist[i][k] + dist[k][j]"
];
