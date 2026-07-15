import { BaseVisualizer } from './base.js';

export class LinkedListVisualizer extends BaseVisualizer {
    constructor(canvas, svg, traceLog, codeContainer) {
        super(canvas, svg, traceLog, codeContainer);
        this.list = [10, 20, 30]; // Default dataset representing node values
        this.maxSize = 6;
        
        this.setupPseudocode([
            '// Linked List Insertion at Tail',
            'procedure insertTail(list, val)',
            '  newNode = createNode(val) // val, next=null',
            '  if list.head == null then list.head = newNode',
            '  else',
            '    curr = list.head',
            '    while curr.next != null do',
            '      curr = curr.next // Traverse',
            '    curr.next = newNode'
        ]);
    }

    init() {
        this.steps = [];
        this.currentStepIndex = -1;
        this.generateIdleState();
    }

    generateIdleState() {
        this.steps = [{
            list: [...this.list],
            highlightedIdx: -1,
            pointerIdx: -1,
            pointerText: '',
            line: 0,
            trace: "Initialized Singly Linked List. Ready for operations."
        }];
        this.currentStepIndex = 0;
        this.renderStep(0);
    }

    getInputsHTML() {
        return `
            <div class="control-group">
                <input type="number" class="input-control" id="ll-val" placeholder="Value" style="width: 80px;">
                <button class="btn btn-primary" id="btn-ll-insert-head">Insert Head</button>
                <button class="btn btn-primary" id="btn-ll-insert-tail">Insert Tail</button>
                <button class="btn" id="btn-ll-delete-val" style="color: var(--state-error);">Delete Val</button>
            </div>
        `;
    }

    bindInputs(container) {
        container.querySelector('#btn-ll-insert-head').addEventListener('click', () => {
            const val = parseInt(container.querySelector('#ll-val').value);
            if (!isNaN(val)) {
                this.executeInsertHead(val);
            }
        });
        container.querySelector('#btn-ll-insert-tail').addEventListener('click', () => {
            const val = parseInt(container.querySelector('#ll-val').value);
            if (!isNaN(val)) {
                this.executeInsertTail(val);
            }
        });
        container.querySelector('#btn-ll-delete-val').addEventListener('click', () => {
            const val = parseInt(container.querySelector('#ll-val').value);
            if (!isNaN(val)) {
                this.executeDeleteValue(val);
            }
        });
    }

    executeInsertHead(val) {
        if (this.list.length >= this.maxSize) {
            alert(`Maximum list size is ${this.maxSize}!`);
            return;
        }

        this.setupPseudocode([
            '// Linked List Insertion at Head',
            'procedure insertHead(list, val)',
            '  newNode = createNode(val)',
            '  newNode.next = list.head',
            '  list.head = newNode'
        ]);

        const tempSteps = [];
        const currentList = [...this.list];

        tempSteps.push({
            list: [...currentList],
            highlightedIdx: -1,
            pointerIdx: -1,
            pointerText: '',
            line: 1,
            trace: `Insert value <span class="highlight-text">${val}</span> at Head.`
        });

        tempSteps.push({
            list: [...currentList],
            highlightedIdx: -1,
            pointerIdx: -1,
            pointerText: '',
            line: 2,
            trace: `Create a new node with value ${val}`
        });

        // Add node at beginning of list (temporarily highlight index 0 later)
        currentList.unshift(val);
        this.list = [...currentList];

        tempSteps.push({
            list: [...currentList],
            highlightedIdx: 0,
            pointerIdx: -1,
            pointerText: '',
            line: 3,
            trace: `Link new node's next pointer to the previous head node.`
        });

        tempSteps.push({
            list: [...this.list],
            highlightedIdx: 0,
            pointerIdx: 0,
            pointerText: 'head',
            line: 4,
            trace: `Update the head pointer to point to the new node.`
        });

        this.steps = tempSteps;
        this.currentStepIndex = 0;
        if (window.app) {
            window.app.updatePlaybackControlsState();
            window.app.play();
        }
    }

