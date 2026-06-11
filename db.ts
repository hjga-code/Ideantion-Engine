
import Dexie, { Table } from 'dexie';
import { Session, GlobalSettings } from './types';

class ThinkLabDatabase extends Dexie {
  sessions!: Table<Session>;
  settings!: Table<GlobalSettings>;

  constructor() {
    super('ThinkLabDB');
    
    // Version 1
    (this as any).version(1).stores({
      sessions: 'id, timestamp, lastModified'
    });

    // Version 2: Added settings table for API Key persistence
    (this as any).version(2).stores({
      sessions: 'id, timestamp, lastModified',
      settings: 'id' 
    });

    // Version 3: Added geminiKey field to settings
    (this as any).version(3).stores({
      sessions: 'id, timestamp, lastModified',
      settings: 'id'
    });
  }
}

export const db = new ThinkLabDatabase();
