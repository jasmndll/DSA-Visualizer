export function generateDFSSteps(graph, startNode = "A") {
  const steps = [];
  const visited = new Set();
  
  const adj = {};
  graph.nodes.forEach(n => adj[n.id] = []);
  graph.edges.forEach(e => {
    adj[e.source].push(e);
  });
  
  steps.push({
    graph,
    visited: [],
    currentNode: null,
    checkingEdge: null,
    line: 0,
    trace: `Start DFS from node ${startNode}`
  });

  function dfs(nodeId) {
    visited.add(nodeId);
    
    steps.push({
      graph,
      visited: Array.from(visited),
      currentNode: nodeId,
      checkingEdge: null,
      line: 2,
      trace: `Visited node ${nodeId}`
    });

    for (const edge of adj[nodeId]) {
      steps.push({
        graph,
        visited: Array.from(visited),
        currentNode: nodeId,
        checkingEdge: edge,
        line: 3,
        trace: `Check neighbor ${edge.target} of ${nodeId}`
      });
      
      if (!visited.has(edge.target)) {
        dfs(edge.target);
        
        steps.push({
          graph,
          visited: Array.from(visited),
          currentNode: nodeId,
          checkingEdge: null,
          line: 4,
          trace: `Backtrack to node ${nodeId}`
        });
      } else {
        steps.push({
          graph,
          visited: Array.from(visited),
          currentNode: nodeId,
          checkingEdge: null,
          line: 5,
          trace: `Neighbor ${edge.target} already visited`
        });
      }
    }
  }

  dfs(startNode);
  
  steps.push({
    graph,
    visited: Array.from(visited),
    currentNode: null,
    checkingEdge: null,
    line: 6,
    trace: `DFS complete!`
  });

  return steps;
}

export const dfsPseudocode = [
  "procedure DFS(node):",
  "  if node is visited, return",
  "  mark node as visited",
  "  for each neighbor of node:",
  "    if neighbor is not visited:",
  "      DFS(neighbor)",
  "end procedure"
];
