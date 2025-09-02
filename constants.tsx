import React from 'react';
import { Module, ModuleType, GameState } from './types';

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#FFCC00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#FFCC00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#FFCC00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);


export const MODULES: Module[] = [
  {
    id: ModuleType.SECURE_DOCUMENTS,
    title: 'Secure Document Handling',
    description: 'Drag documents to the correct storage based on sensitivity.',
    icon: <FolderIcon />,
  },
  {
    id: ModuleType.PHISHING_CHALLENGE,
    title: 'Phishing Email Challenge',
    description: 'Identify and correctly handle suspicious emails in an inbox.',
    icon: <MailIcon />,
  },
  {
    id: ModuleType.PASSWORD_CREATION,
    title: 'Password Creation Station',
    description: 'Learn to build strong, secure passwords.',
    icon: <LockIcon />,
  },
];

export const INITIAL_GAME_STATE: Omit<GameState, 'currentModule'> = {
  score: 0,
  nickname: '',
  completedModules: [],
  isGameComplete: false,
};

export const MODULE_TIME_LIMIT = 90; // seconds