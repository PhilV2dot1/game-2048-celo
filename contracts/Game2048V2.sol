// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Game2048V2
 * @dev Smart contract for playing 2048 on-chain with game start transactions
 * @notice Players must pay to start a game, then can submit their score
 */
contract Game2048V2 {
    uint256 public constant GAME_FEE = 0.01 ether; // Cost to start a game (~$0.01 USD)

    struct PlayerStats {
        uint256 highScore;
        uint256 wins;       // Games reaching 2048
        uint256 losses;     // Games not reaching 2048
        uint256 totalGames;
        int256 currentStreak;
        uint256 bestStreak;
        uint256 lastPlayed;
    }

    struct ActiveGame {
        bool exists;
        uint256 startTime;
    }

    mapping(address => PlayerStats) public playerStats;
    mapping(address => ActiveGame) public activeGames;

    uint256 public totalFeesCollected;

    event GameStarted(address indexed player, uint256 timestamp);
    event ScoreSubmitted(
        address indexed player,
        uint256 score,
        bool reachedGoal,
        uint256 timestamp
    );
    event GameAbandoned(address indexed player, uint256 timestamp);

    /**
     * @dev Start a new on-chain game by paying the fee
     */
    function startGame() external payable {
        require(msg.value == GAME_FEE, "Incorrect game fee");
        require(!activeGames[msg.sender].exists, "Game already in progress");

        activeGames[msg.sender] = ActiveGame({
            exists: true,
            startTime: block.timestamp
        });

        totalFeesCollected += msg.value;

        emit GameStarted(msg.sender, block.timestamp);
    }

    /**
     * @dev Submit a game score to the blockchain
     * @param score The final score achieved in the game
     * @param reachedGoal Whether the player reached the 2048 tile
     */
    function submitScore(uint256 score, bool reachedGoal) external {
        require(score > 0, "Invalid score");
        require(activeGames[msg.sender].exists, "No active game - start a game first");

        // Clear active game
        delete activeGames[msg.sender];

        PlayerStats storage stats = playerStats[msg.sender];

        // Update high score
        if (score > stats.highScore) {
            stats.highScore = score;
        }

        // Update win/loss record
        if (reachedGoal) {
            stats.wins++;
            stats.currentStreak = stats.currentStreak >= 0 ? stats.currentStreak + 1 : int256(1);
        } else {
            stats.losses++;
            stats.currentStreak = stats.currentStreak <= 0 ? stats.currentStreak - 1 : int256(-1);
        }

        // Update best streak
        uint256 absStreak = stats.currentStreak >= 0
            ? uint256(stats.currentStreak)
            : uint256(-stats.currentStreak);
        if (absStreak > stats.bestStreak) {
            stats.bestStreak = absStreak;
        }

        stats.totalGames++;
        stats.lastPlayed = block.timestamp;

        emit ScoreSubmitted(msg.sender, score, reachedGoal, block.timestamp);
    }

    /**
     * @dev Abandon the current active game
     * @notice This will count as a loss but allows starting a new game
     */
    function abandonGame() external {
        // If no active game, silently return (no revert)
        if (!activeGames[msg.sender].exists) {
            return;
        }

        // Clear active game
        delete activeGames[msg.sender];

        PlayerStats storage stats = playerStats[msg.sender];

        // Count as a loss
        stats.losses++;
        stats.totalGames++;
        stats.currentStreak = stats.currentStreak <= 0 ? stats.currentStreak - 1 : int256(-1);
        stats.lastPlayed = block.timestamp;

        emit GameAbandoned(msg.sender, block.timestamp);
    }

    /**
     * @dev Get player statistics
     * @param player The address of the player
     * @return highScore The player's highest score
     * @return wins Number of wins (games reaching 2048)
     * @return losses Number of losses
     * @return totalGames Total games played
     * @return winRate Win percentage (0-100)
     * @return currentStreak Current win/loss streak (positive = wins, negative = losses)
     * @return bestStreak Best streak achieved
     */
    function getStats(address player) external view returns (
        uint256 highScore,
        uint256 wins,
        uint256 losses,
        uint256 totalGames,
        uint256 winRate,
        int256 currentStreak,
        uint256 bestStreak
    ) {
        PlayerStats memory stats = playerStats[player];
        uint256 rate = stats.totalGames > 0
            ? (stats.wins * 100) / stats.totalGames
            : 0;

        return (
            stats.highScore,
            stats.wins,
            stats.losses,
            stats.totalGames,
            rate,
            stats.currentStreak,
            stats.bestStreak
        );
    }

    /**
     * @dev Check if player has an active game
     * @param player The address to check
     * @return exists Whether the player has an active game
     * @return startTime When the game was started
     */
    function hasActiveGame(address player) external view returns (bool exists, uint256 startTime) {
        ActiveGame memory game = activeGames[player];
        return (game.exists, game.startTime);
    }
}
