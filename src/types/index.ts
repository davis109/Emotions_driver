export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export type EmotionTag = 
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'calm'
  | 'angry'
  | 'excited'
  | 'tired'
  | 'motivated'
  | 'stressed'
  | 'relaxed'
  | 'grateful'
  | 'frustrated';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: MoodLevel;
  emotions: EmotionTag[];
}

export interface MoodData {
  date: string;
  value: MoodLevel;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, entry: Partial<Omit<JournalEntry, 'id'>>) => void;
  getEntryById: (id: string) => JournalEntry | undefined;
} 