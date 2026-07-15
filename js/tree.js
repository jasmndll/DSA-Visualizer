import { BaseVisualizer } from './base.js';

class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
        // Visual coordinates calculated dynamically
        this.x = 0;
        this.y = 0;
    }
}

export class TreeVisualizer extends BaseVisualizer {
    constructor(canvas, svg, traceLog, codeContainer) {
        super(canvas, svg, traceLog, codeContainer);
        this.root = null;
        this.canvasWidth = 700;
        this.canvasHeight = 350;
        
        // Initial setup
        this.setupPseudocode([
            '// BST Insertion',
            'procedure insert(node, val)',
            '  if node == null then return new Node(val)',
            '  if val < node.val then',
            '    node.left = insert(node.left, val)',
            '  else if val > node.val then',
            '    node.right = insert(node.right, val)',
            '  return node'
        ]);
    }

    init() {
        // Create a default balanced BST: 40, 20, 60, 10, 30, 50, 70
        this.root = null;
        const vals = [40, 20, 60, 10, 30, 50, 70];
        vals.forEach(v => {
            this.root = this.insertNode(this.root, v);
        });
        
        this.generateIdleState();
    }

    insertNode(node, val) {
        if (!node) return new TreeNode(val);
        if (val < node.val) {
            node.left = this.insertNode(node.left, val);
        } else if (val > node.val) {
            node.right = this.insertNode(node.right, val);
        }
        return node;
    }

    generateIdleState() {
        this.calculatePositions(this.root, this.canvasWidth / 2, 45, 160);
        this.steps = [{
            nodes: this.serializeTree(this.root),
            activeVal: -1,
            visitedVals: [],
            line: 0,
            trace: "Initialized Binary Search Tree. Ready for insertion or traversals."
        }];
        this.currentStepIndex = 0;
        this.renderStep(0);
    }

    getInputsHTML() {
        return `
            <div class="control-group">
                <input type="number" class="input-control" id="tree-val" placeholder="Val" style="width: 70px;">
                <button class="btn btn-primary" id="btn-tree-insert">Insert</button>
                <div class="slider-container" style="margin-left: 12px;">
                    <span style="font-size: 0.85rem;">Traversal:</span>
                    <select class="input-control" id="select-traversal" style="padding: 6px 10px;">
                        <option value="inorder">In-Order</option>
                        <option value="preorder">Pre-Order</option>
                        <option value="postorder">Post-Order</option>
                    </select>
                </div>
                <button class="btn btn-primary" id="btn-tree-traverse">Run</button>
                <button class="btn" id="btn-tree-clear" style="color: var(--state-error);">Clear</button>
            </div>
        `;
    }

    bindInputs(container) {
        container.querySelector('#btn-tree-insert').addEventListener('click', () => {
            const val = parseInt(container.querySelector('#tree-val').value);
            if (!isNaN(val)) {
                this.executeInsert(val);
            }
        });
        
        container.querySelector('#btn-tree-traverse').addEventListener('click', () => {
            const type = container.querySelector('#select-traversal').value;
            this.executeTraversal(type);
        });

        container.querySelector('#btn-tree-clear').addEventListener('click', () => {
            this.root = null;
            this.generateIdleState();
        });
    }

    // Dynamic layout coordinate calculation
    calculatePositions(node, x, y, spacing) {
        if (!node) return;
        node.x = x;
        node.y = y;
        // Spacing halves with each depth level to avoid overlapping
        this.calculatePositions(node.left, x - spacing, y + 70, spacing * 0.55);
        this.calculatePositions(node.right, x + spacing, y + 70, spacing * 0.55);
    }

    serializeTree(node, list = []) {
        if (!node) return list;
        list.push({
            val: node.val,
            x: node.x,
            y: node.y,
            hasLeft: !!node.left,
            leftX: node.left ? node.left.x : 0,
            leftY: node.left ? node.left.y : 0,
            hasRight: !!node.right,
            rightX: node.right ? node.right.x : 0,
            rightY: node.right ? node.right.y : 0
        });
        this.serializeTree(node.left, list);
        this.serializeTree(node.right, list);
        return list;
    }

