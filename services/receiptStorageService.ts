import { ReceiptData } from '../types';

const STORAGE_KEY = 'savedReceipts';

/**
 * Saves a receipt to local storage. Always creates a new entry with a unique ID
 * to prevent overwriting existing receipts.
 * @param receipt The receipt data to save.
 */
export const saveReceipt = (receipt: ReceiptData): void => {
    try {
        const receipts = loadReceipts();
        
        // To prevent overwriting, create a new receipt object with a new unique ID for every save.
        const newReceipt = { ...receipt, id: `receipt-${Date.now()}` };

        receipts.unshift(newReceipt); // Add the new receipt to the top of the list
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
    } catch (error) {
        console.error("Failed to save receipt to localStorage", error);
    }
};

/**
 * Loads all saved receipts from local storage.
 * @returns An array of saved ReceiptData objects.
 */
export const loadReceipts = (): ReceiptData[] => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
        console.error("Failed to load receipts from localStorage", error);
        return [];
    }
};

/**
 * Deletes a receipt from local storage by its ID.
 * @param id The unique ID of the receipt to delete.
 * @returns The updated array of receipts after deletion.
 */
export const deleteReceipt = (id: string): ReceiptData[] => {
    try {
        let receipts = loadReceipts();
        receipts = receipts.filter(r => r.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
        return receipts;
    } catch (error) {
        console.error("Failed to delete receipt from localStorage", error);
        return loadReceipts(); // Return original list on failure
    }
};
