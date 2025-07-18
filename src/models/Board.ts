import { Position } from "./Position";
import { StoneColor } from "./Stone";

export class Board {
  private _size: number;
  private _grid: Array<Array<StoneColor | null>>;
  constructor(size: number) {
    this._size = size;
    this._grid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => null),
    );
  }
  public get size() {
    return this._size;
  }
  public get grid() {
    return this._grid;
  }
  public getStoneColor(position: Position): StoneColor | null {
    return this._grid[position.y][position.x];
  }
  public placeStone(position: Position, color: StoneColor): void {
    this._grid[position.y][position.x] = color;
  }
  public removeStone(position: Position): void {
    this._grid[position.y][position.x] = null;
  }
  public isOnBoard(position: Position): boolean {
    const { x, y } = position;
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }
  public toString(): string {
    return this._grid
      .map((row) =>
        row
          .map((cell) => {
            if (cell === null) return ".";
            if (cell === StoneColor.BLACK) return "B";
            if (cell === StoneColor.WHITE) return "W";
            return "?";
          })
          .join(" "),
      )
      .join("\n");
  }
  public encode(): string {
    return JSON.stringify({
      size: this._size,
      grid: this._grid.map((row) => row.map((cell) => cell ?? null)),
    });
  }

  public static decode(data: string): Board {
    const parsed = JSON.parse(data);
    const board = new Board(parsed.size);
    board._grid = parsed.grid;
    return board;
  }
  public copy(): Board {
    const newBoard = new Board(this._size);

    newBoard._grid = this._grid.map((row) => [...row]);

    return newBoard;
  }
}
