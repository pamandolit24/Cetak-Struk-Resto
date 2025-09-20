
import React from 'react';
import { ReceiptData } from '../types';

interface BillSummaryProps {
  receiptData: ReceiptData;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
};

const BillSummary: React.FC<BillSummaryProps> = ({ receiptData }) => {
  return (
    <div className="space-y-3 mb-6 text-slate-300">
      <div className="flex justify-between">
        <span className="text-slate-400">Subtotal</span>
        <span>{formatCurrency(receiptData.subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Tax (PB1)</span>
        <span>{formatCurrency(receiptData.tax)}</span>
      </div>
      <div className="flex justify-between items-center border-t border-slate-600 pt-3 mt-3">
        <span className="text-lg font-bold text-white">Total</span>
        <span className="text-xl font-bold text-cyan-400">{formatCurrency(receiptData.total)}</span>
      </div>
    </div>
  );
};

export default BillSummary;
