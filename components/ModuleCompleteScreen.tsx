import React from 'react';

interface ModuleCompleteScreenProps {
  onPlayAgain: () => void;
  points: number;
  bonus: number;
  isGameComplete: boolean;
  onShowLeaderboard: () => void;
}

const ModuleCompleteScreen: React.FC<ModuleCompleteScreenProps> = ({ onPlayAgain, points, bonus, isGameComplete, onShowLeaderboard }) => {
    
    const title = isGameComplete ? "Training Complete!" : "Module Complete!";
    const message = isGameComplete
      ? "Congratulations! You've successfully finished all training modules. Your final score is on the leaderboard."
      : "Great job! You've successfully completed the module. Your Data Security Shield is stronger.";
    const buttonText = isGameComplete ? "View Leaderboard" : "Choose Next Module";
    const buttonAction = isGameComplete ? onShowLeaderboard : onPlayAgain;
    const titleColor = isGameComplete ? "text-yellow-400" : "text-emerald-400";

  return (
    <div className="text-center flex flex-col items-center justify-center animate-fade-in" style={{height: '70vh'}}>
      <h2 className={`text-4xl sm:text-5xl font-extrabold ${titleColor} tracking-tight`}>
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-slate-400">
        {message}
      </p>

      <div className="mt-6 text-2xl font-semibold text-slate-200">
          Module Score: <span className="text-[#FFCC00]">{points}</span> + Time Bonus: <span className="text-[#FFCC00]">{bonus}</span>
      </div>

      <button
        onClick={buttonAction}
        className="mt-8 px-8 py-3 bg-[#D40511] text-white font-bold rounded-full hover:bg-[#a7040e] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#D40511]/50 shadow-lg shadow-[#D40511]/30"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ModuleCompleteScreen;