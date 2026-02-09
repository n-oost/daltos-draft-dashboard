import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import type { MasterProspect } from '../db';

interface PlayerAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (prospect: { name: string, position: string, school: string }) => void;
}

const PlayerAutocomplete: React.FC<PlayerAutocompleteProps> = ({ value, onChange, onSelect }) => {
  const [suggestions, setSuggestions] = useState<MasterProspect[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debounced query to Master DB
    const search = async () => {
        if (value.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            console.log(`Searching Master DB for: "${value}"`);
            // Case-insensitive startsWith query using Dexie
            const results = await db.masterProspects
                .where('name')
                .startsWithIgnoreCase(value)
                .limit(10) // Increased limit slightly
                .toArray();
            
            console.log(`Found ${results.length} results.`);
            setSuggestions(results);
        } catch (e) {
            console.error("Autocomplete Query Error:", e);
        }
    };

    const timer = setTimeout(search, 200);
    return () => clearTimeout(timer);
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="font-header text-xs text-gold block mb-2 uppercase">Full Name</label>
      <input
        required
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        className="w-full bg-deep-purple border-2 border-white/20 rounded-xl p-3 text-white font-body text-xl focus:outline-none focus:border-gold transition-colors"
        placeholder="Start typing name..."
      />
      
      {showSuggestions && value.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-mid-purple border-4 border-gold rounded-xl shadow-retro z-[110] overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
          {suggestions.length > 0 ? (
            suggestions.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelect(p);
                  setShowSuggestions(false);
                }}
                className="w-full text-left p-3 hover:bg-gold hover:text-deep-purple transition-colors border-b border-gold/20 last:border-0 group"
              >
                <div className="font-header text-sm">{p.name}</div>
                <div className="font-body text-sm opacity-70 group-hover:opacity-100">
                  {p.position} | {p.school} <span className="text-xs opacity-50 ml-2">({p.source_year})</span>
                </div>
              </button>
            ))
          ) : (
             <div className="p-3 text-white/50 font-body text-sm text-center">
               No matching prospects found in database.
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerAutocomplete;
