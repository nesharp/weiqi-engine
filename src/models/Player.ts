import { StoneColor } from "./Stone";

export interface Player<T extends StoneColor = StoneColor> {
  name: string;
  color: T;
  capturedStones: number;
}
