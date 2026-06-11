import { describe, it, expect } from "vitest";
import {
  arrayToList,
  listToArray,
  arrayToTree,
  treeToArray,
  arrayToGraph,
  graphToArray,
  hydrate,
  dehydrate,
} from "./io.mjs";

describe("linked-list conversion", () => {
  it("round-trips a non-empty array", () => {
    expect(listToArray(arrayToList([1, 2, 3]))).toEqual([1, 2, 3]);
  });

  it("handles the empty list both directions", () => {
    expect(arrayToList([])).toBeNull();
    expect(listToArray(null)).toEqual([]);
  });

  it("builds a real chain (val/next), not a flat array", () => {
    const head = arrayToList([7, 8]);
    expect(head.val).toBe(7);
    expect(head.next.val).toBe(8);
    expect(head.next.next).toBeNull();
  });
});

describe("binary-tree conversion", () => {
  it("round-trips LeetCode level-order with null gaps", () => {
    expect(treeToArray(arrayToTree([1, null, 2, 3]))).toEqual([1, null, 2, 3]);
  });

  it("treats an empty / null-root array as the empty tree", () => {
    expect(arrayToTree([])).toBeNull();
    expect(arrayToTree([null])).toBeNull();
    expect(treeToArray(null)).toEqual([]);
  });

  it("places children by the level-order slot rule (a null node has no slots)", () => {
    const root = arrayToTree([3, 9, 20, null, null, 15, 7]);
    expect(root.val).toBe(3);
    expect(root.left.val).toBe(9);
    expect(root.right.val).toBe(20);
    expect(root.left.left).toBeNull();
    expect(root.right.left.val).toBe(15);
    expect(root.right.right.val).toBe(7);
  });

  it("trims trailing nulls on the way out", () => {
    // A left-only chain serializes without the implicit trailing null children.
    expect(treeToArray(arrayToTree([1, 2, null, 3]))).toEqual([1, 2, null, 3]);
  });
});

describe("graph conversion", () => {
  it("round-trips a cyclic adjacency list (LeetCode clone-graph shape)", () => {
    const adj = [[2, 4], [1, 3], [2, 4], [1, 3]];
    expect(graphToArray(arrayToGraph(adj))).toEqual(adj);
  });

  it("builds real cyclic GraphNodes (val/neighbors), not a flat array", () => {
    const entry = arrayToGraph([[2], [1]]);
    expect(entry.val).toBe(1);
    expect(entry.neighbors[0].val).toBe(2);
    // The cycle closes: node 2's neighbor is the same object we started from.
    expect(entry.neighbors[0].neighbors[0]).toBe(entry);
  });

  it("handles the empty graph and a lone node both directions", () => {
    expect(arrayToGraph([])).toBeNull();
    expect(graphToArray(null)).toEqual([]);
    expect(graphToArray(arrayToGraph([[]]))).toEqual([[]]);
  });

  it("canonicalizes neighbor order on the way out", () => {
    // Unsorted neighbors serialize sorted, so a correct clone deep-equals the input.
    const entry = arrayToGraph([[3, 2], [1], [1]]);
    expect(graphToArray(entry)).toEqual([[2, 3], [1], [1]]);
  });
});

describe("array-of variants map element-wise", () => {
  it("hydrates/dehydrates linked-list[]", () => {
    const lists = hydrate([[1, 2], [], [3]], "linked-list[]");
    expect(lists[0].val).toBe(1);
    expect(lists[1]).toBeNull();
    expect(dehydrate(lists, "linked-list[]")).toEqual([[1, 2], [], [3]]);
  });

  it("hydrates/dehydrates binary-tree[]", () => {
    const trees = hydrate([[1], [2, null, 3]], "binary-tree[]");
    expect(trees[0].val).toBe(1);
    expect(trees[1].right.val).toBe(3);
    expect(dehydrate(trees, "binary-tree[]")).toEqual([[1], [2, null, 3]]);
  });
});

describe("value shape is a pass-through", () => {
  it("does not transform plain values", () => {
    expect(hydrate([1, 2, 3], "value")).toEqual([1, 2, 3]);
    expect(hydrate(42, undefined)).toBe(42);
    expect(dehydrate("abc", "value")).toBe("abc");
  });
});
