import { beforeEach, describe, expect, it } from "vitest";

import { Board } from "../../../../src/models/Board";
import { Move } from "../../../../src/models/Move";
import { StoneColor } from "../../../../src/models/Stone";
import { TestRules } from "./TestRules";

describe("RulesBase - getCapturedGroups", () => {
  let rules: TestRules;
  let board: Board;

  beforeEach(() => {
    board = new Board(5);
    rules = new TestRules(6.5);
  });

  it("should return an empty array if no groups are captured", () => {
    const move: Move = { position: { x: 0, y: 0 }, color: StoneColor.BLACK };
    const captured = rules.getCapturedGroups(board, move);
    expect(captured).toHaveLength(0);
  });

  it("should return enemy stones that would be captured by this move", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.WHITE);
    board.placeStone({ x: 2, y: 3 }, StoneColor.BLACK);
    board.placeStone({ x: 3, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 1, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 2, y: 1 }, StoneColor.BLACK);

    const move: Move = { position: { x: 1, y: 2 }, color: StoneColor.BLACK };
    const captured = rules.getCapturedGroups(board, move);
    expect(captured).toEqual([{ x: 2, y: 2 }]);
  });

  it("should correctly handle multiple enemy stones in a group", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.WHITE);
    board.placeStone({ x: 2, y: 3 }, StoneColor.WHITE);

    board.placeStone({ x: 3, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 3, y: 3 }, StoneColor.BLACK);
    board.placeStone({ x: 1, y: 2 }, StoneColor.BLACK);
    board.placeStone({ x: 1, y: 3 }, StoneColor.BLACK);
    board.placeStone({ x: 2, y: 1 }, StoneColor.BLACK);
    board.placeStone({ x: 2, y: 4 }, StoneColor.BLACK);

    const move: Move = { position: { x: 2, y: 1 }, color: StoneColor.BLACK };
    const captured = rules.getCapturedGroups(board, move);
    expect(captured).toEqual(
      expect.arrayContaining([
        { x: 2, y: 2 },
        { x: 2, y: 3 },
      ]),
    );
  });

  it("should handle scenario with no capture but potential self-atari", () => {
    board.placeStone({ x: 2, y: 2 }, StoneColor.WHITE);
    board.placeStone({ x: 2, y: 3 }, StoneColor.WHITE);

    const move: Move = { position: { x: 2, y: 1 }, color: StoneColor.BLACK };
    const captured = rules.getCapturedGroups(board, move);
    expect(captured).toHaveLength(0);
  });
});
