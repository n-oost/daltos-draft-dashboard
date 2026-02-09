import type { VisualTraits } from '../types';

// Map of names to their "Real" visual traits
// skinTone: 0 (Pale) - 4 (Deep)
// hairColor: 0 (Black) - 4 (Grey)
// mouthType: 0 (Flat), 1 (Smile), 2 (Open)

const REAL_TRAITS_MAP: Record<string, VisualTraits> = {
  "Travis Hunter": { skinTone: 3, hairColor: 0, mouthType: 1 },
  "Mason Graham": { skinTone: 1, hairColor: 1, mouthType: 0 },
  "Will Johnson": { skinTone: 3, hairColor: 0, mouthType: 1 },
  "Cam Ward": { skinTone: 3, hairColor: 0, mouthType: 0 },
  "Shedeur Sanders": { skinTone: 3, hairColor: 0, mouthType: 1 },
  "Arch Manning": { skinTone: 0, hairColor: 1, mouthType: 1 },
  "Fernando Mendoza": { skinTone: 2, hairColor: 0, mouthType: 0 },
  "Rueben Bain Jr.": { skinTone: 4, hairColor: 0, mouthType: 0 },
  "Tetairoa McMillan": { skinTone: 2, hairColor: 0, mouthType: 1 },
  "Abdul Carter": { skinTone: 4, hairColor: 0, mouthType: 0 },
  "Will Campbell": { skinTone: 0, hairColor: 2, mouthType: 0 },
  "James Pearce Jr.": { skinTone: 3, hairColor: 0, mouthType: 1 }
};

export const detectVisualTraits = async (name: string): Promise<VisualTraits | null> => {
  // In a real app, this would hit an LLM/Search API
  // For this prototype, we use our "Smart Lookup" table
  console.log(`Auto-detecting visuals for: ${name}...`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Case-insensitive lookup
  const match = Object.keys(REAL_TRAITS_MAP).find(
    key => key.toLowerCase() === name.toLowerCase()
  );

  if (match) {
    console.log(`Found real traits for ${name}!`);
    return REAL_TRAITS_MAP[match];
  }

  // Generic heuristic based on name/common patterns if no direct match
  // This is a placeholder for actual AI logic
  return null;
};
