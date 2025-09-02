
import React, { useState, useCallback } from 'react';
import { GameState, ModuleType } from './types';
import { INITIAL_GAME_STATE, MODULES, MODULE_TIME_LIMIT } from './constants';
import { addScore } from './services/leaderboardService';
import WelcomeScreen from './components/WelcomeScreen';
import ModuleSelection from './components/ModuleSelection';
import ScenarioView from './components/ScenarioView';
import ModuleCompleteScreen from './components/ModuleCompleteScreen';
import ScoreDisplay from './components/ScoreDisplay';
import Timer from './components/Timer';
import LeaderboardScreen from './components/LeaderboardScreen';

type AppView = 'welcome' | 'module_selection' | 'scenario' | 'module_complete' | 'leaderboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('welcome');
  const [gameState, setGameState] = useState<GameState>({
    ...INITIAL_GAME_STATE,
    currentModule: null,
  });
  const [moduleStartTime, setModuleStartTime] = useState<number | null>(null);
  const [lastModuleStats, setLastModuleStats] = useState<{ points: number; bonus: number } | null>(null);

  const handleStartGame = useCallback((nickname: string) => {
    setGameState(prev => ({...prev, nickname, score: 0, completedModules: [], isGameComplete: false }));
    setView('module_selection');
  }, []);
  
  const handleShowLeaderboard = useCallback(() => {
    setView('leaderboard');
  }, []);

  const handleSelectModule = useCallback((moduleId: ModuleType) => {
    setGameState(prev => ({ ...prev, currentModule: moduleId }));
    setModuleStartTime(Date.now());
    setView('scenario');
  }, []);

  const handleModuleComplete = useCallback((pointsEarned: number, timeUp: boolean = false) => {
    const endTime = Date.now();
    let timeBonus = 0;

    if (moduleStartTime && !timeUp && pointsEarned > 0) {
      const elapsedSeconds = Math.floor((endTime - moduleStartTime) / 1000);
      const remainingSeconds = MODULE_TIME_LIMIT - elapsedSeconds;
      if (remainingSeconds > 0) {
          timeBonus = remainingSeconds * 2; // 2 points per second left
      }
    }
    
    setLastModuleStats({ points: pointsEarned, bonus: timeBonus });

    setGameState(prev => {
      if (!prev.currentModule) return prev;
      
      const newCompleted = [...prev.completedModules, prev.currentModule];
      const isGameNowComplete = newCompleted.length === MODULES.length;
      const newScore = prev.score + pointsEarned + timeBonus;

      if (isGameNowComplete) {
          addScore(prev.nickname, newScore);
      }

      return {
        ...prev,
        score: newScore,
        completedModules: newCompleted,
        isGameComplete: isGameNowComplete,
      };
    });

    setModuleStartTime(null);
    setView('module_complete');
  }, [moduleStartTime]);
  
  const handlePlayAgain = useCallback(() => {
      setGameState(prev => ({ ...prev, currentModule: null}));
      setView('module_selection');
  }, []);

  const handleResetGame = useCallback(() => {
    setGameState({ ...INITIAL_GAME_STATE, currentModule: null });
    setModuleStartTime(null);
    setLastModuleStats(null);
    setView('welcome');
  }, []);


  const renderView = () => {
    const hasStartedGame = gameState.nickname !== '';
    switch (view) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartGame} onShowLeaderboard={handleShowLeaderboard} />;
      case 'leaderboard':
        return <LeaderboardScreen onBack={hasStartedGame && !gameState.isGameComplete ? () => setView('module_selection') : () => setView('welcome')} />;
      case 'module_selection':
        return <ModuleSelection 
                    onSelectModule={handleSelectModule} 
                    completedModules={gameState.completedModules} 
                    onShowLeaderboard={handleShowLeaderboard}
                    nickname={gameState.nickname}
                />;
      case 'scenario':
        if (gameState.currentModule) {
          return <ScenarioView moduleType={gameState.currentModule} onModuleComplete={handleModuleComplete} />;
        }
        return <ModuleSelection onSelectModule={handleSelectModule} completedModules={gameState.completedModules} onShowLeaderboard={handleShowLeaderboard} nickname={gameState.nickname} />;
      case 'module_complete':
        return <ModuleCompleteScreen 
                    onPlayAgain={handlePlayAgain}
                    points={lastModuleStats?.points ?? 0}
                    bonus={lastModuleStats?.bonus ?? 0}
                    isGameComplete={gameState.isGameComplete}
                    onShowLeaderboard={handleShowLeaderboard}
                />;
      default:
        return <WelcomeScreen onStart={handleStartGame} onShowLeaderboard={handleShowLeaderboard} />;
    }
  };

  const showHeader = view !== 'welcome' && view !== 'leaderboard';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="w-full max-w-7xl z-10">
        <header className="w-full flex justify-between items-center mb-6 h-14">
         {showHeader && (
            <>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-wider flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FFCC00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Cyber Defender
                </h1>
                <div className="flex items-center gap-2">
                    {view === 'scenario' && moduleStartTime && (
                        <Timer startTime={moduleStartTime} timeLimit={MODULE_TIME_LIMIT} onTimeUp={() => handleModuleComplete(0, true)} />
                    )}
                    <ScoreDisplay score={gameState.score} shieldLevel={(gameState.completedModules.length / MODULES.length) * 100} />
                    <button onClick={handleResetGame} className="text-sm text-slate-400 hover:text-[#D40511] transition-colors">Reset</button>
                </div>
            </>
         )}
        </header>
        <main className="w-full">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
