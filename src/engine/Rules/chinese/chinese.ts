import { Board } from "../../../models/Board";
import { Player } from "../../../models/Player";
import { StoneColor } from "../../../models/Stone";
import { RulesBase, ScoreResult } from "../base";

export class ChineseRules extends RulesBase {
  constructor() {
    super(7.5); // Standard komi for Chinese rules
  }

  public isGameOver(board: Board): boolean {
    // In Chinese rules, game is over when the board is completely filled
    // But in practice, game ends when both players pass consecutively
    // This method is called as a fallback for board-full situations
    const size = board.size;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (board.getStoneColor({ x, y }) === null) {
          return false;
        }
      }
    }
    return true;
  }

  public calculateScore(
    board: Board,
    players?: Map<StoneColor, Player>,
  ): ScoreResult {
    const size = board.size;

    let blackStones = 0;
    let whiteStones = 0;
    let blackTerritory = 0;
    let whiteTerritory = 0;

    // Count stones on the board
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const stone = board.getStoneColor({ x, y });
        if (stone === StoneColor.BLACK) {
          blackStones++;
        } else if (stone === StoneColor.WHITE) {
          whiteStones++;
        }
      }
    }

    // Count territory (empty points surrounded by one color)
    const visitedEmpty = new Set<string>();
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const stone = board.getStoneColor({ x, y });
        if (stone !== null) continue; // Skip occupied points

        const key = this.key(x, y);
        if (visitedEmpty.has(key)) continue; // Already counted this region

        const { positions, adjacentColors } = this.exploreEmptyRegion(
          board,
          x,
          y,
          visitedEmpty,
        );

        // Territory belongs to a color only if it's completely surrounded by that color
        if (adjacentColors.size === 1) {
          const [surroundingColor] = Array.from(adjacentColors);

          if (surroundingColor === StoneColor.BLACK) {
            blackTerritory += positions.length;
          } else if (surroundingColor === StoneColor.WHITE) {
            whiteTerritory += positions.length;
          }
        }
        // If surrounded by both colors or no colors, it's neutral territory (no points)
      }
    }

    // Calculate total scores
    // In Chinese rules: stones on board + territory + captured stones
    let blackCaptured = 0;
    let whiteCaptured = 0;

    if (players) {
      blackCaptured = players.get(StoneColor.BLACK)?.capturedStones || 0;
      whiteCaptured = players.get(StoneColor.WHITE)?.capturedStones || 0;
    }

    const blackScore = blackStones + blackTerritory + blackCaptured;
    const whiteScore = whiteStones + whiteTerritory + whiteCaptured + this.komi;

    return {
      [StoneColor.BLACK]: blackScore,
      [StoneColor.WHITE]: whiteScore,
    };
  }
}
