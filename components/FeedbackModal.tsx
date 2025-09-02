
import React from 'react';

interface FeedbackModalProps {
  type: 'correct' | 'incorrect';
  message: string;
  onClose: () => void;
}

const CorrectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IncorrectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FeedbackModal: React.FC<FeedbackModalProps> = ({ type, message, onClose }) => {
  const isCorrect = type === 'correct';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in-fast">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-sm w-full text-center transform transition-all scale-95 animate-scale-in">
        <div className="mx-auto mb-4">
          {isCorrect ? <CorrectIcon /> : <IncorrectIcon />}
        </div>
        <h3 className={`text-2xl font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h3>
        <p className="text-slate-300 mt-2 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-2 font-bold rounded-lg transition-colors ${isCorrect ? 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400' : 'bg-red-500 hover:bg-red-600 focus:ring-red-400'} text-white focus:outline-none focus:ring-4`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
