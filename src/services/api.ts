import Papa from 'papaparse';
import type { GameRecord } from '../types';

const SHEET_ID = '1sTG3J0Vaki70AqZlFwh-cAdVzeKkTgRkXszkSI7sUrc';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

export const fetchGameData = async (): Promise<GameRecord[]> => {
  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map((row: any, index) => {
            // Parse date DD/MM/YYYY to timestamp
            const [day, month, year] = row.date.split('/').map(Number);
            // Assuming time is HH:mm:ss
            const [hour, minute, second] = row.time ? row.time.split(':').map(Number) : [0, 0, 0];
            const dateObj = new Date(year, month - 1, day, hour, minute, second);

            return {
              id: `game-${index}`,
              game: row.game,
              win: Number(row.win),
              loss: Number(row.loss),
              total: Number(row.total),
              date: row.date,
              time: row.time,
              timestamp: dateObj.getTime(),
            };
          });
          resolve(data as GameRecord[]);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