    executeInsertTail(val) {
        if (this.list.length >= this.maxSize) {
            alert(`Maximum list size is ${this.maxSize}!`);
            return;
        }

        this.setupPseudocode([
            '// Linked List Insertion at Tail',
            'procedure insertTail(list, val)',
            '  newNode = createNode(val) // val, next=null',
            '  if list.head == null then list.head = newNode',
            '  else',
            '    curr = list.head',
            '    while curr.next != null do',
            '      curr = curr.next // Traverse',
            '    curr.next = newNode'
        ]);

        const tempSteps = [];
        const currentList = [...this.list];

        tempSteps.push({
            list: [...currentList],
            highlightedIdx: -1,
            pointerIdx: -1,
            pointerText: '',
            line: 1,
            trace: `Insert value <span class="highlight-text">${val}</span> at Tail.`
        });

        tempSteps.push({
            list: [...currentList],
            highlightedIdx: -1,
            pointerIdx: -1,
            pointerText: '',
            line: 2,
            trace: `Create a new node with value ${val} and next pointer set to null`
        });

        if (currentList.length === 0) {
            currentList.push(val);
            this.list = [...currentList];
            tempSteps.push({
                list: [...currentList],
                highlightedIdx: 0,
                pointerIdx: 0,
                pointerText: 'head',
                line: 3,
                trace: `Head is null. Point head to the new node.`
            });
        } else {
            tempSteps.push({
                list: [...currentList],
                highlightedIdx: -1,
                pointerIdx: -1,
                pointerText: '',
                line: 3,
                trace: `Head is not null. Set up traversal.`
            });

            tempSteps.push({
                list: [...currentList],
                highlightedIdx: -1,
                pointerIdx: 0,
                pointerText: 'curr',
                line: 5,
                trace: `Initialize pointer curr to head (index 0).`
            });

            // Traverse
            let i = 0;
            for (i = 0; i < currentList.length - 1; i++) {
                tempSteps.push({
                    list: [...currentList],
                    highlightedIdx: i,
                    pointerIdx: i,
                    pointerText: 'curr',
                    line: 6,
                    trace: `Is curr.next null? No (Value ${currentList[i]} points to ${currentList[i+1]})`
                });

                tempSteps.push({
                    list: [...currentList],
                    highlightedIdx: i + 1,
                    pointerIdx: i + 1,
                    pointerText: 'curr',
                    line: 7,
                    trace: `Move curr pointer to next node (index ${i+1}).`
                });
            }

            // At tail
            tempSteps.push({
                list: [...currentList],
                highlightedIdx: i,
                pointerIdx: i,
                pointerText: 'curr',
                line: 6,
                trace: `Is curr.next null? Yes (Value ${currentList[i]} points to null)`
            });

            currentList.push(val);
            this.list = [...currentList];

            tempSteps.push({
                list: [...currentList],
                highlightedIdx: currentList.length - 1,
                pointerIdx: currentList.length - 2,
                pointerText: 'curr',
                line: 8,
                trace: `Link curr node (index ${currentList.length - 2})'s next pointer to the new node.`
            });
        }

        this.steps = tempSteps;
        this.currentStepIndex = 0;
        if (window.app) {
            window.app.updatePlaybackControlsState();
            window.app.play();
        }
    }

    executeDeleteValue(val) {
        if (this.list.length === 0) {
            alert("List is empty!");
            return;
        }

        this.setupPseudocode([
            '// Linked List Value Deletion',
            'procedure deleteValue(list, val)',
            '  if list.head.value == val then',
            '    list.head = list.head.next',
            '  else',
            '    curr = list.head',
            '    while curr.next != null and curr.next.value != val do',
            '      curr = curr.next',
            '    if curr.next != null then curr.next = curr.next.next'
        ]);

        const tempSteps = [];
        const currentList = [...this.list];
        const valIdx = currentList.indexOf(val);

        tempSteps.push({
            list: [...currentList],
            highlightedIdx: -1,
            pointerIdx: -1,
            pointerText: '',
            line: 1,
            trace: `Search and delete node with value <span class="highlight-text">${val}</span>`
        });

        if (valIdx === -1) {
            tempSteps.push({
                list: [...currentList],
                highlightedIdx: -1,
                pointerIdx: -1,
                pointerText: '',
                line: 1,
                trace: `Value ${val} not found in the list. Nothing to delete.`
            });
            this.steps = tempSteps;
            this.currentStepIndex = 0;
            if (window.app) window.app.updatePlaybackControlsState();
            return;
        }

        tempSteps.push({
            list: [...currentList],
            highlightedIdx: 0,
            pointerIdx: -1,
            pointerText: '',
            line: 2,
            trace: `Check if head node (value ${currentList[0]}) matches target value ${val}`
        });

        if (valIdx === 0) {
            currentList.shift();
            this.list = [...currentList];
            tempSteps.push({
                list: [...currentList],
                highlightedIdx: -1,
                pointerIdx: -1,
                pointerText: '',
                line: 3,
                trace: `Head matched. Re-route head pointer to head.next. Node is deleted.`
            });
        } else {
            tempSteps.push({
                list: [...currentList],
                highlightedIdx: -1,
                pointerIdx: 0,
                pointerText: 'curr',
                line: 5,
                trace: `Initialize curr pointer to head.`
            });

            let i = 0;
            // Loop until curr.next matches
            while (i < currentList.length - 1 && currentList[i+1] !== val) {
                tempSteps.push({
                    list: [...currentList],
                    highlightedIdx: i + 1,
                    pointerIdx: i,
                    pointerText: 'curr',
                    line: 6,
                    trace: `Is curr.next.value (${currentList[i+1]}) equal to target ${val}? No.`
                });
                
                i++;
                tempSteps.push({
                    list: [...currentList],
                    highlightedIdx: -1,
                    pointerIdx: i,
                    pointerText: 'curr',
                    line: 7,
                    trace: `Move curr to next node (index ${i}).`
                });
            }

            tempSteps.push({
                list: [...currentList],
                highlightedIdx: i + 1,
                pointerIdx: i,
                pointerText: 'curr',
                line: 6,
                trace: `Is curr.next.value (${currentList[i+1]}) equal to target ${val}? Yes!`
            });

            // Re-route curr.next to curr.next.next
            currentList.splice(valIdx, 1);
            this.list = [...currentList];

            tempSteps.push({
                list: [...currentList],
                highlightedIdx: i,
                pointerIdx: i,
                pointerText: 'curr',
                line: 9,
                trace: `Update curr.next to skip the target node (re-route connection). Target node is deleted.`
            });
        }

        this.steps = tempSteps;
        this.currentStepIndex = 0;
        if (window.app) {
            window.app.updatePlaybackControlsState();
            window.app.play();
        }
    }

