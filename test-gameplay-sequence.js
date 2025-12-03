// Test complete gameplay sequences, especially endgame

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

function gridsEqual(grid1, grid2) {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid1[row][col] !== grid2[row][col]) return false;
    }
  }
  return true;
}

function mergeLineLeft(line) {
  const nonZero = line.filter(val => val !== 0);
  const merged = [];
  let score = 0;
  let i = 0;

  while (i < nonZero.length) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const mergedValue = nonZero[i] * 2;
      merged.push(mergedValue);
      score += mergedValue;
      i += 2;
    } else {
      merged.push(nonZero[i]);
      i += 1;
    }
  }

  while (merged.length < GRID_SIZE) {
    merged.push(0);
  }

  return { newLine: merged, score };
}

function mergeLineRight(line) {
  const nonZero = line.filter(val => val !== 0);
  const merged = [];
  let score = 0;
  let i = nonZero.length - 1;

  while (i >= 0) {
    if (i - 1 >= 0 && nonZero[i] === nonZero[i - 1]) {
      const mergedValue = nonZero[i] * 2;
      merged.unshift(mergedValue);
      score += mergedValue;
      i -= 2;
    } else {
      merged.unshift(nonZero[i]);
      i -= 1;
    }
  }

  while (merged.length < GRID_SIZE) {
    merged.unshift(0);
  }

  return { newLine: merged, score };
}

function move(grid, direction) {
  const newGrid = createEmptyGrid();
  let totalScore = 0;

  switch (direction) {
    case 'left':
      for (let row = 0; row < GRID_SIZE; row++) {
        const { newLine, score } = mergeLineLeft(grid[row]);
        newGrid[row] = newLine;
        totalScore += score;
      }
      break;

    case 'right':
      for (let row = 0; row < GRID_SIZE; row++) {
        const { newLine, score } = mergeLineRight(grid[row]);
        newGrid[row] = newLine;
        totalScore += score;
      }
      break;

    case 'up':
      for (let col = 0; col < GRID_SIZE; col++) {
        const column = [grid[0][col], grid[1][col], grid[2][col], grid[3][col]];
        const { newLine, score } = mergeLineLeft(column);
        for (let row = 0; row < GRID_SIZE; row++) {
          newGrid[row][col] = newLine[row];
        }
        totalScore += score;
      }
      break;

    case 'down':
      for (let col = 0; col < GRID_SIZE; col++) {
        const column = [grid[0][col], grid[1][col], grid[2][col], grid[3][col]];
        const { newLine, score } = mergeLineRight(column);
        for (let row = 0; row < GRID_SIZE; row++) {
          newGrid[row][col] = newLine[row];
        }
        totalScore += score;
      }
      break;
  }

  const moved = !gridsEqual(grid, newGrid);
  return { newGrid, score: totalScore, moved };
}

function addRandomTile(grid) {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return grid;

  const { row, col } = emptyCells[0]; // Use first empty cell for deterministic testing
  const value = 2; // Always use 2 for predictable testing

  const newGrid = grid.map(r => [...r]);
  newGrid[row][col] = value;
  return newGrid;
}

function printGrid(grid, label) {
  console.log(`\n${label}:`);
  grid.forEach((row, i) => console.log(`  ${row.join('\t')}`));
}

// ==========================
// TEST 1: Simulate gameplay sequence with grid nearly full
// ==========================
console.log("=== TEST 1: Gameplay sequence - grid nearly full ===");

let grid = [
  [2, 4, 8, 16],
  [32, 64, 128, 256],
  [512, 1024, 2, 4],
  [8, 16, 0, 0]  // 2 empty cells
];

printGrid(grid, "Initial grid (2 empty cells)");
console.log("Empty cells:", getEmptyCells(grid).length);
console.log("Has valid moves:", hasValidMoves(grid));

// Simulate move sequence exactly as in the hook
console.log("\n--- Move 1: RIGHT ---");
let result = move(grid, 'right');
console.log("Moved:", result.moved);
console.log("Score from move:", result.score);

