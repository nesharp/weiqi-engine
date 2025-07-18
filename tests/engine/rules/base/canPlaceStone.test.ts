// tests/canPlaceStone.test.ts
import { beforeEach, describe, expect, it } from "vitest";

import { Board } from "../../../../src/models/Board";
import { Move } from "../../../../src/models/Move";
import { StoneColor } from "../../../../src/models/Stone";
import { TestRules } from "./TestRules";

describe("RulesBase - canPlaceStone", () => {
  let rules: TestRules;
  let board: Board;

  beforeEach(() => {
    board = new Board(5);
    rules = new TestRules(6.5);
  });

  it("should return false if position is out of bounds", () => {
    const move: Move = { position: { x: 5, y: 0 }, color: StoneColor.BLACK };
    const result = rules.canPlaceStone(board, move);
    expect(result).toBe(false);
  });

  it("should return false if there is already a stone in that position", () => {
    const move: Move = { position: { x: 2, y: 2 }, color: StoneColor.BLACK };
    board.placeStone({ x: 2, y: 2 }, StoneColor.BLACK);
    const result = rules.canPlaceStone(board, move);
    expect(result).toBe(false);
  });

  it("should return true if it immediately captures an enemy group (no self-atari)", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.WHITE);
    board.placeStone({ x: 2, y: 3 }, StoneColor.BLACK);
    board.placeStone({ x: 3, y: 2 }, StoneColor.BLACK);

    const move: Move = { position: { x: 1, y: 2 }, color: StoneColor.BLACK };
    const result = rules.canPlaceStone(board, move);
    expect(result).toBe(true);
  });

  it("should return false if placing the stone results in suicide (no liberties and no enemy captured)", () => {
    board.placeStone({ x: 0, y: 1 }, StoneColor.WHITE);
    board.placeStone({ x: 1, y: 0 }, StoneColor.WHITE);
    board.placeStone({ x: 1, y: 1 }, StoneColor.WHITE);

    const move: Move = { position: { x: 0, y: 0 }, color: StoneColor.BLACK };
    const result = rules.canPlaceStone(board, move);

    expect(result).toBe(false);
  });

  it("should return true if position is empty, in-bounds and does not result in suicide", () => {
    const move: Move = { position: { x: 3, y: 3 }, color: StoneColor.BLACK };
    const result = rules.canPlaceStone(board, move);
    expect(result).toBe(true);
  });
});
