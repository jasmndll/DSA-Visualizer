export function generateKadaneSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 0,
    trace: `Start Kadane's algorithm on array: ${arr.join(", ")}`,
  });

  let maxSum = arr[0];
  let currentSum = arr[0];
  
  steps.push({
    array: [...arr],
    comparing: [0],
    swapping: [],
    sorted: [],
    line: 2,
    trace: `Initialize maxSum = ${maxSum}, currentSum = ${currentSum}`,
  });

  for (let i = 1; i < n; i++) {
    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [],
      line: 4,
      trace: `At index ${i}, element is ${arr[i]}`,
    });

    if (arr[i] > currentSum + arr[i]) {
      currentSum = arr[i];
      steps.push({
        array: [...arr],
        comparing: [i],
        swapping: [],
        sorted: [],
        line: 5,
        trace: `Start new subarray. currentSum = ${currentSum}`,
      });
    } else {
      currentSum = currentSum + arr[i];
      steps.push({
        array: [...arr],
        comparing: [i],
        swapping: [],
        sorted: [],
        line: 5,
        trace: `Extend subarray. currentSum = ${currentSum}`,
      });
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      steps.push({
        array: [...arr],
        comparing: [i],
        swapping: [],
        sorted: [],
        line: 6,
        trace: `New maxSum found! maxSum = ${maxSum}`,
      });
    }
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 7,
    trace: `Algorithm complete. Maximum contiguous sum is ${maxSum}`,
  });

  return steps;
}

export const kadanePseudocode = [
  "procedure kadane(A)",
  "  maxSum = A[0]",
  "  currentSum = A[0]",
  "  for i = 1 to length(A) - 1 do",
  "    currentSum = max(A[i], currentSum + A[i])",
  "    if currentSum > maxSum then",
  "      maxSum = currentSum",
  "  return maxSum"
];
