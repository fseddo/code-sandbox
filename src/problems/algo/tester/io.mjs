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

export const hydrate = (value, shape) => {
  switch (shape) {
    case "linked-list": return arrayToList(value);
    case "linked-list[]": return value.map(arrayToList);
    case "binary-tree": return arrayToTree(value);
    case "binary-tree[]": return value.map(arrayToTree);
    default: return value;
  }
};

export const dehydrate = (value, shape) => {
  switch (shape) {
    case "linked-list": return listToArray(value);
    case "linked-list[]": return value.map(listToArray);
    case "binary-tree": return treeToArray(value);
    case "binary-tree[]": return value.map(treeToArray);
    default: return value;
  }
};
