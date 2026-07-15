import { BaseVisualizer } from './base.js';

export class LinearVisualizer extends BaseVisualizer {
    constructor(canvas, svg, traceLog, codeContainer, algoId) {
        super(canvas, svg, traceLog, codeContainer);
        this.algoId = algoId; // 'array', 'stack', 'queue'
        this.array = [10, 20, 30, 40]; // Default dataset
        this.maxSize = 8;
        
        this.initPseudocode();
    }

    initPseudocode() {
        if (this.algoId === 'array') {
            this.setupPseudocode([
                '// Array Insertion',
                'procedure insert(arr, val, idx)',
                '  if idx < 0 or idx > length then error',
                '  for i = length down to idx + 1 do',
                '    arr[i] = arr[i - 1] // Shift right',
                '  arr[idx] = val',
                '  length = length + 1'
            ]);
        } else if (this.algoId === 'stack') {
            this.setupPseudocode([
                '// Stack Push Operation',
                'procedure push(stack, val)',
                '  if stack.length >= maxSize then overflow',
                '  stack[top] = val',
                '  top = top + 1'
            ]);
        } else if (this.algoId === 'queue') {
            this.setupPseudocode([
                '// Queue Enqueue Operation',
                'procedure enqueue(queue, val)',
                '  if queue.length >= maxSize then overflow',
                '  queue[tail] = val',
                '  tail = tail + 1'
            ]);
        }
    }

    init() {
        this.steps = [];
        this.currentStepIndex = -1;
        // Generate an initial idle state
        this.generateIdleState();
    }

    generateIdleState() {
        this.steps = [{
            array: [...this.array],
            highlighted: [],
            actionType: 'idle',
            line: 0,
            trace: `Initialized ${this.algoId.toUpperCase()}. Ready for operations.`
        }];
        this.currentStepIndex = 0;
        this.renderStep(0);
    }

    getInputsHTML() {
        if (this.algoId === 'array') {
            return `
                <div class="control-group">
                    <input type="number" class="input-control" id="arr-val" placeholder="Value" style="width: 70px;">
                    <input type="number" class="input-control" id="arr-idx" placeholder="Idx" style="width: 60px;">
                    <button class="btn btn-primary" id="btn-arr-insert">Insert</button>
                    <button class="btn" id="btn-arr-delete" style="color: var(--state-error);">Delete Idx</button>
                </div>
            `;
        } else if (this.algoId === 'stack') {
            return `
                <div class="control-group">
                    <input type="number" class="input-control" id="stack-val" placeholder="Value" style="width: 80px;">
                    <button class="btn btn-primary" id="btn-stack-push">Push</button>
                    <button class="btn" id="btn-stack-pop" style="color: var(--state-error);">Pop</button>
                </div>
            `;
        } else if (this.algoId === 'queue') {
            return `
                <div class="control-group">
                    <input type="number" class="input-control" id="queue-val" placeholder="Value" style="width: 80px;">
                    <button class="btn btn-primary" id="btn-queue-enqueue">Enqueue</button>
                    <button class="btn" id="btn-queue-dequeue" style="color: var(--state-error);">Dequeue</button>
                </div>
            `;
        }
        return '';
    }

    bindInputs(container) {
        if (this.algoId === 'array') {
            container.querySelector('#btn-arr-insert').addEventListener('click', () => {
                const val = parseInt(container.querySelector('#arr-val').value);
                const idx = parseInt(container.querySelector('#arr-idx').value);
                if (!isNaN(val) && !isNaN(idx)) {
                    this.executeArrayInsert(val, idx);
                } else {
                    alert("Please provide valid Value and Index.");
                }
            });
            container.querySelector('#btn-arr-delete').addEventListener('click', () => {
                const idx = parseInt(container.querySelector('#arr-idx').value);
                if (!isNaN(idx)) {
                    this.executeArrayDelete(idx);
                } else {
                    alert("Please provide a valid Index to delete.");
                }
            });
        } else if (this.algoId === 'stack') {
            container.querySelector('#btn-stack-push').addEventListener('click', () => {
                const val = parseInt(container.querySelector('#stack-val').value);
                if (!isNaN(val)) {
                    this.executeStackPush(val);
                }
            });
            container.querySelector('#btn-stack-pop').addEventListener('click', () => {
                this.executeStackPop();
            });
        } else if (this.algoId === 'queue') {
            container.querySelector('#btn-queue-enqueue').addEventListener('click', () => {
                const val = parseInt(container.querySelector('#queue-val').value);
                if (!isNaN(val)) {
                    this.executeQueueEnqueue(val);
                }
            });
            container.querySelector('#btn-queue-dequeue').addEventListener('click', () => {
                this.executeQueueDequeue();
            });
        }
    }

