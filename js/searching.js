import { BaseVisualizer } from './base.js';

export class BinarySearchVisualizer extends BaseVisualizer {
    constructor(canvas, svg, traceLog, codeContainer) {
        super(canvas, svg, traceLog, codeContainer);
        this.array = [];
        this.target = 45;
        this.setupPseudocode([
            'procedure binarySearch(A, target)',
            '  low = 0, high = A.length - 1',
            '  while low <= high do',
            '    mid = floor((low + high) / 2)',
            '    if A[mid] === target then return mid',
            '    else if A[mid] < target then',
            '      low = mid + 1',
            '    else',
            '      high = mid - 1',
            '  return -1 (Not Found)'
        ]);
    }

    init() {
        this.generateSortedArray();
    }

    generateSortedArray() {
        const arr = [];
        let val = Math.floor(Math.random() * 10) + 3;
        for (let i = 0; i < 12; i++) {
            arr.push(val);
            val += Math.floor(Math.random() * 12) + 4;
        }
        this.array = arr;
        
        // Pick a random element from the array to be the default target
        this.target = arr[Math.floor(Math.random() * arr.length)];
        
        this.generateSteps();
        this.reset();
    }

    getInputsHTML() {
        return `
            <div class="control-group">
                <button class="btn" id="btn-rand-search">
                    <i data-lucide="refresh-cw"></i>
                    <span>New Array</span>
                </button>
                <div class="slider-container" style="margin-left: 12px;">
                    <span style="font-size: 0.85rem;">Target:</span>
                    <input type="number" class="input-control" id="search-target-val" value="${this.target}" style="width: 70px;">
                </div>
                <button class="btn btn-primary" id="btn-run-search">Search</button>
            </div>
        `;
    }

    bindInputs(container) {
        container.querySelector('#btn-rand-search').addEventListener('click', () => {
            this.generateSortedArray();
            container.querySelector('#search-target-val').value = this.target;
        });
        container.querySelector('#btn-run-search').addEventListener('click', () => {
            const val = parseInt(container.querySelector('#search-target-val').value);
            if (!isNaN(val)) {
                this.target = val;
                this.generateSteps();
                this.reset();
            }
        });
    }

    generateSteps() {
        this.steps = [];
        const arr = [...this.array];
        const t = this.target;
        
        this.steps.push({
            array: [...arr],
            low: -1,
            high: -1,
            mid: -1,
            found: -1,
            line: 0,
            trace: `Start Binary Search for target: <span class="highlight-text">${t}</span>`
        });

        let low = 0;
        let high = arr.length - 1;

        this.steps.push({
            array: [...arr],
            low: low,
            high: high,
            mid: -1,
            found: -1,
            line: 1,
            trace: `Initialize search bounds: low = ${low}, high = ${high}`
        });

        let foundIdx = -1;

        while (low <= high) {
            this.steps.push({
                array: [...arr],
                low: low,
                high: high,
                mid: -1,
                found: -1,
                line: 2,
                trace: `Loop condition: is low (${low}) <= high (${high})? Yes`
            });

            const mid = Math.floor((low + high) / 2);
            
            this.steps.push({
                array: [...arr],
                low: low,
                high: high,
                mid: mid,
                found: -1,
                line: 3,
                trace: `Calculate mid index: mid = floor((${low} + ${high}) / 2) = ${mid}. Element at mid = A[${mid}] (${arr[mid]})`
            });

            this.steps.push({
                array: [...arr],
                low: low,
                high: high,
                mid: mid,
                found: -1,
                line: 4,
                trace: `Compare A[${mid}] (${arr[mid]}) with target (${t})`
            });

            if (arr[mid] === t) {
                foundIdx = mid;
                this.steps.push({
                    array: [...arr],
                    low: low,
                    high: high,
                    mid: mid,
                    found: mid,
                    line: 4,
                    trace: `Match found! Element A[${mid}] (${arr[mid]}) is equal to target (${t}). Return index ${mid}.`
                });
                break;
            } else if (arr[mid] < t) {
                const prevLow = low;
                low = mid + 1;
                this.steps.push({
                    array: [...arr],
                    low: low,
                    high: high,
                    mid: mid,
                    found: -1,
                    line: 5,
                    trace: `A[${mid}] (${arr[mid]}) is less than target (${t})`
                });
                this.steps.push({
                    array: [...arr],
                    low: low,
                    high: high,
                    mid: -1,
                    found: -1,
                    line: 6,
                    trace: `Shift low boundary: low = mid + 1 = ${low}. Sub-array left of low is discarded.`
                });
            } else {
                const prevHigh = high;
                high = mid - 1;
                this.steps.push({
                    array: [...arr],
                    low: low,
                    high: high,
                    mid: mid,
                    found: -1,
                    line: 7,
                    trace: `A[${mid}] (${arr[mid]}) is greater than target (${t})`
                });
                this.steps.push({
                    array: [...arr],
                    low: low,
                    high: high,
                    mid: -1,
                    found: -1,
                    line: 8,
                    trace: `Shift high boundary: high = mid - 1 = ${high}. Sub-array right of high is discarded.`
                });
            }
        }

        if (foundIdx === -1) {
            this.steps.push({
                array: [...arr],
                low: low,
                high: high,
                mid: -1,
                found: -1,
                line: 9,
                trace: `Loop terminated (low > high). Target element <span class="highlight-text">${t}</span> was not found in the array. Return -1.`
            });
        }
    }

    drawState(step) {
        this.canvas.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'linear-container';
        container.style.marginTop = '20px';

        step.array.forEach((val, idx) => {
            const node = document.createElement('div');
            node.className = 'linear-node';
            node.innerText = val;

            // Mark nodes outside of current search bounds as semi-transparent
            const inBounds = idx >= step.low && idx <= step.high;
            if (!inBounds && step.low !== -1) {
                node.style.opacity = '0.2';
            }

            // Set background/border colors based on state
            if (idx === step.found) {
                node.classList.add('success');
            } else if (idx === step.mid) {
                node.classList.add('active');
            }

            // Index label at the bottom
            const indexLabel = document.createElement('span');
            indexLabel.className = 'index-label';
            indexLabel.innerText = idx;
            node.appendChild(indexLabel);

            // Pointer labels above the node
            const pointerTexts = [];
            if (idx === step.low) pointerTexts.push('low');
            if (idx === step.high) pointerTexts.push('high');
            if (idx === step.mid) pointerTexts.push('mid');

            if (pointerTexts.length > 0) {
                const pointerLabel = document.createElement('span');
                pointerLabel.className = 'pointer-label';
                pointerLabel.innerText = pointerTexts.join(' & ');
                
                // Color pointers
                if (pointerTexts.includes('mid')) {
                    pointerLabel.style.borderColor = 'var(--state-active)';
                    pointerLabel.style.color = 'var(--state-active)';
                    pointerLabel.style.background = 'rgba(245, 158, 11, 0.1)';
                } else if (pointerTexts.includes('low') && pointerTexts.includes('high')) {
                    pointerLabel.style.borderColor = 'var(--accent-secondary)';
                    pointerLabel.style.color = 'var(--accent-secondary)';
                    pointerLabel.style.background = 'rgba(168, 85, 247, 0.1)';
                }
                
                node.appendChild(pointerLabel);
            }

            container.appendChild(node);
        });

        this.canvas.appendChild(container);
    }
}
