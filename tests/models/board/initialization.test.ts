import { describe, expect, test } from "vitest";

import { Board } from "../../../src/models/Board";
import { StoneColor } from "../../../src/models/Stone";

describe("Board - Initialization", () => {
  test("Create a board of size 9: all cells should be null", () => {
    const size = 9;
    const board = new Board(size);

    expect(board.size).toBe(size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        expect(board.getStoneColor({ x, y })).toBe(null);
      }
    }
  });

  test("Create a board of size 19: all cells should be null", () => {
    const size = 19;
    const board = new Board(size);

    expect(board.size).toBe(size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        expect(board.getStoneColor({ x, y })).toBe(null);
      }
    }
  });

  test("Check if size property is correct after creation", () => {
    const size = 13;
    const board = new Board(size);
    expect(board.size).toBe(13);
  });

  test("Ensure internal grid is not null", () => {
    const size = 5;
    const board = new Board(size);
    for (let y = 0; y < size; y++) {
      const row: Array<StoneColor | null> = [];
      for (let x = 0; x < size; x++) {
        row.push(board.getStoneColor({ x: x, y: y }));
      }
      expect(row).toHaveLength(size);
    }
  });

  test("Ensure grid length matches size", () => {
    const size = 7;
    const board = new Board(size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        expect(() => board.getStoneColor({ x, y })).not.toThrow();
      }
    }
  });
});
