"use client";

import { motion } from "framer-motion";

type GamePhase = 'playing' | 'won' | 'lost';

interface GameControlsProps {
  onNewGame: () => void;
  onContinue?: () => void;
  onSubmitScore?: () => void;
  onPlayOnChain?: () => void;
  onAbandonGame?: () => void;
  gamePhase: GamePhase;
  mode: 'free' | 'onchain';
  disabled: boolean;
  canContinue?: boolean;
  isConnected?: boolean;
  hasActiveOnChainGame?: boolean;
}

export function GameControls({
  onNewGame,
  onContinue,
  onSubmitScore,
  onPlayOnChain,
  onAbandonGame,
  gamePhase,
  mode,
  disabled,
  canContinue,
  isConnected,
  hasActiveOnChainGame,
}: GameControlsProps) {
  return (
    <div className="mt-3 sm:mt-4 flex flex-col gap-2 sm:gap-3">
      {/* Abandon Game Button (on-chain mode, has active game) */}
      {mode === 'onchain' && isConnected && hasActiveOnChainGame && onAbandonGame && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-3 sm:p-4">
          <p className="text-orange-800 text-xs sm:text-sm font-semibold mb-2">
            ⚠️ Active on-chain game detected
          </p>
          <p className="text-orange-700 text-xs mb-3">
            You have an incomplete on-chain game. Abandon it to start fresh.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onAbandonGame}
            disabled={disabled}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all text-xs sm:text-sm"
          >
            {disabled ? 'ABANDONING...' : '🔄 ABANDON & RESET GAME'}
          </motion.button>
        </div>
      )}

      {/* Continue Button (after winning) */}
      {canContinue && onContinue && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          disabled={disabled}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all text-sm sm:text-base"
        >
          CONTINUE PLAYING
        </motion.button>
      )}

      {/* Start On-Chain Game Button (on-chain mode, connected, at start, NO active game) */}
      {mode === 'onchain' && isConnected && onPlayOnChain && gamePhase === 'playing' && !hasActiveOnChainGame && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onPlayOnChain}
          disabled={disabled}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all text-sm sm:text-base"
        >
          {disabled ? 'STARTING...' : '🎲 START GAME (0.01 CELO)'}
        </motion.button>
      )}

      {/* New Game Button (free mode or after game ends) */}
      {(mode === 'free' || gamePhase !== 'playing') && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onNewGame}
          disabled={disabled}
          className="bg-gradient-to-r from-celo-yellow to-yellow-400 text-gray-900 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all text-sm sm:text-base"
        >
          {gamePhase === 'playing' ? 'NEW GAME' : 'PLAY AGAIN'}
        </motion.button>
      )}

      {/* Submit Score (on-chain mode, game over) */}
      {mode === 'onchain' && gamePhase !== 'playing' && onSubmitScore && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSubmitScore}
          disabled={disabled}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all text-sm sm:text-base"
        >
          {disabled ? 'SUBMITTING...' : 'SUBMIT SCORE'}
        </motion.button>
      )}

      {/* Mobile hint - More subtle */}
      {gamePhase === 'playing' && (
        <p className="text-center text-gray-500 text-xs sm:text-sm mt-1">
          <span className="sm:hidden">Swipe to move</span>
          <span className="hidden sm:inline">Use arrow keys to move</span>
        </p>
      )}
    </div>
  );
}
