import React, { useState, useMemo } from 'react';
import { PasswordCriteria } from '../types';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CriteriaItem: React.FC<{ text: string, met: boolean }> = ({ text, met }) => (
    <li className={`flex items-center transition-colors duration-300 ${met ? 'text-slate-300' : 'text-slate-500'}`}>
        {met ? <CheckIcon /> : <XIcon />}
        <span className="ml-2">{text}</span>
    </li>
);

const PasswordScenario: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
    const [password, setPassword] = useState('');

    const criteria: PasswordCriteria = useMemo(() => ({
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    }), [password]);

    const criteriaMetCount = Object.values(criteria).filter(Boolean).length;
    const allCriteriaMet = criteriaMetCount === 5;
    
    const strength = useMemo(() => {
        if (password.length === 0) return 0;
        let score = 0;
        if (criteria.length) score += 25;
        if (criteria.uppercase) score += 15;
        if (criteria.lowercase) score += 15;
        if (criteria.number) score += 20;
        if (criteria.symbol) score += 25;
        return Math.min(score, 100);
    }, [password, criteria]);

    const strengthColor = useMemo(() => {
        if (strength < 40) return 'bg-red-500';
        if (strength < 75) return 'bg-yellow-500';
        return 'bg-emerald-500';
    }, [strength]);

    const handleSubmit = () => {
        if (allCriteriaMet) {
            onComplete(100);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-center mb-2 text-slate-100">Password Creation Station</h3>
            <p className="text-slate-400 text-center mb-6">Create a password that meets all the security criteria.</p>

            <div className="relative">
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg p-3 text-lg text-slate-100 focus:border-[#FFCC00] focus:ring-[#FFCC00] focus:outline-none transition-colors"
                />
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2.5 my-4">
                <div className={`h-2.5 rounded-full ${strengthColor} transition-all duration-300`} style={{ width: `${strength}%` }}></div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-6">
                <CriteriaItem text="At least 12 characters" met={criteria.length} />
                <CriteriaItem text="Contains an uppercase letter" met={criteria.uppercase} />
                <CriteriaItem text="Contains a lowercase letter" met={criteria.lowercase} />
                <CriteriaItem text="Contains a number" met={criteria.number} />
                <CriteriaItem text="Contains a symbol" met={criteria.symbol} />
            </ul>

            <button
                onClick={handleSubmit}
                disabled={!allCriteriaMet}
                className="w-full mt-8 py-3 bg-[#D40511] text-white font-bold rounded-lg transition-all duration-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-[#a7040e] focus:outline-none focus:ring-4 focus:ring-[#D40511]/50"
            >
                {allCriteriaMet ? 'Submit Password' : 'Complete All Criteria'}
            </button>
            <button
                onClick={() => onComplete(0)}
                className="w-full mt-4 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
            >
                End Module
            </button>
        </div>
    );
};

export default PasswordScenario;