    drawState(step) {
        this.canvas.innerHTML = '';
        
        // Setup base layout container
        const container = document.createElement('div');
        container.className = 'linkedlist-container';
        
        if (step.list.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.color = 'var(--text-muted)';
            emptyMsg.style.fontSize = '1rem';
            emptyMsg.innerText = 'Empty List';
            container.appendChild(emptyMsg);
            this.canvas.appendChild(container);
            
            // Clear SVG edges
            const defs = this.svg.querySelector('defs');
            this.svg.innerHTML = '';
            if (defs) this.svg.appendChild(defs);
            return;
        }

        // Add Head Label above the first element
        step.list.forEach((val, idx) => {
            const group = document.createElement('div');
            group.className = 'linkedlist-node-group';
            group.id = `ll-node-group-${idx}`;

            const node = document.createElement('div');
            node.className = 'linkedlist-node';
            if (idx === step.highlightedIdx) {
                node.classList.add('active');
            }

            const valPart = document.createElement('div');
            valPart.className = 'val-part';
            valPart.innerText = val;
            node.appendChild(valPart);

            const nextPart = document.createElement('div');
            nextPart.className = 'next-part';
            nextPart.innerText = idx === step.list.length - 1 ? '•' : '➔';
            node.appendChild(nextPart);

            group.appendChild(node);

            // Add index label below node
            const indexLabel = document.createElement('span');
            indexLabel.className = 'index-label';
            indexLabel.style.bottom = '-30px';
            indexLabel.style.left = '32%';
            indexLabel.innerText = idx === 0 ? 'head' : idx;
            group.appendChild(indexLabel);

            // Pointer label if active
            if (idx === step.pointerIdx && step.pointerText) {
                const pointerLabel = document.createElement('span');
                pointerLabel.className = 'pointer-label';
                pointerLabel.style.top = '-32px';
                pointerLabel.style.left = '16%';
                pointerLabel.innerText = step.pointerText.toUpperCase();
                group.appendChild(pointerLabel);
            }

            container.appendChild(group);
        });

        this.canvas.appendChild(container);

        // Schedule drawing connecting lines after layout render
        requestAnimationFrame(() => this.drawConnectingLines(step));
    }

    drawConnectingLines(step) {
        // Clear all path elements except defs
        const defs = this.svg.querySelector('defs');
        this.svg.innerHTML = '';
        if (defs) this.svg.appendChild(defs);

        const canvasRect = this.canvas.getBoundingClientRect();
        const numNodes = step.list.length;

        for (let i = 0; i < numNodes - 1; i++) {
            const fromGroup = document.getElementById(`ll-node-group-${i}`);
            const toGroup = document.getElementById(`ll-node-group-${i+1}`);
            if (!fromGroup || !toGroup) continue;

            const fromNode = fromGroup.querySelector('.linkedlist-node');
            const toNode = toGroup.querySelector('.linkedlist-node');
            
            const fromPart = fromNode.querySelector('.next-part');
            const toPart = toNode.querySelector('.val-part');

            const fromRect = fromPart.getBoundingClientRect();
            const toRect = toPart.getBoundingClientRect();

            const x1 = fromRect.left - canvasRect.left + fromRect.width / 2;
            const y1 = fromRect.top - canvasRect.top + fromRect.height / 2;
            
            const x2 = toRect.left - canvasRect.left;
            const y2 = toRect.top - canvasRect.top + toRect.height / 2;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
            
            // Check if connection is active
            if (i === step.pointerIdx) {
                path.setAttribute("class", "graph-edge visited");
                path.setAttribute("marker-end", "url(#arrow-active)");
            } else {
                path.setAttribute("class", "graph-edge");
                path.setAttribute("marker-end", "url(#arrow)");
            }

            this.svg.appendChild(path);
        }
    }
}
