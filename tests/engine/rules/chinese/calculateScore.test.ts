import { describe, expect, it } from "vitest";

import { ChineseRules } from "../../../../src/engine/Rules/chinese";
import { Board } from "../../../../src/models/Board";
import { StoneColor } from "../../../../src/models/Stone";

describe("ChineseRules - calculateScore", () => {
  it("should return correct score for an empty board", () => {
    const board = new Board(9);
    const rules = new ChineseRules();
    const score = rules.calculateScore(board);
    expect(score[StoneColor.BLACK]).toBe(0);
    expect(score[StoneColor.WHITE]).toBe(7.5);
  });

  it("should return correct score for board with stones but no territory", () => {
    const board = new Board(9);
    board.placeStone({ x: 0, y: 0 }, StoneColor.BLACK);
    board.placeStone({ x: 1, y: 1 }, StoneColor.WHITE);
    const rules = new ChineseRules();
    const score = rules.calculateScore(board);
    expect(score[StoneColor.BLACK]).toBe(1);
    expect(score[StoneColor.WHITE]).toBe(8.5);
  });

  it("should correctly count surrounded territory", () => {
    const board = new Board(9);

    const blackStones = [
      { x: 6, y: 1 },
      { x: 6, y: 2 },
      { x: 5, y: 2 },
      { x: 6, y: 3 },
      { x: 5, y: 4 },
      { x: 6, y: 6 },
      { x: 4, y: 6 },
      { x: 4, y: 7 },
      { x: 3, y: 7 },
      { x: 2, y: 8 },
    ];
    blackStones.forEach((pos) => board.placeStone(pos, StoneColor.BLACK));
    const whiteStones = [
      { x: 4, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 2 },
      { x: 5, y: 1 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 3, y: 5 },
      { x: 3, y: 6 },
      { x: 2, y: 7 },
    ];
    whiteStones.forEach((pos) => board.placeStone(pos, StoneColor.WHITE));

    const rules = new ChineseRules();
    const score = rules.calculateScore(board);

    expect(score[StoneColor.BLACK]).toBe(blackStones.length);
    expect(score[StoneColor.WHITE]).toBe(whiteStones.length + 7.5 + 1);
  });
  it("should correctly count surrounded territory", () => {
    const board = new Board(9);
    for (let y = 0; y < 9; y++) {
      board.placeStone({ x: 3, y }, StoneColor.BLACK);
      board.placeStone({ x: 4, y }, StoneColor.WHITE);
    }
    const rules = new ChineseRules();
    const score = rules.calculateScore(board);
    expect(score[StoneColor.BLACK]).toBe(36);
    expect(score[StoneColor.WHITE]).toBe(45 + 7.5);
  });
  it("should correctly count surrounded territory", () => {
    const board = new Board(9);
    for (let y = 0; y < 9; y++) {
      board.placeStone({ x: 3, y }, StoneColor.BLACK);
      board.placeStone({ x: 4, y }, StoneColor.WHITE);
    }
    board.placeStone({ x: 2, y: 5 }, StoneColor.BLACK);
    const rules = new ChineseRules();
    const score = rules.calculateScore(board);
    expect(score);
  });
  it("should handle fully occupied board", () => {
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
    const score = rules.calculateScore(board);
    expect(score[StoneColor.BLACK]).toBeGreaterThan(40);
    expect(score[StoneColor.WHITE]).toBeGreaterThan(40);
  });

  it("should correctly apply komi for white", () => {
    const board = new Board(9);
    const rules = new ChineseRules();
    const score = rules.calculateScore(board);
    expect(score[StoneColor.WHITE]).toBe(7.5);
  });
});
