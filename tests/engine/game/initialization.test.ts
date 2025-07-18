import { beforeEach, describe, expect, it } from "vitest";

import { Game } from "../../../src/engine/Game";
import { Board } from "../../../src/models/Board";
import { Player } from "../../../src/models/Player";
import { StoneColor } from "../../../src/models/Stone";

describe("Game Initialization", () => {
  let game: Game;
  let blackPlayer: Player;
  let whitePlayer: Player;

  beforeEach(() => {
    blackPlayer = {
      name: "First player",
      capturedStones: 0,
      color: StoneColor.BLACK,
    };
    whitePlayer = {
      name: "Second player",
      capturedStones: 0,
      color: StoneColor.WHITE,
    };
    game = new Game(19, blackPlayer, whitePlayer);
  });

  it("should initialize the game with a board", () => {
    expect(game.getBoard()).toBeInstanceOf(Board);
  });

  it("should set the current turn to BLACK initially", () => {
    expect(game.getCurrentTurn()).toBe(StoneColor.BLACK);
  });

  it("should assign players to the correct colors", () => {
    expect(game.getCurrentTurn()).toBe(StoneColor.BLACK);
    expect(blackPlayer).toBeTruthy();
    expect(whitePlayer).toBeTruthy();
  });

  it("should create a 19x19 board by default", () => {
    expect(game.getBoard().size).toBe(19);
  });
});
