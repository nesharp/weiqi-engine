import * as engine from "./dist/index.js";


const game = new engine.Game(19, {name: "First player", color: engine.StoneColor.BLACK, capturedStones: 0}, {name: "Second player", color: engine.StoneColor.WHITE, capturedStones: 0})