    // Array operations
    executeArrayInsert(val, idx) {
        if (this.array.length >= this.maxSize) {
            alert(`Array is full! Maximum size is ${this.maxSize}.`);
            return;
        }
        if (idx < 0 || idx > this.array.length) {
            alert(`Index out of bounds! Valid range is 0 to ${this.array.length}.`);
            return;
        }

        this.setupPseudocode([
            '// Array Insertion',
            'procedure insert(arr, val, idx)',
            '  if idx < 0 or idx > length then error',
            '  for i = length down to idx + 1 do',
            '    arr[i] = arr[i - 1] // Shift right',
            '  arr[idx] = val',
            '  length = length + 1'
        ]);

        const tempSteps = [];
        const arr = [...this.array];
        const initialLen = arr.length;

        tempSteps.push({
            array: [...arr],
            highlighted: [],
            line: 1,
            trace: `Insert value <span class="highlight-text">${val}</span> at index <span class="highlight-text">${idx}</span>`
        });

        tempSteps.push({
            array: [...arr],
            highlighted: [],
            line: 2,
            trace: `Verify bounds check: is index ${idx} valid? Yes`
        });

        // Simulating the shifting loop
        for (let i = initialLen; i > idx; i--) {
            arr[i] = arr[i - 1];
            tempSteps.push({
                array: [...arr],
                highlighted: [i - 1, i],
                line: 4,
                trace: `Shift value at index ${i - 1} (${arr[i-1]}) right to index ${i}`
            });
        }

        arr[idx] = val;
        tempSteps.push({
            array: [...arr],
            highlighted: [idx],
            line: 5,
            trace: `Place new value ${val} at index ${idx}`
        });

        this.array = [...arr];

        tempSteps.push({
            array: [...this.array],
            highlighted: [idx],
            line: 6,
            trace: `Increment array size. Insertion complete.`
        });

        this.steps = tempSteps;
        this.currentStepIndex = 0;
        
        // Notify player in app.js if running
        if (window.app) {
            window.app.updatePlaybackControlsState();
            window.app.play();
        }
    }

    executeArrayDelete(idx) {
        if (this.array.length === 0) {
            alert("Array is empty!");
            return;
        }
        if (idx < 0 || idx >= this.array.length) {
            alert(`Index out of bounds! Valid range is 0 to ${this.array.length - 1}.`);
            return;
        }

        this.setupPseudocode([
            '// Array Deletion',
            'procedure delete(arr, idx)',
            '  if idx < 0 or idx >= length then error',
            '  for i = idx to length - 2 do',
            '    arr[i] = arr[i + 1] // Shift left',
            '  remove last element',
            '  length = length - 1'
        ]);

        const tempSteps = [];
        const arr = [...this.array];
        const val = arr[idx];

        tempSteps.push({
            array: [...arr],
            highlighted: [idx],
            line: 1,
            trace: `Delete element at index <span class="highlight-text">${idx}</span> (value ${val})`
        });

        tempSteps.push({
            array: [...arr],
            highlighted: [],
            line: 2,
            trace: `Verify bounds check: is index ${idx} valid? Yes`
        });

        // Shift left
        for (let i = idx; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
            tempSteps.push({
                array: [...arr],
                highlighted: [i, i + 1],
                line: 4,
                trace: `Shift value at index ${i + 1} (${arr[i+1]}) left to index ${i}`
            });
        }

        arr.pop();
        tempSteps.push({
            array: [...arr],
            highlighted: [],
            line: 5,
            trace: `Remove the leftover redundant last element`
        });

        this.array = [...arr];

        tempSteps.push({
            array: [...this.array],
            highlighted: [],
            line: 6,
            trace: `Decrement array size. Deletion complete.`
        });

        this.steps = tempSteps;
        this.currentStepIndex = 0;
        
        if (window.app) {
            window.app.updatePlaybackControlsState();
            window.app.play();
        }
    }

