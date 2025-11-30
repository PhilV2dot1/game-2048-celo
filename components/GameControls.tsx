"use client";

import { motion } from "framer-motion";

type GamePhase = 'playing' | 'won' | 'lost';

interface GameControlsProps {
  onNewGame: () => void;
  onContinue?: () => void;
  onSubmitScore?: () => void;
  gamePhase: GamePhase;
  mode: 'free' | 'onchain';
  disabled: boolean;
  canContinue?: boolean;
}

export function GameControls({
  onNewGame,
  onContinue,
  onSubmitScore,
  gamePhase,
  mode,
  disabled,
  canContinue,
}: GameControlsProps) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      {/* Continue Button (after winning) */}
      {canContinue && onContinue && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          disabled={disabled}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
        >
          CONTINUE PLAYING
        </motion.button>
      )}

      {/* New Game Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onNewGame}
        disabled={disabled}
        className="bg-gradient-to-r from-celo-yellow to-yellow-400 text-gray-900 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
      >
        {gamePhase === 'playing' ? 'NEW GAME' : 'PLAY AGAIN'}
      </motion.button>

      {/* Submit Score (on-chain mode, game over) */}
      {mode === 'onchain' && gamePhase !== 'playing' && onSubmitScore && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSubmitScore}
          disabled={disabled}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
        >
          {disabled ? 'SUBMITTING...' : 'SUBMIT SCORE ON-CHAIN'}
        </motion.button>
      )}

      {/* Mobile hint */}
      {gamePhase === 'playing' && (
        <p className="text-center text-gray-600 text-sm sm:text-base mt-2">
          <span className="sm:hidden">Swipe to move tiles</span>
          <span className="hidden sm:inline">Use arrow keys to move tiles</span>
        </p>
      )}
    </div>
  );
}
