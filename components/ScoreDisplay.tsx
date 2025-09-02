import React from 'react';

interface ScoreDisplayProps {
  score: number;
  shieldLevel: number;
}

const ShieldIcon: React.FC<{ level: number }> = ({ level }) => (
    <div className="relative h-10 w-10 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden" style={{ clipPath: 'url(#shieldClip)' }}>
            <div className="w-full bg-gradient-to-t from-[#FFCC00] to-[#fde047] transition-all duration-500" style={{ height: `${level}%` }}></div>
        </div>
        <svg width="0" height="0">
            <defs>
                <clipPath id="shieldClip">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </clipPath>
            </defs>
        </svg>
    </div>
);

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, shieldLevel }) => {
  return (
    <div className="flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2">
      <div className="text-right">
        <div className="text-xs text-slate-400">SCORE</div>
        <div className="text-lg font-bold text-white">{score}</div>
      </div>
      <div className="h-8 w-px bg-slate-600"></div>
      <div className="flex items-center gap-2">
         <ShieldIcon level={shieldLevel} />
         <div className="text-right">
            <div className="text-xs text-slate-400">SHIELD</div>
            <div className="text-lg font-bold text-white">{Math.round(shieldLevel)}%</div>
         </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;