    executeInsert(val) {
        // Limit depth/size for styling limits
        const getDepth = (node) => {
            if (!node) return 0;
            return 1 + Math.max(getDepth(node.left), getDepth(node.right));
        };
        if (getDepth(this.root) >= 4) {
            alert("Visualizer height limit reached! Cannot exceed tree depth of 4.");
            return;
        }

        this.setupPseudocode([
            '// BST Insertion',
            'procedure insert(node, val)',
            '  if node == null then return new Node(val)',
            '  if val < node.val then',
            '    node.left = insert(node.left, val)',
            '  else if val > node.val then',
            '    node.right = insert(node.right, val)',
            '  return node'
        ]);

        const tempSteps = [];
        this.calculatePositions(this.root, this.canvasWidth / 2, 45, 160);

        tempSteps.push({
            nodes: this.serializeTree(this.root),
            activeVal: -1,
            visitedVals: [],
            line: 1,
            trace: `Insert value <span class="highlight-text">${val}</span> into Binary Search Tree.`
        });

        const traverseAndInsert = (node, parentVal = null, direction = '') => {
            if (!node) {
                tempSteps.push({
                    nodes: this.serializeTree(this.root),
                    activeVal: -1,
                    visitedVals: [],
                    newNode: { val, parentVal, direction },
                    line: 2,
                    trace: `Reached leaf slot. Insert new Node with value ${val}`
                });
                return new TreeNode(val);
            }

            tempSteps.push({
                nodes: this.serializeTree(this.root),
                activeVal: node.val,
                visitedVals: [],
                line: 3,
                trace: `Compare target ${val} with node ${node.val}`
            });

            if (val === node.val) {
                tempSteps.push({
                    nodes: this.serializeTree(this.root),
                    activeVal: node.val,
                    visitedVals: [],
                    line: 3,
                    trace: `Value ${val} already exists in tree. BSTs do not allow duplicates.`
                });
                return node;
            }

            if (val < node.val) {
                tempSteps.push({
                    nodes: this.serializeTree(this.root),
                    activeVal: node.val,
                    visitedVals: [],
                    line: 4,
                    trace: `${val} < ${node.val}. Traverse down the left subtree.`
                });
                node.left = traverseAndInsert(node.left, node.val, 'left');
            } else {
                tempSteps.push({
                    nodes: this.serializeTree(this.root),
                    activeVal: node.val,
                    visitedVals: [],
                    line: 6,
                    trace: `${val} > ${node.val}. Traverse down the right subtree.`
                });
                node.right = traverseAndInsert(node.right, node.val, 'right');
            }

            return node;
        };

        this.root = traverseAndInsert(this.root);
        this.calculatePositions(this.root, this.canvasWidth / 2, 45, 160);
        
        // Final state
        tempSteps.push({
            nodes: this.serializeTree(this.root),
            activeVal: -1,
            visitedVals: [],
            line: 0,
            trace: `Node ${val} inserted successfully.`
        });

        this.steps = tempSteps;
        this.currentStepIndex = 0;
        if (window.app) {
            window.app.updatePlaybackControlsState();
            window.app.play();
        }
    }

