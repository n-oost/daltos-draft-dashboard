export interface VisualTraits {
  skinTone: number; // 0-4
  hairColor: number; // 0-4
  mouthType: number; // 0-2
}

export interface Player {
  id: string;
  rank: number;
  name: string;
  position: string;
  school: string;
  notes: string;
  year: number;
  visualTraits?: VisualTraits; // Optional manual override
}