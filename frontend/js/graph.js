import { BaseVisualizer } from './base.js';

export class GraphVisualizer extends BaseVisualizer {
    constructor(canvas, svg, traceLog, codeContainer) {
        super(canvas, svg, traceLog, codeContainer);
        
        // Define logical coordinate system size
        this.canvasWidth = 700;
        this.canvasHeight = 350;

        // Predefined graph structure (Nodes A-F)
        this.nodes = {
            'A': { id: 'A', x: 80, y: 175 },
            'B': { id: 'B', x: 240, y: 70 },
            'C': { id: 'C', x: 240, y: 280 },
            'D': { id: 'D', x: 440, y: 70 },
            'E': { id: 'E', x: 440, y: 280 },
            'F': { id: 'F', x: 600, y: 175 }
        };

        this.edges = [
            { from: 'A', to: 'B', weight: 4 },
            { from: 'A', to: 'C', weight: 2 },
            { from: 'B', to: 'C', weight: 1 },
            { from: 'B', to: 'D', weight: 5 },
            { from: 'C', to: 'E', weight: 3 },
            { from: 'D', to: 'E', weight: 2 },
            { from: 'D', to: 'F', weight: 3 },
            { from: 'E', to: 'F', weight: 1 }
        ];

        this.startNode = 'A';
        this.endNode = 'F';

        this.setupPseudocode([
            'procedure dijkstra(Graph, source)',
            '  dist[source] = 0, dist[v] = infinity for all other v',
            '  Q = set of all unvisited nodes',
            '  while Q is not empty do',
            '    u = node in Q with min dist[u]',
            '    remove u from Q (mark visited)',
            '    for each neighbor v of u still in Q do',
            '      alt = dist[u] + weight(u, v)',
            '      if alt < dist[v] then',
            '        dist[v] = alt, prev[v] = u'
        ]);
    }

    init() {
        this.steps = [];
        this.currentStepIndex = -1;
        this.generateIdleState();
    }

    generateIdleState() {
        this.steps = [{
            nodesState: this.cloneNodesState(),
            edgesState: this.cloneEdgesState(),
            activeNode: null,
            visitedNodes: [],
            pathEdges: [],
            line: 0,
            trace: "Initialized Graph. Select start/end nodes and run Dijkstra's shortest path."
        }];
        this.currentStepIndex = 0;
        this.renderStep(0);
    }

    cloneNodesState() {
        const state = {};
        Object.keys(this.nodes).forEach(id => {
            state[id] = {
                ...this.nodes[id],
                dist: Infinity,
                prev: null
            };
        });
        return state;
    }

    cloneEdgesState() {
        return this.edges.map(e => ({ ...e, state: 'normal' })); // 'normal', 'visited', 'path'
    }

    getInputsHTML() {
        return `
            <div class="control-group">
                <div class="slider-container">
                    <span>Start:</span>
                    <select class="input-control" id="select-start-node" style="padding: 6px 10px; width: 60px;">
                        <option value="A" selected>A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                    </select>
                </div>
                <div class="slider-container" style="margin-left: 8px;">
                    <span>End:</span>
                    <select class="input-control" id="select-end-node" style="padding: 6px 10px; width: 60px;">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F" selected>F</option>
                    </select>
                </div>
                <button class="btn btn-primary" id="btn-run-dijkstra">Run Dijkstra</button>
            </div>
        `;
    }

    bindInputs(container) {
        const selectStart = container.querySelector('#select-start-node');
        const selectEnd = container.querySelector('#select-end-node');

        selectStart.addEventListener('change', (e) => {
            this.startNode = e.target.value;
            this.generateIdleState();
        });

        selectEnd.addEventListener('change', (e) => {
            this.endNode = e.target.value;
            this.generateIdleState();
        });

        container.querySelector('#btn-run-dijkstra').addEventListener('click', () => {
            this.executeDijkstra();
        });
    }

