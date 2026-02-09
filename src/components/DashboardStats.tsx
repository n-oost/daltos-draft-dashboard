import React, { useMemo } from 'react';
import type { Player } from '../types';
import { Trophy, Users, School } from 'lucide-react';

interface DashboardStatsProps {
  players: Player[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ players }) => {
  const stats = useMemo(() => {
    if (players.length === 0) return { total: 0, topPos: '-', topSchool: '-' };

    const total = players.length;

    // Mode helper
    const getMode = (arr: string[]) => {
      const counts: Record<string, number> = {};
      let maxCount = 0;
      let mode = '-';
      for (const item of arr) {
        counts[item] = (counts[item] || 0) + 1;
        if (counts[item] > maxCount) {
          maxCount = counts[item];
          mode = item;
        }
      }
      return mode;
    };

    const topPos = getMode(players.map(p => p.position));
    const topSchool = getMode(players.map(p => p.school));

    return { total, topPos, topSchool };
  }, [players]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card 1: Total Picks */}
      <div className="bg-mid-purple border-2 border-gold rounded-2xl p-6 shadow-retro flex items-center justify-between">
        <div>
          <h3 className="font-header text-gold text-sm mb-2 uppercase tracking-wider">Total Picks</h3>
          <p className="font-body text-4xl text-white">{stats.total}</p>
        </div>
        <div className="bg-deep-purple p-3 rounded-xl border border-white/10">
          <Users className="text-gold w-8 h-8" />
        </div>
      </div>

      {/* Card 2: Top Position */}
      <div className="bg-mid-purple border-2 border-gold rounded-2xl p-6 shadow-retro flex items-center justify-between">
        <div>
          <h3 className="font-header text-gold text-sm mb-2 uppercase tracking-wider">Top Position</h3>
          <p className="font-body text-4xl text-white">{stats.topPos}</p>
        </div>
        <div className="bg-deep-purple p-3 rounded-xl border border-white/10">
          <Trophy className="text-gold w-8 h-8" />
        </div>
      </div>

      {/* Card 3: Top School */}
      <div className="bg-mid-purple border-2 border-gold rounded-2xl p-6 shadow-retro flex items-center justify-between">
        <div>
          <h3 className="font-header text-gold text-sm mb-2 uppercase tracking-wider">Top School</h3>
          <p className="font-body text-2xl text-white truncate max-w-[150px]" title={stats.topSchool}>
            {stats.topSchool}
          </p>
        </div>
        <div className="bg-deep-purple p-3 rounded-xl border border-white/10">
          <School className="text-gold w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
