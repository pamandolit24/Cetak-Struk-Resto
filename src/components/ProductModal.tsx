import React, { useState } from 'react';
import { ProductTemplate } from '../types';
import { CubeIcon, TrashIcon, XIcon, SaveIcon } from './icons';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: ProductTemplate[];
    onLoad: (product: ProductTemplate) => void;
    onSave: (product: Omit<ProductTemplate, 'id'>) => void;
    onDelete: (id: string) => void;
}

const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('id-ID').format(amount);
};

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, products, onLoad, onSave, onDelete }) => {
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState<number | ''>('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (newProductName.trim() && newProductPrice !== '') {
            onSave({ name: newProductName, unitPrice: Number(newProductPrice) });
            setNewProductName('');
            setNewProductPrice('');
        }
    };

    const commonInputClasses = "bg-slate-900/80 border border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 transition-colors w-full px-3 py-2 text-sm";


    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                        <CubeIcon className="w-6 h-6 text-cyan-400" />
                        Product Library
                    </h2>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-full hover:bg-slate-700 transition-colors" aria-label="Close modal">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-6">
                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <CubeIcon className="w-16 h-16 mx-auto text-slate-600" />
                            <p className="mt-4 text-slate-500">No saved products found.</p>
                            <p className="text-sm text-slate-600">Use the form below to add a new product.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {products.map((product) => (
                                <li key={product.id} className="bg-slate-700/50 p-3 rounded-lg flex items-center justify-between hover:bg-slate-700 transition-colors group">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-200 truncate">{product.name}</p>
                                        <p className="text-sm text-cyan-400">{formatCurrency(product.unitPrice)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                        <button 
                                            onClick={() => onLoad(product)}
                                            className="px-4 py-1.5 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-colors">
                                            Load
                                        </button>
                                        <button 
                                            onClick={() => onDelete(product.id!)}
                                            className="p-2 text-slate-500 hover:text-red-400 rounded-full hover:bg-red-900/50 transition-colors"
                                            aria-label={`Delete product ${product.name}`}>
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                 <footer className="p-4 bg-slate-900/50 border-t border-slate-700 rounded-b-2xl flex-shrink-0">
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_8rem_auto] sm:gap-3 items-end">
                        <div>
                             <label htmlFor="productName" className="block text-xs font-medium text-slate-400 mb-1">Product Name</label>
                             <input
                                id="productName"
                                type="text"
                                value={newProductName}
                                onChange={(e) => setNewProductName(e.target.value)}
                                className={commonInputClasses}
                                placeholder="e.g., 'Es Teh Tawar'"
                            />
                        </div>
                         <div>
                            <label htmlFor="productPrice" className="block text-xs font-medium text-slate-400 mb-1">Unit Price</label>
                            <input
                                id="productPrice"
                                type="number"
                                value={newProductPrice}
                                onChange={(e) => setNewProductPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                className={commonInputClasses}
                                placeholder="e.g., 10000"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={!newProductName.trim() || newProductPrice === ''}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed h-9">
                            <SaveIcon className="w-5 h-5" />
                            <span>Save</span>
                        </button>
                    </form>
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

export default ProductModal;