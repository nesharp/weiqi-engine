import { describe, expect, test } from "vitest";

import { Board } from "../../../src/models/Board";

describe("Board - Boundary Checks", () => {
  test("Position (0, 0) should be on board", () => {
    const board = new Board(9);
    expect(board.isOnBoard({ x: 0, y: 0 })).toBe(true);
  });

  test("Position (size-1, size-1) should be on board", () => {
    const size = 9;
    const board = new Board(size);
    expect(board.isOnBoard({ x: size - 1, y: size - 1 })).toBe(true);
  });

  test("Position (-1, 0) should be off board", () => {
    const board = new Board(9);
    expect(board.isOnBoard({ x: -1, y: 0 })).toBe(false);
  });

  test("Position (0, size) should be off board", () => {
    const size = 9;
    const board = new Board(size);
    expect(board.isOnBoard({ x: 0, y: size })).toBe(false);
  });

  test("Position (5, 6) should be on board when size is 9", () => {
    const size = 9;
    const board = new Board(size);
    expect(board.isOnBoard({ x: 5, y: 6 })).toBe(true);
  });
});
