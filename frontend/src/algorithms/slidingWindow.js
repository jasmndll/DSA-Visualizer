export function generateSlidingWindowSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;
  const k = Math.min(3, n); // Window size of 3, or less if array is smaller

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    line: 0,
    trace: `Start Sliding Window (Max sum subarray of size ${k}) on: ${arr.join(", ")}`,
  });

  let windowSum = 0;
  let maxSum = 0;
  let bestWindow = [];

  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
    bestWindow.push(i);
    
    steps.push({
      array: [...arr],
      comparing: bestWindow,
      swapping: [],
      sorted: [],
      line: 3,
      trace: `Initialize window: add A[${i}] (${arr[i]}). windowSum = ${windowSum}`,
    });
  }

  maxSum = windowSum;

  steps.push({
    array: [...arr],
    comparing: bestWindow,
    swapping: [],
    sorted: [],
    line: 4,
    trace: `Initial maxSum = ${maxSum}`,
  });

  for (let i = k; i < n; i++) {
    const leavingIndex = i - k;
    const enteringIndex = i;
    
    windowSum = windowSum - arr[leavingIndex] + arr[enteringIndex];

    const currentWindow = [];
    for (let j = leavingIndex + 1; j <= enteringIndex; j++) {
      currentWindow.push(j);
    }

    steps.push({
      array: [...arr],
      comparing: currentWindow,
      swapping: [],
      sorted: [],
      line: 6,
      trace: `Slide window: remove A[${leavingIndex}] (${arr[leavingIndex]}), add A[${enteringIndex}] (${arr[enteringIndex]}). new windowSum = ${windowSum}`,
    });

    if (windowSum > maxSum) {
      maxSum = windowSum;
      bestWindow = [...currentWindow];
      
      steps.push({
        array: [...arr],
        comparing: bestWindow,
        swapping: [],
        sorted: [],
        line: 7,
        trace: `New maxSum found! maxSum = ${maxSum}`,
      });
    }
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: bestWindow, // highlight the best window at the end
    sorted: [],
    line: 8,
    trace: `Algorithm complete. Max contiguous sum of size ${k} is ${maxSum}`,
  });

  return steps;
}

export const slidingWindowPseudocode = [
  "procedure maxSubarraySumSizeK(A, k)",
  "  windowSum = 0",
  "  for i = 0 to k - 1 do",
  "    windowSum = windowSum + A[i]",
  "  maxSum = windowSum",
  "  for i = k to length(A) - 1 do",
  "    windowSum = windowSum - A[i - k] + A[i]",
  "    if windowSum > maxSum then",
  "      maxSum = windowSum",
  "  return maxSum"
];