    executeDijkstra() {
        const tempSteps = [];
        const source = this.startNode;
        const target = this.endNode;

        const dist = {};
        const prev = {};
        const visited = [];
        const unvisited = Object.keys(this.nodes);

        // 1. Initial State
        const nodesState = this.cloneNodesState();
        const edgesState = this.cloneEdgesState();
        
        tempSteps.push({
            nodesState: JSON.parse(JSON.stringify(nodesState)),
            edgesState: [...edgesState],
            activeNode: null,
            visitedNodes: [],
            pathEdges: [],
            line: 0,
            trace: `Start Dijkstra algorithm from source node <span class="highlight-text">${source}</span> to destination <span class="highlight-text">${target}</span>`
        });

        // 2. Init Distances
        unvisited.forEach(v => {
            dist[v] = v === source ? 0 : Infinity;
            prev[v] = null;
            nodesState[v].dist = dist[v];
        });

        tempSteps.push({
            nodesState: JSON.parse(JSON.stringify(nodesState)),
            edgesState: [...edgesState],
            activeNode: null,
            visitedNodes: [],
            pathEdges: [],
            line: 1,
            trace: `Initialize distances: dist[${source}] = 0, and all other nodes to ∞.`
        });

        tempSteps.push({
            nodesState: JSON.parse(JSON.stringify(nodesState)),
            edgesState: [...edgesState],
            activeNode: null,
            visitedNodes: [],
            pathEdges: [],
            line: 2,
            trace: `Add all nodes to the unvisited set Q: {${unvisited.join(', ')}}`
        });

        // Loop
        while (unvisited.length > 0) {
            // Find min distance node
            let u = null;
            let minDist = Infinity;
            unvisited.forEach(node => {
                if (dist[node] < minDist) {
                    minDist = dist[node];
                    u = node;
                }
            });

            // If min distance node is infinity, rest are unreachable
            if (u === null || dist[u] === Infinity) {
                tempSteps.push({
                    nodesState: JSON.parse(JSON.stringify(nodesState)),
                    edgesState: [...edgesState],
                    activeNode: null,
                    visitedNodes: [...visited],
                    pathEdges: [],
                    line: 3,
                    trace: `Remaining nodes are unreachable. Terminating search.`
                });
                break;
            }

            tempSteps.push({
                nodesState: JSON.parse(JSON.stringify(nodesState)),
                edgesState: [...edgesState],
                activeNode: u,
                visitedNodes: [...visited],
                pathEdges: [],
                line: 4,
                trace: `Select node <span class="highlight-text">${u}</span> with minimum distance (${dist[u]}) from Q.`
            });

            // Mark u as visited
            const uIdx = unvisited.indexOf(u);
            unvisited.splice(uIdx, 1);
            visited.push(u);

            tempSteps.push({
                nodesState: JSON.parse(JSON.stringify(nodesState)),
                edgesState: [...edgesState],
                activeNode: u,
                visitedNodes: [...visited],
                pathEdges: [],
                line: 5,
                trace: `Remove ${u} from Q (mark as Visited).`
            });

            // Stop if target reached
            if (u === target) {
                tempSteps.push({
                    nodesState: JSON.parse(JSON.stringify(nodesState)),
                    edgesState: [...edgesState],
                    activeNode: u,
                    visitedNodes: [...visited],
                    pathEdges: [],
                    line: 5,
                    trace: `Destination node ${target} has been visited! Shortest path search complete.`
                });
                break;
            }

            // Relax neighbors
            // Get edges connected to u
            const neighborsEdges = this.edges.filter(e => e.from === u || e.to === u);

            for (const edge of neighborsEdges) {
                const v = edge.from === u ? edge.to : edge.from;
                
                // Only consider unvisited neighbors
                if (!unvisited.includes(v)) continue;

                // Highlight checking edge
                const currentEdges = edgesState.map(e => {
                    if ((e.from === u && e.to === v) || (e.from === v && e.to === u)) {
                        return { ...e, state: 'visited' };
                    }
                    return e;
                });

                tempSteps.push({
                    nodesState: JSON.parse(JSON.stringify(nodesState)),
                    edgesState: currentEdges,
                    activeNode: u,
                    visitedNodes: [...visited],
                    pathEdges: [],
                    line: 6,
                    trace: `Examine neighbor node <span class="highlight-text">${v}</span> of node ${u}.`
                });

                const alt = dist[u] + edge.weight;
                tempSteps.push({
                    nodesState: JSON.parse(JSON.stringify(nodesState)),
                    edgesState: currentEdges,
                    activeNode: u,
                    visitedNodes: [...visited],
                    pathEdges: [],
                    line: 7,
                    trace: `Calculate tentative distance: dist[${u}] (${dist[u]}) + weight(${edge.weight}) = ${alt}`
                });

                tempSteps.push({
                    nodesState: JSON.parse(JSON.stringify(nodesState)),
                    edgesState: currentEdges,
                    activeNode: u,
                    visitedNodes: [...visited],
                    pathEdges: [],
                    line: 8,
                    trace: `Compare tentative distance (${alt}) with current dist[${v}] (${dist[v] === Infinity ? '∞' : dist[v]})`
                });

                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                    nodesState[v].dist = alt;
                    nodesState[v].prev = u;

                    // Permanently mark edge as relaxed/visited
                    const edgeIdx = edgesState.findIndex(e => (e.from === u && e.to === v) || (e.from === v && e.to === u));
                    if (edgeIdx !== -1) edgesState[edgeIdx].state = 'visited';

                    tempSteps.push({
                        nodesState: JSON.parse(JSON.stringify(nodesState)),
                        edgesState: [...edgesState],
                        activeNode: u,
                        visitedNodes: [...visited],
                        pathEdges: [],
                        line: 9,
                        trace: `New shorter path found! Update dist[${v}] = ${alt}, prev[${v}] = ${u}`
                    });
                }
            }
        }

        // Reconstruct shortest path if reached
        const path = [];
        let curr = target;
        const pathEdges = [];
        
        while (prev[curr] !== undefined && prev[curr] !== null) {
            const pNode = prev[curr];
            path.unshift(curr);
            pathEdges.push({ from: pNode, to: curr });
            curr = pNode;
        }
        if (path.length > 0) path.unshift(source);

