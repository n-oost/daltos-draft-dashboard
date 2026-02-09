import React from 'react';
import { Search, Filter, X, Plus } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedPositions: string[];
  setSelectedPositions: (pos: string[]) => void;
  allPositions: string[];
  isOpen: boolean;
  toggleSidebar: () => void;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  allYears: number[];
  onAddNewYear: () => void;
  onOpenAddPlayer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedPositions,
  setSelectedPositions,
  allPositions,
  isOpen,
  toggleSidebar,
  selectedYear,
  setSelectedYear,
  allYears,
  onAddNewYear,
  onOpenAddPlayer,
}) => {
  
  const togglePosition = (pos: string) => {
    if (selectedPositions.includes(pos)) {
      setSelectedPositions(selectedPositions.filter(p => p !== pos));
    } else {
      setSelectedPositions([...selectedPositions, pos]);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={clsx(
          "fixed top-0 left-0 h-full w-80 bg-mid-purple border-r-4 border-gold z-50 transition-transform duration-300 transform shadow-retro md:translate-x-0 md:static md:h-[calc(100vh-2rem)] md:rounded-3xl md:border-4 md:mb-8",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8 md:hidden">
             <h2 className="font-header text-gold text-xl">Filters</h2>
             <button onClick={toggleSidebar} className="text-white hover:text-gold">
               <X />
             </button>
          </div>

          <h2 className="font-header text-gold text-xl mb-6 hidden md:block">Scouting Dept.</h2>

          {/* Year Selection */}
          <div className="mb-8">
            <label className="font-header text-xs text-white/70 mb-2 block uppercase">Select Year</label>
            <div className="flex gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="flex-1 bg-deep-purple border-2 border-white/20 rounded-xl px-3 py-2 text-white font-body text-xl focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
              >
                {allYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button 
                onClick={onAddNewYear}
                className="bg-gold text-deep-purple p-2 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
                title="Add New Year"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Add Prospect Button */}
          <button
            onClick={onOpenAddPlayer}
            className="w-full bg-deep-purple border-2 border-gold text-gold font-header text-xs py-4 rounded-xl mb-8 shadow-retro hover:bg-gold hover:text-deep-purple transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            + ADD PROSPECT
          </button>

          {/* Search */}
          <div className="mb-8">
            <label className="font-header text-xs text-white/70 mb-2 block uppercase">Search Name</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find prospect..."
                className="w-full bg-deep-purple border-2 border-white/20 rounded-xl py-3 pl-10 pr-4 text-white font-body text-lg focus:outline-none focus:border-gold transition-colors placeholder:text-white/30"
              />
              <Search className="absolute left-3 top-3.5 text-white/40 w-5 h-5" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="text-gold w-4 h-4" />
              <label className="font-header text-xs text-white/70 uppercase">Position Groups</label>
            </div>
            
            <div className="space-y-2">
              {allPositions.map(pos => (
                <button
                  key={pos}
                  onClick={() => togglePosition(pos)}
                  className={clsx(
                    "w-full text-left px-4 py-2 rounded-lg font-body text-lg transition-all border-2 flex justify-between items-center group",
                    selectedPositions.includes(pos)
                      ? "bg-gold text-deep-purple border-gold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] translate-x-[1px] translate-y-[1px]" 
                      : "bg-deep-purple text-white/80 border-transparent hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <span>{pos}</span>
                  {selectedPositions.includes(pos) && (
                    <span className="font-header text-xs">x</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
             <p className="font-body text-white/30 text-sm">Yogscast NFL 2025</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
