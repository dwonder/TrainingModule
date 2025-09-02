import { LeaderboardEntry } from '../types';

const LEADERBOARD_KEY = 'cyberDefenderLeaderboard';
const MAX_ENTRIES = 10;

export const getLeaderboard = (): LeaderboardEntry[] => {
    try {
        const data = localStorage.getItem(LEADERBOARD_KEY);
        if (!data) return [];
        const entries: LeaderboardEntry[] = JSON.parse(data);
        // Basic validation
        if (Array.isArray(entries)) {
            return entries;
        }
        return [];
    } catch (error) {
        console.error("Failed to parse leaderboard data from localStorage", error);
        return [];
    }
};

export const addScore = (nickname: string, score: number): void => {
    if (!nickname || score < 0) return;

    const newEntry: LeaderboardEntry = {
        nickname,
        score,
        date: new Date().toLocaleDateString(),
    };

    const leaderboard = getLeaderboard();
    leaderboard.push(newEntry);

    // Sort by score (desc)
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only the top N entries
    const updatedLeaderboard = leaderboard.slice(0, MAX_ENTRIES);

    try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
    } catch (error) {
        console.error("Failed to save leaderboard data to localStorage", error);
    }
};