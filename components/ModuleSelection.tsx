import React from 'react';
import { ModuleType } from '../types';
import { MODULES } from '../constants';

interface ModuleSelectionProps {
  onSelectModule: (moduleId: ModuleType) => void;
  completedModules: ModuleType[];
  onShowLeaderboard: () => void;
  nickname: string;
}

const ModuleCard: React.FC<{ module: typeof MODULES[0]; onSelect: () => void; isCompleted: boolean }> = ({ module, onSelect, isCompleted }) => (
  <div
    className={`bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FFCC00]/20 relative ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    onClick={!isCompleted ? onSelect : undefined}
    aria-disabled={isCompleted}
  >
    {isCompleted && (
        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">COMPLETED</div>
    )}
    <div className="mb-4">{module.icon}</div>
    <h3 className="text-xl font-bold text-slate-100 mb-2">{module.title}</h3>
    <p className="text-slate-400 text-sm flex-grow">{module.description}</p>
    {!isCompleted && (
        <button className="mt-6 w-full bg-slate-700 text-[#FFCC00] font-semibold py-2 rounded-lg hover:bg-slate-600 transition-colors">
            Start Module
        </button>
    )}
  </div>
);

const ModuleSelection: React.FC<ModuleSelectionProps> = ({ onSelectModule, completedModules, onShowLeaderboard, nickname }) => {
  const allModulesComplete = completedModules.length === MODULES.length;

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-slate-100 mb-2">Welcome, {nickname}!</h2>
      <p className="text-center text-slate-400 mb-8">
        {allModulesComplete ? "You have completed all training modules." : "Select a module to begin your training."}
      </p>
      {allModulesComplete ? (
        <div className="text-center p-8 bg-slate-800 rounded-lg border border-emerald-500">
            <h3 className="text-2xl font-bold text-emerald-400">Congratulations!</h3>
            <p className="text-slate-300 mt-2">You have completed all Cyber Defender training modules. Your data security shield is at maximum strength!</p>
             <button
                onClick={onShowLeaderboard}
                className="mt-6 px-6 py-2 bg-[#D40511] text-white font-bold rounded-full hover:bg-[#a7040e] transition-all"
            >
                View Final Leaderboard
            </button>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MODULES.map(module => (
                <ModuleCard
                    key={module.id}
                    module={module}
                    onSelect={() => onSelectModule(module.id)}
                    isCompleted={completedModules.includes(module.id)}
                />
                ))}
            </div>
            <div className="text-center mt-8">
                <button
                    onClick={onShowLeaderboard}
                    className="text-slate-400 hover:text-[#FFCC00] transition-colors font-semibold"
                >
                    View Leaderboard
                </button>
            </div>
        </>
      )}
    </div>
  );
};

export default ModuleSelection;