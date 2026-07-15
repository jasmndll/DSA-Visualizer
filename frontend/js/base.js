// Base Visualizer Interface
export class BaseVisualizer {
    constructor(canvas, svg, traceLog, codeContainer) {
        this.canvas = canvas;
        this.svg = svg;
        this.traceLog = traceLog;
        this.codeContainer = codeContainer;
        
        this.steps = [];          // List of animation frame snapshots
        this.currentStepIndex = -1; // Current index in steps
    }

    init() {}
    
    reset() {
        this.currentStepIndex = -1;
        this.renderStep(0);
    }

    renderStep(index) {
        if (index < 0 || index >= this.steps.length) return;
        const step = this.steps[index];
        this.drawState(step);
        this.highlightCodeLine(step.line);
        this.traceLog.innerHTML = step.trace;
    }

    drawState(step) {
        // Implemented by subclasses
    }

    highlightCodeLine(lineNum) {
        document.querySelectorAll('.code-line').forEach(line => {
            line.classList.remove('active-line');
        });
        const activeLine = document.getElementById(`line-${lineNum}`);
        if (activeLine) {
            activeLine.classList.add('active-line');
            // Auto scroll container if needed
            activeLine.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    setupPseudocode(lines) {
        this.codeContainer.innerHTML = '';
        lines.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'code-line';
            lineDiv.id = `line-${index}`;
            
            const numSpan = document.createElement('span');
            numSpan.className = 'line-num';
            numSpan.innerText = index + 1;
            
            lineDiv.appendChild(numSpan);
            lineDiv.appendChild(document.createTextNode(line));
            this.codeContainer.appendChild(lineDiv);
        });
    }

    getInputsHTML() {
        return '';
    }

    bindInputs(container) {}
}
