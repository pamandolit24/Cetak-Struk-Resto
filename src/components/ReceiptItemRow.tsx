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

  const commonInputClasses = "bg-slate-700/50 border border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 transition-colors w-full px-2 py-1.5 text-sm";
  const labelClasses = "block text-xs font-medium text-slate-400 mb-1 md:hidden";


  return (
    <div className="relative bg-slate-700/50 rounded-lg p-3 space-y-2 md:space-y-0 md:p-0 md:bg-transparent md:grid md:grid-cols-[1fr_4rem_6rem_6rem_2.5rem] md:gap-2 md:items-center">
      {/* Item Name */}
      <div className="md:col-span-1">
        <label htmlFor={`itemName-${item.name}`} className={labelClasses}>Item Name</label>
        <input
            id={`itemName-${item.name}`}
            type="text"
            value={item.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={commonInputClasses}
            placeholder="Item Name"
        />
      </div>

      {/* Wrapper for numerical inputs */}
      <div className="grid grid-cols-3 gap-2 md:contents">
        <div className="md:col-span-1">
            <label htmlFor={`itemQty-${item.name}`} className={labelClasses}>Qty</label>
            <input
                id={`itemQty-${item.name}`}
                type="number"
                value={item.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value, 10) || 0)}
                className={`${commonInputClasses} text-right`}
                min="0"
            />
        </div>
        <div className="md:col-span-1">
            <label htmlFor={`itemPrice-${item.name}`} className={labelClasses}>Unit Price</label>
            <input
                id={`itemPrice-${item.name}`}
                type="number"
                value={item.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
                className={`${commonInputClasses} text-right`}
                min="0"
                step="1000"
            />
        </div>
        <div className="md:col-span-1 text-right">
            <label className={labelClasses}>Total</label>
            <div className="text-slate-300 h-full flex items-center justify-end pr-1 text-sm md:text-base">
                {formatCurrency(item.quantity * item.unitPrice)}
            </div>
        </div>
      </div>

      {/* Delete Button */}
       <div className="absolute top-2 right-2 md:relative md:top-auto md:right-auto md:col-span-1">
         <button onClick={onDelete} className="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-full hover:bg-red-900/50 flex items-center justify-center">
            <TrashIcon className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
};

export default ReceiptItemRow;