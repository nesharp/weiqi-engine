import { Position } from "./Position";
import { StoneColor } from "./Stone";

export interface Move {
  color: StoneColor;
  position: Position;
}
