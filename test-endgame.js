// Test endgame scenarios - near full grid

const GRID_SIZE = 4;

function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function getEmptyCells(grid) {
  const cells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
}

function hasValidMoves(grid) {
  // Check for empty cells
  if (getEmptyCells(grid).length > 0) return true;

  // Check for adjacent matching tiles
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const current = grid[row][col];

      // Check right neighbor
      if (col < GRID_SIZE - 1 && grid[row][col + 1] === current) return true;

      // Check down neighbor
      if (row < GRID_SIZE - 1 && grid[row + 1][col] === current) return true;
    }
  }

  return false;
}

function hasWon(grid) {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 2048) return true;
    }
  }
  return false;
}

function addRandomTile(grid) {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return grid;

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  const newGrid = grid.map(r => [...r]);
  newGrid[row][col] = value;
  return newGrid;
}

function printGrid(grid, label) {
  console.log(`\n${label}:`);
  grid.forEach((row, i) => console.log(`  ${row.join('\t')}`));
}

// TEST 1: Grid with only one empty cell
console.log("=== TEST 1: Grid with only 1 empty cell ===");
let grid = [
  [2, 4, 8, 16],
  [32, 64, 128, 256],
  [512, 1024, 2048, 4],
  [8, 16, 32, 0]  // One empty cell
];

printGrid(grid, "Before adding tile");
console.log("Empty cells:", getEmptyCells(grid).length);
console.log("Has valid moves:", hasValidMoves(grid));
console.log("Has won:", hasWon(grid));

const gridAfterAdd = addRandomTile(grid);
printGrid(gridAfterAdd, "After adding random tile");
console.log("Empty cells:", getEmptyCells(gridAfterAdd).length);
console.log("Has valid moves:", hasValidMoves(gridAfterAdd));
console.log("✓ Should be game over if no adjacent matches");

// TEST 2: Full grid with no valid moves
console.log("\n\n=== TEST 2: Full grid with NO valid moves ===");
grid = [
  [2, 4, 2, 4],
  [4, 2, 4, 2],
  [2, 4, 2, 4],
  [4, 2, 4, 2]
];

printGrid(grid, "Grid state");
console.log("Empty cells:", getEmptyCells(grid).length);
console.log("Has valid moves:", hasValidMoves(grid));
console.log("Has won:", hasWon(grid));
console.log("✓ Should be game over (no moves, no empty cells)");

// TEST 3: Full grid WITH valid moves (adjacent matches)
console.log("\n\n=== TEST 3: Full grid WITH valid moves ===");
grid = [
  [2, 2, 4, 8],  // Has matching 2s
  [4, 8, 16, 32],
  [8, 16, 32, 64],
  [16, 32, 64, 128]
];

printGrid(grid, "Grid state");
console.log("Empty cells:", getEmptyCells(grid).length);
console.log("Has valid moves:", hasValidMoves(grid));
console.log("Has won:", hasWon(grid));
console.log("✓ Should still be playable (has matching adjacent tiles)");

// TEST 4: Grid with 2048 tile
console.log("\n\n=== TEST 4: Winning grid with 2048 ===");
grid = [
  [2, 4, 8, 16],
  [32, 64, 128, 256],
  [512, 1024, 2048, 0],  // Has 2048!
  [2, 4, 8, 0]
];

printGrid(grid, "Grid state");
console.log("Empty cells:", getEmptyCells(grid).length);
console.log("Has valid moves:", hasValidMoves(grid));
console.log("Has won:", hasWon(grid));
console.log("✓ Should trigger win condition");

// TEST 5: Edge case - trying to add tile to full grid
console.log("\n\n=== TEST 5: Add tile to FULL grid (edge case) ===");
grid = [
  [2, 4, 2, 4],
  [4, 2, 4, 2],
  [2, 4, 2, 4],
  [4, 2, 4, 2]
];

printGrid(grid, "Before (FULL grid)");
const gridAfterAttempt = addRandomTile(grid);
printGrid(gridAfterAttempt, "After attempting to add tile");
console.log("✓ Grid should remain unchanged (no empty cells)");

// Check if grids are equal
let same = true;
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 4; c++) {
    if (grid[r][c] !== gridAfterAttempt[r][c]) same = false;
  }
}
console.log("Grids are identical:", same);
