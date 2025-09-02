import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DocumentItem, DocumentSensitivity, StorageTarget } from '../types';
import { generateDocumentScenario } from '../services/geminiService';
import FeedbackModal from './FeedbackModal';

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
);

const DraggableDocument: React.FC<{ doc: DocumentItem }> = ({ doc }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("documentId", doc.id);
    e.dataTransfer.setData("documentSensitivity", doc.sensitivity);
    e.currentTarget.classList.add('opacity-50', 'border-dashed');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50', 'border-dashed');
  };

  return (
    <div
      id={doc.id}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="bg-slate-700 p-3 rounded-lg flex items-center cursor-grab active:cursor-grabbing border border-slate-600 hover:border-[#FFCC00] transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
      <span>{doc.name}</span>
    </div>
  );
};

const DropTarget: React.FC<{ target: StorageTarget; onDrop: (e: React.DragEvent<HTMLDivElement>) => void }> = ({ target, onDrop }) => {
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
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 ${isOver ? 'border-[#FFCC00] bg-slate-700/50 scale-105' : 'border-slate-600 bg-slate-800'}`}
        >
            <div className="text-[#FFCC00]">{target.icon}</div>
            <h4 className="text-lg font-bold mt-2 text-slate-200">{target.name}</h4>
            <p className="text-sm text-slate-400">{target.description}</p>
        </div>
    );
};


const DocumentScenario: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);

  const initialDocCount = useMemo(() => documents.length, [documents]);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      const items = await generateDocumentScenario();
      setDocuments(items);
      setIsLoading(false);
    };
    fetchDocuments();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const docId = e.dataTransfer.getData("documentId");
    const docSensitivity = e.dataTransfer.getData("documentSensitivity") as DocumentSensitivity;
    const targetId = e.currentTarget.dataset.targetId as DocumentSensitivity;

    if (docSensitivity === targetId) {
      setPoints(p => p + 20);
      setFeedback({ type: 'correct', message: `Correct! '${docId}' was classified properly.` });
    } else {
      setPoints(p => p - 10);
      setFeedback({ type: 'incorrect', message: `That's not right. This type of document belongs in the '${docSensitivity}' storage.` });
    }

    setDocuments(docs => docs.filter(doc => doc.id !== docId));
  }, []);
  
  const storageTargets: StorageTarget[] = [
    { id: DocumentSensitivity.PUBLIC, name: 'Public Folder', description: 'For non-sensitive, public information.', icon: <FolderIcon /> },
    { id: DocumentSensitivity.INTERNAL, name: 'Internal Server', description: 'For company-internal, non-confidential data.', icon: <FolderIcon /> },
    { id: DocumentSensitivity.CONFIDENTIAL, name: 'Encrypted Secure Storage', description: 'For sensitive, restricted-access data.', icon: <FolderIcon /> },
  ];

  if (isLoading) {
    return <div className="text-center p-10">Loading Scenario...</div>;
  }
  
  if (documents.length === 0 && !isLoading && initialDocCount > 0) {
      onComplete(points);
      return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {feedback && <FeedbackModal type={feedback.type} message={feedback.message} onClose={() => setFeedback(null)} />}
      <div className="lg:w-1/3 bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col">
        <div className="flex-grow">
            <h3 className="text-xl font-bold mb-4 text-slate-100">Documents to Classify</h3>
            <p className="text-slate-400 mb-6 text-sm">Drag each document to the correct storage location on the right.</p>
            <div className="space-y-3">
            {documents.map(doc => <DraggableDocument key={doc.id} doc={doc} />)}
            </div>
        </div>
        <div className="mt-6">
            <button
                onClick={() => onComplete(points)}
                disabled={documents.length === 0}
                className="w-full py-2 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
                Submit Final Score
            </button>
        </div>
      </div>
      <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
        {storageTargets.map(target => <DropTarget key={target.id} target={target} onDrop={handleDrop} />)}
      </div>
    </div>
  );
};

export default DocumentScenario;