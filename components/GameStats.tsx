import type { GameStats as Stats } from "@/lib/farcaster";

interface GameStatsProps {
  stats: Stats;
  mode: 'free' | 'onchain';
  bestScore: number;
}

export function GameStats({ stats, mode, bestScore }: GameStatsProps) {
  const winRate = stats.totalGames > 0 ? ((stats.wins / stats.totalGames) * 100).toFixed(1) : '0.0';

  return (
    <div
      className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border-2 border-gray-300"
      style={{
        boxShadow: "0 0 0 1px rgba(252, 255, 82, 0.3), 0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      }}
    >
      <h3 className="text-xl font-bold text-center mb-4 text-gray-900">Statistics</h3>

      {/* High Score */}
      <div
        className="mb-4 p-3 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg border-2 border-celo-yellow/50"
        style={{
          boxShadow: "0 0 0 1px rgba(252, 255, 82, 0.2)"
        }}
      >
        <div className="text-sm text-gray-700 font-medium text-center">High Score</div>
        <div className="text-3xl font-bold text-center text-gray-900">{bestScore}</div>
      </div>

      {/* Game stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatItem label="Wins" value={stats.wins} color="text-green-600" />
        <StatItem label="Losses" value={stats.losses} color="text-red-600" />
      </div>

      {/* Total games */}
      <div className="mb-4 text-center p-2 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">Total Games</div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalGames}</div>
      </div>

      {/* Win rate */}
      <div className="pt-4 border-t border-gray-300">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Win Rate</div>
          <div className="text-3xl font-bold text-gray-900">{winRate}%</div>
        </div>
      </div>

      {/* Streaks (on-chain only) */}
      {mode === 'onchain' && (stats.currentStreak !== 0 || stats.bestStreak > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-600">Current</div>
              <div className={`text-lg font-bold ${stats.currentStreak > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.currentStreak > 0 ? '+' : ''}{stats.currentStreak}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600">Best Streak</div>
              <div className="text-lg font-bold text-purple-600">{stats.bestStreak}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center p-2 bg-gray-50 rounded-lg">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