        // Highlight final path
        const finalEdges = edgesState.map(e => {
            const isPath = pathEdges.some(pe => 
                (pe.from === e.from && pe.to === e.to) || (pe.from === e.to && pe.to === e.from)
            );
            return { ...e, state: isPath ? 'path' : e.state };
        });

        tempSteps.push({
            nodesState: JSON.parse(JSON.stringify(nodesState)),
            edgesState: finalEdges,
            activeNode: null,
            visitedNodes: [...visited],
            pathNodes: path,
            pathEdges: pathEdges,
            line: 10,
            trace: path.length > 0
                ? `Dijkstra Finished! Shortest path: <span class="highlight-text">${path.join(' ➔ ')}</span> (Total distance = ${dist[target]})`
                : `Dijkstra Finished! No path exists between ${source} and ${target}.`
        });

        this.steps = tempSteps;
        this.currentStepIndex = 0;
        if (window.app) {
            window.app.updatePlaybackControlsState();
            window.app.play();
        }
    }

    drawState(step) {
        this.canvas.innerHTML = '';
        const defs = this.svg.querySelector('defs');
        this.svg.innerHTML = '';
        if (defs) this.svg.appendChild(defs);

        // Relative container inside canvas to hold elements
        const graphArea = document.createElement('div');
        graphArea.style.position = 'relative';
        graphArea.style.width = `${this.canvasWidth}px`;
        graphArea.style.height = `${this.canvasHeight}px`;
        graphArea.style.margin = 'auto';

        // 1. Draw Edges (SVG Lines)
        step.edgesState.forEach(edge => {
            const fromNode = this.nodes[edge.from];
            const toNode = this.nodes[edge.to];
            if (!fromNode || !toNode) return;

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", fromNode.x);
            line.setAttribute("y1", fromNode.y);
            line.setAttribute("x2", toNode.x);
            line.setAttribute("y2", toNode.y);

            // Styling states
            if (edge.state === 'path') {
                line.setAttribute("class", "graph-edge path");
            } else if (edge.state === 'visited') {
                line.setAttribute("class", "graph-edge visited");
            } else {
                line.setAttribute("class", "graph-edge");
            }

            this.svg.appendChild(line);

            // 2. Draw Edge Weight Labels at midpoints
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            
            const label = document.createElement('div');
            label.className = 'edge-label-container';
            label.innerText = edge.weight;
            
            // Offset label by half of its dimensions
            label.style.left = `${midX - 12}px`;
            label.style.top = `${midY - 10}px`;

            if (edge.state === 'path') {
                label.style.borderColor = 'var(--state-success)';
                label.style.color = 'var(--state-success)';
            } else if (edge.state === 'visited') {
                label.style.borderColor = 'var(--accent-primary)';
                label.style.color = 'var(--accent-primary)';
            }

            graphArea.appendChild(label);
        });

        // 3. Draw Nodes
        Object.keys(step.nodesState).forEach(id => {
            const n = step.nodesState[id];
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'canvas-node';
            
            // Set position (centering 46px diameter node)
            nodeDiv.style.left = `${n.x - 23}px`;
            nodeDiv.style.top = `${n.y - 23}px`;

            nodeDiv.innerText = id;

            // Highlight state
            if (id === step.activeNode) {
                nodeDiv.classList.add('active');
            } else if (step.pathNodes && step.pathNodes.includes(id)) {
                nodeDiv.classList.add('path');
            } else if (step.visitedNodes.includes(id)) {
                nodeDiv.classList.add('visited');
            }

            // Dist label above node
            const distLabel = document.createElement('span');
            distLabel.className = 'node-weight-label';
            distLabel.innerText = n.dist === Infinity ? '∞' : `d=${n.dist}`;
            
            if (id === this.startNode) {
                distLabel.innerText += ' (src)';
                distLabel.style.color = 'var(--state-success)';
                distLabel.style.background = 'rgba(16, 185, 129, 0.1)';
                distLabel.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            }
            if (id === this.endNode) {
                distLabel.innerText += ' (dest)';
                distLabel.style.color = 'var(--accent-primary)';
                distLabel.style.background = 'rgba(99, 102, 241, 0.1)';
                distLabel.style.borderColor = 'rgba(99, 102, 241, 0.2)';
            }

            nodeDiv.appendChild(distLabel);
            graphArea.appendChild(nodeDiv);
        });

        this.canvas.appendChild(graphArea);

        // Adjust SVG viewport to align with graphArea
        requestAnimationFrame(() => {
            const canvasRect = this.canvas.getBoundingClientRect();
            const graphAreaRect = graphArea.getBoundingClientRect();
            this.svg.style.left = `${graphAreaRect.left - canvasRect.left}px`;
            this.svg.style.top = `${graphAreaRect.top - canvasRect.top}px`;
            this.svg.style.width = `${graphAreaRect.width}px`;
            this.svg.style.height = `${graphAreaRect.height}px`;
        });
    }
}
