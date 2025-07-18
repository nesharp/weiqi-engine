import { Position } from "../models/Position";

/**
 * Converts a Go-style coordinate string (e.g., "D4", "AA19") to a Position object
 * @param moveString - String in Go coordinate format (letters A-Z followed by numbers)
 * @returns Position object with x and y coordinates
 * @throws {Error} If the input string doesn't match the expected format
 * @example
 * serializePosition("D4") // returns { x: 4, y: 4 }
 * serializePosition("AA19") // returns { x: 27, y: 19 }
 */
export function serializePosition(moveString: string): Position {
  const match = moveString.match(/^([A-Z]+)(\d+)$/);
  if (!match) throw new Error("Invalid Go coordinate format");

  const [, colStr, rowStr] = match;
  let col = 0;

  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - "A".charCodeAt(0) + 1);
  }

  return { x: col, y: parseInt(rowStr, 10) };
}

/**
 * Converts a Position object to Go-style coordinate string
 * @param position - Position object containing x and y coordinates
 * @returns String in Go coordinate format (e.g., "D4", "AA19")
 * @throws {Error} If coordinates are invalid (less than 1)
 * @example
 * deserializeMove({ x: 4, y: 4 }) // returns "D4"
 * deserializeMove({ x: 27, y: 19 }) // returns "AA19"
 */
export function deserializePosition(position: Position): string {
  let x = position.x;
  const y = position.y;

  if (x < 1 || y < 1) throw new Error("Invalid coordinates");

  let col = "";
  while (x > 0) {
    x--;
    col = String.fromCharCode((x % 26) + "A".charCodeAt(0)) + col;
    x = Math.floor(x / 26);
  }

  return `${col}${y}`;
}
