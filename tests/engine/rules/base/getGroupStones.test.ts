// tests/getGroupStones.test.ts
import { beforeEach, describe, expect, it } from "vitest";

import { Board } from "../../../../src/models/Board";
import { Position } from "../../../../src/models/Position";
import { StoneColor } from "../../../../src/models/Stone";
import { TestRules } from "./TestRules";

describe("RulesBase - getGroupStones", () => {
  let rules: TestRules;
  let board: Board;

  beforeEach(() => {
    board = new Board(5);
    rules = new TestRules(6.5);
  });

  it("should return a single stone if it's isolated", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.BLACK);
    const group = rules["getGroupStones"](
      board,
      { x: 2, y: 2 },
      StoneColor.BLACK,
    );
    expect(group).toEqual([{ x: 2, y: 2 }]);
  });

  it("should return all stones connected orthogonally of the same color", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 2, y: 3 }, StoneColor.BLACK);
    board.placeStone({ x: 3, y: 2 }, StoneColor.BLACK);

    board.placeStone({ x: 3, y: 3 }, StoneColor.WHITE); // інший колір

    const group = rules["getGroupStones"](
      board,
      { x: 2, y: 2 },
      StoneColor.BLACK,
    );
    expect(group.length).toBe(3);
    expect(group).toEqual(
      expect.arrayContaining<Position>([
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 2 },
      ]),
    );
  });

  it("should return empty array if start position has no stone", () => {
    const group = rules["getGroupStones"](
      board,
      { x: 0, y: 0 },
      StoneColor.BLACK,
    );

    expect(group).toHaveLength(0);
  });

  it("should handle large groups", () => {
    const blackPositions = [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 3 },
    ];
    blackPositions.forEach((pos) => board.placeStone(pos, StoneColor.BLACK));

    const group = rules["getGroupStones"](
      board,
      { x: 1, y: 1 },
      StoneColor.BLACK,
    );
    expect(group.length).toBe(5);
  });

  it("should not cross color boundaries", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 2, y: 3 }, StoneColor.WHITE);

    const blackGroup = rules["getGroupStones"](
      board,
      { x: 2, y: 2 },
      StoneColor.BLACK,
    );
    const whiteGroup = rules["getGroupStones"](
      board,
      { x: 2, y: 3 },
      StoneColor.WHITE,
    );

    expect(blackGroup).toEqual([{ x: 2, y: 2 }]);
    expect(whiteGroup).toEqual([{ x: 2, y: 3 }]);
  });
});
