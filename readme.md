# Weiqi Engine

A modern TypeScript library for Go (Weiqi/Baduk) game logic and board management.

---

## Features

- 🎯 **Complete Go Rules Implementation** – Supports all standard Go rules including captures, ko rule, and territory scoring
- 🏁 **Board State Management** – Efficient board representation and state tracking
- 🔄 **Move Validation** – Comprehensive move validation with suicide rule and ko detection
- 📊 **Game Analysis** – Territory calculation, group analysis, and scoring utilities
- 🎮 **Game Flow Control** – Turn management, game phases, and end-game detection
- 🏆 **Multiple Scoring Systems** – Support for different scoring methods (area, territory)
- 📱 **Framework Agnostic** – Pure TypeScript with no external dependencies
- 🚀 **Performance Optimized** – Efficient algorithms for real-time gameplay

---

## Installation

```bash
npm install weiqi-engine
```

---

## Usage

### Importing

```typescript
import { Game, StoneColor } from 'weiqi-engine';
```

### Basic Example

```typescript
// Create players
const blackPlayer = {
  name: 'First player',
  color: StoneColor.BLACK,
  capturedStones: 0,
};
const whitePlayer = {
  name: 'Second player',
  color: StoneColor.WHITE,
  capturedStones: 0,
};

// Create a new game (19x19 board by default)
const game = new Game(19, blackPlayer, whitePlayer);

// Make a move (Black plays at (3, 3))
const move = { position: { x: 3, y: 3 }, color: StoneColor.BLACK };
const result = game.makeMove(move);
console.log(result.success, result.message);

// Get current board state as string
console.log(game.getBoard().toString());

// Get whose turn it is
console.log('Current turn:', game.getCurrentTurn());
```

---

## Documentation

- [API Reference](#) *(soon)*
- [Examples](#) *(soon)*

---

## License

MIT