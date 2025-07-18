// tests/calculateScore.test.ts
import { beforeEach, describe, expect, test } from "vitest";

import { ScoreResult } from "../../../../src/engine/Rules/base";
import { Board } from "../../../../src/models/Board";
import { StoneColor } from "../../../../src/models/Stone";
import { TestRules } from "./TestRules";

describe("RulesBase - calculateScore (abstract method test)", () => {
  let rules: TestRules;
  let board: Board;

  beforeEach(() => {
    board = new Board(5);
    rules = new TestRules(6.5);
  });

  test("should return an object with black and white properties", () => {
    const score = rules.calculateScore(board);
    expect(score).toHaveProperty(StoneColor.BLACK);
    expect(score).toHaveProperty(StoneColor.WHITE);
  });

  test("should return ScoreResult type with numbers", () => {
    const score = rules.calculateScore(board);

    expect(typeof score[StoneColor.BLACK]).toBe("number");
    expect(typeof score[StoneColor.WHITE]).toBe("number");
  });

  test("should not throw any error when called", () => {
    expect(() => rules.calculateScore(board)).not.toThrow();
  });

  test("should take komi into account in a real implementation (dummy here)", () => {
    const customKomiRules = new TestRules(7.5);
    const score = customKomiRules.calculateScore(board);
    // У заглушці: повертаємо 0,0
    expect(score[StoneColor.BLACK]).toBe(0);
    expect(score[StoneColor.WHITE]).toBe(0);
  });

  test("can be overridden in a subclass for actual scoring logic", () => {
    class CustomScoringRules extends TestRules {
      // eslint-disable-next-line
      public calculateScore(board: Board): ScoreResult {
        return { [StoneColor.BLACK]: 10, [StoneColor.WHITE]: 15 };
      }
    }
    const customRules = new CustomScoringRules(6.5);
    const score = customRules.calculateScore(board);
    expect(score[StoneColor.BLACK]).toBe(10);
    expect(score[StoneColor.WHITE]).toBe(15);
  });
});
