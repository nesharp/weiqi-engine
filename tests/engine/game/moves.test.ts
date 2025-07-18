import { beforeEach, describe, expect, it, vi } from "vitest";

import { Game } from "../../../src/engine/Game";
import { RulesBase } from "../../../src/engine/Rules/base";
import { ChineseRules } from "../../../src/engine/Rules/chinese";
import { GameMessages } from "../../../src/lib/messages";
import { Move } from "../../../src/models/Move";
import { Player } from "../../../src/models/Player";
import { StoneColor } from "../../../src/models/Stone";

vi.mock("../../../src/engine/Rules/chinese", () => ({
  ChineseRules: class {
    canPlaceStone = vi.fn();
    getCapturedGroups = vi.fn();
    isGameOver = vi.fn();
    calculateScore = vi.fn();
  },
}));
describe("Game Moves", () => {
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

    // Configure default mock behaviors
    vi.mocked(rulesMock.isGameOver).mockReturnValue(false);
    vi.mocked(rulesMock.calculateScore).mockReturnValue({
      [StoneColor.BLACK]: 0,
      [StoneColor.WHITE]: 7.5,
    });

    game = new Game(19, blackPlayer, whitePlayer, rulesMock);
  });

  it("should allow a valid move and switch turns", () => {
    const move: Move = { position: { x: 3, y: 3 }, color: StoneColor.BLACK };
    vi.mocked(rulesMock.canPlaceStone).mockReturnValue(true);
    vi.mocked(rulesMock.getCapturedGroups).mockReturnValue([]);

    const result = game.makeMove(move);
    expect(result.success).toBe(true);
    expect(result.message).toBe(GameMessages.STONE_PLACED);
    expect(game.getCurrentTurn()).toBe(StoneColor.WHITE);
  });

  it("should reject a move if it's not the player's turn", () => {
    const move: Move = { position: { x: 3, y: 3 }, color: StoneColor.WHITE };
    const result = game.makeMove(move);

    expect(result.success).toBe(false);
    expect(result.message).toBe(GameMessages.NOT_YOUR_TURN);
  });

  it("should reject a move if the position is invalid", () => {
    const move: Move = { position: { x: 3, y: 3 }, color: StoneColor.BLACK };
    vi.mocked(rulesMock.canPlaceStone).mockReturnValue(false);

    const result = game.makeMove(move);

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      GameMessages.YOU_CANT_PLACE_STONE_ON_THIS_POSITION,
    );
  });

  it("should remove captured stones from the board", () => {
    const move: Move = { position: { x: 3, y: 3 }, color: StoneColor.BLACK };
    vi.mocked(rulesMock.canPlaceStone).mockReturnValue(true);
    vi.mocked(rulesMock.getCapturedGroups).mockReturnValue([{ x: 4, y: 4 }]);

    const removeStoneSpy = vi.spyOn(game.getBoard(), "removeStone");

    const result = game.makeMove(move);

    expect(result.success).toBe(true);
    expect(removeStoneSpy).toHaveBeenCalledWith({ x: 4, y: 4 });
  });
});
