import { db } from '../db';
import type { MasterProspect } from '../db';

export const syncMasterData = async () => {
  try {
    const count = await db.masterProspects.count();
    if (count > 0) {
      console.log('Master DB already seeded.');
      return; 
    }

    console.log('Seeding Master Prospect Database from local source...');
    const response = await fetch('/prospects_master.json');
    if (!response.ok) throw new Error('Failed to load local prospects_master.json');
    
    const prospects: any[] = await response.json();

    const dbProspects: MasterProspect[] = prospects.map((p, i) => ({
        id: `master-${p.source_year}-${i}`,
        name: p.name,
        position: p.position,
        school: p.school,
        source_year: p.source_year
    }));

    await db.masterProspects.bulkPut(dbProspects);
    console.log(`Successfully seeded ${dbProspects.length} prospects.`);

  } catch (err) {
    console.error('Data Sync Failed:', err);
  }
};
