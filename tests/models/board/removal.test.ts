import { describe, expect, test } from "vitest";

import { Board } from "../../../src/models/Board";
import { Position } from "../../../src/models/Position";
import { StoneColor } from "../../../src/models/Stone";

describe("Board - Stone Removal", () => {
  test("Remove a stone that was placed", () => {
    const board = new Board(9);
    const position: Position = { x: 4, y: 4 };

    board.placeStone(position, StoneColor.BLACK);
    board.removeStone(position);
    expect(board.getStoneColor(position)).toBe(null);
  });

  test("Remove a stone from an empty cell does nothing", () => {
    const board = new Board(9);
    const position: Position = { x: 0, y: 0 };

    // Початково порожньо
    expect(board.getStoneColor(position)).toBe(null);

    // Видаляємо
    board.removeStone(position);
    expect(board.getStoneColor(position)).toBe(null);
  });

  test("Place then remove multiple stones", () => {
    const board = new Board(5);

    board.placeStone({ x: 0, y: 0 }, StoneColor.BLACK);
    board.placeStone({ x: 1, y: 1 }, StoneColor.WHITE);
    board.placeStone({ x: 2, y: 2 }, StoneColor.BLACK);

    board.removeStone({ x: 0, y: 0 });
    board.removeStone({ x: 2, y: 2 });

    expect(board.getStoneColor({ x: 0, y: 0 })).toBe(null);
    expect(board.getStoneColor({ x: 1, y: 1 })).toBe(StoneColor.WHITE);
    expect(board.getStoneColor({ x: 2, y: 2 })).toBe(null);
  });

  test("Remove a stone at board edges", () => {
    const board = new Board(5);

    // Крайні позиції
    const edgePositions: Position[] = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
      { x: 4, y: 4 },
    ];

    edgePositions.forEach((pos) => {
      board.placeStone(pos, StoneColor.BLACK);
      expect(board.getStoneColor(pos)).toBe(StoneColor.BLACK);
    });

    edgePositions.forEach((pos) => board.removeStone(pos));

    edgePositions.forEach((pos) => {
      expect(board.getStoneColor(pos)).toBe(null);
    });
  });

  test("Remove stone in the middle of the board", () => {
    const board = new Board(5);
    const position: Position = { x: 2, y: 2 };

    board.placeStone(position, StoneColor.WHITE);
    expect(board.getStoneColor(position)).toBe(StoneColor.WHITE);

    board.removeStone(position);
    expect(board.getStoneColor(position)).toBe(null);
  });
});
