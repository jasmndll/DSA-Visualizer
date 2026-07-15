export function generateNQueensSteps(N) {
  const steps = [];
  const board = new Array(N).fill(-1); // board[i] = col index of queen in row i
  let solved = false;

  steps.push({
    customData: { board: [...board], N, activeRow: -1, activeCol: -1 },
    line: 0,
    trace: `Start N-Queens with N=${N}`,
  });

  function isSafe(row, col) {
    for (let i = 0; i < row; i++) {
      const qCol = board[i];
      if (qCol === col || Math.abs(qCol - col) === Math.abs(i - row)) {
        return false;
      }
    }
    return true;
  }

  function solve(row) {
    if (row === N) {
      solved = true;
      steps.push({
        customData: { board: [...board], N, activeRow: -1, activeCol: -1 },
        line: 8,
        trace: `All queens placed successfully! Solution found.`,
      });
      return true;
    }

    for (let col = 0; col < N; col++) {
      steps.push({
        customData: { board: [...board], N, activeRow: row, activeCol: col },
        line: 3,
        trace: `Trying to place queen at row ${row}, col ${col}`,
      });

      if (isSafe(row, col)) {
        board[row] = col;
        steps.push({
          customData: { board: [...board], N, activeRow: row, activeCol: col },
          line: 5,
          trace: `Safe to place at row ${row}, col ${col}. Moving to next row.`,
        });

        if (solve(row + 1)) return true;

        // Backtrack
        board[row] = -1;
        steps.push({
          customData: { board: [...board], N, activeRow: row, activeCol: col },
          line: 7,
          trace: `Backtracking from row ${row}, col ${col}`,
        });
      } else {
        steps.push({
          customData: { board: [...board], N, activeRow: row, activeCol: col },
          line: 4,
          trace: `Conflict at row ${row}, col ${col}. Cannot place queen here.`,
        });
      }
    }

    return false;
  }

  solve(0);

  if (!solved) {
    steps.push({
      customData: { board: [...board], N, activeRow: -1, activeCol: -1 },
      line: 0,
      trace: `No solution exists for N=${N}`,
    });
  }

  return steps;
}

export const nQueensPseudocode = [
  "procedure solveNQueens(board, row)",
  "  if row == N then return true",
  "  for col = 0 to N - 1 do",
  "    if isSafe(board, row, col) then",
  "      board[row] = col",
  "      if solveNQueens(board, row + 1) then",
  "        return true",
  "      board[row] = -1 // backtrack",
  "  return false"
];
