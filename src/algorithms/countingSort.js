export function generateCountingSortSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 0,
    trace: `Start counting sort on array: ${arr.join(", ")}`,
  });

  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 2,
    trace: `Find max element = ${max}. Initialize count array of size ${max + 1}.`,
  });

  for (let i = 0; i < n; i++) {
    count[arr[i]]++;
    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [],
      line: 4,
      trace: `Increment count for value ${arr[i]}. (Count is now ${count[arr[i]]})`,
    });
  }

  let index = 0;
  for (let i = 0; i <= max; i++) {
    while (count[i] > 0) {
      arr[index] = i;
      count[i]--;
      
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [index],
        sorted: [],
        line: 7,
        trace: `Place value ${i} at index ${index} from count array.`,
      });
      index++;
    }
  }

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: allSorted,
    line: 0,
    trace: `Counting sort complete! Sorted array: ${arr.join(", ")}`,
  });

  return steps;
}

export const countingSortPseudocode = [
  "procedure countingSort(A)",
  "  max = maximum(A)",
  "  count = array of zeros (size max+1)",
  "  for i = 0 to length(A) - 1 do",
  "    count[A[i]] = count[A[i]] + 1",
  "  index = 0",
  "  for i = 0 to max do",
  "    while count[i] > 0 do",
  "      A[index] = i",
  "      index = index + 1",
  "      count[i] = count[i] - 1"
];