if (result.moved) {
  printGrid(result.newGrid, "After move (before adding tile)");

  const gridWithNew = addRandomTile(result.newGrid);
  printGrid(gridWithNew, "After adding tile");
  console.log("Empty cells:", getEmptyCells(gridWithNew).length);
  console.log("Has valid moves:", hasValidMoves(gridWithNew));

  grid = gridWithNew; // Update for next move
}

// Try another move
console.log("\n--- Move 2: DOWN ---");
result = move(grid, 'down');
console.log("Moved:", result.moved);
console.log("Score from move:", result.score);

if (result.moved) {
  printGrid(result.newGrid, "After move (before adding tile)");

  const gridWithNew = addRandomTile(result.newGrid);
  printGrid(gridWithNew, "After adding tile");
  console.log("Empty cells:", getEmptyCells(gridWithNew).length);
  console.log("Has valid moves:", hasValidMoves(gridWithNew));

  grid = gridWithNew;
}

// ==========================
// TEST 2: Grid with only 1 empty cell - test move sequence
// ==========================
console.log("\n\n=== TEST 2: Grid with 1 empty cell - move sequence ===");

grid = [
  [2, 4, 8, 16],
  [32, 64, 128, 256],
  [512, 1024, 2048, 4],
  [8, 16, 32, 0]  // 1 empty cell
];

printGrid(grid, "Initial grid (1 empty cell)");
console.log("Empty cells:", getEmptyCells(grid).length);
console.log("Has valid moves:", hasValidMoves(grid));

// Try moving left (tiles should slide)
console.log("\n--- Move: LEFT ---");
result = move(grid, 'left');
console.log("Moved:", result.moved);

if (result.moved) {
  printGrid(result.newGrid, "After move (before adding tile)");
  console.log("Empty cells after move:", getEmptyCells(result.newGrid).length);

  const gridWithNew = addRandomTile(result.newGrid);
  printGrid(gridWithNew, "After adding tile");
  console.log("Empty cells after adding tile:", getEmptyCells(gridWithNew).length);
  console.log("Has valid moves:", hasValidMoves(gridWithNew));
  console.log("✓ This should detect game over if no adjacent matches");
}

// ==========================
// TEST 3: Test vertical moves with 3 full rows
// ==========================
console.log("\n\n=== TEST 3: Vertical moves with 3 full bottom rows ===");

grid = [
  [0, 0, 0, 0],      // Top row empty
  [2, 4, 8, 16],     // Full
  [32, 64, 128, 256],// Full
  [512, 2, 4, 8]     // Full
];

printGrid(grid, "Initial grid (3 bottom rows full)");

console.log("\n--- Move: DOWN ---");
result = move(grid, 'down');
console.log("Moved:", result.moved);
printGrid(result.newGrid, "After DOWN");

console.log("\n--- Move: UP from same grid ---");
grid = [
  [0, 0, 0, 0],
  [2, 4, 8, 16],
  [32, 64, 128, 256],
  [512, 2, 4, 8]
];
result = move(grid, 'up');
console.log("Moved:", result.moved);
printGrid(result.newGrid, "After UP");
console.log("✓ Tiles should move up, no wrapping or reappearing");

// ==========================
// TEST 4: Test scenario that might cause issues
// ==========================
console.log("\n\n=== TEST 4: Edge case - No move possible ===");

grid = [
  [2, 4, 8, 16],
  [32, 64, 128, 256],
  [512, 1024, 2048, 4],
  [8, 16, 32, 64]
];

printGrid(grid, "Full grid, no adjacent matches");
console.log("Has valid moves:", hasValidMoves(grid));

console.log("\n--- Try move: RIGHT ---");
result = move(grid, 'right');
console.log("Moved:", result.moved);
console.log("✓ Should NOT move (no valid moves)");

if (!result.moved) {
  console.log("✓ Correctly rejected invalid move");
  console.log("✓ No tile should be added");
  console.log("✓ Game should be over");
}

console.log("\n\n=== All gameplay sequence tests complete ===");
