import React, { useEffect, useState } from 'react';
import { ReceiptData, ReceiptItem, PaymentType } from '../types';
import ReceiptItemRow from './ReceiptItemRow';
import BillSummary from './BillSummary';
import PrintButton from './PrintButton';
import { EditIcon, LoadingSpinnerIcon, SaveIcon, CubeIcon } from './icons';

interface ReceiptEditorProps {
  receiptData: ReceiptData | null;
  onDataChange: (data: ReceiptData) => void;
  onSave: (data: ReceiptData) => void;
  onSaveAsTemplate: () => void;
  onOpenProductModal: () => void;
  isLoading: boolean;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
};

const ReceiptEditor: React.FC<ReceiptEditorProps> = ({ receiptData, onDataChange, onSave, onSaveAsTemplate, onOpenProductModal, isLoading }) => {
    const [internalData, setInternalData] = useState<ReceiptData | null>(receiptData);
    const [saveStatus, setSaveStatus] = useState<string>('');

    useEffect(() => {
        setInternalData(receiptData);
    }, [receiptData]);

    const handleFieldChange = (field: keyof ReceiptData, value: string) => {
        if (!internalData) return;
        const newData = { ...internalData, [field]: value };
        setInternalData(newData);
        onDataChange(newData);
    };

    const handlePaymentChange = (field: keyof ReceiptData, value: string | number) => {
        if (!internalData) return;
        
        let newData: ReceiptData = { ...internalData, [field]: value };

        if (field === 'paymentAmount') {
            const amountPaid = Number(value) || 0;
            const change = amountPaid > internalData.total ? amountPaid - internalData.total : 0;
            newData = { ...newData, paymentAmount: amountPaid, paymentChange: change };
        }
        
        if (field === 'paymentType' && value !== 'Tunai') {
            delete newData.paymentAmount;
            delete newData.paymentChange;
        }

        setInternalData(newData);
        onDataChange(newData);
    };

    const handleItemChange = (index: number, updatedItem: ReceiptItem) => {
        if (!internalData) return;
        const newItems = [...internalData.items];
        newItems[index] = updatedItem;
        recalculateTotals(newItems);
    };

    const handleItemDelete = (index: number) => {
        if (!internalData) return;
        const newItems = internalData.items.filter((_, i) => i !== index);
        recalculateTotals(newItems);
    };

    const handleAddItem = () => {
        if (!internalData) return;
        const newItems = [...internalData.items, { name: '', quantity: 1, unitPrice: 0 }];
        setInternalData({ ...internalData, items: newItems });
    };

    const recalculateTotals = (items: ReceiptItem[]) => {
        const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
        const taxRate = internalData && internalData.subtotal > 0 ? internalData.tax / internalData.subtotal : 0.1;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        const newData = {
            ...internalData!,
            items,
            subtotal,
            tax,
            total,
        };
        setInternalData(newData);
        onDataChange(newData);
    };

    const handleSave = () => {
        if (internalData) {
            onSave(internalData);
            setSaveStatus('Receipt saved successfully!');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    const commonInputClasses = "bg-slate-700/50 border border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 transition-colors w-full px-3 py-2 text-sm";
    const labelClasses = "block text-xs font-medium text-slate-400 mb-1";

  return (
    <div className="bg-slate-800/50 rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-semibold text-slate-300 flex items-center gap-2">
            <EditIcon className="w-6 h-6 text-cyan-400" />
            2. Edit & Print Bill
        </h2>
      </div>

      {isLoading ? (
         <div className="flex-grow flex items-center justify-center">
            <div className="text-center text-slate-400">
              <LoadingSpinnerIcon className="w-10 h-10 mx-auto" />
              <p className="mt-2">Waiting for AI result...</p>
            </div>
         </div>
      ) : !internalData ? (
         <div className="flex-grow flex items-center justify-center">
            <p className="text-slate-500">Upload a receipt to get started.</p>
         </div>
      ) : (
        <div className="flex-grow flex flex-col overflow-y-auto">
            <div className="p-6 space-y-4 flex-grow">
                {/* Header Details */}
                <fieldset className="space-y-2">
                    <legend className="text-sm font-semibold text-slate-300 mb-2">Header Details</legend>
                    <div>
                        <label htmlFor="restaurantName" className={labelClasses}>Restaurant Name</label>
                        <input id="restaurantName" type="text" value={internalData.restaurantName || ''} onChange={(e) => handleFieldChange('restaurantName', e.target.value)} className={commonInputClasses} />
                    </div>
                     <div>
                        <label htmlFor="address" className={labelClasses}>Address</label>
                        <input id="address" type="text" value={internalData.address || ''} onChange={(e) => handleFieldChange('address', e.target.value)} className={commonInputClasses} />
                    </div>
                     <div>
                        <label htmlFor="city" className={labelClasses}>City</label>
                        <input id="city" type="text" value={internalData.city || ''} onChange={(e) => handleFieldChange('city', e.target.value)} className={commonInputClasses} />
                    </div>
                     <div>
                        <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                        <input id="phone" type="text" value={internalData.phone || ''} onChange={(e) => handleFieldChange('phone', e.target.value)} className={commonInputClasses} />
                    </div>
                </fieldset>

                <div className="border-t border-slate-700"></div>

                {/* Transaction Details */}
                <fieldset>
                    <legend className="text-sm font-semibold text-slate-300 mb-2">Transaction Details</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className={labelClasses}>Date</label>
                            <input id="date" type="text" value={internalData.date || ''} onChange={(e) => handleFieldChange('date', e.target.value)} className={commonInputClasses} />
                        </div>
                        <div>
                            <label htmlFor="transactionId" className={labelClasses}>Transaction ID</label>
                            <input id="transactionId" type="text" value={internalData.transactionId || ''} onChange={(e) => handleFieldChange('transactionId', e.target.value)} className={commonInputClasses} />
                        </div>
                         <div>
                            <label htmlFor="tableNumber" className={labelClasses}>Table Number</label>
                            <input id="tableNumber" type="text" value={internalData.tableNumber || ''} onChange={(e) => handleFieldChange('tableNumber', e.target.value)} className={commonInputClasses} />
                        </div>
                         <div>
                            <label htmlFor="customerName" className={labelClasses}>Customer Name</label>
                            <input id="customerName" type="text" value={internalData.customerName || ''} onChange={(e) => handleFieldChange('customerName', e.target.value)} className={commonInputClasses} />
                        </div>
                    </div>
                </fieldset>

                <div className="border-t border-slate-700"></div>

                <div className="grid grid-cols-[1fr_4rem_6rem_6rem_2.5rem] gap-2 font-semibold text-slate-400 text-sm px-2">
                    <span>Item</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Unit Price</span>
                    <span className="text-right">Total</span>
                    <span></span>
                </div>
                <div className="space-y-2">
                {internalData.items.map((item, index) => (
                    <ReceiptItemRow 
                        key={index} 
                        item={item} 
                        onChange={(updatedItem) => handleItemChange(index, updatedItem)}
                        onDelete={() => handleItemDelete(index)}
                    />
                ))}
                </div>
                <div className="flex gap-2 mt-2">
                    <button 
                        onClick={handleAddItem}
                        className="flex-grow text-sm text-cyan-400 hover:text-cyan-300 bg-slate-700/50 hover:bg-slate-700 rounded-md py-2 transition-colors">
                        + Add Item
                    </button>
                    <button 
                        onClick={onOpenProductModal}
                        className="flex-shrink-0 flex items-center gap-2 px-4 text-sm text-cyan-400 hover:text-cyan-300 bg-slate-700/50 hover:bg-slate-700 rounded-md py-2 transition-colors">
                        <CubeIcon className="w-4 h-4" /> Load Product
                    </button>
                </div>

                <div className="border-t border-slate-700"></div>

                 {/* Footer Details */}
                <fieldset className="space-y-2">
                    <legend className="text-sm font-semibold text-slate-300 mb-2">Footer Details</legend>
                    <div>
                        <label htmlFor="footerMessage" className={labelClasses}>Footer Message</label>
                        <textarea id="footerMessage" value={internalData.footerMessage || ''} onChange={(e) => handleFieldChange('footerMessage', e.target.value)} className={`${commonInputClasses} h-20`} />
                    </div>
                </fieldset>

            </div>
            
            <div className="p-6 border-t border-slate-700 bg-slate-900/50 rounded-b-xl">
              <BillSummary receiptData={internalData} />
              
              <div className="my-6 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-300">Payment Method</h3>
                  <div>
                      <label htmlFor="paymentType" className={labelClasses}>Type</label>
                      <select
                          id="paymentType"
                          value={internalData.paymentType || 'Tunai'}
                          onChange={(e) => handlePaymentChange('paymentType', e.target.value as PaymentType)}
                          className={commonInputClasses}
                      >
                          <option value="Tunai">Tunai</option>
                          <option value="Debit">Debit</option>
                          <option value="QRIS">QRIS</option>
                      </select>
                  </div>
                  {internalData.paymentType === 'Tunai' && (
                      <>
                          <div>
                              <label htmlFor="paymentAmount" className={labelClasses}>Amount Paid</label>
                              <input
                                  id="paymentAmount"
                                  type="number"
                                  value={internalData.paymentAmount || ''}
                                  onChange={(e) => handlePaymentChange('paymentAmount', e.target.valueAsNumber)}
                                  className={commonInputClasses}
                                  placeholder="Enter amount paid"
                              />
                          </div>
                          <div className="flex justify-between items-center border-t border-slate-700 pt-3 mt-3">
                              <span className="text-md font-medium text-slate-400">Change</span>
                              <span className="text-lg font-bold text-green-400">
                                  {formatCurrency((internalData.paymentChange || 0))}
                              </span>
                          </div>
                      </>
                  )}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-cyan-200 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                        <SaveIcon className="w-5 h-5" />
                        <span>Save Receipt</span>
                    </button>
                    <button
                        onClick={onSaveAsTemplate}
                        disabled={!internalData}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-slate-200 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <SaveIcon className="w-5 h-5" />
                        <span>Save as Template</span>
                    </button>
                </div>
                <PrintButton receiptData={internalData} />
              </div>
               {saveStatus && (
                <p className="mt-3 text-sm text-center text-green-400">
                  {saveStatus}
                </p>
              )}
            </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptEditor;
