// Global App Orchestrator for DSA Visualizer
import { BaseVisualizer } from './base.js';
import { BubbleSortVisualizer, QuickSortVisualizer } from './sorting.js';
import { BinarySearchVisualizer } from './searching.js';
import { LinearVisualizer } from './linear.js';
import { LinkedListVisualizer } from './linkedlist.js';
import { TreeVisualizer } from './tree.js';
import { GraphVisualizer } from './graph.js';

// Register all visualizers
const visualizersMap = {
    'bubble-sort': BubbleSortVisualizer,
    'quick-sort': QuickSortVisualizer,
    'binary-search': BinarySearchVisualizer,
    'array': LinearVisualizer,
    'stack': LinearVisualizer,
    'queue': LinearVisualizer,
    'singly-linked-list': LinkedListVisualizer,
    'bst': TreeVisualizer,
    'dijkstra': GraphVisualizer
};

const complexityData = {
    'bubble-sort': { best: 'O(n)', worst: 'O(n²)', avg: 'O(n²)', space: 'O(1)' },
    'quick-sort': { best: 'O(n log n)', worst: 'O(n²)', avg: 'O(n log n)', space: 'O(log n)' },
    'binary-search': { best: 'O(1)', worst: 'O(log n)', avg: 'O(log n)', space: 'O(1)' },
    'array': { best: 'O(1)', worst: 'O(n)', avg: 'O(n)', space: 'O(n)' },
    'stack': { best: 'O(1)', worst: 'O(1)', avg: 'O(1)', space: 'O(n)' },
    'queue': { best: 'O(1)', worst: 'O(1)', avg: 'O(1)', space: 'O(n)' },
    'singly-linked-list': { best: 'O(1)', worst: 'O(n)', avg: 'O(n)', space: 'O(n)' },
    'bst': { best: 'O(log n)', worst: 'O(n)', avg: 'O(log n)', space: 'O(n)' },
    'dijkstra': { best: 'O((V + E) log V)', worst: 'O(V²)', avg: 'O((V + E) log V)', space: 'O(V)' }
};

class App {
    constructor() {
        this.activeAlgoId = 'bubble-sort';
        this.activeVisualizer = null;
        this.isPlaying = false;
        this.playTimeout = null;
        
        // Dom cache
        this.canvasContainer = document.getElementById('canvas-container');
        this.svgOverlay = document.getElementById('svg-overlay');
        this.traceLog = document.getElementById('trace-log-content');
        this.pseudocodeContainer = document.getElementById('pseudocode-lines');
        this.dynamicInputs = document.getElementById('dynamic-inputs');
        
        this.btnPlayPause = document.getElementById('btn-play-pause');
        this.playIcon = document.getElementById('play-icon');
        this.btnPrev = document.getElementById('btn-prev');
        this.btnNext = document.getElementById('btn-next');
        this.btnReset = document.getElementById('btn-reset');
        this.speedSlider = document.getElementById('speed-slider');
        this.statusText = document.getElementById('visualizer-status');
        
        // Complexities
        this.compBest = document.getElementById('comp-best');
        this.compWorst = document.getElementById('comp-worst');
        this.compAvg = document.getElementById('comp-avg');
        this.compSpace = document.getElementById('comp-space');

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupControls();
        this.loadAlgorithm(this.activeAlgoId);
        
        // Initial icon render
        lucide.createIcons();
    }

    setupNavigation() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget;
                
                // Clear previous active states
                document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
                target.classList.add('active');
                
                const algo = target.getAttribute('data-algo');
                const title = target.querySelector('span').innerText;
                
                // Update header title
                document.getElementById('algo-title').innerText = title;
                
                // Set description
                const descMap = {
                    'bubble-sort': 'An easy comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
                    'quick-sort': 'A highly efficient divide-and-conquer algorithm that selects a "pivot" element and partitions the array around it, sorting recursively.',
                    'binary-search': 'A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
                    'array': 'Visualizes sequential operations on a linear array structure: Insertion, Deletion, and Searching by index or value.',
                    'stack': 'Visualizes Last-In-First-Out (LIFO) stack operations: Push (inserting at the top) and Pop (removing from the top).',
                    'queue': 'Visualizes First-In-First-Out (FIFO) queue operations: Enqueue (inserting at the tail) and Dequeue (removing from the head).',
                    'singly-linked-list': 'Visualizes nodes linked sequentially via pointers. Demonstrates dynamic Insertion, Deletion, and pointer traversals.',
                    'bst': 'Visualizes a Binary Search Tree where each node has at most two children. The left subtree contains smaller keys, and the right contains larger keys.',
                    'dijkstra': 'Finds the shortest paths between nodes in a graph. Highlights active paths, node relaxation, and final shortest route.'
                };
                document.getElementById('algo-desc').innerText = descMap[algo] || '';

