import { describe, expect, it } from "vitest";

import { ChineseRules } from "../../../../src/engine/Rules/chinese";
import { Board } from "../../../../src/models/Board";
import { StoneColor } from "../../../../src/models/Stone";

describe("ChineseRules - isGameOver", () => {
  it("returns false when board has empty positions", () => {
    const board = new Board(9);
    const rules = new ChineseRules();
    expect(rules.isGameOver(board)).toBe(false);
  });

  it("returns true when board is full", () => {
    const board = new Board(9);
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        board.placeStone(
          { x, y },
          x % 2 === 0 ? StoneColor.BLACK : StoneColor.WHITE,
        );
      }
    }
    const rules = new ChineseRules();
    expect(rules.isGameOver(board)).toBe(true);
  });

  it("returns false for partially filled board", () => {
    const board = new Board(9);
    board.placeStone({ x: 0, y: 0 }, StoneColor.BLACK);
    const rules = new ChineseRules();
    expect(rules.isGameOver(board)).toBe(false);
  });

  it("returns true for a full 19x19 board", () => {
    const board = new Board(19);
    for (let x = 0; x < 19; x++) {
      for (let y = 0; y < 19; y++) {
        board.placeStone(
          { x, y },
          (x + y) % 2 === 0 ? StoneColor.BLACK : StoneColor.WHITE,
        );
      }
    }
    const rules = new ChineseRules();
    expect(rules.isGameOver(board)).toBe(true);
  });

  it("returns false when only one row is filled", () => {
    const board = new Board(9);
    for (let x = 0; x < 9; x++) {
      board.placeStone({ x, y: 0 }, StoneColor.BLACK);
    }
    const rules = new ChineseRules();
    expect(rules.isGameOver(board)).toBe(false);
  });
});
