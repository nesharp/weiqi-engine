import { describe, expect, test } from "vitest";

import { Board } from "../../../src/models/Board";
import { StoneColor } from "../../../src/models/Stone";

describe("Board - toString()", () => {
  test("Empty 3x3 board should render all '.'", () => {
    const board = new Board(3);
    const expected = ". . .\n" + ". . .\n" + ". . .";

    expect(board.toString()).toBe(expected);
  });

  test("Board with one black stone", () => {
    const board = new Board(3);
    board.placeStone({ x: 1, y: 1 }, StoneColor.BLACK);

    const expected = ". . .\n" + ". B .\n" + ". . .";

    expect(board.toString()).toBe(expected);
  });

  test("Board with one white stone", () => {
    const board = new Board(3);
    board.placeStone({ x: 0, y: 2 }, StoneColor.WHITE);

    const expected = ". . .\n" + ". . .\n" + "W . .";

    expect(board.toString()).toBe(expected);
  });

  test("Board with multiple stones (mixed)", () => {
    const board = new Board(3);
    board.placeStone({ x: 0, y: 0 }, StoneColor.BLACK);
    board.placeStone({ x: 2, y: 2 }, StoneColor.WHITE);
    board.placeStone({ x: 1, y: 1 }, StoneColor.BLACK);

    const expected = "B . .\n" + ". B .\n" + ". . W";

    expect(board.toString()).toBe(expected);
  });

  test("Board 2x2 with a black stone overwritten by a white stone", () => {
    const board = new Board(2);
    // Спочатку чорна
    board.placeStone({ x: 0, y: 0 }, StoneColor.BLACK);
    // Потім біла
    board.placeStone({ x: 0, y: 0 }, StoneColor.WHITE);

    const expected = "W .\n" + ". .";

    expect(board.toString()).toBe(expected);
  });
});
