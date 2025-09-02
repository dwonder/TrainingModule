import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { getLeaderboard } from '../services/leaderboardService';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        setLeaderboard(getLeaderboard());
    }, []);

    const rankColors = ['text-yellow-400', 'text-slate-300', 'text-amber-500'];

    return (
        <div className="max-w-3xl mx-auto bg-slate-800 border border-slate-700 rounded-xl p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-slate-100 mb-6 flex items-center justify-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FFCC00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Leaderboard
            </h2>
            
            <div className="space-y-3">
                {leaderboard.length > 0 ? leaderboard.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/50 p-4 rounded-lg border-l-4 border-slate-600">
                        <div className="flex items-center gap-4">
                            <span className={`text-2xl font-bold w-8 text-center ${rankColors[index] || 'text-slate-400'}`}>
                                {index + 1}
                            </span>
                            <div>
                                <div className="text-lg font-semibold text-slate-100">{entry.nickname}</div>
                                <div className="text-xs text-slate-400">Completed on {entry.date}</div>
                            </div>
                        </div>
                        <div className="text-xl font-bold text-[#FFCC00]">{entry.score.toLocaleString()} PTS</div>
                    </div>
                )) : (
                    <p className="text-center text-slate-400 py-8">No scores yet. Be the first to complete the training!</p>
                )}
            </div>

            <div className="text-center mt-8">
                <button
                    onClick={onBack}
                    className="px-8 py-3 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 transition-all duration-300"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default LeaderboardScreen;