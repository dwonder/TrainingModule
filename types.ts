
export enum ModuleType {
  SECURE_DOCUMENTS = 'Secure Document Handling',
  PHISHING_CHALLENGE = 'Phishing Email Challenge',
  PASSWORD_CREATION = 'Password Creation Station',
}

export interface Module {
  id: ModuleType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// For Document Scenario
export enum DocumentSensitivity {
  PUBLIC = 'Public',
  INTERNAL = 'Internal',
  CONFIDENTIAL = 'Confidential',
}

export interface DocumentItem {
  id: string;
  name: string;
  sensitivity: DocumentSensitivity;
}

export interface StorageTarget {
  id: DocumentSensitivity;
  name: string;
  description: string;
  icon: React.ReactNode;
}

// For Phishing Scenario
export interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  bodyPreview: string;
  isPhishing: boolean;
}

export enum EmailAction {
  DELETE = 'Delete',
  REPORT_PHISHING = 'Report Phishing',
  REPLY = 'Reply',
}

export interface EmailActionTarget {
  id: EmailAction;
  name: string;
  icon: React.ReactNode;
}

// For Password Scenario
export interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  symbol: boolean;
}

// General game state
export interface GameState {
  score: number;
  nickname: string;
  currentModule: ModuleType | null;
  completedModules: ModuleType[];
  isGameComplete: boolean;
}

// Leaderboard
export interface LeaderboardEntry {
    nickname: string;
    score: number;
    date: string;
}