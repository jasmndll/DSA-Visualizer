export function generateHeapSortSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 0,
    trace: `Start heap sort on array: ${arr.join(", ")}`,
  });

  function heapify(n, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [],
      line: 7,
      trace: `heapify at index ${i}`,
    });

    if (l < n) {
      steps.push({
        array: [...arr],
        comparing: [l, largest],
        swapping: [],
        sorted: [],
        line: 9,
        trace: `Compare left child (${arr[l]}) with root (${arr[largest]})`,
      });
      if (arr[l] > arr[largest]) {
        largest = l;
      }
    }

    if (r < n) {
      steps.push({
        array: [...arr],
        comparing: [r, largest],
        swapping: [],
        sorted: [],
        line: 11,
        trace: `Compare right child (${arr[r]}) with largest (${arr[largest]})`,
      });
      if (arr[r] > arr[largest]) {
        largest = r;
      }
    }

    if (largest !== i) {
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;

      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [i, largest],
        sorted: [],
        line: 14,
        trace: `Swap root (${arr[largest]}) with largest child (${arr[i]})`,
      });

      heapify(n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [],
      line: 3,
      trace: `Build max heap: heapify at ${i}`,
    });
    heapify(n, i);
  }

  const sortedIndices = [];

  for (let i = n - 1; i > 0; i--) {
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    sortedIndices.unshift(i);

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [0, i],
      sorted: [...sortedIndices],
      line: 5,
      trace: `Swap current root (${arr[i]}) with end node (${arr[0]})`,
    });

    heapify(i, 0);
  }

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: allSorted,
    line: 0,
    trace: `Heap sort complete! Sorted array: ${arr.join(", ")}`,
  });

  return steps;
}

export const heapSortPseudocode = [
  "procedure heapSort(A)",
  "  n = length(A)",
  "  for i = floor(n/2) - 1 down to 0 do",
  "    heapify(A, n, i)",
  "  for i = n - 1 down to 1 do",
  "    swap(A[0], A[i])",
  "    heapify(A, i, 0)",
  "procedure heapify(A, n, i)",
  "  largest = i",
  "  l = 2 * i + 1",
  "  r = 2 * i + 2",
  "  if l < n and A[l] > A[largest] then largest = l",
  "  if r < n and A[r] > A[largest] then largest = r",
  "  if largest != i then",
  "    swap(A[i], A[largest])",
  "    heapify(A, n, largest)"
];
