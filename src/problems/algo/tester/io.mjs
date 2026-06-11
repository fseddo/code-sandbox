// Reference-type I/O for the judge: test data is plain arrays, but solutions see real `ListNode` /
// `TreeNode` structures. `hydrate` materializes a param before the call; `dehydrate` flattens a result
// after it. Kept separate from the worker so the conversions are unit-testable in isolation
// (see io.test.ts) and shared by both the worker and the verifier. See docs/features/problem-authoring.md.

/** Singly-linked node, also injected as a sandbox global so linked-list solutions can reference `ListNode`. */
export class ListNode {
  constructor(val, next) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

/** Binary-tree node, also injected as a sandbox global so tree solutions can reference `TreeNode`. */
export class TreeNode {
  constructor(val, left, right) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

/** Graph node (adjacency list), also injected as a sandbox global so graph solutions can reference `GraphNode`. */
export class GraphNode {
  constructor(val, neighbors) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
  }
}

export const arrayToList = (values) => {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) head = new ListNode(values[i], head);
  return head;
};

export const listToArray = (node) => {
  const values = [];
  for (let current = node; current !== null && current !== undefined; current = current.next) values.push(current.val);
  return values;
};

// LeetCode level-order array (with `null` for absent children) → TreeNode. A null node has no slots.
export const arrayToTree = (values) => {
  if (!values || values.length === 0 || values[0] === null || values[0] === undefined) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (i < values.length) {
    const node = queue.shift();
    const leftVal = values[i++];
    if (leftVal !== null && leftVal !== undefined) { node.left = new TreeNode(leftVal); queue.push(node.left); }
    if (i < values.length) {
      const rightVal = values[i++];
      if (rightVal !== null && rightVal !== undefined) { node.right = new TreeNode(rightVal); queue.push(node.right); }
    }
  }
  return root;
};

// TreeNode → LeetCode level-order array, trailing `null`s trimmed (so [1,2,3] not [1,2,3,null,null,null,null]).
export const treeToArray = (root) => {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === null || node === undefined) { result.push(null); continue; }
    result.push(node.val);
    queue.push(node.left ?? null, node.right ?? null);
  }
  while (result.length > 0 && result[result.length - 1] === null) result.pop();
  return result;
};

// LeetCode adjacency-list array → GraphNode. `adjList[i]` holds the neighbor *vals* of the node with val
// `i + 1` (vals are the contiguous range 1..N). Returns the node with val 1 — the entry point a graph
// solution is handed — or null for the empty graph.
export const arrayToGraph = (adjList) => {
  if (!adjList || adjList.length === 0) return null;
  const nodes = adjList.map((_, i) => new GraphNode(i + 1));
  adjList.forEach((neighbors, i) => { nodes[i].neighbors = neighbors.map((val) => nodes[val - 1]); });
  return nodes[0];
};

// GraphNode → LeetCode adjacency-list array. Traverses from the entry node, ordering nodes and each node's
// neighbors by val so the serialization is canonical (a structurally-correct result deep-equals the input).
// Structure-only: object identity is gone after serialization, so this CANNOT distinguish a deep copy from
// the original graph — clone problems graded through this check only their structure. See problem-authoring.md.
export const graphToArray = (node) => {
  if (!node) return [];
  const seen = new Map();
  const queue = [node];
  while (queue.length > 0) {
    const current = queue.shift();
    if (seen.has(current.val)) continue;
    seen.set(current.val, current);
    for (const neighbor of current.neighbors) if (!seen.has(neighbor.val)) queue.push(neighbor);
  }
  const maxVal = Math.max(...seen.keys());
  const result = [];
  for (let val = 1; val <= maxVal; val++) {
    const found = seen.get(val);
    result.push(found ? found.neighbors.map((n) => n.val).sort((a, b) => a - b) : []);
  }
  return result;
};

export const hydrate = (value, shape) => {
  switch (shape) {
    case "linked-list": return arrayToList(value);
    case "linked-list[]": return value.map(arrayToList);
    case "binary-tree": return arrayToTree(value);
    case "binary-tree[]": return value.map(arrayToTree);
    case "graph": return arrayToGraph(value);
    default: return value;
  }
};

export const dehydrate = (value, shape) => {
  switch (shape) {
    case "linked-list": return listToArray(value);
    case "linked-list[]": return value.map(listToArray);
    case "binary-tree": return treeToArray(value);
    case "binary-tree[]": return value.map(treeToArray);
    case "graph": return graphToArray(value);
    default: return value;
  }
};