    executeTraversal(type) {
        if (!this.root) {
            alert("Tree is empty!");
            return;
        }

        const pseudocodes = {
            inorder: [
                'procedure inorder(node)',
                '  if node == null then return',
                '  inorder(node.left)',
                '  visit(node) // output node.val',
                '  inorder(node.right)'
            ],
            preorder: [
                'procedure preorder(node)',
                '  if node == null then return',
                '  visit(node) // output node.val',
                '  preorder(node.left)',
                '  preorder(node.right)'
            ],
            postorder: [
                'procedure postorder(node)',
                '  if node == null then return',
                '  postorder(node.left)',
                '  postorder(node.right)',
                '  visit(node) // output node.val'
            ]
        };

        this.setupPseudocode(pseudocodes[type]);

        const tempSteps = [];
        const visitedList = [];
        this.calculatePositions(this.root, this.canvasWidth / 2, 45, 160);

        tempSteps.push({
            nodes: this.serializeTree(this.root),
            activeVal: -1,
            visitedVals: [],
            line: 0,
            trace: `Start ${type.toUpperCase()} traversal on root.`
        });

        const runInorder = (node) => {
            if (!node) {
                tempSteps.push({
                    nodes: this.serializeTree(this.root),
                    activeVal: -1,
                    visitedVals: [...visitedList],
                    line: 1,
                    trace: "Leaf reached. Backtrack."
                });
                return;
            }

            tempSteps.push({
                nodes: this.serializeTree(this.root),
                activeVal: node.val,
                visitedVals: [...visitedList],
                line: 2,
                trace: `Traverse left subtree of ${node.val}`
            });
            runInorder(node.left);

            visitedList.push(node.val);
            tempSteps.push({
                nodes: this.serializeTree(this.root),
                activeVal: node.val,
                visitedVals: [...visitedList],
                line: 3,
                trace: `Visit node: <span class="highlight-text">${node.val}</span>. Traversal path: ${visitedList.join(', ')}`
            });

            tempSteps.push({
                nodes: this.serializeTree(this.root),
                activeVal: node.val,
                visitedVals: [...visitedList],
                line: 4,
                trace: `Traverse right subtree of ${node.val}`
            });
            runInorder(node.right);
        };

        const runPreorder = (node) => {
            if (!node) {
                tempSteps.push({
                    nodes: this.serializeTree(this.root),
                    activeVal: -1,
                    visitedVals: [...visitedList],
                    line: 1,
                    trace: "Leaf reached. Backtrack."
                });
                return;
            }

            visitedList.push(node.val);
            tempSteps.push({
                nodes: this.serializeTree(this.root),
                activeVal: node.val,
                visitedVals: [...visitedList],
                line: 2,
                trace: `Visit node: <span class="highlight-text">${node.val}</span>. Traversal path: ${visitedList.join(', ')}`
            });

            tempSteps.push({
                nodes: this.serializeTree(this.root),
                activeVal: node.val,
                visitedVals: [...visitedList],
                line: 3,
                trace: `Traverse left subtree of ${node.val}`
            });
            runPreorder(node.left);

            tempSteps.push({
                nodes: this.serializeTree(this.root),
                activeVal: node.val,
                visitedVals: [...visitedList],
                line: 4,
                trace: `Traverse right subtree of ${node.val}`
            });
            runPreorder(node.right);
        };

        const runPostorder = (node) => {
            if (!node) {
                tempSteps.push({
                    nodes: this.serializeTree(this.root),
                    activeVal: -1,
                    visitedVals: [...visitedList],
                    line: 1,
                    trace: "Leaf reached. Backtrack."
                });
                return;
            }

            tempSteps.push({
                nodes: this.serializeTree(this.root),
                activeVal: node.val,
                visitedVals: [...visitedList],
                line: 2,
                trace: `Traverse left subtree of ${node.val}`
            });
            runPostorder(node.left);

            tempSteps.push({
                nodes: this.serializeTree(this.root),
                activeVal: node.val,
                visitedVals: [...visitedList],
                line: 3,
                trace: `Traverse right subtree of ${node.val}`
            });
            runPostorder(node.right);

            visitedList.push(node.val);
            tempSteps.push({
                nodes: this.serializeTree(this.root),
                activeVal: node.val,
                visitedVals: [...visitedList],
                line: 4,
                trace: `Visit node: <span class="highlight-text">${node.val}</span>. Traversal path: ${visitedList.join(', ')}`
            });
        };

        if (type === 'inorder') runInorder(this.root);
        else if (type === 'preorder') runPreorder(this.root);
        else if (type === 'postorder') runPostorder(this.root);

        // Final summary step
        tempSteps.push({
            nodes: this.serializeTree(this.root),
            activeVal: -1,
            visitedVals: [...visitedList],
            line: 0,
            trace: `${type.toUpperCase()} Traversal complete! Visited: ${visitedList.join(', ')}`
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

        if (!step.nodes || step.nodes.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.color = 'var(--text-muted)';
            emptyMsg.innerText = 'Empty Tree';
            this.canvas.appendChild(emptyMsg);
            return;
        }

        // Parent relative container inside canvas
        const treeArea = document.createElement('div');
        treeArea.style.position = 'relative';
        treeArea.style.width = `${this.canvasWidth}px`;
        treeArea.style.height = `${this.canvasHeight}px`;
        treeArea.style.margin = 'auto';

        // Draw connections (edges)
        step.nodes.forEach(n => {
            if (n.hasLeft) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", n.x);
                line.setAttribute("y1", n.y);
                line.setAttribute("x2", n.leftX);
                line.setAttribute("y2", n.leftY);
                line.setAttribute("class", "graph-edge");
                this.svg.appendChild(line);
            }
            if (n.hasRight) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", n.x);
                line.setAttribute("y1", n.y);
                line.setAttribute("x2", n.rightX);
                line.setAttribute("y2", n.rightY);
                line.setAttribute("class", "graph-edge");
                this.svg.appendChild(line);
            }
        });

        // Draw Nodes
        step.nodes.forEach(n => {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'canvas-node';
            nodeDiv.innerText = n.val;
            
            // Positioning (subtracted half width/height 23px to center on coordinates)
            nodeDiv.style.left = `${n.x - 23}px`;
            nodeDiv.style.top = `${n.y - 23}px`;

            // State styling
            if (n.val === step.activeVal) {
                nodeDiv.classList.add('active');
            } else if (step.visitedVals.includes(n.val)) {
                nodeDiv.classList.add('visited');
            }

            treeArea.appendChild(nodeDiv);
        });

        // Render temporary new node in insertion process if exists
        if (step.newNode) {
            const { val, parentVal, direction } = step.newNode;
            const parent = step.nodes.find(x => x.val === parentVal);
            if (parent) {
                // Calculate position based on direction
                const newX = direction === 'left' ? parent.x - 40 : parent.x + 40;
                const newY = parent.y + 60;

                // Draw edge to new node
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", parent.x);
                line.setAttribute("y1", parent.y);
                line.setAttribute("x2", newX);
                line.setAttribute("y2", newY);
                line.setAttribute("class", "graph-edge visited");
                this.svg.appendChild(line);

                // Draw new node
                const nodeDiv = document.createElement('div');
                nodeDiv.className = 'canvas-node path';
                nodeDiv.innerText = val;
                nodeDiv.style.left = `${newX - 23}px`;
                nodeDiv.style.top = `${newY - 23}px`;
                treeArea.appendChild(nodeDiv);
            } else if (!parent && step.nodes.length === 0) {
                // First node inserted
                const nodeDiv = document.createElement('div');
                nodeDiv.className = 'canvas-node path';
                nodeDiv.innerText = val;
                nodeDiv.style.left = `${this.canvasWidth / 2 - 23}px`;
                nodeDiv.style.top = `45px`;
                treeArea.appendChild(nodeDiv);
            }
        }

        this.canvas.appendChild(treeArea);

        // Position overlay SVG relative to treeArea
        requestAnimationFrame(() => {
            const canvasRect = this.canvas.getBoundingClientRect();
            const treeAreaRect = treeArea.getBoundingClientRect();
            this.svg.style.left = `${treeAreaRect.left - canvasRect.left}px`;
            this.svg.style.top = `${treeAreaRect.top - canvasRect.top}px`;
            this.svg.style.width = `${treeAreaRect.width}px`;
            this.svg.style.height = `${treeAreaRect.height}px`;
        });
    }
}
