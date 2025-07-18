import { beforeEach, describe, expect, it } from "vitest";

import { Board } from "../../../../src/models/Board";
import { TestRules } from "./TestRules";

describe("RulesBase - isInBounds", () => {
  let rules: TestRules;
  let board: Board;

  beforeEach(() => {
    board = new Board(9);
    rules = new TestRules(6.5);
  });

  it("should return true if x and y are within the board boundaries (e.g. center)", () => {
    expect(rules["isInBounds"](board, 4, 4)).toBe(true);
  });

  it("should return false if x < 0", () => {
    expect(rules["isInBounds"](board, -1, 4)).toBe(false);
  });

  it("should return false if y < 0", () => {
    expect(rules["isInBounds"](board, 3, -5)).toBe(false);
  });

  it("should return false if x >= board.size", () => {
    expect(rules["isInBounds"](board, 9, 4)).toBe(false);
  });

  it("should return false if y >= board.size", () => {
    expect(rules["isInBounds"](board, 4, 9)).toBe(false);
  });
});
