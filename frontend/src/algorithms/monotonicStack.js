export function generateMonotonicStackSteps(inputArray) {
  const steps = [];
  const arr = [...inputArray];
  const n = arr.length;
  const result = new Array(n).fill(-1);
  const stack = []; // will store indices

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    customData: { stack: [], result: [...result] },
    line: 0,
    trace: `Start Next Greater Element using Monotonic Stack on: ${arr.join(", ")}`,
  });

  for (let i = 0; i < n; i++) {
    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [],
      customData: { stack: [...stack], result: [...result] },
      line: 3,
      trace: `At index ${i}, element is ${arr[i]}.`,
    });

    while (stack.length > 0 && arr[stack[stack.length - 1]] < arr[i]) {
      const topIndex = stack[stack.length - 1];
      
      steps.push({
        array: [...arr],
        comparing: [i, topIndex],
        swapping: [],
        sorted: [],
        customData: { stack: [...stack], result: [...result] },
        line: 4,
        trace: `Top of stack element A[${topIndex}] (${arr[topIndex]}) is less than A[${i}] (${arr[i]}).`,
      });

      const popped = stack.pop();
      result[popped] = arr[i];

      steps.push({
        array: [...arr],
        comparing: [i],
        swapping: [popped], // highlight the resolved element
        sorted: [],
        customData: { stack: [...stack], result: [...result] },
        line: 5,
        trace: `Pop ${popped} from stack. Next greater element for A[${popped}] is ${arr[i]}.`,
      });
    }

    stack.push(i);
    
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [],
      customData: { stack: [...stack], result: [...result] },
      line: 6,
      trace: `Push index ${i} to stack.`,
    });
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    customData: { stack: [...stack], result: [...result] },
    line: 7,
    trace: `Algorithm complete. Result: ${result.join(", ")}`,
  });

  return steps;
}

export const monotonicStackPseudocode = [
  "procedure nextGreaterElement(A)",
  "  result = array of -1s (size length(A))",
  "  stack = empty stack (stores indices)",
  "  for i = 0 to length(A) - 1 do",
  "    while stack is not empty and A[stack.top()] < A[i] do",
  "      poppedIndex = stack.pop()",
  "      result[poppedIndex] = A[i]",
  "    stack.push(i)",
  "  return result"
];
