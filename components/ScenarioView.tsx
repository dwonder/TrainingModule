
import React from 'react';
import { ModuleType } from '../types';
import DocumentScenario from './DocumentScenario';
import PhishingScenario from './PhishingScenario';
import PasswordScenario from './PasswordScenario';

interface ScenarioViewProps {
  moduleType: ModuleType;
  onModuleComplete: (pointsEarned: number) => void;
}

const ScenarioView: React.FC<ScenarioViewProps> = ({ moduleType, onModuleComplete }) => {
  const renderScenario = () => {
    switch (moduleType) {
      case ModuleType.SECURE_DOCUMENTS:
        return <DocumentScenario onComplete={onModuleComplete} />;
      case ModuleType.PHISHING_CHALLENGE:
        return <PhishingScenario onComplete={onModuleComplete} />;
      case ModuleType.PASSWORD_CREATION:
        return <PasswordScenario onComplete={onModuleComplete} />;
      default:
        return <div className="text-center">Error: Unknown module type.</div>;
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {renderScenario()}
    </div>
  );
};

export default ScenarioView;
