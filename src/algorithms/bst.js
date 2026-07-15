// BST node factory
function makeNode(val) {
  return { val, left: null, right: null };
}

// Deep clone a BST node tree
function cloneTree(node) {
  if (!node) return null;
  return { val: node.val, left: cloneTree(node.left), right: cloneTree(node.right) };
}

// Insert into BST, return new root
function insertBST(root, val) {
  if (!root) return makeNode(val);
  if (val < root.val) root.left = insertBST(root.left, val);
  else if (val > root.val) root.right = insertBST(root.right, val);
  return root;
}

// Build a BST from an array of values
function buildBST(values) {
  let root = null;
  for (const v of values) root = insertBST(root, v);
  return root;
}

// ─── Level-Order (BFS) ────────────────────────────────────────────────────────
export function generateLevelOrderSteps(values) {
  const steps = [];
  const root = buildBST(values);

  steps.push({
    tree: cloneTree(root),
    highlighted: [],
    visitOrder: [],
    line: 0,
    trace: `Level Order (BFS) on BST with values: ${values.join(", ")}`,
  });

  const visitOrder = [];
  const queue = [root];

  steps.push({
    tree: cloneTree(root),
    highlighted: [root.val],
    visitOrder: [...visitOrder],
    line: 1,
    trace: `Enqueue root (${root.val})`,
  });

  while (queue.length > 0) {
    const node = queue.shift();
    visitOrder.push(node.val);

    steps.push({
      tree: cloneTree(root),
      highlighted: [node.val],
      visitOrder: [...visitOrder],
      line: 3,
      trace: `Dequeue ${node.val}. Visit it. Order so far: [${visitOrder.join(", ")}]`,
    });

    if (node.left) {
      queue.push(node.left);
      steps.push({
        tree: cloneTree(root),
        highlighted: [node.val, node.left.val],
        visitOrder: [...visitOrder],
        line: 4,
        trace: `Enqueue left child: ${node.left.val}`,
      });
    }
    if (node.right) {
      queue.push(node.right);
      steps.push({
        tree: cloneTree(root),
        highlighted: [node.val, node.right.val],
        visitOrder: [...visitOrder],
        line: 5,
        trace: `Enqueue right child: ${node.right.val}`,
      });
    }
  }

  steps.push({
    tree: cloneTree(root),
    highlighted: [],
    visitOrder: [...visitOrder],
    line: 6,
    trace: `Level Order complete! Result: [${visitOrder.join(", ")}]`,
  });

  return steps;
}

export const levelOrderPseudocode = [
  "procedure levelOrder(root)",
  "  queue = [root]",
  "  result = []",
  "  while queue is not empty do",
  "    node = queue.dequeue()",
  "    result.append(node.val)",
  "    if node.left exists: queue.enqueue(node.left)",
  "    if node.right exists: queue.enqueue(node.right)",
  "  return result"
];

// ─── Inorder DFS ──────────────────────────────────────────────────────────────
export function generateInorderSteps(values) {
  const steps = [];
  const root = buildBST(values);
  const visitOrder = [];

  steps.push({
    tree: cloneTree(root),
    highlighted: [],
    visitOrder: [],
    line: 0,
    trace: `Inorder DFS (Left → Root → Right) on BST`,
  });

  function inorder(node) {
    if (!node) return;
    steps.push({
      tree: cloneTree(root),
      highlighted: [node.val],
      visitOrder: [...visitOrder],
      line: 2,
      trace: `Recurse left from ${node.val}`,
    });
    inorder(node.left);

    visitOrder.push(node.val);
    steps.push({
      tree: cloneTree(root),
      highlighted: [node.val],
      visitOrder: [...visitOrder],
      line: 3,
      trace: `Visit ${node.val}. Order: [${visitOrder.join(", ")}]`,
    });

    steps.push({
      tree: cloneTree(root),
      highlighted: [node.val],
      visitOrder: [...visitOrder],
      line: 4,
      trace: `Recurse right from ${node.val}`,
    });
    inorder(node.right);
  }

  inorder(root);

  steps.push({
    tree: cloneTree(root),
    highlighted: [],
    visitOrder: [...visitOrder],
    line: 5,
    trace: `Inorder DFS complete! Result: [${visitOrder.join(", ")}]`,
  });

  return steps;
}

export const inorderPseudocode = [
  "procedure inorder(node)",
  "  if node is null: return",
  "  inorder(node.left)",
  "  visit(node.val)",
  "  inorder(node.right)",
  "  return"
];

// ─── Preorder DFS ─────────────────────────────────────────────────────────────
export function generatePreorderSteps(values) {
  const steps = [];
  const root = buildBST(values);
  const visitOrder = [];

  steps.push({
    tree: cloneTree(root),
    highlighted: [],
    visitOrder: [],
    line: 0,
    trace: `Preorder DFS (Root → Left → Right) on BST`,
  });

  function preorder(node) {
    if (!node) return;
    visitOrder.push(node.val);
    steps.push({
      tree: cloneTree(root),
      highlighted: [node.val],
      visitOrder: [...visitOrder],
      line: 2,
      trace: `Visit ${node.val}. Order: [${visitOrder.join(", ")}]`,
    });
    preorder(node.left);
    preorder(node.right);
  }

  preorder(root);

  steps.push({
    tree: cloneTree(root),
    highlighted: [],
    visitOrder: [...visitOrder],
    line: 4,
    trace: `Preorder DFS complete! Result: [${visitOrder.join(", ")}]`,
  });

  return steps;
}

export const preorderPseudocode = [
  "procedure preorder(node)",
  "  if node is null: return",
  "  visit(node.val)",
  "  preorder(node.left)",
  "  preorder(node.right)",
  "  return"
];

// ─── Postorder DFS ────────────────────────────────────────────────────────────
export function generatePostorderSteps(values) {
  const steps = [];
  const root = buildBST(values);
  const visitOrder = [];

  steps.push({
    tree: cloneTree(root),
    highlighted: [],
    visitOrder: [],
    line: 0,
    trace: `Postorder DFS (Left → Right → Root) on BST`,
  });

  function postorder(node) {
    if (!node) return;
    postorder(node.left);
    postorder(node.right);
    visitOrder.push(node.val);
    steps.push({
      tree: cloneTree(root),
      highlighted: [node.val],
      visitOrder: [...visitOrder],
      line: 3,
      trace: `Visit ${node.val}. Order: [${visitOrder.join(", ")}]`,
    });
  }

  postorder(root);

  steps.push({
    tree: cloneTree(root),
    highlighted: [],
    visitOrder: [...visitOrder],
    line: 5,
    trace: `Postorder DFS complete! Result: [${visitOrder.join(", ")}]`,
  });

  return steps;
}

export const postorderPseudocode = [
  "procedure postorder(node)",
  "  if node is null: return",
  "  postorder(node.left)",
  "  postorder(node.right)",
  "  visit(node.val)",
  "  return"
];
