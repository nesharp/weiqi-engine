import { describe, expect, test } from "vitest";

import { Board } from "../../../src/models/Board";
import { Position } from "../../../src/models/Position";
import { StoneColor } from "../../../src/models/Stone";
describe("Board - Stone Placement", () => {
  test("Place a black stone at (0,0)", () => {
    const board = new Board(9);
    const position: Position = { x: 0, y: 0 };

    board.placeStone(position, StoneColor.BLACK);
    expect(board.getStoneColor(position)).toBe(StoneColor.BLACK);
  });

  test("Place a white stone at (3,4)", () => {
    const board = new Board(9);
    const position: Position = { x: 3, y: 4 };

    board.placeStone(position, StoneColor.WHITE);
    expect(board.getStoneColor(position)).toBe(StoneColor.WHITE);
  });

  test("Place a stone on an existing cell should overwrite it", () => {
    const board = new Board(9);
    const position: Position = { x: 2, y: 2 };

    board.placeStone(position, StoneColor.BLACK);
    expect(board.getStoneColor(position)).toBe(StoneColor.BLACK);

    board.placeStone(position, StoneColor.WHITE);
    expect(board.getStoneColor(position)).toBe(StoneColor.WHITE);
  });

  test("Place a stone at the corner (size-1, size-1)", () => {
    const size = 9;
    const board = new Board(size);
    const position: Position = { x: size - 1, y: size - 1 };

    board.placeStone(position, StoneColor.BLACK);
    expect(board.getStoneColor(position)).toBe(StoneColor.BLACK);
  });

  test("Place multiple stones of different colors in different positions", () => {
    const board = new Board(5);

    board.placeStone({ x: 0, y: 0 }, StoneColor.BLACK);
    board.placeStone({ x: 1, y: 1 }, StoneColor.WHITE);
    board.placeStone({ x: 2, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 3, y: 3 }, StoneColor.WHITE);

    expect(board.getStoneColor({ x: 0, y: 0 })).toBe(StoneColor.BLACK);
    expect(board.getStoneColor({ x: 1, y: 1 })).toBe(StoneColor.WHITE);
    expect(board.getStoneColor({ x: 2, y: 2 })).toBe(StoneColor.BLACK);
    expect(board.getStoneColor({ x: 3, y: 3 })).toBe(StoneColor.WHITE);
  });
});
