import React, { useState } from 'react';
import type { Player } from '../types';
import PixelAvatar from './PixelAvatar';
import { ChevronUp, ChevronDown, Edit2 } from 'lucide-react';
import clsx from 'clsx';

interface DataGridProps {
  players: Player[];
  onReRank: (player: Player, newRank: number) => void;
  onEdit: (player: Player) => void;
  isSortedByRank: boolean;
}

type SortKey = Exclude<keyof Player, 'visualTraits'>;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const SortIcon = ({ column, sortConfig }: { column: SortKey, sortConfig: SortConfig }) => {
  if (sortConfig.key !== column) return <div className="w-4 h-4 opacity-0 group-hover:opacity-20" />;
  return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-gold" />;
};

const HeaderCell = ({ 
  column, 
  label, 
  sortConfig, 
  handleSort, 
  align = 'left' 
}: { 
  column: SortKey, 
  label: string, 
  sortConfig: SortConfig, 
  handleSort: (key: SortKey) => void, 
  align?: string 
}) => (
  <th 
    className={clsx(
      "bg-mid-purple text-white font-header text-xs uppercase tracking-wider py-4 px-4 cursor-pointer hover:bg-white/5 transition-colors group sticky top-0 z-10 border-b-2 border-gold text-left",
      align === 'center' && "text-center",
      align === 'right' && "text-right"
    )}
    onClick={() => handleSort(column)}
  >
    <div className={clsx("flex items-center gap-2", align === 'center' && "justify-center", align === 'right' && "justify-end")}>
      {label}
      <SortIcon column={column} sortConfig={sortConfig} />
    </div>
  </th>
);

const RankEditor = ({ rank, onSave }: { rank: number, onSave: (newRank: number) => void }) => {
  const [value, setValue] = useState(rank.toString());
  const [isEditing, setIsEditing] = useState(false);

  if (!isEditing) {
    return (
      <button 
        onClick={() => setIsEditing(true)}
        className="font-body text-xl text-gold/80 font-bold w-full hover:text-gold hover:scale-110 transition-all"
      >
        {rank}
      </button>
    );
  }

  return (
    <input
      autoFocus
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        onSave(parseInt(value) || rank);
        setIsEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSave(parseInt(value) || rank);
          setIsEditing(false);
        }
        if (e.key === 'Escape') setIsEditing(false);
      }}
      className="w-12 bg-deep-purple border-2 border-gold text-gold font-body text-xl text-center rounded focus:outline-none"
    />
  );
};

const DataGrid: React.FC<DataGridProps> = ({ players, onReRank, onEdit, isSortedByRank }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rank', direction: 'asc' });

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedPlayers = React.useMemo(() => {
    const sorted = [...players];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [players, sortConfig]);

  if (players.length === 0) {
    return (
      <div className="bg-mid-purple/50 rounded-2xl p-12 text-center border-2 border-dashed border-white/10">
        <p className="font-header text-gold">No prospects found.</p>
        <p className="font-body text-white/50 mt-2">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-mid-purple border-2 border-gold rounded-2xl shadow-retro overflow-hidden flex flex-col h-full max-h-[calc(100vh-14rem)]">
      <div className="overflow-auto custom-scrollbar flex-1">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <HeaderCell column="rank" label="Rank" align="center" sortConfig={sortConfig} handleSort={handleSort} />
              <th className="bg-mid-purple text-white font-header text-xs uppercase tracking-wider py-4 px-4 border-b-2 border-gold text-center w-16">Icon</th>
              <HeaderCell column="name" label="Player" sortConfig={sortConfig} handleSort={handleSort} />
              <HeaderCell column="position" label="Pos" align="center" sortConfig={sortConfig} handleSort={handleSort} />
              <HeaderCell column="school" label="School" sortConfig={sortConfig} handleSort={handleSort} />
              <th className="bg-mid-purple text-white font-header text-xs uppercase tracking-wider py-4 px-4 border-b-2 border-gold text-left w-1/3">Scouting Report</th>
              <th className="bg-mid-purple border-b-2 border-gold w-12"></th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player) => (
              <tr 
                key={player.id} 
                className="border-b border-white/5 hover:bg-white/5 transition-colors group"
              >
                <td className="py-4 px-4 w-16 text-center">
                  {isSortedByRank ? (
                    <RankEditor rank={player.rank} onSave={(newRank) => onReRank(player, newRank)} />
                  ) : (
                    <span className="font-body text-xl text-gold/60">{player.rank}</span>
                  )}
                </td>
                <td className="py-4 px-4 flex justify-center">
                  <PixelAvatar name={player.name} traits={player.visualTraits} size={40} />
                </td>
                <td className="py-4 px-4 font-header text-sm text-white">
                  {player.name}
                </td>
                <td className="py-4 px-4 font-body text-lg text-center">
                  <span className="bg-deep-purple px-2 py-1 rounded text-gold border border-white/10">
                    {player.position}
                  </span>
                </td>
                <td className="py-4 px-4 font-body text-lg text-white/80">
                  {player.school}
                </td>
                <td className="py-4 px-4 relative group/notes">
                  <div className="font-body text-lg text-white/70 line-clamp-2 group-hover/notes:line-clamp-none transition-all duration-300">
                    {player.notes}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <button 
                    onClick={() => onEdit(player)}
                    className="opacity-0 group-hover:opacity-100 text-gold hover:scale-110 transition-all p-2"
                  >
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataGrid;
