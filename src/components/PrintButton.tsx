import React, { useState } from 'react';
import { ReceiptData } from '../types';
import { connectAndPrint } from '../services/printerService';
import { PrintIcon, LoadingSpinnerIcon } from './icons';

interface PrintButtonProps {
  receiptData: ReceiptData;
}

const PrintButton: React.FC<PrintButtonProps> = ({ receiptData }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    setIsError(false);
    setStatusMessage('Connecting to printer...');

    try {
      await connectAndPrint(receiptData, (message) => setStatusMessage(message));
      setStatusMessage('Printed successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Printing failed:', error);
      setStatusMessage(`Error: ${(error as Error).message}`);
      setIsError(true);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePrint}
        disabled={isPrinting}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 font-bold text-white bg-cyan-600 rounded-lg shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isPrinting ? (
          <>
            <LoadingSpinnerIcon className="w-5 h-5" />
            <span>Printing...</span>
          </>
        ) : (
          <>
            <PrintIcon className="w-5 h-5" />
            <span>Connect & Print</span>
          </>
        )}
      </button>
      {statusMessage && (
        <p className={`mt-3 text-sm text-center ${isError ? 'text-red-400' : 'text-slate-400'}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default PrintButton;