                this.loadAlgorithm(algo);
            });
        });
    }

    setupControls() {
        this.btnPlayPause.addEventListener('click', () => this.togglePlay());
        this.btnNext.addEventListener('click', () => this.stepForward());
        this.btnPrev.addEventListener('click', () => this.stepBackward());
        this.btnReset.addEventListener('click', () => this.resetVisualizer());
        
        // Listen to speed slider
        this.speedSlider.addEventListener('input', () => {
            if (this.isPlaying) {
                // Restart timer loop with new speed immediately
                this.pause();
                this.play();
            }
        });
    }

    getDelay() {
        // Slider value 1 (Slowest) -> 10 (Fastest)
        // Maps 1 to 1500ms and 10 to 80ms
        const val = parseInt(this.speedSlider.value);
        return Math.max(80, 1600 - (val * 150));
    }

    loadAlgorithm(algoId) {
        this.pause();
        this.activeAlgoId = algoId;
        
        // Clean canvas and SVGs
        this.canvasContainer.innerHTML = '';
        // Clear all SVG lines except defs
        const defs = this.svgOverlay.querySelector('defs');
        this.svgOverlay.innerHTML = '';
        if (defs) this.svgOverlay.appendChild(defs);

        // Update complexities panel
        const comp = complexityData[algoId];
        if (comp) {
            this.compBest.innerText = comp.best;
            this.compWorst.innerText = comp.worst;
            this.compAvg.innerText = comp.avg;
            this.compSpace.innerText = comp.space;
        }

        // Initialize Visualizer class
        const VisualizerClass = visualizersMap[algoId];
        if (VisualizerClass) {
            this.activeVisualizer = new VisualizerClass(
                this.canvasContainer,
                this.svgOverlay,
                this.traceLog,
                this.pseudocodeContainer,
                algoId // pass algoId for subclass differentiations like LinearVisualizer
            );
            
            // Build custom inputs in Top bar
            this.dynamicInputs.innerHTML = this.activeVisualizer.getInputsHTML();
            this.activeVisualizer.bindInputs(this.dynamicInputs);
            
            // Refresh lucide icons in dynamic inputs
            lucide.createIcons();
            
            // Initialize visualizer dataset/structure
            this.activeVisualizer.init();
            this.updatePlaybackControlsState();
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (!this.activeVisualizer || this.activeVisualizer.steps.length === 0) return;
        
        // If we reached the end, reset back to 0
        if (this.activeVisualizer.currentStepIndex >= this.activeVisualizer.steps.length - 1) {
            this.activeVisualizer.currentStepIndex = -1;
        }

        this.isPlaying = true;
        this.playIcon.setAttribute('data-lucide', 'pause');
        lucide.createIcons();
        this.statusText.innerText = 'Running';
        this.statusText.style.color = 'var(--state-active)';
        
        this.runLoop();
    }

    pause() {
        this.isPlaying = false;
        clearTimeout(this.playTimeout);
        this.playIcon.setAttribute('data-lucide', 'play');
        lucide.createIcons();
        this.statusText.innerText = 'Paused';
        this.statusText.style.color = 'var(--accent-primary)';
    }

    runLoop() {
        if (!this.isPlaying) return;
        
        const success = this.stepForward();
        if (success) {
            this.playTimeout = setTimeout(() => this.runLoop(), this.getDelay());
        } else {
            this.pause();
            this.statusText.innerText = 'Finished';
            this.statusText.style.color = 'var(--state-success)';
        }
    }

    stepForward() {
        if (!this.activeVisualizer) return false;
        
        if (this.activeVisualizer.currentStepIndex < this.activeVisualizer.steps.length - 1) {
            this.activeVisualizer.currentStepIndex++;
            this.activeVisualizer.renderStep(this.activeVisualizer.currentStepIndex);
            this.updatePlaybackControlsState();
            return true;
        }
        return false;
    }

    stepBackward() {
        if (!this.activeVisualizer) return false;
        
        if (this.activeVisualizer.currentStepIndex > 0) {
            this.activeVisualizer.currentStepIndex--;
            this.activeVisualizer.renderStep(this.activeVisualizer.currentStepIndex);
            this.updatePlaybackControlsState();
            return true;
        }
        return false;
    }

    resetVisualizer() {
        this.pause();
        if (this.activeVisualizer) {
            this.activeVisualizer.reset();
            this.updatePlaybackControlsState();
        }
    }

    updatePlaybackControlsState() {
        if (!this.activeVisualizer) return;
        const total = this.activeVisualizer.steps.length;
        const current = this.activeVisualizer.currentStepIndex;
        
        this.btnPrev.disabled = current <= 0;
        this.btnNext.disabled = current >= total - 1;
        
        // Progress or status percentage
        if (total > 0 && current >= 0) {
            const pct = Math.round(((current + 1) / total) * 100);
            this.statusText.innerText = `Step ${current + 1}/${total} (${pct}%)`;
        } else {
            this.statusText.innerText = 'Ready';
            this.statusText.style.color = 'var(--accent-primary)';
        }
    }
}


// Instantiate core on page load
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
