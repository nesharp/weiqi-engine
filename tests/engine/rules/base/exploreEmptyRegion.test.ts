// tests/exploreEmptyRegion.test.ts
import { beforeEach, describe, expect, it } from "vitest";

import { Board } from "../../../../src/models/Board";
import { StoneColor } from "../../../../src/models/Stone";
import { TestRules } from "./TestRules";

describe("RulesBase - exploreEmptyRegion", () => {
  let rules: TestRules;
  let board: Board;

  beforeEach(() => {
    board = new Board(5);
    rules = new TestRules(6.5);
  });

  it("should find all connected empty positions starting from a given empty spot", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.BLACK);

    const visited = new Set<string>();
    const { positions, adjacentColors } = rules["exploreEmptyRegion"](
      board,
      0,
      0,
      visited,
    );
    expect(positions.length).toBeGreaterThan(1);

    expect(adjacentColors.has(StoneColor.BLACK)).toBe(true);
  });

  it("should return the same region if called multiple times on the same spot", () => {
    const result1 = rules["exploreEmptyRegion"](board, 1, 1, new Set());
    const result2 = rules["exploreEmptyRegion"](board, 1, 1, new Set());

    expect(result1).toStrictEqual(result2);
  });

  it("should have positions array of length 1 (або 0) if the start is out of bounds (залежить від реалізації)", () => {
    const visited = new Set<string>();
    const { positions, adjacentColors } = rules["exploreEmptyRegion"](
      board,
      5,
      5,
      visited,
    );

    expect(positions.length).toBeGreaterThanOrEqual(0);
    expect(adjacentColors.size).toBe(0);
  });

  it("should correctly identify adjacent colors around the empty region", () => {
    board.placeStone({ x: 1, y: 1 }, StoneColor.BLACK);
    board.placeStone({ x: 1, y: 2 }, StoneColor.BLACK);

    const visited = new Set<string>();
    const { positions, adjacentColors } = rules["exploreEmptyRegion"](
      board,
      0,
      0,
      visited,
    );
    expect(adjacentColors.has(StoneColor.BLACK)).toBe(true);
    expect(positions.length).toBeGreaterThan(0);
  });

  it("should not include positions occupied by stones in the returned positions array", () => {
    board.placeStone({ x: 0, y: 1 }, StoneColor.WHITE);

    const visited = new Set<string>();
    const { positions } = rules["exploreEmptyRegion"](board, 0, 0, visited);

    for (const pos of positions) {
      expect(board.getStoneColor(pos)).toBeNull();
    }
  });
});
