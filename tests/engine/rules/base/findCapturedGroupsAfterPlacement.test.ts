// tests/findCapturedGroupsAfterPlacement.test.ts
import { beforeEach, describe, expect, test } from "vitest";

import { Board } from "../../../../src/models/Board";
import { Move } from "../../../../src/models/Move";
import { StoneColor } from "../../../../src/models/Stone";
import { TestRules } from "./TestRules";

describe("RulesBase - findCapturedGroupsAfterPlacement", () => {
  let rules: TestRules;
  let board: Board;

  beforeEach(() => {
    board = new Board(5);
    rules = new TestRules(6.5);
  });

  test("should return empty array if no group is captured by the new stone", () => {
    const move: Move = { position: { x: 2, y: 2 }, color: StoneColor.BLACK };
    const captured = rules["findCapturedGroupsAfterPlacement"](board, move);
    expect(captured).toHaveLength(0);
  });

  test("should capture a single enemy stone with no liberties", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.WHITE);

    board.placeStone({ x: 2, y: 3 }, StoneColor.BLACK);
    board.placeStone({ x: 3, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 2, y: 1 }, StoneColor.BLACK);

    const move: Move = { position: { x: 1, y: 2 }, color: StoneColor.BLACK };
    const captured = rules["findCapturedGroupsAfterPlacement"](board, move);
    expect(captured).toEqual([{ x: 2, y: 2 }]);
  });

  test("should capture an entire group of enemy stones", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.WHITE);
    board.placeStone({ x: 2, y: 3 }, StoneColor.WHITE);

    board.placeStone({ x: 1, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 1, y: 3 }, StoneColor.BLACK);
    board.placeStone({ x: 3, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 3, y: 3 }, StoneColor.BLACK);
    board.placeStone({ x: 2, y: 4 }, StoneColor.BLACK);

    const move: Move = { position: { x: 2, y: 1 }, color: StoneColor.BLACK };
    const captured = rules["findCapturedGroupsAfterPlacement"](board, move);
    expect(captured).toEqual(
      expect.arrayContaining([
        { x: 2, y: 2 },
        { x: 2, y: 3 },
      ]),
    );
  });

  test("should capture nothing if the neighboring stones are not all out of liberties", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.WHITE);

    const move: Move = { position: { x: 3, y: 3 }, color: StoneColor.BLACK };
    const captured = rules["findCapturedGroupsAfterPlacement"](board, move);
    expect(captured).toHaveLength(0);
  });

  test("should handle capturing multiple enemy groups adjacent to the placed stone", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.WHITE);
    board.placeStone({ x: 2, y: 3 }, StoneColor.WHITE);

    board.placeStone({ x: 3, y: 2 }, StoneColor.WHITE);
    board.placeStone({ x: 4, y: 2 }, StoneColor.WHITE);

    board.placeStone({ x: 2, y: 1 }, StoneColor.BLACK);
    board.placeStone({ x: 2, y: 4 }, StoneColor.BLACK);
    board.placeStone({ x: 3, y: 1 }, StoneColor.BLACK);
    board.placeStone({ x: 3, y: 3 }, StoneColor.BLACK);
    board.placeStone({ x: 4, y: 1 }, StoneColor.BLACK);
    board.placeStone({ x: 4, y: 3 }, StoneColor.BLACK);
    board.placeStone({ x: 1, y: 2 }, StoneColor.BLACK);

    const move: Move = { position: { x: 1, y: 3 }, color: StoneColor.BLACK };
    const captured = rules["findCapturedGroupsAfterPlacement"](board, move);
    expect(captured.length).toBeGreaterThan(1);
  });
});
