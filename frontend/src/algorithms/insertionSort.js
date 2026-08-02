export function generateInsertionSortSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 0,
    trace: `Start insertion sort on array: ${arr.join(", ")}`,
  });

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [0],
    line: 1,
    trace: `Set length n = ${n}. First element is trivially sorted.`,
  });

  const sortedIndices = [0];

  for (let i = 1; i < n; i++) {
    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [...sortedIndices],
      line: 2,
      trace: `i = ${i}. Element to insert: ${arr[i]}`,
    });

    let key = arr[i];
    
    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [...sortedIndices],
      line: 3,
      trace: `key = ${key}`,
    });

    let j = i - 1;
    
    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [...sortedIndices],
      line: 4,
      trace: `j = ${j}`,
    });

    steps.push({
      array: [...arr],
      comparing: [j, j + 1],
      swapping: [],
      sorted: [...sortedIndices],
      line: 5,
      trace: `While j >= 0 and A[j] (${j >= 0 ? arr[j] : 'none'}) > key (${key})`,
    });

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [j, j + 1],
        sorted: [...sortedIndices],
        line: 6,
        trace: `Shift A[${j}] to A[${j + 1}]`,
      });

      j = j - 1;

      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [...sortedIndices],
        line: 7,
        trace: `j = ${j}`,
      });

      if (j >= 0) {
        steps.push({
          array: [...arr],
          comparing: [j, j + 1], // Comparing next A[j] with key (conceptual)
          swapping: [],
          sorted: [...sortedIndices],
          line: 5,
          trace: `While j >= 0 and A[j] (${arr[j]}) > key (${key})`,
        });
      } else {
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [],
          sorted: [...sortedIndices],
          line: 5,
          trace: `j < 0, exit while loop`,
        });
      }
    }

    arr[j + 1] = key;
    sortedIndices.push(i);

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [j + 1],
      sorted: [...sortedIndices],
      line: 8,
      trace: `Insert key (${key}) at A[${j + 1}]`,
    });
  }

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: allSorted,
    line: 0,
    trace: `Insertion sort complete! Sorted array: ${arr.join(", ")}`,
  });

  return steps;
}

export const insertionSortPseudocode = [
  "procedure insertionSort(A : list of items)",
  "  n = length(A)",
  "  for i = 1 to n-1 inclusive do",
  "    key = A[i]",
  "    j = i - 1",
  "    while j >= 0 and A[j] > key do",
  "      A[j+1] = A[j]",
  "      j = j - 1",
  "    A[j+1] = key"
];
