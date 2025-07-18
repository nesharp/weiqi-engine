import { GameMessages } from "../lib/messages";
import { Board } from "../models/Board";
import { Move } from "../models/Move";
import { Player } from "../models/Player";
import { StoneColor } from "../models/Stone";
import { RulesBase } from "./Rules/base";
import { ScoreResult } from "./Rules/base/types";
import { ChineseRules } from "./Rules/chinese";

export type MoveReturn = {
  success: boolean;
  message: (typeof GameMessages)[keyof typeof GameMessages];
};

export type GameState = {
  isGameEnded: boolean;
  consecutivePasses: number;
  winner?: StoneColor | "tie";
  score?: ScoreResult;
};

export class Game {
  public board: Board;
  private players: Map<StoneColor, Player> = new Map();
  private currentTurn: StoneColor;
  private rules: RulesBase;
  private _isGameEnded: boolean = false;
  private _consecutivePasses: number = 0;
  private _winner?: StoneColor | "tie";
  private _score?: ScoreResult;

  constructor(
    boardSizeOrState: number,
    blackPlayer: Player,
    whitePlayer: Player,
    rules: RulesBase = new ChineseRules(),
  ) {
    this.rules = rules;

    this.board = new Board(boardSizeOrState);
    if (blackPlayer && whitePlayer) {
      this.players.set(StoneColor.BLACK, blackPlayer);
      this.players.set(StoneColor.WHITE, whitePlayer);
    }
    this.currentTurn = StoneColor.BLACK;
  }

  public get isGameEnded() {
    return this._isGameEnded;
  }

  public get consecutivePasses() {
    return this._consecutivePasses;
  }

  public get winner() {
    return this._winner;
  }

  public get score() {
    return this._score;
  }

  public getGameState(): GameState {
    return {
      isGameEnded: this._isGameEnded,
      consecutivePasses: this._consecutivePasses,
      winner: this._winner,
      score: this._score,
    };
  }

  public getBoard(): Board {
    return this.board;
  }

  public getCurrentTurn(): StoneColor {
    return this.currentTurn;
  }

  public makeMove(move: Move): MoveReturn {
    if (this._isGameEnded) {
      return {
        success: false,
        message: GameMessages.GAME_ALREADY_ENDED,
      };
    }

    if (move.color !== this.currentTurn) {
      return {
        success: false,
        message: GameMessages.NOT_YOUR_TURN,
      };
    }

    if (!this.rules.canPlaceStone(this.board, move)) {
      return {
        success: false,
        message: GameMessages.YOU_CANT_PLACE_STONE_ON_THIS_POSITION,
      };
    }

    // Reset consecutive passes since a move was made
    this._consecutivePasses = 0;

    this.board.placeStone(move.position, move.color);

    const capturedGroups = this.rules.getCapturedGroups(this.board, move);
    if (capturedGroups.length > 0) {
      capturedGroups.forEach((pos) => {
        const capturedColor = this.board.getStoneColor(pos);
        if (capturedColor) {
          const capturedPlayer = this.players.get(capturedColor);
          if (capturedPlayer) {
            capturedPlayer.capturedStones += 1;
          }
        }
        this.board.removeStone(pos);
      });
    }

    this.switchTurn();
    this.checkGameEnd();

    return {
      success: true,
      message: GameMessages.STONE_PLACED,
    };
  }

  public pass(): void {
    if (this._isGameEnded) {
      return;
    }

    this._consecutivePasses++;
    this.switchTurn();
    this.checkGameEnd();
  }

  private switchTurn(): void {
    this.currentTurn =
      this.currentTurn === StoneColor.BLACK
        ? StoneColor.WHITE
        : StoneColor.BLACK;
  }

  private checkGameEnd(): void {
    // Game ends after two consecutive passes or when board is full (Chinese rules)
    if (this._consecutivePasses >= 2 || this.rules.isGameOver(this.board)) {
      this.endGame();
    }
  }

  public endGame(): void {
    if (this._isGameEnded) {
      return;
    }

    this._isGameEnded = true;
    this._score = this.rules.calculateScore(this.board, this.players);

    // Determine winner
    if (this._score) {
      const blackScore = this._score[StoneColor.BLACK];
      const whiteScore = this._score[StoneColor.WHITE];

      if (blackScore > whiteScore) {
        this._winner = StoneColor.BLACK;
      } else if (whiteScore > blackScore) {
        this._winner = StoneColor.WHITE;
      } else {
        this._winner = "tie";
      }
    }
  }

  public getScoreResult(): ScoreResult | null {
    if (!this._isGameEnded) {
      return null;
    }
    return this._score || null;
  }

  public saveState(): string {
    const state = {
      board: this.board.encode(),
      players: {
        [StoneColor.BLACK]: {
          name: this.players.get(StoneColor.BLACK)?.name || "",
          capturedStones:
            this.players.get(StoneColor.BLACK)?.capturedStones || 0,
        },
        [StoneColor.WHITE]: {
          name: this.players.get(StoneColor.WHITE)?.name || "",
          capturedStones:
            this.players.get(StoneColor.WHITE)?.capturedStones || 0,
        },
      },
      currentTurn: this.currentTurn,
      isGameEnded: this._isGameEnded,
    };
    return JSON.stringify(state);
  }
  public restoreGameFromString(moves: string): void {
    const tokens = moves.trim().split(/\s+/);

    for (const token of tokens) {
      if (/^pass$/i.test(token)) {
        this.pass();
        continue;
      }

      const match = /^([A-Za-z])(\d+)$/.exec(token);
      if (!match) {
        throw new Error(`Invalid move format: "${token}"`);
      }

      const letterPart = match[1].toUpperCase(); // щоб усе було в одному регістрі
      const numberPart = parseInt(match[2], 10);

      const x = letterPart.charCodeAt(0) - "A".charCodeAt(0);

      const y = numberPart - 1;

      if (x < 0 || y < 0 || x >= this.board.size || y >= this.board.size) {
        throw new Error(
          `Coordinates out of board range: token="${token}", x=${x}, y=${y}`,
        );
      }

      const move: Move = {
        color: this.getCurrentTurn(), // Поточний колір, який ходить
        position: { x, y },
      };

      const result = this.makeMove(move);
      if (!result.success) {
        throw new Error(`Failed to make move "${token}": ${result.message}`);
      }
    }
  }
}
