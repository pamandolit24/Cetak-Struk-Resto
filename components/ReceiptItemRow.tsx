import React from 'react';
import { ReceiptItem } from '../types';
import { TrashIcon } from './icons';

interface ReceiptItemRowProps {
  item: ReceiptItem;
  onChange: (item: ReceiptItem) => void;
  onDelete: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
};

const ReceiptItemRow: React.FC<ReceiptItemRowProps> = ({ item, onChange, onDelete }) => {
  const handleInputChange = (field: keyof ReceiptItem, value: string | number) => {
    onChange({ ...item, [field]: value });
  };

  const commonInputClasses = "bg-slate-700/50 border border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 transition-colors w-full";

  return (
    <div className="grid grid-cols-[1fr_4rem_6rem_6rem_2.5rem] gap-2 items-center p-2 rounded-lg hover:bg-slate-700/50">
      <input
        type="text"
        value={item.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        className={`${commonInputClasses} px-2 py-1.5`}
        placeholder="Item Name"
      />
      <input
        type="number"
        value={item.quantity}
        onChange={(e) => handleInputChange('quantity', parseInt(e.target.value, 10) || 0)}
        className={`${commonInputClasses} px-2 py-1.5 text-right`}
        min="0"
      />
      <input
        type="number"
        value={item.unitPrice}
        onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
        className={`${commonInputClasses} px-2 py-1.5 text-right`}
        min="0"
        step="1000"
      />
      <div className="text-right text-slate-300 pr-1">
        {formatCurrency(item.quantity * item.unitPrice)}
      </div>
      <button onClick={onDelete} className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-full hover:bg-red-900/50 flex items-center justify-center">
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ReceiptItemRow;