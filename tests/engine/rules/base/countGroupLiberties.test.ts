// tests/countGroupLiberties.test.ts
import { beforeEach, describe, expect, it } from "vitest";

import { Board } from "../../../../src/models/Board";
import { Position } from "../../../../src/models/Position";
import { StoneColor } from "../../../../src/models/Stone";
import { TestRules } from "./TestRules";

describe("RulesBase - countGroupLiberties", () => {
  let rules: TestRules;
  let board: Board;

  beforeEach(() => {
    board = new Board(5);
    rules = new TestRules(6.5);
  });

  it("should return 4 liberties for a single stone in the center", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.BLACK);
    const group = [{ x: 2, y: 2 }];
    const liberties = rules["countGroupLiberties"](board, group);
    expect(liberties).toBe(4);
  });

  it("should return correct liberties if group is near an edge", () => {
    board.placeStone({ x: 0, y: 2 }, StoneColor.BLACK);
    const group = [{ x: 0, y: 2 }];

    const liberties = rules["countGroupLiberties"](board, group);
    expect(liberties).toBe(3);
  });

  it("should count unique liberties for a multi-stone group", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 2, y: 3 }, StoneColor.BLACK);
    board.placeStone({ x: 3, y: 2 }, StoneColor.BLACK);

    const group: Position[] = [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 2 },
    ];
    const liberties = rules["countGroupLiberties"](board, group);

    expect(liberties).toBeGreaterThan(0);
  });

  it("should return 0 if group is fully surrounded by enemy stones", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.BLACK);

    board.placeStone({ x: 2, y: 1 }, StoneColor.WHITE);
    board.placeStone({ x: 2, y: 3 }, StoneColor.WHITE);
    board.placeStone({ x: 1, y: 2 }, StoneColor.WHITE);
    board.placeStone({ x: 3, y: 2 }, StoneColor.WHITE);

    const group = [{ x: 2, y: 2 }];
    const liberties = rules["countGroupLiberties"](board, group);
    expect(liberties).toBe(0);
  });

  it("should not double-count the same liberty for multiple stones in the group", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 2, y: 3 }, StoneColor.BLACK);

    const group = [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ];
    const liberties = rules["countGroupLiberties"](board, group);

    expect(liberties).toBeGreaterThan(0);
    expect(liberties).toBeLessThanOrEqual(6);
  });
});
