export interface WordDetails {
  definition: string;
  phonetic: string;
  example: string;
  chineseDefinition: string;
}

export interface WordData {
  word: string;
  definition?: string;
  phonetic?: string;
  example?: string;
  imageUrl?: string;
  timestamp: number;
  data?: WordDetails;
}

export interface SearchResult {
  found: boolean;
  data?: WordDetails;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}