export function generateMergeSortSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 0,
    trace: `Start merge sort on array: ${arr.join(", ")}`,
  });

  function merge(left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [],
      line: 6,
      trace: `Merge subarrays [${left}..${mid}] and [${mid + 1}..${right}]`,
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        array: [...arr],
        comparing: [left + i, mid + 1 + j],
        swapping: [],
        sorted: [],
        line: 6,
        trace: `Compare ${leftArr[i]} and ${rightArr[j]}`,
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [k],
        sorted: [],
        line: 6,
        trace: `Place ${arr[k]} at index ${k}`,
      });
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [k],
        sorted: [],
        line: 6,
        trace: `Place remaining left element ${arr[k]} at index ${k}`,
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [k],
        sorted: [],
        line: 6,
        trace: `Place remaining right element ${arr[k]} at index ${k}`,
      });
      j++;
      k++;
    }
  }

  function mergeSort(left, right) {
    if (left >= right) return;
    
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [],
      line: 2,
      trace: `if left (${left}) < right (${right})`,
    });

    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [],
      line: 3,
      trace: `mid = ${mid}`,
    });

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [],
      line: 4,
      trace: `mergeSort(A, ${left}, ${mid})`,
    });
    mergeSort(left, mid);
    
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [],
      line: 5,
      trace: `mergeSort(A, ${mid + 1}, ${right})`,
    });
    mergeSort(mid + 1, right);
    
    merge(left, mid, right);
  }

  mergeSort(0, n - 1);

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: allSorted,
    line: 0,
    trace: `Merge sort complete! Sorted array: ${arr.join(", ")}`,
  });

  return steps;
}

export const mergeSortPseudocode = [
  "procedure mergeSort(A, left, right)",
  "  if left < right then",
  "    mid = floor((left + right) / 2)",
  "    mergeSort(A, left, mid)",
  "    mergeSort(A, mid + 1, right)",
  "    merge(A, left, mid, right)"
];
