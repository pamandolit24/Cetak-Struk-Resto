import React, { useState } from 'react';
import { SaveIcon, XIcon } from './icons';

interface SaveTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (templateName: string) => void;
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({ isOpen, onClose, onSave }) => {
    const [templateName, setTemplateName] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (templateName.trim()) {
            onSave(templateName.trim());
            setTemplateName(''); // Reset for next time
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <header className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                        <SaveIcon className="w-6 h-6 text-cyan-400" />
                        Save as Template
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-full hover:bg-slate-700 transition-colors" aria-label="Close modal">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-6 space-y-4">
                    <label htmlFor="templateName" className="block text-sm font-medium text-slate-400">Template Name</label>
                    <input
                        id="templateName"
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        className="bg-slate-700/50 border border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 transition-colors w-full px-3 py-2 text-sm"
                        placeholder="e.g., 'My Restaurant Template'"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                </div>
                 <footer className="p-4 bg-slate-900/50 border-t border-slate-700 rounded-b-2xl flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!templateName.trim()}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed">
                        Save Template
                    </button>
                </footer>
            </div>
             <style>{`
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default SaveTemplateModal;
