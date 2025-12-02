"use client";

import { use2048 } from "@/hooks/use2048";
import { GameGrid } from "@/components/GameGrid";
import { GameControls } from "@/components/GameControls";
import { GameStats } from "@/components/GameStats";
import { ModeToggle } from "@/components/ModeToggle";
import { WalletConnect } from "@/components/WalletConnect";
import { FarcasterShare } from "@/components/FarcasterShare";
import { ShareAppButton } from "@/components/ShareAppButton";
import { GameMessage } from "@/components/GameMessage";

export default function Home() {
  const {
    mode,
    gamePhase,
    grid,
    score,
    bestScore,
    message,
    stats,
    canContinue,
    isPending,
    isConnected,
    address,
    newGame,
    continueGame,
    submitScoreOnChain,
    playOnChain,
    switchMode,
  } = use2048();

  return (
    <div className="min-h-screen p-2 sm:p-6 bg-gradient-to-br from-gray-100 via-gray-50 to-yellow-50/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-2 sm:mb-4">
          <h1 className="text-3xl sm:text-5xl font-bold text-center text-gray-900 mb-1">
            2048 on Celo
          </h1>
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Swipe to merge tiles and reach 2048!
          </p>
        </header>

        {/* Mode Toggle & Wallet Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
          <div className="flex justify-center gap-2">
            <ModeToggle mode={mode} onModeChange={switchMode} />
            <ShareAppButton />
          </div>

          {/* Connected Wallet Display */}
          {mode === 'onchain' && isConnected && address && (
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-celo-yellow shadow-sm text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-mono text-gray-800 font-medium">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          )}
        </div>

        {/* Wallet Connection (On-Chain Mode Only) */}
        {mode === 'onchain' && !isConnected && (
          <div className="mb-3">
            <WalletConnect />
          </div>
        )}

        {/* Score Display */}
        <div className="flex gap-3 mb-3 justify-center">
          <div className="bg-white/90 px-6 py-3 rounded-xl border-2 border-gray-300 shadow-md">
            <div className="text-xs text-gray-600 text-center font-semibold">SCORE</div>
            <div className="text-2xl sm:text-3xl font-bold text-center text-gray-900">{score}</div>
          </div>
          <div className="bg-gradient-to-r from-celo-yellow/30 to-yellow-300/30 px-6 py-3 rounded-xl border-2 border-celo-yellow shadow-md">
            <div className="text-xs text-gray-700 text-center font-semibold">BEST</div>
            <div className="text-2xl sm:text-3xl font-bold text-center text-gray-900">{bestScore}</div>
          </div>
        </div>

        {/* Game Message */}
        {message && (
          <div className="mb-3">
            <GameMessage message={message} />
          </div>
        )}

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-3">
          {/* Game Grid (spans 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <GameGrid grid={grid} />

            {/* Game Controls */}
            <GameControls
              onNewGame={newGame}
              onContinue={canContinue ? continueGame : undefined}
              onSubmitScore={mode === 'onchain' ? submitScoreOnChain : undefined}
              onPlayOnChain={mode === 'onchain' ? playOnChain : undefined}
              gamePhase={gamePhase}
              mode={mode}
              disabled={isPending}
              canContinue={canContinue}
              isConnected={isConnected}
            />
          </div>

          {/* Stats Sidebar - Hidden on mobile when game is active */}
          <div className={`${gamePhase === 'playing' && !canContinue ? 'hidden lg:block' : ''}`}>
            <GameStats stats={stats} mode={mode} bestScore={bestScore} />
          </div>
        </div>

        {/* Farcaster Share (when game is finished) */}
        {(gamePhase === 'won' || gamePhase === 'lost') && (
          <div className="mb-3">
            <FarcasterShare gamePhase={gamePhase} score={score} stats={stats} />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-500 text-xs mt-4 sm:mt-8 pb-4">
          <p className="hidden sm:block">
            Built with ❤️ on{" "}
            <a
              href="https://celo.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 font-semibold hover:text-celo-yellow transition-colors"
            >
              Celo
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
