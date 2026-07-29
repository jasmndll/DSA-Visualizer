export function generateKnapsackSteps(items, capacity) {
  const steps = [];
  const n = items.length;
  
  // Initialize DP table with null
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(null));

  const copyDP = () => {
    return dp.map(row => [...row]);
  };

  // Step 0: Initialize base case
  for (let w = 0; w <= capacity; w++) {
    dp[0][w] = 0;
  }
  for (let i = 0; i <= n; i++) {
    dp[i][0] = 0;
  }

  steps.push({
    dp: copyDP(),
    i: 0,
    w: 0,
    line: 1,
    trace: "Initialize base cases: dp[i][0] = 0 and dp[0][w] = 0",
    comparing: []
  });

  for (let i = 1; i <= n; i++) {
    const itemWeight = items[i - 1].weight;
    const itemValue = items[i - 1].value;

    for (let w = 1; w <= capacity; w++) {
      steps.push({
        dp: copyDP(),
        i,
        w,
        line: 2,
        trace: `Evaluating item ${i} (weight: ${itemWeight}, value: ${itemValue}) for capacity ${w}`,
        comparing: []
      });

      if (itemWeight <= w) {
        // Can include the item
        const excludeValue = dp[i - 1][w];
        const includeValue = dp[i - 1][w - itemWeight] + itemValue;
        
        steps.push({
          dp: copyDP(),
          i,
          w,
          line: 4,
          trace: `Compare: exclude item (value ${excludeValue}) vs include item (value ${dp[i - 1][w - itemWeight]} + ${itemValue} = ${includeValue})`,
          comparing: [[i - 1, w], [i - 1, w - itemWeight]]
        });

        dp[i][w] = Math.max(excludeValue, includeValue);
        
        steps.push({
          dp: copyDP(),
          i,
          w,
          line: 5,
          trace: `Took maximum value: ${dp[i][w]}`,
          comparing: []
        });

      } else {
        // Cannot include the item
        dp[i][w] = dp[i - 1][w];
        steps.push({
          dp: copyDP(),
          i,
          w,
          line: 7,
          trace: `Item ${i} weight (${itemWeight}) > current capacity (${w}), cannot include. Value remains ${dp[i][w]}`,
          comparing: [[i - 1, w]]
        });
      }
    }
  }

  steps.push({
    dp: copyDP(),
    i: null,
    w: null,
    line: 8,
    trace: `Knapsack complete! Max value is ${dp[n][capacity]}`,
    comparing: []
  });

  return steps;
}

export const knapsackPseudocode = [
  "procedure 01Knapsack(items, capacity):",
  "  initialize dp[n+1][capacity+1] with 0s",
  "  for i from 1 to n:",
  "    for w from 1 to capacity:",
  "      if weight[i] <= w:",
  "        dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])",
  "      else:",
  "        dp[i][w] = dp[i-1][w]",
  "  return dp[n][capacity]"
];
