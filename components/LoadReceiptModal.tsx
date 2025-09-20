import React from 'react';
import { ReceiptData } from '../types';
import { FolderIcon, TrashIcon, XIcon } from './icons';

interface LoadReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    receipts: ReceiptData[];
    onLoad: (receipt: ReceiptData) => void;
    onDelete: (id: string) => void;
}

const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('id-ID').format(amount);
};

const LoadReceiptModal: React.FC<LoadReceiptModalProps> = ({ isOpen, onClose, receipts, onLoad, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                        <FolderIcon className="w-6 h-6 text-cyan-400" />
                        Load Saved Receipt
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-full hover:bg-slate-700 transition-colors" aria-label="Close modal">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-6">
                    {receipts.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderIcon className="w-16 h-16 mx-auto text-slate-600" />
                            <p className="mt-4 text-slate-500">No saved receipts found.</p>
                            <p className="text-sm text-slate-600">Use the 'Save Receipt' button to store a bill.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {receipts.map((receipt) => (
                                <li key={receipt.id} className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-between hover:bg-slate-700 transition-colors group">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-200 truncate">{receipt.restaurantName || 'Untitled Receipt'}</p>
                                        <p className="text-sm text-slate-400">
                                            {receipt.date} &bull; Total: <span className="font-semibold text-cyan-400">{formatCurrency(receipt.total)}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                        <button 
                                            onClick={() => onLoad(receipt)}
                                            className="px-4 py-1.5 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-colors">
                                            Load
                                        </button>
                                        <button 
                                            onClick={() => onDelete(receipt.id!)}
                                            className="p-2 text-slate-500 hover:text-red-400 rounded-full hover:bg-red-900/50 transition-colors"
                                            aria-label={`Delete receipt from ${receipt.date}`}>
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

export default LoadReceiptModal;
