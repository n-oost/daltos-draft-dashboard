import { useEffect, useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import DashboardStats from './components/DashboardStats';
import DataGrid from './components/DataGrid';
import NewPlayerModal from './components/NewPlayerModal';
import type { Player } from './types';
import { parseCSV } from './utils/csvParser';
import { Menu } from 'lucide-react';
import { db } from './db';
import { syncMasterData } from './utils/dataLoader';
import { useLiveQuery } from 'dexie-react-hooks';

function App() {
  const [loading, setLoading] = useState(true);

  // UI State
  const [selectedYear, setSelectedYear] = useState(2025);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Dexie Queries
  // This automatically updates when the DB changes
  const dbPlayers = useLiveQuery(
    () => db.myPlayers.where('year').equals(selectedYear).toArray(),
    [selectedYear]
  );
  
  // Available years - simple distinct query
  const availableYears = useLiveQuery(async () => {
    const players = await db.myPlayers.toArray();
    const years = new Set(players.map(p => p.year));
    // Always include 2025
    years.add(2025);
    return Array.from(years).sort((a, b) => a - b);
  });

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        console.log('Opening Database...');
        await db.open();
        
        // 1. Sync Master Data (nflverse)
        await syncMasterData();

        // 2. Check if we need to seed initial 2025 CSV data
        const count = await db.myPlayers.where('year').equals(2025).count();
        console.log(`Current 2025 player count: ${count}`);
        if (count === 0) {
            console.log('Fetching initial CSV...');
            const csvData = await parseCSV('/nfl_draft_2025.csv');
            console.log(`Parsed ${csvData.length} players from CSV`);
            await db.myPlayers.bulkAdd(csvData);
            console.log('Seeded 2025 CSV data into IndexedDB');
        }

      } catch (err) {
        console.error('CRITICAL: Initialization failed:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const allPositions = useMemo(() => {
    if (!dbPlayers) return [];
    const posSet = new Set(dbPlayers.map(p => p.position));
    return Array.from(posSet).sort();
  }, [dbPlayers]);

  const filteredPlayers = useMemo(() => {
    if (!dbPlayers) return [];
    return dbPlayers.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            player.school.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPosition = selectedPositions.length === 0 || selectedPositions.includes(player.position);

      return matchesSearch && matchesPosition;
    });
  }, [dbPlayers, searchQuery, selectedPositions]);

  const handleAddOrUpdatePlayer = async (playerData: Omit<Player, 'rank' | 'year' | 'id'>, id?: string) => {
    if (id) {
      // Update
      await db.myPlayers.update(id, playerData);
    } else {
      // Add New
      const existing = await db.myPlayers.where('year').equals(selectedYear).toArray();
      const existingRanks = existing.map(p => p.rank);
      const nextRank = existingRanks.length > 0 ? Math.max(...existingRanks) + 1 : 1;
      
      const newId = `local-${selectedYear}-${Date.now()}`;
      
      await db.myPlayers.add({
        ...playerData,
        id: newId,
        rank: nextRank,
        year: selectedYear
      });
    }
    setEditingPlayer(null);
  };

  const handleReRank = async (targetPlayer: Player, newRank: number) => {
    if (newRank === targetPlayer.rank) return;
    if (!dbPlayers) return;

    const oldRank = targetPlayer.rank;
    const isIncreasing = newRank > oldRank;

    // Transaction to ensure safety
    await db.transaction('rw', db.myPlayers, async () => {
        // 1. Shift others
        const playersToShift = dbPlayers.filter(p => {
             if (isIncreasing) return p.rank > oldRank && p.rank <= newRank;
             else return p.rank >= newRank && p.rank < oldRank;
        });

        for (const p of playersToShift) {
            await db.myPlayers.update(p.id, { rank: isIncreasing ? p.rank - 1 : p.rank + 1 });
        }

        // 2. Update target
        await db.myPlayers.update(targetPlayer.id, { rank: newRank });
    });
  };

  const handleAddNewYear = () => {
    const nextYear = (availableYears && availableYears.length > 0) ? Math.max(...availableYears) + 1 : 2026;
    // We don't actually need to "create" a year in the DB, just select it.
    // The DB stores players, not years. First player added will "create" it.
    setSelectedYear(nextYear);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-purple flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="font-header text-gold animate-pulse text-sm">SYNCING MASTER DATABASE...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-purple text-white p-4 md:p-8 font-sans selection:bg-gold selection:text-deep-purple">
      <div className="max-w-[1600px] mx-auto flex gap-8 h-full">
        
        {/* Sidebar */}
        <Sidebar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedPositions={selectedPositions}
          setSelectedPositions={setSelectedPositions}
          allPositions={allPositions}
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          allYears={availableYears || [2025]}
          onAddNewYear={handleAddNewYear}
          onOpenAddPlayer={() => {
            setEditingPlayer(null);
            setIsModalOpen(true);
          }}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-gold hover:text-white transition-colors"
              >
                <Menu />
              </button>
              <div>
                <h1 className="font-header text-2xl md:text-3xl text-white drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)] leading-tight">
                  <span className="text-gold">Daltos</span> Draft Board '{selectedYear.toString().slice(-2)}
                </h1>
                <p className="font-body text-white/50 text-lg">Official Scouting Department | {selectedYear} Edition</p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="px-4 py-2 bg-mid-purple rounded-lg border border-gold/30 text-gold font-body text-sm animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                INDEXEDDB CONNECTED
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          <DashboardStats players={filteredPlayers} />

          {/* Main Grid */}
          <DataGrid 
            players={filteredPlayers} 
            onReRank={handleReRank}
            onEdit={(p) => {
                setEditingPlayer(p);
                setIsModalOpen(true);
            }}
            isSortedByRank={true}
          />
        </main>
      </div>

      <NewPlayerModal 
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setEditingPlayer(null);
        }}
        onSave={handleAddOrUpdatePlayer}
        year={selectedYear}
        editingPlayer={editingPlayer}
      />
    </div>
  );
}

export default App;