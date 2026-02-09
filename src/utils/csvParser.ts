import type { Player } from '../types';

export const parseCSV = async (url: string): Promise<Player[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const text = await response.text();
    
    // Split by new line, handling both CRLF and LF
    const rows = text.split(/\r?\n/).filter(row => row.trim() !== '');

    // Skip header
    const dataRows = rows.slice(1);

    return dataRows.map(row => {
      const columns: string[] = [];
      let inQuote = false;
      let currentToken = '';

      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          columns.push(currentToken.trim());
          currentToken = '';
        } else {
          currentToken += char;
        }
      }
      columns.push(currentToken.trim()); // Push the last token

      // Helper to remove surrounding quotes if they exist
      const clean = (val: string) => {
        if (!val) return '';
        // Check if it starts and ends with quotes
        if (val.startsWith('"') && val.endsWith('"')) {
          return val.slice(1, -1).trim();
        }
        return val.trim();
      };

      // Map to Player interface
      // CSV Structure: R., Player, Position, School, Notes
      const name = clean(columns[1]);
      const rank = parseInt(clean(columns[0]), 10) || 0;
      
      return {
        id: `csv-2025-${rank}-${name.replace(/\s+/g, '-').toLowerCase()}`,
        rank,
        name,
        position: clean(columns[2]),
        school: clean(columns[3]),
        notes: clean(columns[4]),
        year: 2025
      };
    });
  } catch (error) {
    console.error("Error parsing CSV:", error);
    return [];
  }
};