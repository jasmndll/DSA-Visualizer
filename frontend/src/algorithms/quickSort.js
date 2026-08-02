export function generateQuickSortSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 0,
    trace: `Start quick sort on array: ${arr.join(", ")}`,
  });

  function partition(low, high) {
    const pivot = arr[high];
    
    steps.push({
      array: [...arr],
      comparing: [high],
      swapping: [],
      sorted: [],
      line: 6,
      trace: `Choose pivot: ${pivot} at index ${high}`,
    });

    let i = low - 1;
    
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [],
      line: 7,
      trace: `i = ${i}`,
    });

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, high],
        swapping: [],
        sorted: [],
        line: 9,
        trace: `Compare A[${j}] (${arr[j]}) with pivot (${pivot})`,
      });

      if (arr[j] < pivot) {
        i++;
        
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [i, j],
          sorted: [],
          line: 11,
          trace: `A[j] < pivot, so increment i and swap A[${i}] with A[${j}]`,
        });
      }
    }

    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [i + 1, high],
      sorted: [],
      line: 12,
      trace: `Swap pivot into correct position at index ${i + 1}`,
    });

    return i + 1;
  }

  function quickSort(low, high) {
    if (low < high) {
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [],
        line: 2,
        trace: `if low (${low}) < high (${high})`,
      });

      const pi = partition(low, high);
      
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [pi],
        line: 3,
        trace: `Partition index pi = ${pi}`,
      });

      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [],
        line: 4,
        trace: `quickSort(A, ${low}, ${pi - 1})`,
      });
      quickSort(low, pi - 1);
      
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [],
        line: 5,
        trace: `quickSort(A, ${pi + 1}, ${high})`,
      });
      quickSort(pi + 1, high);
    }
  }

  quickSort(0, n - 1);

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: allSorted,
    line: 0,
    trace: `Quick sort complete! Sorted array: ${arr.join(", ")}`,
  });

  return steps;
}

export const quickSortPseudocode = [
  "procedure quickSort(A, low, high)",
  "  if low < high then",
  "    pi = partition(A, low, high)",
  "    quickSort(A, low, pi - 1)",
  "    quickSort(A, pi + 1, high)",
  "procedure partition(A, low, high)",
  "  pivot = A[high]",
  "  i = low - 1",
  "  for j = low to high - 1 do",
  "    if A[j] < pivot then",
  "      i = i + 1",
  "      swap(A[i], A[j])",
  "  swap(A[i + 1], A[high])",
  "  return i + 1"
];
