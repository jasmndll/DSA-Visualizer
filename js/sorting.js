import { BaseVisualizer } from './base.js';

// Base Sorting Class to share rendering and inputs
class BaseSortingVisualizer extends BaseVisualizer {
    constructor(canvas, svg, traceLog, codeContainer) {
        super(canvas, svg, traceLog, codeContainer);
        this.array = [];
        this.defaultSize = 10;
    }

    init() {
        this.generateRandomArray();
    }

    generateRandomArray() {
        this.array = [];
        for (let i = 0; i < this.defaultSize; i++) {
            this.array.push(Math.floor(Math.random() * 80) + 15); // values 15 to 95
        }
        this.generateSteps();
        this.reset();
    }

    loadCustomArray(str) {
        const custom = str.split(',')
            .map(x => parseInt(x.trim()))
            .filter(x => !isNaN(x) && x > 0 && x <= 100);
        
        if (custom.length > 0) {
            this.array = custom.slice(0, 20); // Cap at 20 elements for visual appeal
            this.generateSteps();
            this.reset();
        } else {
            alert("Invalid input format. Use comma-separated positive numbers (e.g., 5, 2, 9).");
        }
    }

    getInputsHTML() {
        return `
            <div class="control-group">
                <button class="btn" id="btn-randomize-sort">
                    <i data-lucide="refresh-cw"></i>
                    <span>Randomize</span>
                </button>
                <input type="text" class="input-control" id="custom-input-array" placeholder="e.g. 35, 12, 67, 8, 44" style="width: 180px;">
                <button class="btn btn-primary" id="btn-load-sort">Load</button>
            </div>
        `;
    }

    bindInputs(container) {
        container.querySelector('#btn-randomize-sort').addEventListener('click', () => this.generateRandomArray());
        container.querySelector('#btn-load-sort').addEventListener('click', () => {
            const val = container.querySelector('#custom-input-array').value;
            this.loadCustomArray(val);
        });
    }

    drawState(step) {
        this.canvas.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'array-container';
        
        const maxVal = Math.max(...step.array);
        
        step.array.forEach((val, idx) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            
            // Set height as % of container (max value gets ~85% height)
            const heightPct = maxVal > 0 ? (val / maxVal) * 85 : 0;
            bar.style.height = `${Math.max(10, heightPct)}%`;
            
            // Text inside
            bar.innerText = val;
            
            // Add state classes
            if (step.comparing.includes(idx)) {
                bar.classList.add('compare');
            } else if (step.swapping.includes(idx)) {
                bar.classList.add('swap');
            } else if (step.sorted.includes(idx)) {
                bar.classList.add('sorted');
            }
            
            container.appendChild(bar);
        });
        
        this.canvas.appendChild(container);
    }
}

// 1. Bubble Sort Visualizer
export class BubbleSortVisualizer extends BaseSortingVisualizer {
    constructor(canvas, svg, traceLog, codeContainer) {
        super(canvas, svg, traceLog, codeContainer);
        this.setupPseudocode([
            'procedure bubbleSort(A : list of items)',
            '  n = length(A)',
            '  repeat',
            '    swapped = false',
            '    for i = 1 to n-1 inclusive do',
            '      if A[i-1] > A[i] then',
            '        swap(A[i-1], A[i])',
            '        swapped = true',
            '    n = n - 1',
            '  until not swapped'
        ]);
    }

    generateSteps() {
        this.steps = [];
        const arr = [...this.array];
        const n = arr.length;
        
        // Initial state
        this.steps.push({
            array: [...arr],
            comparing: [],
            swapping: [],
            sorted: [],
            line: 0,
            trace: "Start bubble sort on array: " + arr.join(", ")
        });
        
        this.steps.push({
            array: [...arr],
            comparing: [],
            swapping: [],
            sorted: [],
            line: 1,
            trace: `Set length n = ${n}`
        });

        let swapped;
        let passLimit = n;
        let sortedIndices = [];

        do {
            swapped = false;
            this.steps.push({
                array: [...arr],
                comparing: [],
                swapping: [],
                sorted: [...sortedIndices],
                line: 3,
                trace: "Set swapped = false, starting comparison pass."
            });

            for (let i = 1; i < passLimit; i++) {
                // Comparing
                this.steps.push({
                    array: [...arr],
                    comparing: [i - 1, i],
                    swapping: [],
                    sorted: [...sortedIndices],
                    line: 5,
                    trace: `Compare A[${i-1}] (${arr[i-1]}) and A[${i}] (${arr[i]})`
                });

                if (arr[i - 1] > arr[i]) {
                    // Swapping
                    const temp = arr[i - 1];
                    arr[i - 1] = arr[i];
                    arr[i] = temp;
                    swapped = true;
                    
                    this.steps.push({
                        array: [...arr],
                        comparing: [],
                        swapping: [i - 1, i],
                        sorted: [...sortedIndices],
                        line: 6,
                        trace: `Swap A[${i-1}] and A[${i}] since ${arr[i]} < ${arr[i-1]}`
                    });
                    
                    this.steps.push({
                        array: [...arr],
                        comparing: [],
                        swapping: [],
                        sorted: [...sortedIndices],
                        line: 7,
                        trace: "Set swapped = true"
                    });
                }
            }
            
            passLimit--;
            sortedIndices.unshift(passLimit); // Add largest element of this pass to sorted
            
            this.steps.push({
                array: [...arr],
                comparing: [],
                swapping: [],
                sorted: [...sortedIndices],
                line: 8,
                trace: `Decrement n. Element A[${passLimit}] (${arr[passLimit]}) is in its final sorted position.`
            });
            
            this.steps.push({
                array: [...arr],
                comparing: [],
                swapping: [],
                sorted: [...sortedIndices],
                line: 9,
                trace: swapped ? "Elements were swapped; run another pass." : "No elements swapped; array is sorted!"
            });

        } while (swapped && passLimit > 1);

        // Final sorted state
        const allSorted = Array.from({length: n}, (_, i) => i);
        this.steps.push({
            array: [...arr],
            comparing: [],
            swapping: [],
            sorted: allSorted,
            line: 0,
            trace: "Bubble sort complete! Sorted array: " + arr.join(", ")
        });
    }
}

