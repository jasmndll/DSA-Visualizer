/**
 * generateBubbleSortSteps — pure function, no DOM.
 * Ported from sorting.js's BubbleSortVisualizer.generateSteps(),
 * with all `this.canvas` / DOM work stripped out. Same algorithm,
 * same step shape, so the React component just renders `step.array`.
 */
export function generateBubbleSortSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 0,
    trace: `Start bubble sort on array: ${arr.join(", ")}`,
  });

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 1,
    trace: `Set length n = ${n}`,
  });

  let swapped;
  let passLimit = n;
  let sortedIndices = [];

  do {
    swapped = false;
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices],
      line: 3,
      trace: "Set swapped = false, starting comparison pass.",
    });

    for (let i = 1; i < passLimit; i++) {
      steps.push({
        array: [...arr],
        comparing: [i - 1, i],
        swapping: [],
        sorted: [...sortedIndices],
        line: 5,
        trace: `Compare A[${i - 1}] (${arr[i - 1]}) and A[${i}] (${arr[i]})`,
      });

      if (arr[i - 1] > arr[i]) {
        const temp = arr[i - 1];
        arr[i - 1] = arr[i];
        arr[i] = temp;
        swapped = true;

        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [i - 1, i],
          sorted: [...sortedIndices],
          line: 6,
          trace: `Swap A[${i - 1}] and A[${i}] since ${arr[i]} < ${arr[i - 1]}`,
        });

        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [],
          sorted: [...sortedIndices],
          line: 7,
          trace: "Set swapped = true",
        });
      }
    }

    passLimit--;
    sortedIndices.unshift(passLimit);

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices],
      line: 8,
      trace: `Decrement n. Element A[${passLimit}] (${arr[passLimit]}) is in its final sorted position.`,
    });

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sortedIndices],
      line: 9,
      trace: swapped
        ? "Elements were swapped; run another pass."
        : "No elements swapped; array is sorted!",
    });
  } while (swapped && passLimit > 1);

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: allSorted,
    line: 0,
    trace: `Bubble sort complete! Sorted array: ${arr.join(", ")}`,
  });

  return steps;
}

export const bubbleSortPseudocode = [
  "procedure bubbleSort(A : list of items)",
  "  n = length(A)",
  "  repeat",
  "    swapped = false",
  "    for i = 1 to n-1 inclusive do",
  "      if A[i-1] > A[i] then",
  "        swap(A[i-1], A[i])",
  "        swapped = true",
  "    n = n - 1",
  "  until not swapped",
];

export function randomArray(size = 10) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 15);
}
