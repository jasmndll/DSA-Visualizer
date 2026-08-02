export function generateSelectionSortSteps(arr) {
  const steps = [];
  const array = [...arr];

  steps.push({
    array: [...array],
    i: null,
    j: null,
    swapping: [],
    comparing: [],
    sorted: [],
    line: 0,
    trace: "Starting Selection Sort"
  });

  for (let i = 0; i < array.length; i++) {
    let minIdx = i;

    steps.push({
      array: [...array],
      i,
      j: null,
      swapping: [],
      comparing: [],
      sorted: Array.from({ length: i }, (_, idx) => idx),
      line: 1,
      trace: `Assume minimum is at index ${minIdx} (value ${array[minIdx]})`
    });

    for (let j = i + 1; j < array.length; j++) {
      steps.push({
        array: [...array],
        i,
        j,
        swapping: [],
        comparing: [minIdx, j],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        line: 2,
        trace: `Compare array[${j}] (${array[j]}) with current min array[${minIdx}] (${array[minIdx]})`
      });

      if (array[j] < array[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...array],
          i,
          j,
          swapping: [],
          comparing: [minIdx],
          sorted: Array.from({ length: i }, (_, idx) => idx),
          line: 3,
          trace: `New minimum found at index ${minIdx} (value ${array[minIdx]})`
        });
      }
    }

    if (minIdx !== i) {
      steps.push({
        array: [...array],
        i,
        j: minIdx,
        swapping: [i, minIdx],
        comparing: [i, minIdx],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        line: 4,
        trace: `Swap array[${i}] and array[${minIdx}]`
      });

      // Swap
      const temp = array[i];
      array[i] = array[minIdx];
      array[minIdx] = temp;

      steps.push({
        array: [...array],
        i,
        j: null,
        swapping: [],
        comparing: [i, minIdx],
        sorted: Array.from({ length: i }, (_, idx) => idx),
        line: 5,
        trace: `Swapped!`
      });
    }
  }

  steps.push({
    array: [...array],
    i: null,
    j: null,
    swapping: [],
    comparing: [],
    sorted: Array.from({ length: array.length }, (_, idx) => idx),
    line: 6,
    trace: "Selection Sort complete!"
  });

  return steps;
}

export const selectionSortPseudocode = [
  "procedure SelectionSort(A):",
  "  for i = 0 to length(A) - 1:",
  "    minIndex = i",
  "    for j = i + 1 to length(A) - 1:",
  "      if A[j] < A[minIndex]:",
  "        minIndex = j",
  "    if minIndex != i:",
  "      swap A[i] and A[minIndex]"
];
