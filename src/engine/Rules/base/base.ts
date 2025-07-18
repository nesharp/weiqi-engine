import { Board } from "../../../models/Board";
import { Move } from "../../../models/Move";
import { Player } from "../../../models/Player";
import { Position } from "../../../models/Position";
import { StoneColor } from "../../../models/Stone";
import { ScoreResult } from "./types";

export abstract class RulesBase {
  constructor(public readonly komi: number) {}

  public canPlaceStone(board: Board, move: Move): boolean {
    const { x, y } = move.position;
    const color = move.color;

    if (!this.isInBounds(board, x, y)) {
      return false;
    }

    if (board.getStoneColor({ x, y }) !== null) {
      return false;
    }

    board.placeStone(move.position, move.color);

    const capturedEnemy = this.findCapturedGroupsAfterPlacement(board, move);

    if (capturedEnemy.length > 0) {
      board.removeStone({ x, y });
      return true;
    }
    const newStoneGroup = this.getGroupStones(board, move.position, color);
    const libertiesCount = this.countGroupLiberties(board, newStoneGroup);

    board.removeStone({ x, y });

    return libertiesCount > 0;
  }
  public getCapturedGroups(board: Board, move: Move): Array<Position> {
    const boardCopy = board.copy();
    boardCopy.placeStone(move.position, move.color);

    const capturedEnemy = this.findCapturedGroupsAfterPlacement(board, move);

    boardCopy.removeStone(move.position);

    return capturedEnemy;
  }

  public abstract isGameOver(board: Board): boolean;

  public abstract calculateScore(
    board: Board,
    players?: Map<StoneColor, Player>,
  ): ScoreResult;

  protected isInBounds(board: Board, x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < board.size && y < board.size;
  }
  protected key(x: number, y: number): string {
    return `${x},${y}`;
  }
  protected getNeighbors(board: Board, x: number, y: number): Position[] {
    const neighbors: Position[] = [];
    const directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ];
    directions.forEach(({ dx, dy }) => {
      const nx = x + dx;
      const ny = y + dy;
      if (this.isInBounds(board, nx, ny)) {
        neighbors.push({ x: nx, y: ny });
      }
    });

    return neighbors;
  }
  protected getGroupStones(
    board: Board,
    start: Position,
    color: StoneColor,
  ): Position[] {
    if (board.getStoneColor(start) === null) return [];
    const stack: Position[] = [start];
    const group: Position[] = [];
    const visited: Set<string> = new Set();
    visited.add(this.key(start.x, start.y));

    while (stack.length) {
      const current = stack.pop()!;
      group.push(current);

      const neighbors = this.getNeighbors(board, current.x, current.y);
      for (const n of neighbors) {
        if (!visited.has(this.key(n.x, n.y))) {
          const stoneColor = board.getStoneColor(n);
          if (stoneColor === color) {
            stack.push(n);
            visited.add(this.key(n.x, n.y));
          }
        }
      }
    }

    return group;
  }

  protected countGroupLiberties(board: Board, group: Position[]): number {
    const libertiesSet: Set<string> = new Set();

    for (const pos of group) {
      const neighbors = this.getNeighbors(board, pos.x, pos.y);

      for (const n of neighbors) {
        if (board.getStoneColor(n) === null) {
          libertiesSet.add(this.key(n.x, n.y));
        }
      }
    }

    return libertiesSet.size;
  }

  protected findCapturedGroupsAfterPlacement(
    board: Board,
    move: Move,
  ): Position[] {
    const {
      position: { x, y },
      color,
    } = move;
    const opponentColor =
      color === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK;
    // TODO:rework this through board coping
    board.placeStone(move.position, move.color);

    const neighbors = this.getNeighbors(board, x, y);
    const captured: Position[] = [];

    for (const n of neighbors) {
      if (board.getStoneColor(n) === opponentColor) {
        const enemyGroup = this.getGroupStones(board, n, opponentColor);
        const liberties = this.countGroupLiberties(board, enemyGroup);
        if (liberties === 0) {
          captured.push(...enemyGroup);
        }
      }
    }

    return captured;
  }
  protected exploreEmptyRegion(
    board: Board,
    startX: number,
    startY: number,
    visited: Set<string>,
  ): { positions: Position[]; adjacentColors: Set<StoneColor> } {
    const stack: Position[] = [{ x: startX, y: startY }];
    const positions: Position[] = [];
    const adjacentColors: Set<StoneColor> = new Set();

    visited.add(this.key(startX, startY));

    while (stack.length) {
      const current = stack.pop()!;
      positions.push(current);

      const neighbors = this.getNeighbors(board, current.x, current.y);
      for (const n of neighbors) {
        const stone = board.getStoneColor(n);
        if (stone === null) {
          const k = this.key(n.x, n.y);
          if (!visited.has(k)) {
            visited.add(k);
            stack.push(n);
          }
        } else {
          adjacentColors.add(stone);
        }
      }
    }

    return { positions, adjacentColors };
  }
}
