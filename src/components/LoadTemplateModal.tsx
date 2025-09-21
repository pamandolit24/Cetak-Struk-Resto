import React from 'react';
import { ReceiptTemplate } from '../types';
import { FolderIcon, TrashIcon, XIcon } from './icons';

interface LoadTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    templates: ReceiptTemplate[];
    onLoad: (template: ReceiptTemplate) => void;
    onDelete: (id: string) => void;
}

const LoadTemplateModal: React.FC<LoadTemplateModalProps> = ({ isOpen, onClose, templates, onLoad, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                        <FolderIcon className="w-6 h-6 text-cyan-400" />
                        Load Receipt Template
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-full hover:bg-slate-700 transition-colors" aria-label="Close modal">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-6">
                    {templates.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderIcon className="w-16 h-16 mx-auto text-slate-600" />
                            <p className="mt-4 text-slate-500">No saved templates found.</p>
                            <p className="text-sm text-slate-600">Use the 'Save as Template' button to store a configuration.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {templates.map((template) => (
                                <li key={template.id} className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-between hover:bg-slate-700 transition-colors group">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-200 truncate">{template.templateName}</p>
                                        <p className="text-sm text-slate-400 truncate">{template.restaurantName || 'No restaurant name'}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                        <button 
                                            onClick={() => onLoad(template)}
                                            className="px-4 py-1.5 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-colors">
                                            Load
                                        </button>
                                        <button 
                                            onClick={() => onDelete(template.id!)}
                                            className="p-2 text-slate-500 hover:text-red-400 rounded-full hover:bg-red-900/50 transition-colors"
                                            aria-label={`Delete template ${template.templateName}`}>
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                 <footer className="p-4 bg-slate-900/50 border-t border-slate-700 rounded-b-2xl flex-shrink-0">
                    <button onClick={onClose} className="w-full sm:w-auto sm:float-right px-6 py-2 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors">
                        Close
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

export default LoadTemplateModal;