    // Stack operations
    executeStackPush(val) {
        this.setupPseudocode([
            '// Stack Push Operation',
            'procedure push(stack, val)',
            '  if stack.length >= maxSize then overflow',
            '  stack[top] = val',
            '  top = top + 1'
        ]);

        if (this.array.length >= this.maxSize) {
            alert("Stack Overflow! Cannot push more items.");
            return;
        }

        const tempSteps = [];
        const arr = [...this.array];

        tempSteps.push({
            array: [...arr],
            highlighted: [],
            line: 1,
            trace: `Initiating push operation for value <span class="highlight-text">${val}</span>`
        });

        tempSteps.push({
            array: [...arr],
            highlighted: [],
            line: 2,
            trace: `Check overflow: stack size (${arr.length}) < maxSize (${this.maxSize})? Yes`
        });

        arr.push(val);
        tempSteps.push({
            array: [...arr],
            highlighted: [arr.length - 1],
            line: 3,
            trace: `Place element ${val} at stack index top (${arr.length - 1})`
        });

        this.array = [...arr];

        tempSteps.push({
            array: [...this.array],
            highlighted: [this.array.length - 1],
            line: 4,
            trace: `Increment top index. Push complete.`
        });

        this.steps = tempSteps;
        this.currentStepIndex = 0;
        if (window.app) {
            window.app.updatePlaybackControlsState();
            window.app.play();
        }
    }

    executeStackPop() {
        this.setupPseudocode([
            '// Stack Pop Operation',
            'procedure pop(stack)',
            '  if stack is empty then underflow',
            '  val = stack[top]',
            '  top = top - 1',
            '  return val'
        ]);

        if (this.array.length === 0) {
            alert("Stack Underflow! Stack is empty.");
            return;
        }

        const tempSteps = [];
        const arr = [...this.array];
        const popped = arr[arr.length - 1];

        tempSteps.push({
            array: [...arr],
            highlighted: [arr.length - 1],
            line: 1,
            trace: `Initiating pop operation.`
        });

        tempSteps.push({
            array: [...arr],
            highlighted: [arr.length - 1],
            line: 2,
            trace: `Check underflow: stack contains elements? Yes`
        });

        tempSteps.push({
            array: [...arr],
            highlighted: [arr.length - 1],
            line: 3,
            trace: `Retrieve value at top of stack: A[${arr.length - 1}] = ${popped}`
        });

        arr.pop();
        tempSteps.push({
            array: [...arr],
            highlighted: [],
            line: 4,
            trace: `Decrement top index. Remove element from stack.`
        });

        this.array = [...arr];

        tempSteps.push({
            array: [...this.array],
            highlighted: [],
            line: 5,
            trace: `Return popped value: <span class="highlight-text">${popped}</span>. Pop complete.`
        });

        this.steps = tempSteps;
        this.currentStepIndex = 0;
        if (window.app) {
            window.app.updatePlaybackControlsState();
            window.app.play();
        }
    }

    // Queue operations
    executeQueueEnqueue(val) {
        this.setupPseudocode([
            '// Queue Enqueue Operation',
            'procedure enqueue(queue, val)',
            '  if queue.length >= maxSize then overflow',
            '  queue[tail] = val',
            '  tail = tail + 1'
        ]);

        if (this.array.length >= this.maxSize) {
            alert("Queue Overflow! Queue is full.");
            return;
        }

        const tempSteps = [];
        const arr = [...this.array];

        tempSteps.push({
            array: [...arr],
            highlighted: [],
            line: 1,
            trace: `Initiating enqueue operation for value <span class="highlight-text">${val}</span>`
        });

        tempSteps.push({
            array: [...arr],
            highlighted: [],
            line: 2,
            trace: `Check overflow: queue size (${arr.length}) < maxSize (${this.maxSize})? Yes`
        });

        arr.push(val);
        tempSteps.push({
            array: [...arr],
            highlighted: [arr.length - 1],
            line: 3,
            trace: `Add element ${val} at the tail of the queue (index ${arr.length - 1})`
        });

        this.array = [...arr];

        tempSteps.push({
            array: [...this.array],
            highlighted: [this.array.length - 1],
            line: 4,
            trace: `Increment tail index. Enqueue complete.`
        });

        this.steps = tempSteps;
        this.currentStepIndex = 0;
        if (window.app) {
            window.app.updatePlaybackControlsState();
            window.app.play();
        }
    }

