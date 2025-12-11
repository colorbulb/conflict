// Import data from constants.tsx to Firestore
// Run this script to initialize your Firestore database with data from constants.tsx

import { initializeFirestore, saveAppData } from './db.js';
import { INITIAL_DATA } from '../constants.js';

/**
 * Import all data from constants.tsx to Firestore
 * This will create collections for both 'en' and 'zh' languages
 */
export const importAllData = async () => {
  try {
    console.log('Starting data import...');
    
    // Check if data already exists
    const initialized = await initializeFirestore(INITIAL_DATA);
    
    if (!initialized) {
      console.log('Data already exists. Use force import to overwrite.');
      return false;
    }
    
    console.log('Data import completed successfully!');
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

/**
 * Force import - overwrites existing data
 */
export const forceImportAllData = async () => {
  try {
    console.log('Starting force import (overwriting existing data)...');
    
    // Import for both languages
    for (const lang of ['en', 'zh']) {
      const langData = INITIAL_DATA[lang];
      if (langData) {
        await saveAppData(langData, lang);
        console.log(`Imported ${lang} data`);
      }
    }
    
    console.log('Force import completed successfully!');
    return true;
  } catch (error) {
    console.error('Error force importing data:', error);
    throw error;
  }
};

/**
 * Import translations from translations.ts
 */
export const importTranslations = async (translations) => {
  try {
    const { saveTranslations } = await import('./db.js');
    
    for (const lang of ['en', 'zh']) {
      if (translations[lang]) {
        await saveTranslations(translations[lang], lang);
        console.log(`Imported ${lang} translations`);
      }
    }
    
    console.log('Translations import completed!');
    return true;
  } catch (error) {
    console.error('Error importing translations:', error);
    throw error;
  }
};

// If running directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  importAllData()
    .then(() => {
      console.log('Import script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}

