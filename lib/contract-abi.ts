// Game2048V2 Smart Contract ABI
// Update CONTRACT_ADDRESS after deploying the V2 contract

export const CONTRACT_ADDRESS = "0x617f5d75643FCDDf06A6b84401721CC214aB6723" as `0x${string}`;

export const CONTRACT_ABI = [
  {
    type: "function",
    name: "startGame",
    inputs: [],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "submitScore",
    inputs: [
      { name: "score", type: "uint256" },
      { name: "reachedGoal", type: "bool" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getStats",
    inputs: [{ name: "player", type: "address" }],
    outputs: [
      { name: "highScore", type: "uint256" },
      { name: "wins", type: "uint256" },
      { name: "losses", type: "uint256" },
      { name: "totalGames", type: "uint256" },
      { name: "winRate", type: "uint256" },
      { name: "currentStreak", type: "int256" },
      { name: "bestStreak", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "hasActiveGame",
    inputs: [{ name: "player", type: "address" }],
    outputs: [
      { name: "exists", type: "bool" },
      { name: "startTime", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "GAME_FEE",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "GameStarted",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "ScoreSubmitted",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "score", type: "uint256", indexed: false },
      { name: "reachedGoal", type: "bool", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false }
    ]
  }
] as const;
