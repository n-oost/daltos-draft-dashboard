import Dexie, { type Table } from 'dexie';
import type { Player, VisualTraits } from './types';

export interface MasterProspect {
  id: string;
  name: string;
  position: string;
  school: string;
  source_year: number;
  visualTraits?: VisualTraits;
}

export class DraftDatabase extends Dexie {
  myPlayers!: Table<Player>; 
  masterProspects!: Table<MasterProspect>;

  constructor() {
    super('DaltosDraftDB');
    this.version(2).stores({
      myPlayers: 'id, rank, year, name, position, school',
      masterProspects: 'id, name, position, school, source_year'
    });
  }
}

export const db = new DraftDatabase();