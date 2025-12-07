"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain } from "wagmi";
import { celo } from "wagmi/chains";
import {
  Grid,
  Direction,
  initializeGame,
  move,
  addRandomTile,
  hasWon,
  hasValidMoves,
} from "@/lib/game-logic";
import { GameStats } from "@/lib/farcaster";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract-abi";

type GamePhase = 'playing' | 'won' | 'lost';
type GameMode = 'free' | 'onchain';

const STORAGE_KEYS = {
  FREE_BEST: 'game2048_free_best',
  FREE_STATS: 'game2048_free_stats',
};

export function use2048() {
  // Game state
  const [mode, setMode] = useState<GameMode>('free');
  const [gamePhase, setGamePhase] = useState<GamePhase>('playing');
  const [grid, setGrid] = useState<Grid>(() => initializeGame().grid);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [message, setMessage] = useState('');
  const [canContinue, setCanContinue] = useState(false);
  const [lastTransactionType, setLastTransactionType] = useState<'startGame' | 'submitScore' | null>(null);

  // Stats (for display)
  const [freeStats, setFreeStats] = useState<GameStats>({
    wins: 0,
    losses: 0,
    totalGames: 0,
    currentStreak: 0,
    bestStreak: 0,
  });

  // Wagmi hooks
  const { address, isConnected, chain } = useAccount();
  const { writeContract, data: hash, isPending, reset: resetWrite } = useWriteContract();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  const { switchChain } = useSwitchChain();

  // Read on-chain stats
  const { data: onchainStats, refetch: refetchStats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getStats',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && mode === 'onchain' && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
      gcTime: 0, // Don't cache - always fetch fresh data
      staleTime: 0, // Consider data immediately stale
    },
  });

  // Check if user has an active on-chain game
  const { data: activeGameData, refetch: refetchActiveGame } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasActiveGame',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && mode === 'onchain' && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
      gcTime: 0, // Don't cache
      staleTime: 0,
    },
  });

  // Load best score and stats from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedBest = localStorage.getItem(STORAGE_KEYS.FREE_BEST);
    if (savedBest) setBestScore(parseInt(savedBest, 10));

    const savedStats = localStorage.getItem(STORAGE_KEYS.FREE_STATS);
    if (savedStats) {
      try {
        setFreeStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Failed to parse saved stats:', e);
      }
    }
  }, []);

  // Update best score when score changes
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      if (mode === 'free' && typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.FREE_BEST, score.toString());
      }
    }
  }, [score, bestScore, mode]);

  // Refetch active game state when wallet connects or address changes
  useEffect(() => {
    if (isConnected && address && mode === 'onchain') {
      console.log('🔄 Wallet connected, refetching active game state...');

      // Immediate refetch
      refetchActiveGame();
      refetchStats();

      // Second refetch after 500ms
      const timer1 = setTimeout(() => {
        console.log('🔄 Second refetch...');
        refetchActiveGame();
        refetchStats();
      }, 500);

      // Third refetch after 1.5s to ensure we have correct state
      const timer2 = setTimeout(() => {
        console.log('🔄 Final refetch...');
        refetchActiveGame();
        refetchStats();
      }, 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isConnected, address, mode, refetchActiveGame, refetchStats]);

  // Check if user has an active on-chain game (compute early)
  const hasActiveOnChainGame = activeGameData ? activeGameData[0] : false;

  // Handle transaction receipt
  useEffect(() => {
    if (receipt) {
      console.log('✅ Transaction receipt received:', receipt.transactionHash);
      console.log('Transaction type:', lastTransactionType);

      // Only process if we have a transaction type (avoid double processing)
      if (!lastTransactionType) {
        console.log('⏭️ Skipping - already processed');
        return;
      }

      // Capture transaction type before clearing it
      const txType = lastTransactionType;

      // Clear the transaction type immediately to prevent double processing
      setLastTransactionType(null);

      // Refetch active game state after any transaction
      refetchActiveGame();
      refetchStats();

      // Show success message
      setMessage('✅ Transaction completed successfully!');

      // Only reset game after submitScore (abandon or real score)
      // Don't reset after startGame - user needs to play!
      if (txType === 'submitScore') {
        setTimeout(() => {
          console.log('🎮 Resetting game state after score submission');
          setGamePhase('playing');
          const { grid: newGrid } = initializeGame();
          setGrid(newGrid);
          setScore(0);
          setCanContinue(false);
        }, 2500);
      } else if (txType === 'startGame') {
        console.log('✅ Game started - ready to play!');
      }

      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  }, [receipt, refetchStats, refetchActiveGame, lastTransactionType]);

  // Update stats when game ends (free mode only) - Defined first to avoid hoisting issues
  const updateStatsOnGameEnd = useCallback((won: boolean) => {
    if (mode !== 'free' || typeof window === 'undefined') return;

    const newStats = { ...freeStats };
    newStats.totalGames++;

    if (won) {
      newStats.wins++;
      newStats.currentStreak = newStats.currentStreak >= 0 ? newStats.currentStreak + 1 : 1;
    } else {
      newStats.losses++;
      newStats.currentStreak = newStats.currentStreak <= 0 ? newStats.currentStreak - 1 : -1;
    }

    // Update best streak
    const absStreak = Math.abs(newStats.currentStreak);
    if (absStreak > newStats.bestStreak) {
      newStats.bestStreak = absStreak;
    }

    setFreeStats(newStats);
    localStorage.setItem(STORAGE_KEYS.FREE_STATS, JSON.stringify(newStats));
  }, [mode, freeStats]);

  // Handle move
  const handleMove = useCallback((direction: Direction) => {
    if (gamePhase === 'lost' || isPending) return;

    const { newGrid, score: moveScore, moved } = move(grid, direction);
    if (!moved) return;

    // Add random tile after move
    const gridWithNew = addRandomTile(newGrid);
    setGrid(gridWithNew);
    setScore(prev => prev + moveScore);

    // Check win condition (only if not already won)
    if (gamePhase !== 'won' && hasWon(gridWithNew)) {
      setGamePhase('won');
      const msg = mode === 'onchain'
        ? '🎉 You reached 2048! Submit your score on-chain!'
        : '🎉 You reached 2048!';
      setMessage(msg);
      setCanContinue(true);
      return;
    }

    // Check lose condition
    if (!hasValidMoves(gridWithNew)) {
      setGamePhase('lost');
      const msg = mode === 'onchain'
        ? '😢 Game Over! You can still submit your score.'
        : '😢 Game Over! No more moves.';
      setMessage(msg);
      updateStatsOnGameEnd(false);
    }
  }, [grid, gamePhase, isPending, mode, updateStatsOnGameEnd]);

  // Continue playing after winning
  const continueGame = useCallback(() => {
    setGamePhase('playing');
    setMessage('');
    setCanContinue(false);
  }, []);

  // Submit score on-chain
  const submitScoreOnChain = useCallback(async () => {
    if (!isConnected) {
      setMessage('❌ Please connect your wallet first');
      return;
    }

    if (!address) {
      setMessage('❌ Wallet address not found');
      return;
    }

    if (mode !== 'onchain') {
      setMessage('❌ Switch to On-Chain mode first');
      return;
    }

    if (gamePhase === 'playing') {
      setMessage('❌ Finish the game first');
      return;
    }

    const reachedGoal = gamePhase === 'won';

    try {
      // Reset previous transaction state
      resetWrite?.();

      // Check if we're on the correct chain (Celo)
      if (chain?.id !== celo.id) {
        setMessage('⚡ Switching to Celo network...');
        try {
          await switchChain?.({ chainId: celo.id });
          // Give wallet time to switch
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (switchError) {
          console.error('Chain switch error:', switchError);
          setMessage('❌ Please switch to Celo network in your wallet');
          return;
        }
      }

      setMessage('⏳ Submitting score on-chain...');
      console.log('📤 Submitting score:', score, 'Won:', reachedGoal);

      // Mark this as a submitScore transaction
      setLastTransactionType('submitScore');

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'submitScore',
        args: [BigInt(score), reachedGoal],
        chainId: celo.id,
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error('❌ Failed to submit score:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Detect state mismatch errors
      if (errorMessage.toLowerCase().includes('simulation') ||
          errorMessage.toLowerCase().includes('no active game') ||
          errorMessage.toLowerCase().includes('invalid')) {
        console.error('❌ State mismatch detected! Forcing refetch...');
        setMessage('🔄 Syncing game state...');

        // Force immediate refetch to correct the state
        refetchActiveGame();
        refetchStats();

        setTimeout(() => {
          refetchActiveGame();
          refetchStats();
          setMessage('');
        }, 1000);
      } else {
        setMessage('❌ Failed to submit score - Please try again');
      }
    }
  }, [isConnected, address, mode, gamePhase, score, chain, switchChain, writeContract, resetWrite, refetchActiveGame, refetchStats]);

  // New game
  const newGame = useCallback(() => {
    // Save stats if game was finished (not abandoned mid-game)
    if (gamePhase === 'won' && mode === 'free') {
      updateStatsOnGameEnd(true);
    }

    const { grid: newGrid, score: initialScore } = initializeGame();
    setGrid(newGrid);
    setScore(initialScore);
    setGamePhase('playing');
    setMessage('');
    setCanContinue(false);
  }, [gamePhase, mode, updateStatsOnGameEnd]);

  // Switch mode
  const switchMode = useCallback((newMode: GameMode) => {
    setMode(newMode);
    if (newMode === 'onchain') {
      setMessage('🎮 On-Chain Mode: Play and submit your score to the blockchain!');
      setTimeout(() => setMessage(''), 3000);
    }
    newGame();
  }, [newGame]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

      e.preventDefault();

      const directionMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      handleMove(directionMap[e.key]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  // Touch input
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      const minDistance = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minDistance) {
        handleMove(deltaX > 0 ? 'right' : 'left');
      } else if (Math.abs(deltaY) > minDistance) {
        handleMove(deltaY > 0 ? 'down' : 'up');
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMove]);

  // Abandon current on-chain game
  const abandonGame = useCallback(async () => {
    if (!isConnected) {
      setMessage('❌ Please connect your wallet first');
      return;
    }

    if (!address) {
      setMessage('❌ Wallet address not found');
      return;
    }

    if (mode !== 'onchain') {
      setMessage('❌ Only for On-Chain mode');
      return;
    }

    try {
      // Reset previous transaction state
      resetWrite?.();

      // Check if we're on the correct chain (Celo)
      if (chain?.id !== celo.id) {
        setMessage('⚡ Switching to Celo network...');
        try {
          await switchChain?.({ chainId: celo.id });
          // Give wallet time to switch
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (switchError) {
          console.error('Chain switch error:', switchError);
          setMessage('❌ Please switch to Celo network in your wallet');
          return;
        }
      }

      setMessage('⏳ Abandoning game on-chain...');
      console.log('📤 Calling abandonGame function');

      // Mark this as a submitScore transaction (abandon counts as submit)
      setLastTransactionType('submitScore');

      // Call the dedicated abandonGame function
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'abandonGame',
        chainId: celo.id,
        gas: BigInt(200000),
      });
    } catch (error) {
      console.error('❌ Failed to abandon game:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Detect state mismatch errors
      if (errorMessage.toLowerCase().includes('simulation') ||
          errorMessage.toLowerCase().includes('no active game') ||
          errorMessage.toLowerCase().includes('invalid')) {
        console.error('❌ State mismatch detected! Forcing refetch...');
        setMessage('🔄 Syncing game state...');

        // Force immediate refetch to correct the state
        refetchActiveGame();
        refetchStats();

        setTimeout(() => {
          refetchActiveGame();
          refetchStats();
          setMessage('');
        }, 1000);
      } else {
        setMessage('❌ Failed to abandon game - Please try again');
      }
    }
  }, [isConnected, address, mode, chain, switchChain, writeContract, resetWrite, refetchActiveGame, refetchStats]);

  // Play on-chain with improved reliability
  const playOnChain = useCallback(async () => {
    if (!isConnected) {
      setMessage('❌ Please connect your wallet first');
      return;
    }

    if (!address) {
      setMessage('❌ Wallet address not found');
      return;
    }

    try {
      // Reset previous transaction state
      resetWrite?.();

      // Check if we're on the correct chain (Celo)
      if (chain?.id !== celo.id) {
        setMessage('⚡ Switching to Celo...');
        try {
          await switchChain?.({ chainId: celo.id });
          // Give wallet time to switch
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (switchError) {
          console.error('Chain switch error:', switchError);
          setMessage('❌ Please switch to Celo network in your wallet');
          return;
        }
      }

      // Show immediate feedback
      setMessage('🎲 Starting your on-chain game...');

      console.log('📤 Sending startGame transaction...');

      // Mark this as a startGame transaction
      setLastTransactionType('startGame');

      // Send transaction with game fee (0.01 CELO)
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'startGame',
        chainId: celo.id,
        gas: BigInt(200000),
        value: BigInt("10000000000000000"), // 0.01 CELO in wei
      });

    } catch (error) {
      console.error('❌ Transaction error:', error);
      setMessage('❌ Transaction failed - Please try again');
    }
  }, [isConnected, address, chain, switchChain, writeContract, resetWrite]);

  // Get current stats (free or on-chain)
  const stats: GameStats = mode === 'onchain' && onchainStats
    ? {
        wins: Number(onchainStats[1]),
        losses: Number(onchainStats[2]),
        totalGames: Number(onchainStats[3]),
        currentStreak: Number(onchainStats[5]),
        bestStreak: Number(onchainStats[6]),
      }
    : freeStats;

  // Get high score display
  const highScore = mode === 'onchain' && onchainStats
    ? Number(onchainStats[0])
    : bestScore;

  return {
    // Game state
    mode,
    gamePhase,
    grid,
    score,
    bestScore: highScore,
    message,
    stats,
    canContinue,
    hasActiveOnChainGame,

    // Wallet state
    address,
    isConnected,
    isPending: isPending || isConfirming,

    // Actions
    handleMove,
    newGame,
    continueGame,
    submitScoreOnChain,
    playOnChain,
    switchMode,
    abandonGame,
    refetchActiveGame,
  };
}
