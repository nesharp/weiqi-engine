import { Position } from "./Position";

export enum StoneColor {
  BLACK = "BLACK",
  WHITE = "WHITE",
}

export interface Stone {
  position: Position;
  color: StoneColor;
}
