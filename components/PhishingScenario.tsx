import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { EmailItem, EmailAction, EmailActionTarget } from '../types';
import { generatePhishingScenario } from '../services/geminiService';
import FeedbackModal from './FeedbackModal';

const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H5a2 2 0 00-2 2zm0 0h18" /></svg>;
const ReplyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>;

const DraggableEmail: React.FC<{ email: EmailItem }> = ({ email }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("emailId", email.id);
        e.dataTransfer.setData("isPhishing", String(email.isPhishing));
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="bg-slate-700/50 p-4 rounded-lg flex items-center gap-4 cursor-grab active:cursor-grabbing border-l-4 border-slate-600 hover:border-[#FFCC00] hover:bg-slate-700 transition-all"
        >
            <div className="flex-shrink-0 h-10 w-10 bg-slate-600 rounded-full flex items-center justify-center font-bold text-slate-300">{email.sender.charAt(0)}</div>
            <div className="flex-1 overflow-hidden">
                <div className="font-bold text-slate-200 truncate">{email.sender}</div>
                <div className="text-slate-300 truncate">{email.subject}</div>
                <div className="text-sm text-slate-400 truncate">{email.bodyPreview}</div>
            </div>
        </div>
    );
};

const EmailDropTarget: React.FC<{ target: EmailActionTarget; onDrop: (e: React.DragEvent<HTMLDivElement>) => void }> = ({ target, onDrop }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = () => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        onDrop(e);
    }
    
    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-target-id={target.id}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 ${isOver ? 'bg-slate-600' : 'bg-slate-700'}`}
        >
            <div className="text-slate-300 mb-2">{target.icon}</div>
            <span className="text-sm text-slate-400 font-semibold">{target.name}</span>
        </div>
    );
};

const PhishingScenario: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
    const [emails, setEmails] = useState<EmailItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [points, setPoints] = useState(0);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);

    const initialEmailCount = useMemo(() => emails.length, [emails]);

    useEffect(() => {
        const fetchEmails = async () => {
            setIsLoading(true);
            const items = await generatePhishingScenario();
            setEmails(items);
            setIsLoading(false);
        };
        fetchEmails();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        const emailId = e.dataTransfer.getData("emailId");
        const isPhishing = e.dataTransfer.getData("isPhishing") === 'true';
        const targetAction = e.currentTarget.dataset.targetId as EmailAction;

        let correct = false;
        let feedbackMsg = '';

        if (isPhishing && targetAction === EmailAction.REPORT_PHISHING) {
            correct = true;
            feedbackMsg = "Excellent! You correctly identified and reported the phishing attempt.";
        } else if (!isPhishing && targetAction === EmailAction.DELETE) {
            correct = true;
            feedbackMsg = "Good choice. That was a safe email to delete.";
        } else if (isPhishing && (targetAction === EmailAction.DELETE || targetAction === EmailAction.REPLY)) {
            feedbackMsg = `Be careful! That was a phishing email. The best action is to report it, not just delete or reply.`;
        } else if (!isPhishing && targetAction === EmailAction.REPORT_PHISHING) {
            feedbackMsg = `This email was legitimate. Reporting safe emails can cause unnecessary alerts.`;
        } else if (targetAction === EmailAction.REPLY) {
            feedbackMsg = `Replying can be risky, especially to suspicious emails. It's safer to delete or report.`;
        }
        
        setPoints(p => p + (correct ? 20 : -10));
        setFeedback({ type: correct ? 'correct' : 'incorrect', message: feedbackMsg });
        setEmails(prev => prev.filter(email => email.id !== emailId));
    }, []);

    const actionTargets: EmailActionTarget[] = [
        { id: EmailAction.DELETE, name: 'Delete', icon: <DeleteIcon /> },
        { id: EmailAction.REPORT_PHISHING, name: 'Report Phishing', icon: <ReportIcon /> },
        { id: EmailAction.REPLY, name: 'Reply', icon: <ReplyIcon /> },
    ];
    
    if (isLoading) {
        return <div className="text-center p-10">Loading Scenario...</div>;
    }
    
    if (emails.length === 0 && !isLoading && initialEmailCount > 0) {
        onComplete(points);
        return null;
    }

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-2 sm:p-4">
            {feedback && <FeedbackModal type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)} />}
            <div className="flex flex-col md:flex-row">
                <div className="md:w-3/4 p-4">
                    <h3 className="text-xl font-bold mb-4 text-slate-100">Inbox</h3>
                    <div className="space-y-3">
                        {emails.map(email => <DraggableEmail key={email.id} email={email} />)}
                    </div>
                </div>
                <div className="md:w-1/4 p-4 bg-slate-900/50 rounded-lg flex flex-col">
                    <div className="flex-grow">
                        <h3 className="text-lg font-bold mb-4 text-center text-slate-300">Actions</h3>
                        <p className="text-slate-400 mb-6 text-sm text-center">Drag an email here.</p>
                        <div className="space-y-4">
                            {actionTargets.map(target => <EmailDropTarget key={target.id} target={target} onDrop={handleDrop} />)}
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={() => onComplete(points)}
                            disabled={emails.length === 0}
                            className="w-full py-2 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
                        >
                            Submit Final Score
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhishingScenario;