// Red-Black Tree constants
const RED = "RED";
const BLACK = "BLACK";

function rbNode(val, color = RED) {
  return { val, color, left: null, right: null, parent: null };
}

// Deep clone RB tree (strips parent refs to avoid cycles)
function cloneRB(node) {
  if (!node) return null;
  const n = { val: node.val, color: node.color, left: null, right: null };
  n.left = cloneRB(node.left);
  n.right = cloneRB(node.right);
  return n;
}

// Rotate left
function rotateLeft(root, node) {
  const y = node.right;
  node.right = y.left;
  if (y.left) y.left.parent = node;
  y.parent = node.parent;
  if (!node.parent) root = y;
  else if (node === node.parent.left) node.parent.left = y;
  else node.parent.right = y;
  y.left = node;
  node.parent = y;
  return root;
}

// Rotate right
function rotateRight(root, node) {
  const y = node.left;
  node.left = y.right;
  if (y.right) y.right.parent = node;
  y.parent = node.parent;
  if (!node.parent) root = y;
  else if (node === node.parent.right) node.parent.right = y;
  else node.parent.left = y;
  y.right = node;
  node.parent = y;
  return root;
}

// Fix RB tree after insert
function fixInsert(root, z, steps) {
  while (z.parent && z.parent.color === RED) {
    if (z.parent === z.parent.parent?.left) {
      const y = z.parent.parent?.right; // uncle
      if (y && y.color === RED) {
        // Case 1: Uncle is red → recolor
        z.parent.color = BLACK;
        y.color = BLACK;
        z.parent.parent.color = RED;
        z = z.parent.parent;
        steps.push({
          tree: cloneRB(root),
          highlighted: [z.val],
          line: 3,
          trace: `Case 1: Uncle is RED. Recolor parent & uncle to BLACK, grandparent to RED.`,
        });
      } else {
        if (z === z.parent.right) {
          // Case 2: Uncle is black, z is right child → left rotate
          z = z.parent;
          steps.push({
            tree: cloneRB(root),
            highlighted: [z.val],
            line: 4,
            trace: `Case 2: Uncle is BLACK, z is right child. Left-rotate around z's parent.`,
          });
          root = rotateLeft(root, z);
        }
        // Case 3: Uncle is black, z is left child → right rotate
        z.parent.color = BLACK;
        z.parent.parent.color = RED;
        steps.push({
          tree: cloneRB(root),
          highlighted: [z.parent.val],
          line: 5,
          trace: `Case 3: Uncle is BLACK, z is left child. Recolor and right-rotate around grandparent.`,
        });
        root = rotateRight(root, z.parent.parent);
      }
    } else {
      const y = z.parent.parent?.left; // uncle (mirror)
      if (y && y.color === RED) {
        z.parent.color = BLACK;
        y.color = BLACK;
        z.parent.parent.color = RED;
        z = z.parent.parent;
        steps.push({
          tree: cloneRB(root),
          highlighted: [z.val],
          line: 3,
          trace: `Case 1 (mirror): Uncle is RED. Recolor parent & uncle to BLACK, grandparent to RED.`,
        });
      } else {
        if (z === z.parent.left) {
          z = z.parent;
          steps.push({
            tree: cloneRB(root),
            highlighted: [z.val],
            line: 4,
            trace: `Case 2 (mirror): Uncle is BLACK, z is left child. Right-rotate around z's parent.`,
          });
          root = rotateRight(root, z);
        }
        z.parent.color = BLACK;
        z.parent.parent.color = RED;
        steps.push({
          tree: cloneRB(root),
          highlighted: [z.parent.val],
          line: 5,
          trace: `Case 3 (mirror): Recolor and left-rotate around grandparent.`,
        });
        root = rotateLeft(root, z.parent.parent);
      }
    }
  }
  root.color = BLACK;
  return root;
}

export function generateRedBlackSteps(values) {
  const steps = [];
  let root = null;

  steps.push({
    tree: null,
    highlighted: [],
    line: 0,
    trace: `Start Red-Black Tree insertions: ${values.join(", ")}`,
  });

  for (const val of values) {
    // Standard BST insert
    const z = rbNode(val, RED);
    let y = null;
    let x = root;

    steps.push({
      tree: cloneRB(root),
      highlighted: [val],
      line: 1,
      trace: `Insert ${val} as a RED node and find position via BST rules.`,
    });

    while (x) {
      y = x;
      x = val < x.val ? x.left : x.right;
    }
    z.parent = y;
    if (!y) root = z;
    else if (val < y.val) y.left = z;
    else y.right = z;

    steps.push({
      tree: cloneRB(root),
      highlighted: [val],
      line: 2,
      trace: `Node ${val} placed. Now fix Red-Black properties.`,
    });

    root = fixInsert(root, z, steps);

    steps.push({
      tree: cloneRB(root),
      highlighted: [val],
      line: 6,
      trace: `Tree is balanced after inserting ${val}. Root is always BLACK.`,
    });
  }

  steps.push({
    tree: cloneRB(root),
    highlighted: [],
    line: 7,
    trace: `All insertions complete. Final Red-Black Tree is valid.`,
  });

  return steps;
}

export const redBlackPseudocode = [
  "procedure rbInsert(root, val)",
  "  z = new RED node(val)",
  "  insert z using standard BST rules",
  "  while z.parent is RED do",
  "    Case 1: Uncle is RED → recolor",
  "    Case 2: Uncle is BLACK, z is outer → rotate",
  "    Case 3: Uncle is BLACK, z is inner → double rotate",
  "  root.color = BLACK"
];