    executeQueueDequeue() {
        this.setupPseudocode([
            '// Queue Dequeue Operation',
            'procedure dequeue(queue)',
            '  if queue is empty then underflow',
            '  val = queue[head]',
            '  head = head + 1',
            '  return val'
        ]);

        if (this.array.length === 0) {
            alert("Queue Underflow! Queue is empty.");
            return;
        }

        const tempSteps = [];
        const arr = [...this.array];
        const dequeued = arr[0];

        tempSteps.push({
            array: [...arr],
            highlighted: [0],
            line: 1,
            trace: `Initiating dequeue operation.`
        });

        tempSteps.push({
            array: [...arr],
            highlighted: [0],
            line: 2,
            trace: `Check underflow: queue has items? Yes`
        });

        tempSteps.push({
            array: [...arr],
            highlighted: [0],
            line: 3,
            trace: `Retrieve value at head of queue: A[0] = ${dequeued}`
        });

        // Slide elements left
        arr.shift();
        tempSteps.push({
            array: [...arr],
            highlighted: [],
            line: 4,
            trace: `Shift head index pointer. Elements slide left.`
        });

        this.array = [...arr];

        tempSteps.push({
            array: [...this.array],
            highlighted: [],
            line: 5,
            trace: `Return dequeued value: <span class="highlight-text">${dequeued}</span>. Dequeue complete.`
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
        
        if (this.algoId === 'array') {
            const container = document.createElement('div');
            container.className = 'linear-container';
            container.style.marginTop = '20px';
            
            step.array.forEach((val, idx) => {
                const node = document.createElement('div');
                node.className = 'linear-node';
                node.innerText = val;
                
                if (step.highlighted.includes(idx)) {
                    node.classList.add('active');
                }
                
                const indexLabel = document.createElement('span');
                indexLabel.className = 'index-label';
                indexLabel.innerText = idx;
                node.appendChild(indexLabel);
                
                container.appendChild(node);
            });
            
            this.canvas.appendChild(container);
            
        } else if (this.algoId === 'stack') {
            const container = document.createElement('div');
            container.className = 'stack-container';
            container.style.margin = '20px auto';
            
            step.array.forEach((val, idx) => {
                const node = document.createElement('div');
                node.className = 'stack-node';
                node.innerText = val;
                
                if (idx === step.array.length - 1) {
                    node.style.borderColor = 'var(--accent-primary)';
                    node.style.boxShadow = '0 0 10px var(--accent-primary-glow)';
                    
                    const topLabel = document.createElement('span');
                    topLabel.className = 'pointer-label';
                    topLabel.style.right = '-60px';
                    topLabel.style.top = '10px';
                    topLabel.innerText = 'TOP';
                    node.appendChild(topLabel);
                }
                
                if (step.highlighted.includes(idx)) {
                    node.style.borderColor = 'var(--state-active)';
                }
                
                container.appendChild(node);
            });
            
            // Add grid guides
            this.canvas.appendChild(container);
            
        } else if (this.algoId === 'queue') {
            const container = document.createElement('div');
            container.className = 'queue-container';
            container.style.margin = '20px auto';
            
            step.array.forEach((val, idx) => {
                const node = document.createElement('div');
                node.className = 'linear-node';
                node.innerText = val;
                node.style.animation = 'nodePop 0.3s ease';
                
                if (idx === 0) {
                    node.style.borderColor = 'var(--state-success)';
                    
                    const headLabel = document.createElement('span');
                    headLabel.className = 'pointer-label';
                    headLabel.style.borderColor = 'var(--state-success)';
                    headLabel.style.color = 'var(--state-success)';
                    headLabel.style.background = 'rgba(16, 185, 129, 0.1)';
                    headLabel.innerText = 'HEAD';
                    node.appendChild(headLabel);
                }
                
                if (idx === step.array.length - 1 && idx !== 0) {
                    node.style.borderColor = 'var(--accent-primary)';
                    
                    const tailLabel = document.createElement('span');
                    tailLabel.className = 'pointer-label';
                    tailLabel.innerText = 'TAIL';
                    node.appendChild(tailLabel);
                }
                
                if (step.highlighted.includes(idx)) {
                    node.classList.add('active');
                }
                
                container.appendChild(node);
            });
            
            this.canvas.appendChild(container);
        }
    }
}
