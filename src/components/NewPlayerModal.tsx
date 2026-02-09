import React, { useState, useEffect } from 'react';
import { X, Sparkles, RefreshCw } from 'lucide-react';
import type { Player, VisualTraits } from '../types';
import PlayerAutocomplete from './PlayerAutocomplete';
import PixelAvatar from './PixelAvatar';
import { detectVisualTraits } from '../utils/visualsService';

interface NewPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Omit<Player, 'rank' | 'year' | 'id'>, id?: string) => void;
  year: number;
  editingPlayer?: Player | null;
}

const NewPlayerModal: React.FC<NewPlayerModalProps> = ({ isOpen, onClose, onSave, year, editingPlayer }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [school, setSchool] = useState('');
  const [notes, setNotes] = useState('');
  const [traits, setTraits] = useState<VisualTraits | undefined>();
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (editingPlayer) {
      setName(editingPlayer.name);
      setPosition(editingPlayer.position);
      setSchool(editingPlayer.school);
      setNotes(editingPlayer.notes);
      setTraits(editingPlayer.visualTraits);
    } else {
      setName('');
      setPosition('');
      setSchool('');
      setNotes('');
      setTraits(undefined);
    }
  }, [editingPlayer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position) return;
    onSave({ name, position, school, notes, visualTraits: traits }, editingPlayer?.id);
    onClose();
  };

  const handleSelectProspect = (prospect: { name: string; position: string; school: string }) => {
    setName(prospect.name);
    setPosition(prospect.position);
    setSchool(prospect.school);
    // Trigger auto-detect immediately on selection
    triggerAutoDetect(prospect.name);
  };

  const triggerAutoDetect = async (targetName: string) => {
    if (!targetName) return;
    setIsDetecting(true);
    const results = await detectVisualTraits(targetName);
    if (results) setTraits(results);
    setIsDetecting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-mid-purple border-4 border-gold rounded-3xl w-full max-w-lg shadow-retro overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gold p-4 flex justify-between items-center">
          <h2 className="font-header text-deep-purple text-lg">
            {editingPlayer ? 'EDIT' : 'NEW'} PROSPECT - {year}
          </h2>
          <button onClick={onClose} className="text-deep-purple hover:scale-110 transition-transform">
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <PlayerAutocomplete 
                value={name} 
                onChange={setName} 
                onSelect={handleSelectProspect}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
                <PixelAvatar name={name} traits={traits} size={64} />
                <button
                    type="button"
                    onClick={() => triggerAutoDetect(name)}
                    disabled={!name || isDetecting}
                    className="bg-deep-purple border border-gold/30 p-2 rounded-lg text-gold hover:bg-gold hover:text-deep-purple transition-all disabled:opacity-50"
                    title="Auto-detect appearance"
                >
                    {isDetecting ? <RefreshCw className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-header text-xs text-gold block mb-2 uppercase">Position</label>
              <input
                required
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-deep-purple border-2 border-white/20 rounded-xl p-3 text-white font-body text-xl focus:outline-none focus:border-gold transition-colors"
                placeholder="QB, CB, etc."
              />
            </div>
            <div>
              <label className="font-header text-xs text-gold block mb-2 uppercase">School</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full bg-deep-purple border-2 border-white/20 rounded-xl p-3 text-white font-body text-xl focus:outline-none focus:border-gold transition-colors"
                placeholder="University"
              />
            </div>
          </div>

          <div>
            <label className="font-header text-xs text-gold block mb-2 uppercase">Scouting Notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-deep-purple border-2 border-white/20 rounded-xl p-3 text-white font-body text-xl focus:outline-none focus:border-gold transition-colors resize-none"
              placeholder="Enter scouting report..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gold text-deep-purple font-header py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >
              {editingPlayer ? 'UPDATE' : 'ENLIST'} PROSPECT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPlayerModal;
