import { beforeEach, describe, expect, it } from "vitest";

import { Game } from "../../../src/engine/Game";
import { RulesBase } from "../../../src/engine/Rules/base";
import { ChineseRules } from "../../../src/engine/Rules/chinese";
import { Player } from "../../../src/models/Player";
import { StoneColor } from "../../../src/models/Stone";

describe("Game ending", () => {
  let game: Game;
  let rulesMock: RulesBase;
  beforeEach(() => {
    const blackPlayer: Player<StoneColor.BLACK> = {
      name: "First player",
      capturedStones: 0,
      color: StoneColor.BLACK,
    };
    const whitePlayer: Player<StoneColor.WHITE> = {
      name: "First player",
      capturedStones: 0,
      color: StoneColor.WHITE,
    };
    rulesMock = new ChineseRules();
    game = new Game(19, blackPlayer, whitePlayer, rulesMock);
  });
  it("Should works😄", () => {
    game.endGame();
    expect(game.isGameEnded).toBe(true);
  });
});