// 2. Quick Sort Visualizer
export class QuickSortVisualizer extends BaseSortingVisualizer {
    constructor(canvas, svg, traceLog, codeContainer) {
        super(canvas, svg, traceLog, codeContainer);
        this.setupPseudocode([
            'procedure quickSort(A, low, high)',
            '  if low < high then',
            '    p = partition(A, low, high)',
            '    quickSort(A, low, p - 1)',
            '    quickSort(A, p + 1, high)',
            'procedure partition(A, low, high)',
            '  pivot = A[high]',
            '  i = low - 1',
            '  for j = low to high - 1',
            '    if A[j] < pivot then swap A[++i] and A[j]',
            '  swap A[i+1] and A[high]',
            '  return i + 1'
        ]);
    }

    generateSteps() {
        this.steps = [];
        const arr = [...this.array];
        const sortedIndices = [];

        this.steps.push({
            array: [...arr],
            comparing: [],
            swapping: [],
            sorted: [],
            line: 0,
            trace: "Start Quick Sort on array: " + arr.join(", ")
        });

        const solveQuickSort = (low, high) => {
            this.steps.push({
                array: [...arr],
                comparing: [],
                swapping: [],
                sorted: [...sortedIndices],
                line: 1,
                trace: `Check condition: low (${low}) < high (${high})`
            });

            if (low < high) {
                this.steps.push({
                    array: [...arr],
                    comparing: [],
                    swapping: [],
                    sorted: [...sortedIndices],
                    line: 2,
                    trace: `Partition array from index ${low} to ${high}`
                });

                const p = solvePartition(low, high);

                // Left partition recursion
                this.steps.push({
                    array: [...arr],
                    comparing: [],
                    swapping: [],
                    sorted: [...sortedIndices],
                    line: 3,
                    trace: `Recursively sort left sub-array: [${low} ... ${p - 1}]`
                });
                solveQuickSort(low, p - 1);

                // Right partition recursion
                this.steps.push({
                    array: [...arr],
                    comparing: [],
                    swapping: [],
                    sorted: [...sortedIndices],
                    line: 4,
                    trace: `Recursively sort right sub-array: [${p + 1} ... ${high}]`
                });
                solveQuickSort(p + 1, high);
            } else if (low === high) {
                // Singular node is sorted
                if (!sortedIndices.includes(low)) sortedIndices.push(low);
            }
        };

        const solvePartition = (low, high) => {
            const pivot = arr[high];
            this.steps.push({
                array: [...arr],
                comparing: [high], // highlight pivot
                swapping: [],
                sorted: [...sortedIndices],
                line: 6,
                trace: `Select rightmost element as pivot: A[${high}] = ${pivot}`
            });

            let i = low - 1;
            this.steps.push({
                array: [...arr],
                comparing: [high],
                swapping: [],
                sorted: [...sortedIndices],
                line: 7,
                trace: `Initialize i pointer to ${i}`
            });

            for (let j = low; j < high; j++) {
                this.steps.push({
                    array: [...arr],
                    comparing: [j, high], // compare j with pivot
                    swapping: [],
                    sorted: [...sortedIndices],
                    line: 8,
                    trace: `Scan index j = ${j}. Compare A[${j}] (${arr[j]}) with pivot (${pivot})`
                });

                this.steps.push({
                    array: [...arr],
                    comparing: [j, high],
                    swapping: [],
                    sorted: [...sortedIndices],
                    line: 9,
                    trace: `Is A[${j}] (${arr[j]}) < pivot (${pivot})?`
                });

                if (arr[j] < pivot) {
                    i++;
                    const temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                    
                    this.steps.push({
                        array: [...arr],
                        comparing: [],
                        swapping: [i, j],
                        sorted: [...sortedIndices],
                        line: 9,
                        trace: `A[${j}] is smaller than pivot. Increment i to ${i} and swap A[${i}] and A[${j}]`
                    });
                }
            }

            // Swap pivot into place
            const temp = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp;

            this.steps.push({
                array: [...arr],
                comparing: [],
                swapping: [i + 1, high],
                sorted: [...sortedIndices],
                line: 10,
                trace: `Swap pivot A[${high}] with A[i+1] (index ${i + 1}) to place pivot in correct position`
            });

            const pivotIdx = i + 1;
            sortedIndices.push(pivotIdx);

            this.steps.push({
                array: [...arr],
                comparing: [],
                swapping: [],
                sorted: [...sortedIndices],
                line: 11,
                trace: `Pivot element placed at sorted index ${pivotIdx}. Return partition index`
            });

            return pivotIdx;
        };

        solveQuickSort(0, arr.length - 1);

        // Final step mark all sorted
        const allSorted = Array.from({length: arr.length}, (_, i) => i);
        this.steps.push({
            array: [...arr],
            comparing: [],
            swapping: [],
            sorted: allSorted,
            line: 0,
            trace: "Quick Sort finished! Sorted array: " + arr.join(", ")
        });
    }
}
