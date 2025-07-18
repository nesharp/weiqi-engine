import { RulesBase, ScoreResult } from "../../../../src/engine/Rules/base";
import { Board } from "../../../../src/models/Board";
import { StoneColor } from "../../../../src/models/Stone";

export class TestRules extends RulesBase {
  // eslint-disable-next-line
  public isGameOver(board: Board): boolean {
    return false;
  }

  // eslint-disable-next-line
  public calculateScore(board: Board): ScoreResult {
    return { [StoneColor.BLACK]: 0, [StoneColor.WHITE]: 0 };
  }
}
