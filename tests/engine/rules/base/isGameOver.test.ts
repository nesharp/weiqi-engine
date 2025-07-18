// tests/isGameOver.test.ts
import { beforeEach, describe, expect, it } from "vitest";

import { Board } from "../../../../src/models/Board";
import { TestRules } from "./TestRules";

describe("RulesBase - isGameOver (abstract method test)", () => {
  let rules: TestRules;
  let board: Board;

  beforeEach(() => {
    board = new Board(5);
    rules = new TestRules(6.5);
  });

  it("should return a boolean (dummy: false)", () => {
    expect(typeof rules.isGameOver(board)).toBe("boolean");
  });

  it("should return false by default in TestRules", () => {
    expect(rules.isGameOver(board)).toBe(false);
  });

  it("should not throw any error when called", () => {
    expect(() => rules.isGameOver(board)).not.toThrow();
  });

  it("can be overridden in a subclass to reflect real end-game conditions", () => {
    class CustomRules extends TestRules {
      // eslint-disable-next-line
      public isGameOver(board: Board): boolean {
        return true;
      }
    }
    const customRules = new CustomRules(6.5);
    expect(customRules.isGameOver(board)).toBe(true);
  });

  it("dummy coverage test calling isGameOver multiple times", () => {
    rules.isGameOver(board);
    rules.isGameOver(board);
    expect(rules.isGameOver(board)).toBe(false);
  });
});
