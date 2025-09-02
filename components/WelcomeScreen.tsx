import React, { useState } from 'react';

interface WelcomeScreenProps {
  onStart: (nickname: string) => void;
  onShowLeaderboard: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onShowLeaderboard }) => {
  const [nickname, setNickname] = useState('');

  const handleStart = () => {
    if (nickname.trim()) {
      onStart(nickname.trim());
    }
  };

  return (
    <div className="text-center flex flex-col items-center justify-center animate-fade-in" style={{height: '70vh'}}>
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight">
        Welcome to <span className="text-[#FFCC00]">Cyber Defender</span>
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-slate-400">
        An interactive training simulation to sharpen your cybersecurity skills.
        Learn to protect sensitive data through hands-on, gamified scenarios.
      </p>
      
      <div className="mt-8 w-full max-w-sm flex flex-col items-center gap-4">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter your nickname"
          maxLength={15}
          className="w-full bg-slate-800 border-2 border-slate-600 rounded-full p-3 text-lg text-slate-100 text-center focus:border-[#FFCC00] focus:ring-[#FFCC00] focus:outline-none transition-colors"
          aria-label="Nickname input"
        />
        <button
          onClick={handleStart}
          disabled={!nickname.trim()}
          className="w-full px-8 py-3 bg-[#D40511] text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#D40511]/50 shadow-lg shadow-[#D40511]/30 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
        >
          Start Training
        </button>
        <button
            onClick={onShowLeaderboard}
            className="text-slate-400 hover:text-[#FFCC00] transition-colors font-semibold"
        >
            View Leaderboard
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;